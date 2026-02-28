import { BoxScoreTable } from '@/components/box-score-table/box-score-table';
import { mockPlayers } from '@/data/mock/players';
import { Action, ActionType, EventLog } from '@/types/logs/EventLog';
import { PlayerStatsLog } from '@/types/logs/PlayerStatsLog';
import { Player } from '@/types/Player';
import { NgClass } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BoxScoreTable, NgClass],
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
   * Duplicated logic for points/rebounds/assists/etc. (for now).
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

    this.pushEventLog(playerStatsLog.player, App.getPointActionType(value));
  }

  /**
   * Duplicated logic for points/rebounds/assists/etc. (for now).
   * @param playerStatsLog
   * @param value
   */
  addOffRebound(playerStatsLog: PlayerStatsLog, value: number): void {
    this.playerStatsLogs.update((playerStagsLogs) => {
      const log = playerStagsLogs.find((log) => log.id === playerStatsLog.id);

      if (log) {
        log.stats.offRebounds = log.stats.offRebounds + value;
      }

      return [ ... playerStagsLogs ];
    });

    this.pushEventLog(playerStatsLog.player, Action.OffRebound);
  }

  /**
   * Duplicated logic for points/rebounds/assists/etc. (for now).
   * @param playerStatsLog
   * @param value
   */
  addDefRebound(playerStatsLog: PlayerStatsLog, value: number): void {
    this.playerStatsLogs.update((playerStagsLogs) => {
      const log = playerStagsLogs.find((log) => log.id === playerStatsLog.id);

      if (log) {
        log.stats.defRebounds = log.stats.defRebounds + value;
      }

      return [ ... playerStagsLogs ];
    });

    this.pushEventLog(playerStatsLog.player, Action.DefRebound);
  }

  /**
   * Duplicated logic for points/rebounds/assists/etc. (for now).
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

  /**
   * Duplicated logic for points/rebounds/assists/etc. (for now).
   * @param playerStatsLog
   * @param value
   */
  addSteals(playerStatsLog: PlayerStatsLog, value: number): void {
    this.playerStatsLogs.update((playerStagsLogs) => {
      const log = playerStagsLogs.find((log) => log.id === playerStatsLog.id);

      if (log) {
        log.stats.steals = log.stats.steals + value;
      }

      return [ ... playerStagsLogs ];
    });

    this.pushEventLog(playerStatsLog.player, Action.Steal);
  }

  /**
   * Duplicated logic for points/rebounds/assists/etc. (for now).
   * @param playerStatsLog
   * @param value
   */
  addBlocks(playerStatsLog: PlayerStatsLog, value: number): void {
    this.playerStatsLogs.update((playerStagsLogs) => {
      const log = playerStagsLogs.find((log) => log.id === playerStatsLog.id);

      if (log) {
        log.stats.blocks = log.stats.blocks + value;
      }

      return [ ... playerStagsLogs ];
    });

    this.pushEventLog(playerStatsLog.player, Action.Block);
  }

  /**
   * Duplicated logic for points/rebounds/assists/etc. (for now).
   * @param playerStatsLog
   * @param value
   */
  addTurnovers(playerStatsLog: PlayerStatsLog, value: number): void {
    this.playerStatsLogs.update((playerStagsLogs) => {
      const log = playerStagsLogs.find((log) => log.id === playerStatsLog.id);

      if (log) {
        log.stats.turnovers = log.stats.turnovers + value;
      }

      return [ ... playerStagsLogs ];
    });

    this.pushEventLog(playerStatsLog.player, Action.Turnover);
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
      offRebounds: 0,
      defRebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
    };

    return { id: player.id, player, stats };
  }

  /**
   * This may end up redundant when made/attempted logic is applied.
   * @param value
   * @private
   */
  private static getPointActionType(value: number): ActionType {
    switch (value) {
      case 3:
        return Action.Point_3;
      case 2:
        return Action.Point_2;
      default:
        return Action.Point_1;
    }
  }

  /* temp to reduce button pollution */
  cssButtonClasses = "border-1 border-gray-300 rounded-sm bg-white px-1 text-sm cursor-pointer hover:bg-gray-100";

}
