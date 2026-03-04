import { PlayerName } from '@/components/player/player-name/player-name';
import { MinutesPipe } from '@/pipes/minutes-pipe';
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
    PlayerName,
    MinutesPipe
  ]
})
export class BoxScoreTable {

  playerStatsLogs = input.required<Array<PlayerStatsLog>>();

  playerStatsTotals = computed(() => {
    return this.playerStatsLogs()
      .reduce((acc, log) => {
        return {
          seconds: acc.seconds + log.stats.seconds,
          fgMade: acc.fgMade + log.stats.fgMade,
          fgAttempted: acc.fgAttempted + log.stats.fgAttempted,
          fg3Made: acc.fg3Made + log.stats.fg3Made,
          fg3Attempted: acc.fg3Attempted + log.stats.fg3Attempted,
          ftMade: acc.ftMade + log.stats.ftMade,
          ftAttempted: acc.ftAttempted + log.stats.ftAttempted,
          offRebounds: acc.offRebounds + log.stats.offRebounds,
          defRebounds: acc.defRebounds + log.stats.defRebounds,
          assists: acc.assists + log.stats.assists,
          steals: acc.steals + log.stats.steals,
          blocks: acc.blocks + log.stats.blocks,
          turnovers: acc.turnovers + log.stats.turnovers,
        };
      }, {
        seconds: 0,
        fgMade: 0,
        fgAttempted: 0,
        fg3Made: 0,
        fg3Attempted: 0,
        ftMade: 0,
        ftAttempted: 0,
        offRebounds: 0,
        defRebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
      });
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
