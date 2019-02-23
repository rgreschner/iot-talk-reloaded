import { Injectable } from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Service responsible for data acquisition of
 * device sensors.
 */
@Injectable()
export class DeviceSensorService {
  private _deviceOrientationData$ = fromEvent(window, 'deviceorientation').pipe(
    map((event: any) => this.mapOrientationData(event))
  );

  private _deviceAccelerationData$ = fromEvent(window, 'devicemotion').pipe(
    map((event: any) => this.mapAccelerationData(event))
  );

  private _allSensorData$ = this.mergeSensorData();

  private mapOrientationData(event: any) {
    return {
      ts: new Date(),
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
      isAbsolute: event.absolute
    };
  }

  private mapAccelerationData(event: any) {
    const acceleration = event.acceleration;
    // Values need to be copied manually because destructuring
    // does not work for DeviceAcceleration event.
    const mappedAcceleration = {
      x: acceleration.x,
      y: acceleration.y,
      z: acceleration.z
    };
    const data = {
      ts: new Date(),
      ...mappedAcceleration
    };
    return data;
  }

  private mergeSensorData() {
    return merge(
      this._deviceOrientationData$.pipe(
        map((payload: any) => ({ type: 'device-orientation', payload }))
      ),
      this._deviceAccelerationData$.pipe(
        map((payload: any) => ({ type: 'device-motion', payload }))
      )
    );
  }

  public get deviceOrientationData$() {
    return this._deviceOrientationData$;
  }

  public get deviceAccelerationData$() {
    return this._deviceAccelerationData$;
  }

  public get allSensorData$() {
    return this._allSensorData$;
  }
}
