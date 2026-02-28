import { Stats } from '@/types/Stats';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rebounds',
  standalone: true,
})
export class ReboundsPipe implements PipeTransform {
  transform(stats: Stats): number {
    return (
      stats.offRebounds + stats.defRebounds
    );
  }
}
