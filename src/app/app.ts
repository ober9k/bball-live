import { BoxScoreTable } from '@/components/box-score-table/box-score-table';
import { mockPlayers } from '@/data/mock/players';
import { Action, ActionType, EventLog } from '@/types/logs/EventLog';
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

  private static initialSeconds = 60 * 10; /* 10 minute quarter */

  playerStatsLogs = signal(mockPlayers
    .map((player) => App.generatePlayerStatsLog(player))
  );

  events = signal<Array<EventLog>>([]);

  timerInterval: any = null;

  /**
   * temp timer logic
   */
  remainingSeconds = signal<number>(App.initialSeconds);

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
    this.remainingSeconds.set(App.initialSeconds);
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

    let action: ActionType;

    switch (value) {
      case 3:
        action = Action.Point_3;
        break;
      case 2:
        action = Action.Point_2;
        break
      case 1:
      default:
        action = Action.Point_1;
        break;
    }

    this.pushEventLog(playerStatsLog.player, action);
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

    this.pushEventLog(playerStatsLog.player, Action.Rebound);
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

    this.pushEventLog(playerStatsLog.player, Action.Assist);
  }

  private pushEventLog(player: Player, action: ActionType): void {
    const eventLog = {
      id: this.events().length,
      player, action,
      seconds: this.remainingSeconds(),
    };

    this.events.update((events) => [
      ...events, eventLog,
    ]);
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
