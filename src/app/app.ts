import { BoxScoreTable } from '@/components/box-score-table/box-score-table';
import { PlayByPlayRow } from '@/components/play-by-play/play-by-play-row/play-by-play-row';
import { mockPlayers } from '@/data/mock/players';
import { EventLogService } from '@/services/event-log.service';
import { Action, ActionType, EventLog } from '@/types/logs/EventLog';
import { PlayerStatsLog } from '@/types/logs/PlayerStatsLog';
import { Player } from '@/types/Player';
import { StatsUtils } from '@/utils/stats.utils';
import { NgClass } from '@angular/common';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BoxScoreTable, NgClass, PlayByPlayRow],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App implements OnDestroy {
  protected readonly title = signal('bball-live');

  protected eventLogService = inject(EventLogService);

  private static initialSeconds = 60 * 10; /* 10 minute quarter */

  events = this.eventLogService.eventLogs; /* copy... todo, readonly */
  activeEvents = computed(() => {
    return this.events()
      .filter((event) => event.active);
  });

  playerStatsLogs = computed(() => {
    const playerStatsLogs = mockPlayers
      .map(StatsUtils.generatePlayerStatsLog);

    /* temp, mark first 5 as starters */
    playerStatsLogs
      .slice(0,5)
      .forEach((log) => {
        log.active = true;
      });

    /* start seconds at default initial */
    let secondsCounter = App.initialSeconds;

    this.events().forEach((event) => {
      if (event.active === false) {
        return; /* ignore event */
      }

      const { player, secondaryPlayer, action } = event;
      const { stats } = playerStatsLogs.find((log) => log.player.id === player.id)!; /* expect it */

      StatsUtils.applyAction(action, stats);

      /* need generic handling */
      if (secondaryPlayer) {
        const { stats } = playerStatsLogs.find((log) => log.player.id === secondaryPlayer.id)! /* expect it */
        StatsUtils.applyAction(Action.Assist, stats); /* apply secondary stat for the assist */
      }

      /* temp logic... just throw the seconds on everyone */
      playerStatsLogs.forEach((log) => {
        if (log.active) {
          log.stats.seconds = log.stats.seconds + (secondsCounter - event.seconds);
        }
      })

      /* reset seconds to event timing */
      secondsCounter = event.seconds;
    });

    return playerStatsLogs;
  });

  players = computed(() => {
    return this.playerStatsLogs()
      .map((log) => log.player);
  });

  /* temp logic */
  getAssistedBy({ id }: Player): Array<Player> {
    return mockPlayers
      .filter((player) => player.id !== id);
  }

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

      // kill the empty timer
      if (this.remainingSeconds() === 0) {
        this.pauseTimer();
      }
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

  dispatchEvent(player: Player, action: ActionType): void {
    this.pushEventLog(player, action);
  }

  /* shooting events */
  handleFgMade       = (player: Player) => this.dispatchEvent(player, Action.FieldGoalMade_2);
  handleFgAttempted  = (player: Player) => this.dispatchEvent(player, Action.FieldGoalAttempted_2);
  handleFg3Made      = (player: Player) => this.dispatchEvent(player, Action.FieldGoalMade_3);
  handleFg3Attempted = (player: Player) => this.dispatchEvent(player, Action.FieldGoalAttempted_3);
  handleFtMade       = (player: Player) => this.dispatchEvent(player, Action.FieldGoalMade_1);
  handleFtAttempted  = (player: Player) => this.dispatchEvent(player, Action.FieldGoalAttempted_1);
  /* other events */
  handleOffRebound   = (player: Player) => this.dispatchEvent(player, Action.OffRebound);
  handleDefRebound   = (player: Player) => this.dispatchEvent(player, Action.DefRebound);
  handleAssist       = (player: Player) => this.dispatchEvent(player, Action.Assist);
  handleSteal        = (player: Player) => this.dispatchEvent(player, Action.Steal);
  handleBlock        = (player: Player) => this.dispatchEvent(player, Action.Block);
  handleTurnover     = (player: Player) => this.dispatchEvent(player, Action.Turnover);

  dispatchMadeShotUpdateEvent(eventLog: EventLog, secondaryPlayer: Player | undefined): void {
    this.updateEventLog(eventLog, secondaryPlayer);
  }

  dispatchDeleteEvent(eventLog: EventLog): void {
    this.eventLogService.deleteEventLog(eventLog);
  }

  private pushEventLog(player: Player, action: ActionType): void {
    this.eventLogService.pushEventLog(
      action, player, this.remainingSeconds(),
    );
  }

  /**
   * iffy with this logic, todo check for something better once working
   * @param eventLog
   * @param secondaryPlayer
   * @private
   */
  private updateEventLog(eventLog: EventLog, secondaryPlayer: Player | undefined): void {
    this.events.update((events) => {
      const existingLog = events.find(({ id }) => id === eventLog.id);

      if (existingLog) {
        existingLog.secondaryPlayer = secondaryPlayer;
      }

      return [
        ...events,
      ];
    });
  }

  /* temp to reduce button pollution */
  cssButtonClasses = "border-1 border-gray-300 rounded-sm bg-white px-1 text-sm cursor-pointer hover:bg-gray-100";
  cssTableButtonClasses = "border-1 border-gray-300 rounded-sm bg-white px-1 text-sm leading-4.5 cursor-pointer hover:bg-gray-100";

  /**
   * This is expensive... OPTIMIZE IT... thx
   * @param eventLog
   * @param secondaryPlayer
   */
  getSelectedCssTableButtonClasses(eventLog: EventLog, secondaryPlayer: Player): string {
    return (eventLog.secondaryPlayer === secondaryPlayer)
      ? this.cssTableButtonClasses + " bg-blue-100!"
      : this.cssTableButtonClasses;
  }

  protected readonly Action = Action; /* temp, expose in template */

}
