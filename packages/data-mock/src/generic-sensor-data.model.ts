/**
 * Generic Sensor Data.
 */
export interface GenericSensorData {
  /**
   * Primary key.
   */
  _id?: any;
  /**
   * Payload data type.
   */
  type: string;
  /**
   * Arbitrary payload.
   */
  payload: any;
}
