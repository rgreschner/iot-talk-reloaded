import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * Sleep for given time.
 * @param time Time in milliseconds.
 */
export const sleep = (time: number) => {
  return interval(time)
    .pipe(take(1))
    .toPromise();
};
