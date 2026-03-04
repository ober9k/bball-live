import { Stats } from '@/types/Stats';
import { Pipe, PipeTransform } from '@angular/core';

type ShotType = "fg" | "fg3" | "ft";

type MadeAndAttempted = {
  made: number,
  attempted: number,
}

@Pipe({
  name: 'madeAndAttempted',
  standalone: true,
})
export class MadeAndAttemptedPipe implements PipeTransform {

  transform(stats: Stats, shotType: ShotType): string {
    const { made, attempted } = MadeAndAttemptedPipe.getMadeAndAttempted(stats, shotType);

    return `${made}-${attempted}`;
  }

  private static getMadeAndAttempted(stats: Stats, shotType: ShotType): MadeAndAttempted {
    switch (shotType) {
      case "fg":  return { made: stats.fgMade,  attempted: stats.fgAttempted  };
      case "fg3": return { made: stats.fg3Made, attempted: stats.fg3Attempted };
      case "ft":  return { made: stats.ftMade,  attempted: stats.ftAttempted  };
      default:
        throw Error("Invalid `shotType` provided.")
    }
  }

}
