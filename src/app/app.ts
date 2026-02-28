import { BoxScoreTable } from '@/components/box-score-table/box-score-table';
import { mockPlayers } from '@/data/mock/players';
import { PlayerStatsLog } from '@/types/logs/PlayerStatsLog';
import { Player } from '@/types/Player';
import { Component, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BoxScoreTable],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App implements OnDestroy {
  protected readonly title = signal('bball-live');

  playerStatsLogs = signal(mockPlayers
    .map((player) => App.generatePlayerStatsLog(player))
  );

  timerInterval: any = null;

  /**
   * temp timer logic
   */
  remainingSeconds = signal<number>(60);

  startTimer() {
    if (this.timerInterval) {
      return;
    }

    this.timerInterval = setInterval(() => {
      this.remainingSeconds.update((seconds) => seconds - 1);
    }, 1000);
  }

  pauseTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetTimer() {
    this.pauseTimer();
    this.remainingSeconds.set(60);
    this.startTimer();
  }

  ngOnDestroy() {
    this.pauseTimer(); // cleanup
  }

  /**
   * Duplicated logic for points/rebounds/assists (for now).
   * @param playerStatsLog
   * @param value
   */
  addPoints(playerStatsLog: PlayerStatsLog, value: number): void {
    this.playerStatsLogs.update((playerStagsLogs) => {
      const log = playerStagsLogs.find((log) => log.id === playerStatsLog.id);

      if (log) {
        log.stats.points = log.stats.points + value;
      }

      return [ ... playerStagsLogs ];
    });
  }

  /**
   * Duplicated logic for points/rebounds/assists (for now).
   * @param playerStatsLog
   * @param value
   */
  addRebounds(playerStatsLog: PlayerStatsLog, value: number): void {
    this.playerStatsLogs.update((playerStagsLogs) => {
      const log = playerStagsLogs.find((log) => log.id === playerStatsLog.id);

      if (log) {
        log.stats.rebounds = log.stats.rebounds + value;
      }

      return [ ... playerStagsLogs ];
    });
  }

  /**
   * Duplicated logic for points/rebounds/assists (for now).
   * @param playerStatsLog
   * @param value
   */
  addAssists(playerStatsLog: PlayerStatsLog, value: number): void {
    this.playerStatsLogs.update((playerStagsLogs) => {
      const log = playerStagsLogs.find((log) => log.id === playerStatsLog.id);

      if (log) {
        log.stats.assists = log.stats.assists + value;
      }

      return [ ... playerStagsLogs ];
    });
  }

  /* this can be in a util function later */
  private static generatePlayerStatsLog(player: Player): PlayerStatsLog {
    const stats = {
      points: 0,
      rebounds: 0,
      assists: 0,
    };

    return { id: player.id, player, stats };
  }

}
