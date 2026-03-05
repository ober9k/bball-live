import { EventLogService } from '@/services/event-log.service';
import { Action, ActionType } from '@/types/logs/EventLog';
import { PlayerStatsLog } from '@/types/logs/PlayerStatsLog';
import { Player } from '@/types/Player';
import { NgClass } from '@angular/common';
import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';

@Component({
  selector: 'app-substitutions',
  templateUrl: './substitutions.html',
  styleUrl: './substitutions.css',
  standalone: true,
  imports: [
    NgClass
  ]
})
export class Substitutions implements OnInit {

  protected eventLogService = inject(EventLogService);

  playerStatsLogs = input.required<Array<PlayerStatsLog>>();
  remainingSeconds = input.required<number>();
  onClose = output<void>();

  initialActiveIds = signal<number[]>([]);
  initialInactiveIds = signal<number[]>([]);

  currentActiveIds = signal<number[]>([]);
  currentInactiveIds = signal<number[]>([]);

  activePlayersLogs = computed(() => {
    return this.playerStatsLogs()
      .filter((log) => this.currentActiveIds().includes(log.player.id));
  });
  inactivePlayersLogs = computed(() => {
    return this.playerStatsLogs()
      .filter((log) => this.currentInactiveIds().includes(log.player.id));
  });

  ngOnInit() {
    this.initialActiveIds.update(() => {
      return [ ...this.playerStatsLogs()
        .filter(Substitutions.filterActive)
        .map(Substitutions.mapPlayerId)
      ];
    });

    this.initialInactiveIds.update(() => {
      return [ ...this.playerStatsLogs()
        .filter(Substitutions.filterInactive)
        .map(Substitutions.mapPlayerId)
      ];
    });

    this.currentActiveIds.update(() => {
      return [ ...this.initialActiveIds() ];
    });

    this.currentInactiveIds.update(() => {
      return [ ...this.initialInactiveIds() ];
    });
  }

  handleActivePlayerLog(log: PlayerStatsLog): void {
    this.currentActiveIds.update((ids) => {
      return [ ...ids.filter((id) => id !== log.id) ];
    });
    this.currentInactiveIds.update((ids) => {
      return [ ...ids, log.player.id ];
    });
  }

  handleInactivePlayerLog(log: PlayerStatsLog): void {
    this.currentInactiveIds.update((ids) => {
      return [ ...ids.filter((id) => id !== log.id) ];
    });
    this.currentActiveIds.update((ids) => {
      return [ ...ids, log.player.id ];
    });
  }

  cancelSubstitutions() {
    this.onClose.emit();
  }

  confirmSubstitutions() {
    const subsOut = this.initialActiveIds().filter((id) => !this.currentActiveIds().includes(id));
    const subsIn  = this.initialInactiveIds().filter((id) => !this.currentInactiveIds().includes(id));

    subsOut.forEach((id) => {
      const existingLog = this.playerStatsLogs().find((log) => log.player.id === id);
      if (existingLog) {
        this.dispatchEvent(existingLog.player, Action.SubstitutionOut);
      }
    });

    subsIn.forEach((id) => {
      const existingLog = this.playerStatsLogs().find((log) => log.player.id === id);
      if (existingLog) {
        this.dispatchEvent(existingLog.player, Action.SubstitutionIn);
      }
    });

    this.onClose.emit();
  }

  dispatchEvent(player: Player, action: ActionType): void {
    this.pushEventLog(player, action);
  }

  private pushEventLog(player: Player, action: ActionType): void {
    this.eventLogService.pushEventLog(
      action, player, this.remainingSeconds(),
    );
  }

  private static filterActive(log: PlayerStatsLog): boolean {
    return log.active;
  }

  private static filterInactive(log: PlayerStatsLog): boolean {
    return !log.active;
  }

  private static mapPlayerId(log: PlayerStatsLog): number {
    return log.player.id;
  }

  /* temp to reduce button pollution */
  cssButtonClasses = "border-1 border-gray-300 rounded-sm bg-white px-1 text-sm cursor-pointer hover:bg-gray-100";

}
