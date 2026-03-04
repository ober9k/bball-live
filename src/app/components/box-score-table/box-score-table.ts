import { PlayerName } from '@/components/player/player-name/player-name';
import { MinutesPipe } from '@/pipes/minutes-pipe';
import { PointsPipe } from '@/pipes/stats/points-pipe';
import { ReboundsPipe } from '@/pipes/stats/rebounds-pipe';
import { PlayerStatsLog } from '@/types/logs/PlayerStatsLog';
import { Stats, StatsKeys } from '@/types/Stats';
import { StatsUtils } from '@/utils/stats.utils';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-box-score-table',
  templateUrl: './box-score-table.html',
  standalone: true,
  imports: [
    PointsPipe,
    ReboundsPipe,
    PlayerName,
    MinutesPipe
  ]
})
export class BoxScoreTable {

  playerStatsLogs = input.required<Array<PlayerStatsLog>>();

  playerStatsTotals = computed(() => {
    StatsUtils.generateEmptyStats();

    return this.playerStatsLogs()
      .reduce(StatsUtils.accumulatePlayerStats, StatsUtils.generateEmptyStats());
  });

  /* temporary... strategy tbd */
  starterPlayerLogs = computed(() => {
    return this.playerStatsLogs()
      .slice(0, 5);
  });

  /* temporary... strategy tbd */
  benchPlayerLogs = computed(() => {
    return this.playerStatsLogs()
      .slice(5);
  });

}
