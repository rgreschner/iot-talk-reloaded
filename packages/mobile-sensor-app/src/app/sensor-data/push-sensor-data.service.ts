import { Injectable } from '@angular/core';
import { DeviceSensorService } from './device-sensor.service';
import * as io from 'socket.io-client';
import {
  HOST,
  WEBSOCKET_CHANNEL_SENSOR_DATA_PUSH
} from '../shared/config.const';

/**
 * Service responsible for push of
 * sensor data on WebSocket.
 */
@Injectable()
export class PushSensorDataService {
  private _socket: any;

  constructor(private readonly _deviceSensorService: DeviceSensorService) {}

  /**
   * Push data on WebSocket.
   * @param sensorData Sensor data to push.
   */
  private pushSensorData(sensorData: any) {
    this._socket.emit(WEBSOCKET_CHANNEL_SENSOR_DATA_PUSH, { ...sensorData });
  }

  /**
   * Initialize service.
   */
  public initialize() {
    this._socket = io(`ws://${HOST}:3100`);
    const allSensorData$ = this._deviceSensorService.allSensorData$;
    allSensorData$.subscribe((sensorData: any) =>
      this.pushSensorData(sensorData)
    );
  }
}
