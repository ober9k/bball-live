import { Player } from '@/types/Player';

export const Action = {
  FieldGoalMade_1:      "fieldGoalMade_1",
  FieldGoalAttempted_1: "fieldGoalAttempted_1",
  FieldGoalMade_2:      "fieldGoalMade_2",
  FieldGoalAttempted_2: "fieldGoalAttempted_2",
  FieldGoalMade_3:      "fieldGoalMade_3",
  FieldGoalAttempted_3: "fieldGoalAttempted_3",
  OffRebound:           "offRebound",
  DefRebound:           "defRebound",
  Assist:               "assist",
  Steal:                "steal",
  Block:                "block",
  Turnover:             "turnover",
  /* special cases */
  SubstitutionOut:      "substitutionOut",
  SubstitutionIn:       "substitutionIn",
} as const;

export type ActionType = typeof Action[keyof typeof Action];

export type EventLog = {
  id: number,
  action: ActionType,
  player: Player,
  secondaryPlayer?: Player | undefined, /* secondary player tied to the event */
  seconds: number,
  active: boolean,
}
