import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { HOST } from '../shared/config.const';

/**
 * API Client service for Statistics Endpoints.
 */
@Injectable()
export class StatisticsApiService {
  constructor(private readonly _http: HttpClient) {}

  /**
   * Get mean acceleration.
   */
  public getMeanAcceleration() {
    return this._http
      .get(`http://${HOST}:3000/statistics/acceleration/mean`)
      .pipe(
        map((data: any) => JSON.parse(JSON.stringify(data))),
        take(1)
      );
  }
}
