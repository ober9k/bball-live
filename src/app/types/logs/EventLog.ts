import { Player } from '@/types/Player';

export const Action = {
  Point_1: "point_1",
  Point_2: "point_2",
  Point_3: "point_3",
  Rebound: "rebound",
  Assist: "assist",
} as const;

export type ActionType = typeof Action[keyof typeof Action];

export type EventLog = {
  id: number,
  player: Player,
  action: ActionType,
  seconds: number,
}
