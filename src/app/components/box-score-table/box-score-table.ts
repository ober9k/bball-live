import { PlayerName } from '@/components/player/player-name/player-name';
import { MinutesPipe } from '@/pipes/minutes-pipe';
import { MadeAndAttemptedPercentagePipe } from '@/pipes/stats/made-and-attempted-percentage-pipe';
import { MadeAndAttemptedPipe } from '@/pipes/stats/made-and-attempted-pipe';
import { PointsPipe } from '@/pipes/stats/points-pipe';
import { ReboundsPipe } from '@/pipes/stats/rebounds-pipe';
import { PlayerStatsLog } from '@/types/logs/PlayerStatsLog';
import { StatsUtils } from '@/utils/stats.utils';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-box-score-table',
  templateUrl: './box-score-table.html',
  styleUrl: './box-score-table.css',
  standalone: true,
  imports: [
    PointsPipe,
    ReboundsPipe,
    PlayerName,
    MinutesPipe,
    MadeAndAttemptedPipe,
    MadeAndAttemptedPercentagePipe
  ]
})
export class BoxScoreTable {

  playerStatsLogs = input.required<Array<PlayerStatsLog>>();

  playerStatsTotals = computed(() => {
    StatsUtils.generateEmptyStats();

    return this.playerStatsLogs()
      .reduce(StatsUtils.accumulatePlayerStats, StatsUtils.generateEmptyStats());
  });

  /* alias for IDE limitations */
  /* similarly for log */
  totals = this.playerStatsTotals;

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
