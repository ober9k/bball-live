import { BoxScoreTable } from '@/components/box-score-table/box-score-table';
import { mockPlayers } from '@/data/mock/players';
import { MinutesPipe } from '@/pipes/minutes-pipe';
import { Action, ActionType, EventLog } from '@/types/logs/EventLog';
import { PlayerStatsLog } from '@/types/logs/PlayerStatsLog';
import { Player } from '@/types/Player';
import { StatsUtils } from '@/utils/stats.utils';
import { NgClass } from '@angular/common';
import { Component, computed, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BoxScoreTable, NgClass, MinutesPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App implements OnDestroy {
  protected readonly title = signal('bball-live');

  private static initialSeconds = 60 * 10; /* 10 minute quarter */

  events = signal<Array<EventLog>>([]);

  currentEventId = computed(() => {
    return this.events().length + 1;
  });

  playerStatsLogs = computed(() => {
    const playerStatsLogs = mockPlayers
      .map(App.generatePlayerStatsLog);

    this.events().forEach((event) => {
      const { player, secondaryPlayer, action } = event;
      const { stats } = playerStatsLogs.find((log) => log.player.id === player.id)!; /* expect it */

      StatsUtils.applyAction(action, stats);

      /* need generic handling */
      if (secondaryPlayer) {
        const { stats } = playerStatsLogs.find((log) => log.player.id === secondaryPlayer.id)! /* expect it */
        StatsUtils.applyAction(Action.Assist, stats); /* apply secondary stat for the assist */
      }
    });

    return playerStatsLogs;
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

  dispatchFieldGoalMadeEvent({ player }: PlayerStatsLog, value: number): void {
    this.dispatchEvent(player, App.getFieldGoalMadeAction(value));
  }

  dispatchFieldGoalAttemptedEvent({ player }: PlayerStatsLog, value: number): void {
    this.dispatchEvent(player, App.getFieldGoalAttemptedAction(value));
  }

  dispatchOffReboundEvent({ player }: PlayerStatsLog): void {
    this.dispatchEvent(player, Action.OffRebound);
  }

  dispatchDefReboundEvent({ player }: PlayerStatsLog): void {
    this.dispatchEvent(player, Action.DefRebound);
  }

  dispatchAssistsEvent({ player }: PlayerStatsLog): void {
    this.dispatchEvent(player, Action.Assist);
  }

  dispatchStealsEvent({ player }: PlayerStatsLog): void {
    this.dispatchEvent(player, Action.Steal);
  }

  dispatchBlocksEvent({ player }: PlayerStatsLog): void {
    this.dispatchEvent(player, Action.Block);
  }

  dispatchTurnoversEvent({ player }: PlayerStatsLog): void {
    this.dispatchEvent(player, Action.Turnover);
  }

  dispatchMadeShotUpdateEvent(eventLog: EventLog, secondaryPlayer: Player | undefined): void {
    this.updateEventLog(eventLog, secondaryPlayer);

  }

  private pushEventLog(player: Player, action: ActionType): void {
    const eventLog = {
      id: this.currentEventId(),
      player, action,
      seconds: this.remainingSeconds(),
    };

    this.events.update((events) => [
      ...events, eventLog,
    ]);
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
      ]
    });
  }

  /* this can be in a util function later */
  private static generatePlayerStatsLog(player: Player): PlayerStatsLog {
    const stats = {
      fieldGoalMade_1: 0,
      fieldGoalAttempted_1: 0,
      fieldGoalMade_2: 0,
      fieldGoalAttempted_2: 0,
      fieldGoalMade_3: 0,
      fieldGoalAttempted_3: 0,
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
   * @param value
   * @private
   */
  private static getFieldGoalMadeAction(value: number): ActionType {
    switch (value) {
      case 3:  return Action.FieldGoalMade_3;
      case 2:  return Action.FieldGoalMade_2;
      default: return Action.FieldGoalMade_1;
    }
  }

  /**
   * @param value
   * @private
   */
  private static getFieldGoalAttemptedAction(value: number): ActionType {
    switch (value) {
      case 3:  return Action.FieldGoalAttempted_3;
      case 2:  return Action.FieldGoalAttempted_2;
      default: return Action.FieldGoalAttempted_1;
    }
  }

  /* temp to reduce button pollution */
  cssButtonClasses = "border-1 border-gray-300 rounded-sm bg-white px-1 text-sm cursor-pointer hover:bg-gray-100";
  cssTableButtonClasses = "border-1 border-gray-300 rounded-sm bg-white px-1 text-sm leading-4.5 cursor-pointer hover:bg-gray-100";

  protected readonly Action = Action; /* temp, expose in template */

}
