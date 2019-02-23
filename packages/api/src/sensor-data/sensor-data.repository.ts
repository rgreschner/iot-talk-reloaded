import { BaseRepository } from '../persistence/base.repository';
import { GenericSensorData } from './generic-sensor-data.model';
import { MeanAcceleration } from '../statistics/mean-acceleration.model';

/**
 * Repository for Sensor Data.
 */
export class SensorDataRepository extends BaseRepository<GenericSensorData> {
  static COLLECTION_NAME = 'sensorData';

  /**
   * Create pipeline to aggregate mean acceleration
   * in date range.
   * @param startDate Start date of date range.
   * @param endDate End date of date range.
   */
  private createPipelineForMeanAcceleration(startDate: Date, endDate: Date) {
    const pipeline = [
      {
        $match: {
          'type': 'device-motion',
          'payload.ts': { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          x: { $avg: '$payload.x' },
          y: { $avg: '$payload.y' },
          z: { $avg: '$payload.z' }
        }
      },
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
    const pipeline = this.createPipelineForMeanAcceleration(startDate, endDate);
    const aggregationResults = await this.aggregate(pipeline);
    const meanAcceleration = aggregationResults[0];
    return Promise.resolve(meanAcceleration);
  }

  public get collection() {
    return this._mongoConnectionService.db.collection(
      SensorDataRepository.COLLECTION_NAME
    );
  }
}
