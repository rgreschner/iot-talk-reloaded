import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection
} from '@nestjs/websockets';
import { SensorDataRepository } from './sensor-data.repository';
import { GenericSensorData } from './generic-sensor-data.model';
import { logger } from '../logging/logger.const';
import { WEBSOCKET_PORT, WEBSOCKET_CHANNEL_SENSOR_DATA_PUSH } from '../shared/config.const';

/**
 * Websocket service for Sensor Data.
 */
@WebSocketGateway(WEBSOCKET_PORT)
export class WebsocketService implements OnGatewayConnection {
  @WebSocketServer()
  private _webSocketServer;

  constructor(private readonly _sensorDataRepository: SensorDataRepository) {}

  /**
   * Map sensor data from event.
   * @param event Event from WebSocket to map.
   * @returns Mapped sensor data.
   */
  private mapSensorDataFromEvent(event: any): GenericSensorData {
    if (!event) {
      throw new Error('Invalid parameter: event');
    }
    const sensorData = { ...event };
    if (sensorData.payload && typeof sensorData.payload.ts === 'string') {
      sensorData.payload.ts = new Date(sensorData.payload.ts);
    }
    return sensorData;
  }

  /**
   * Handle pushed sensor data.
   * @param event Event from WebSocket.
   */
  private async handleSensorDataPush(event: any) {
    if (!event) {
      logger.warn('Received invalid event in sensor-data-push, was null.');
      return;
    }
    try {
      const sensorData = this.mapSensorDataFromEvent(event);
      await this._sensorDataRepository.addSensorData(sensorData);
    } catch (err) {
      logger.error({ err }, 'Error persisting pushed sensor data.');
    }
  }

  /**
   * Handle new client connection.
   * @param client Client socket.
   * @param args Optional args.
   */
  public handleConnection(client: any, ...args: any[]) {
    client.on(WEBSOCKET_CHANNEL_SENSOR_DATA_PUSH, (event: any) =>
      this.handleSensorDataPush(event)
    );
  }
}
