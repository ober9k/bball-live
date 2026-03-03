import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutes',
  standalone: true,
})
export class MinutesPipe implements PipeTransform {
  transform(value: number): string {
    if (value === 0) {
      return '---';
    }

    const minutes = Math.floor(value / 60).toString();
    const seconds = (value % 60).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  }
}
