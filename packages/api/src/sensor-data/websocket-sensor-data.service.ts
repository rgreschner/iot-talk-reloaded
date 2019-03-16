import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection
} from '@nestjs/websockets';
import { SensorDataRepository } from './sensor-data.repository';
import { GenericSensorData } from './generic-sensor-data.model';
import { logger } from '../logging/logger.const';
import {
  WEBSOCKET_PORT,
  WEBSOCKET_CHANNEL_SENSOR_DATA_PUSH
} from '../shared/config.const';
import { Subject } from 'rxjs';
import { concatMap } from 'rxjs/operators';

/**
 * Websocket service for Sensor Data.
 */
@WebSocketGateway(WEBSOCKET_PORT)
export class WebsocketService implements OnGatewayConnection {
  @WebSocketServer()
  private _webSocketServer;
  private _sensorDataSource = new Subject();
  private _sensorData$ = this._sensorDataSource.asObservable();

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
  private handleSensorDataPush(event: any) {
    if (!event) {
      logger.warn(
        'Received invalid event in sensor-data-push, was null.'
      );
      return;
    }
    try {
      const sensorData = this.mapSensorDataFromEvent(event);
      this._sensorDataSource.next(sensorData);
    } catch (err) {
      logger.error({ err }, 'Error persisting pushed sensor data.');
    }
  }

  /**
	 * Persist sensor data.
	 * @param sensorData Sensor data to persist.
	 */
  private async persistSensorData(sensorData: GenericSensorData) {
    try {
      if (!sensorData) {
        throw new Error('Invalid parameter: sensorData');
      }
      await this._sensorDataRepository.addSensorData(sensorData);
    } catch (err) {
      logger.error({ err }, 'Error persisting pushed sensor data.');
    }
  }

  /**
	 * Initializes service.
	 */
  public initialize() {
    this._sensorData$
      .pipe(
        // Using RxJS magic with concatMap here
        // to sequencialize bucket writes.
        // This prevents an issue where multiple new
        // buckets may be created on current bucket overflow
        // by a *single* writer while performing
        // parallel update operations.
        concatMap((sensorData: GenericSensorData) =>
          this.persistSensorData(sensorData)
        )
      )
      // Need to subscribe here on NOOP
      // to activate observable pipe.
      .subscribe(() => {});
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
