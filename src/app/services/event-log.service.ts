import { ActionType, EventLog } from '@/types/logs/EventLog';
import { Player } from '@/types/Player';
import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventLogService {

  eventLogs = signal<Array<EventLog>>([]);

  getNextId = computed(() => {
    return (this.eventLogs().length)
      ? this.eventLogs().at(-1).id + 1
      : 1;
  });

  pushEventLog(action: ActionType, player: Player, seconds: number, active: boolean = true): void {
    const log = {
      id: this.getNextId(),
      action, player, seconds, active
    };

    this.eventLogs.update((logs) => [
      ...logs, log,
    ]);
  }

  deleteEventLog(log: EventLog): void {
    this.eventLogs.update((logs) => {
      const existingLog = logs.find(({ id }) => id === log.id);

      if (existingLog) {
        existingLog.active = false; /* or deleted flag */
      }

      return [
        ...logs,
      ];
    });
  }

}
