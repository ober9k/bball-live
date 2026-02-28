import { Stats } from '@/types/Stats';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'points',
  standalone: true,
})
export class PointsPipe implements PipeTransform {
  transform(stats: Stats): number {
    return (
      stats.fieldGoalMade_1 + (stats.fieldGoalMade_2 * 2) + stats.fieldGoalMade_3
    );
  }
}
