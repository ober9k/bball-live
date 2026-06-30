import { PlayerStatsLog } from '@/types/logs/PlayerStatsLog';
import { NgClass } from '@angular/common';
import { Component, computed, input, OnInit, output, signal } from '@angular/core';

@Component({
  selector: 'app-assist-modal',
  templateUrl: './assist-modal.html',
  styleUrl: './assist-modal.css',
  standalone: true,
  imports: [
    NgClass
  ]
})
export class AssistModal implements OnInit {

  playerStatsLogs = input.required<Array<PlayerStatsLog>>();

  activePlayersLogs = computed(() => {
    return this.playerStatsLogs()
      .filter((log) => this.currentActiveIds().includes(log.player.id));
  });

  initialActiveIds = signal<number[]>([]);
  currentActiveIds = signal<number[]>([]);

  onClose = output<void>();

  ngOnInit() {
    this.initialActiveIds.update(() => {
      return [ ...this.playerStatsLogs()
        .filter(AssistModal.filterActive)
        .map(AssistModal.mapPlayerId)
      ];
    });

    this.currentActiveIds.update(() => {
      return [ ...this.initialActiveIds() ];
    });
  }

  cancelSubstitutions() {
    this.onClose.emit();
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
