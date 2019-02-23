import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, timer } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { StatisticsApiService } from './statistics-api.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'statistics',
  templateUrl: './statistics.component.html'
})
export class StatisticsComponent implements OnInit, OnDestroy {
  static REFRESH_INTERVAL = 500;

  constructor(private readonly _statisticsApiService: StatisticsApiService) {}

  public get accelerationMean$() {
    return this._accelerationMean$;
  }

  private _destroySource = new Subject();
  private _destroy$ = this._destroySource.asObservable();

  private _accelerationMeanSource = new BehaviorSubject(null);
  private _accelerationMean$ = this._accelerationMeanSource.asObservable().pipe(
    map((accelerationMean: any) => {
      const keys = ['x', 'y', 'z'];
      if (!accelerationMean) {
        const dummyResult = {};
        for (const key of keys) {
          dummyResult[key] = 0;
        }
        accelerationMean = dummyResult;
      }
      const singleValues = [];
      for (const key of keys) {
        let value = accelerationMean[key];
        value = Math.max(-1, value);
        value = Math.min(1, value);
        singleValues.push({ name: key.toUpperCase(), value });
      }
      return singleValues;
    }),
    takeUntil(this._destroy$)
  );

  /**
   * Refresh displayed data.
   */
  private refresh() {
    this._statisticsApiService.getMeanAcceleration().subscribe(
      (accelerationMean) => {
        this._accelerationMeanSource.next(accelerationMean);
      },
      (err) => {
        this._accelerationMeanSource.next(null);
      }
    );
  }

  public ngOnInit() {
    const timer$ = timer(0, StatisticsComponent.REFRESH_INTERVAL).pipe(
      takeUntil(this._destroy$)
    );
    timer$.subscribe(() => this.refresh());
  }

  public ngOnDestroy() {
    this._destroySource.next(true);
  }
}
