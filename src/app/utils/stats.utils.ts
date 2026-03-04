import { Action, ActionType } from '@/types/logs/EventLog';
import { PlayerStatsLog } from '@/types/logs/PlayerStatsLog';
import { Player } from '@/types/Player';
import { Stats, StatsKeys } from '@/types/Stats';

export class StatsUtils {

  /**
   * Map of handled player actions.
   */
  static playerActionMap = new Map()
    .set(Action.FieldGoalMade_1, "fieldGoalMade_1")
    .set(Action.FieldGoalAttempted_1, "fieldGoalAttempted_1")
    .set(Action.FieldGoalMade_2, "fieldGoalMade_2")
    .set(Action.FieldGoalAttempted_2, "fieldGoalAttempted_2")
    .set(Action.FieldGoalMade_3, "fieldGoalMade_3")
    .set(Action.FieldGoalAttempted_3, "fieldGoalAttempted_3")
    .set(Action.OffRebound, "offRebounds")
    .set(Action.DefRebound, "defRebounds")
    .set(Action.Assist, "assists")
    .set(Action.Steal, "steals")
    .set(Action.Block, "blocks")
    .set(Action.Turnover, "turnovers");

  /**
   * Apply the respective increment for the applied event if relevant.
   * @param action
   * @param stats
   */
  static applyAction(action: ActionType, stats: Stats): void {
    /* handle extra logic for attempted when made show */
    switch (action) {
      case Action.FieldGoalMade_1:
        stats.ftAttempted += 1;
        break;
      case Action.FieldGoalMade_2:
        stats.fgAttempted += 1;
        break;
      case Action.FieldGoalMade_3:
        stats.fgMade += 1;
        stats.fgAttempted += 1;
        stats.fg3Attempted += 1;
        break;
      case Action.FieldGoalAttempted_3:
        stats.fgAttempted += 1;
        break;
    }

    /* work through default handling */
    stats[StatsUtils.playerActionMap.get(action)] += 1;
  }

  /**
   * Generate the empty base log object for a player.
   * @param player
   */
  static generatePlayerStatsLog(player: Player): PlayerStatsLog {
    const { id } = player;
    const stats  = StatsUtils.generateEmptyStats();
    const active = false;

    return { id, player, stats, active };
  }

  /**
   * Generate empty stats object used to players and totals.
   * This is just a shorthand to avoid doing it property-by-property.
   * (initially used a reducer, but this should be more efficient)
   */
  static generateEmptyStats(): Stats {
    const stats = {} as Stats;

    StatsKeys.forEach((key) => {
      stats[key] = 0;
    });

    return stats;
  }

  /**
   * Accumulate player stats based on player logs.
   * (initially used a reducer, but this should be more efficient)
   * @param acc
   * @param log
   */
  static accumulatePlayerStats(acc: Stats, log: PlayerStatsLog): Stats {
    const stats = {} as Stats;

    StatsKeys.forEach((key) => {
      stats[key] = acc[key] + log.stats[key];
    });

    return stats;
  }

}
