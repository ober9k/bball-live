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
          offRebounds: acc.offRebounds + log.stats.offRebounds,
          defRebounds: acc.defRebounds + log.stats.defRebounds,
          assists: acc.assists + log.stats.assists,
          steals: acc.steals + log.stats.steals,
          blocks: acc.blocks + log.stats.blocks,
          turnovers: acc.turnovers + log.stats.turnovers,
        };
      }, {
        points: 0,
        offRebounds: 0,
        defRebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
      });
  });

}
