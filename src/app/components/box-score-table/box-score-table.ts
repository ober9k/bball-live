import { PlayerName } from '@/components/player/player-name/player-name';
import { PointsPipe } from '@/pipes/stats/points-pipe';
import { ReboundsPipe } from '@/pipes/stats/rebounds-pipe';
import { PlayerStatsLog } from '@/types/logs/PlayerStatsLog';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-box-score-table',
  templateUrl: './box-score-table.html',
  standalone: true,
  imports: [
    PointsPipe,
    ReboundsPipe,
    PlayerName
  ]
})
export class BoxScoreTable {

  playerStatsLogs = input.required<Array<PlayerStatsLog>>();

  playerStatsTotals = computed(() => {
    return this.playerStatsLogs()
      .reduce((acc, log) => {
        return {
          fieldGoalMade_1: acc.fieldGoalMade_1 + log.stats.fieldGoalMade_1,
          fieldGoalAttempted_1: acc.fieldGoalAttempted_1 + log.stats.fieldGoalAttempted_1,
          fieldGoalMade_2: acc.fieldGoalMade_2 + log.stats.fieldGoalMade_2,
          fieldGoalAttempted_2: acc.fieldGoalAttempted_2 + log.stats.fieldGoalAttempted_2,
          fieldGoalMade_3: acc.fieldGoalMade_3 + log.stats.fieldGoalMade_3,
          fieldGoalAttempted_3: acc.fieldGoalAttempted_3 + log.stats.fieldGoalAttempted_3,
          offRebounds: acc.offRebounds + log.stats.offRebounds,
          defRebounds: acc.defRebounds + log.stats.defRebounds,
          assists: acc.assists + log.stats.assists,
          steals: acc.steals + log.stats.steals,
          blocks: acc.blocks + log.stats.blocks,
          turnovers: acc.turnovers + log.stats.turnovers,
        };
      }, {
        fieldGoalMade_1: 0,
        fieldGoalAttempted_1: 0,
        fieldGoalMade_2: 0,
        fieldGoalAttempted_2: 0,
        fieldGoalMade_3: 0,
        fieldGoalAttempted_3: 0,
        offRebounds: 0,
        defRebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
      });
  });

}
