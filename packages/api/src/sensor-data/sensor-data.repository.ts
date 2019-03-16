import { BaseRepository } from '../persistence/base.repository';
import { GenericSensorData } from './generic-sensor-data.model';
import { MeanAcceleration } from '../statistics/mean-acceleration.model';
import * as moment from 'moment';

/**
 * Repository for Sensor Data.
 */
export class SensorDataRepository extends BaseRepository<GenericSensorData> {
  static COLLECTION_NAME = 'sensorDataBuckets';

  /**
	 * Create pipeline to aggregate mean acceleration
	 * in date range.
	 * @param startDate Start date of date range.
	 * @param endDate End date of date range.
	 */
  private createPipelineForMeanAcceleration(startDate: Date, endDate: Date) {
    const pipeline = [
      // Match on bucket.
      {
        $match: {
          endDate: { $gte: startDate, $lte: endDate }
        }
      },
      // Focus on sample data only by 
      // unwind & replace root.
      { $unwind: '$samples' },
      { $replaceRoot: { newRoot: '$samples' } },
      // Match on sample.
      {
        $match: {
          'type': 'device-motion',
          'payload.ts': { $gte: startDate, $lte: endDate }
        }
      },
      // Group axis data.
      {
        $group: {
          _id: null,
          x: { $avg: '$payload.x' },
          y: { $avg: '$payload.y' },
          z: { $avg: '$payload.z' }
        }
      },
      // Id neither necessary nor useful in result.
      { $project: { _id: false } }
    ];
    return pipeline;
  }

  /**
	 * Get mean acceleration in date range.
	 * @param startDate Start date of date range.
	 * @param endDate End date of date range.
	 */
  public async getMeanAccelerationInDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<MeanAcceleration> {
    if (!startDate) {
      throw new Error('Invalid start date.');
    }
    if (!endDate) {
      throw new Error('Invalid end date.');
    }
    const pipeline = this.createPipelineForMeanAcceleration(
      startDate,
      endDate
    );
    const aggregationResults = await this.aggregate(pipeline);
    const meanAcceleration = aggregationResults[0];
    return Promise.resolve(meanAcceleration);
  }

  public get collection() {
    return this._mongoConnectionService.db.collection(
      SensorDataRepository.COLLECTION_NAME
    );
  }

  /**
   * Add new sensor data from device.
   * @param sensorData New sensor data.
   */
  public addSensorData(sensorData: GenericSensorData) {
    const ts = sensorData.payload.ts;
    const day = moment(ts).format('YYYY-MM-DD');
    const updateDoc = {
      $set: { day },
      $min: { startDate: ts },
      $max: { endDate: ts },
      $push: { samples: sensorData },
      $inc: { nsamples: 1 }
    };
    return this.collection.updateOne(
      { day, nsamples: { $lt: 9000 } },
      updateDoc,
      { upsert: true }
    );
  }
}
