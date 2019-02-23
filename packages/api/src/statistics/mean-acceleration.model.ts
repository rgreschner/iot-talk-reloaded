import { ApiModelProperty } from '@nestjs/swagger';

/**
 * Data model for mean acceleration
 * in statistics.
 */
export class MeanAcceleration {
  /**
   * Acceleration in X axis.
   */
  @ApiModelProperty({ description: 'Acceleration in X axis.' })
  public x: number;
  /**
   * Acceleration in Y axis.
   */
  @ApiModelProperty({ description: 'Acceleration in Y axis.' })
  public y: number;
  /**
   * Acceleration in Z axis.
   */
  @ApiModelProperty({ description: 'Acceleration in Z axis.' })
  public z: number;
}
