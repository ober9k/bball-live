import { PlayerStatsLog } from '@/types/logs/PlayerStatsLog';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-box-score-table',
  templateUrl: './box-score-table.html',
  standalone: true,
})
export class BoxScoreTable {

  playerStatsLogs = input.required<Array<PlayerStatsLog>>();

  playerStatsTotals = computed(() => {
    return this.playerStatsLogs()
      .reduce((acc, log) => {
        return {
          points: acc.points + log.stats.points,
          rebounds: acc.rebounds + log.stats.rebounds,
          assists: acc.assists + log.stats.assists,
        };
      }, {
        points: 0,
        rebounds: 0,
        assists: 0,
      });
  });

}
