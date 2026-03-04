import { Stats } from '@/types/Stats';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'points',
  standalone: true,
})
export class PointsPipe implements PipeTransform {
  transform(stats: Stats): number {
    return (
      stats.ftMade + (stats.fgMade * 2) + stats.fg3Made
    );
  }
}
