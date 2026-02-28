import { Action, ActionType } from '@/types/logs/EventLog';
import { Stats } from '@/types/Stats';

export class StatsUtils {

  /**
   * Map of handled player actions.
   */
  static playerActionMap = new Map()
    .set(Action.Point_1, "points")
    .set(Action.Point_2, "points")
    .set(Action.Point_3, "points")
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
    /* for now, separately handle points until ftm/a, fgm/a, 3pm/a applied */
    switch (action) {
      case Action.Point_1:
        stats.points += 1;
        break;
      case Action.Point_2:
        stats.points += 2;
        break;
      case Action.Point_3:
        stats.points += 3;
        break;
      default:
        stats[StatsUtils.playerActionMap.get(action)] += 1;
    }
  }

}
