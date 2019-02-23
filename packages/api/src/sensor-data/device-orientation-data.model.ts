/**
 * Sensor Data for
 * Device Orientation.
 */
export interface DeviceOrientationData {
  ts: Date;
  beta: number;
  gamma: number;
  alpha: number;
  isAbsolute: boolean;
}
