import { PipeTransform, Pipe } from '@angular/core';

/**
 * Pipe converting number to fixed-point 2 digit precision.
 */
@Pipe({
  name: 'fixed'
})
export class FixedNumberPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value.toFixed(2);
  }
}
