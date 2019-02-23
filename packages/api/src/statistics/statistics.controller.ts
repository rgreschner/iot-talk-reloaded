import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query
} from '@nestjs/common';
import { SensorDataRepository } from '../sensor-data/sensor-data.repository';
import { MeanAcceleration } from './mean-acceleration.model';
import {
  ApiResponse,
  ApiImplicitParam,
  ApiOperation,
  ApiUseTags
} from '@nestjs/swagger';

/**
 * Controller for Statistics Endpoints.
 */
@Controller('/statistics')
export class StatisticsController {
  static DEFAULT_SLIDING_WINDOW_INTERVAL_IN_SECONDS = 10;

  constructor(private readonly _sensorDataRepository: SensorDataRepository) {}

  /**
   * Get mean acceleration in sliding window.
   * @param slidingWindowTimeText Text-encoded sliding window time.
   */
  @Get('/acceleration/mean')
  @ApiUseTags('statistics')
  @ApiOperation({
    title: 'Get Mean Acceleration',
    description: 'Get mean acceleration in sliding window.'
  })
  @ApiImplicitParam({
    name: 't',
    description: 'Text-encoded sliding window time.',
    required: false
  })
  @ApiResponse({
    status: 200,
    description: 'Returns mean acceleration.',
    type: MeanAcceleration
  })
  @ApiResponse({
    status: 406,
    description: 'Invalid input parameters.'
  })
  @ApiResponse({ status: 404, description: 'No statistics available.' })
  async getMeanAcceleration(
    @Query('t')
    slidingWindowTimeText: string = StatisticsController.DEFAULT_SLIDING_WINDOW_INTERVAL_IN_SECONDS.toString()
  ): Promise<MeanAcceleration> {
    const slidingWindowTime = 1000 * parseInt(slidingWindowTimeText, 10);
    if (isNaN(slidingWindowTime)) {
      throw new HttpException(
        'Invalid parameter: slidingWindowTime.',
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const slidingWindowEnd = new Date();
    const slidingWindowStart = new Date(
      slidingWindowEnd.getTime() - slidingWindowTime
    );
    const meanAcceleration = await this._sensorDataRepository.getMeanAccelerationInDateRange(
      slidingWindowStart,
      slidingWindowEnd
    );
    if (!meanAcceleration) {
      throw new HttpException('No statistics available.', HttpStatus.NOT_FOUND);
    }
    return Promise.resolve(meanAcceleration);
  }
}
