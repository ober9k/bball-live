import { Player } from '@/types/Player';
import { Stats } from '@/types/Stats';

export type PlayerStatsLog = {
  id: number,
  player: Player,
  active: boolean,
  stats: Stats,
}
