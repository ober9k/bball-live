import { Action, ActionType } from '@/types/logs/EventLog';
import { Stats } from '@/types/Stats';

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
        stats.fieldGoalAttempted_1 += 1;
        break;
      case Action.FieldGoalMade_2:
        stats.fieldGoalAttempted_2 += 1;
        break;
      case Action.FieldGoalMade_3:
        stats.fieldGoalMade_2 += 1;
        stats.fieldGoalAttempted_2 += 1;
        stats.fieldGoalAttempted_3 += 1;
        break;
      case Action.FieldGoalAttempted_3:
        stats.fieldGoalAttempted_2 += 1;
        break;
    }

    /* work through default handling */
    stats[StatsUtils.playerActionMap.get(action)] += 1;
  }

}
