export type Stats = {
  /* playing time handling */
  seconds: number,
  /* ft/fg/3p named to avoid conflicts */
  fieldGoalMade_1: number,
  fieldGoalAttempted_1: number,
  fieldGoalMade_2: number,
  fieldGoalAttempted_2: number,
  fieldGoalMade_3: number,
  fieldGoalAttempted_3: number,
  /* other stats */
  offRebounds: number,
  defRebounds: number,
  assists: number,
  steals: number,
  blocks: number,
  turnovers: number,
}
