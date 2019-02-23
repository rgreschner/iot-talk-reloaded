import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceOrientationData } from './device-orientation-data.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DeviceSensorService } from './device-sensor.service';

/**
 * Component displaying
 * Sensor Data Acquisition.
 */
@Component({
  selector: 'data-acquisition',
  templateUrl: './data-acquisition.component.html',
  styleUrls: ['./data-acquisition.component.css']
})
export class DataAcquisitionComponent implements OnInit, OnDestroy {
  private _destroy$ = new Subject();

  public deviceOrientationData$: any;
  public deviceAccelerationData$: any;

  constructor(private readonly _deviceSensorService: DeviceSensorService) {}

  private updateOrientationCube(deviceOrientationData: DeviceOrientationData) {
    document.getElementById(
      'cube'
    ).style.webkitTransform = document.getElementById('cube').style.transform =
      'rotateX(' +
      deviceOrientationData.beta +
      'deg) ' +
      'rotateY(' +
      deviceOrientationData.gamma +
      'deg) ' +
      'rotateZ(' +
      deviceOrientationData.alpha +
      'deg)';
  }

  public ngOnInit() {
    this.deviceOrientationData$ = this._deviceSensorService.deviceOrientationData$.pipe(
      takeUntil(this._destroy$)
    );
    this.deviceAccelerationData$ = this._deviceSensorService.deviceAccelerationData$.pipe(
      takeUntil(this._destroy$)
    );
    this.deviceOrientationData$.subscribe(
      (deviceOrientationData: DeviceOrientationData) =>
        this.updateOrientationCube(deviceOrientationData)
    );
  }

  public ngOnDestroy() {
    this._destroy$.next(true);
  }
}
