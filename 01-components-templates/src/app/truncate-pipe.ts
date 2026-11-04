import { Pipe, PipeTransform } from '@angular/core';

// A custom pipe. In a template: {{ someText | truncate:20 }}
// The name below is what you type after the "|".
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  // `value` is whatever is on the left of the "|".
  // `limit` is the argument after the ":" (defaults to 10 if left out).
  transform(value: string, limit = 10): string {
    return value.length > limit ? value.slice(0, limit) + '…' : value;
  }
}
