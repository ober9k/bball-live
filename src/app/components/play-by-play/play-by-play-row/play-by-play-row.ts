import { MinutesPipe } from '@/pipes/minutes-pipe';
import { Action, EventLog } from '@/types/logs/EventLog';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-play-by-play-row',
  templateUrl: './play-by-play-row.html',
  standalone: true,
  providers: [
    MinutesPipe
  ]
})
export class PlayByPlayRow {

  eventLog = input.required<EventLog>();

  constructor(
    private minutesPipe: MinutesPipe,
  ) {}


  getAction() {
    return this.eventLog().action;
  }

  getPlayer() {
    return this.eventLog().player;
  }

  getSecondaryPlayer() {
    return this.eventLog().secondaryPlayer;
  }

  getActionText() {
    /* handle special cases */
    if (this.getAction() === Action.FieldGoalMade_2 && this.getSecondaryPlayer()) {
      return `made two point field goal (assisted by <strong>${this.getSecondaryPlayer().name}</strong>).`;
    }

    if (this.getAction() === Action.FieldGoalMade_3 && this.getSecondaryPlayer()) {
      return `made three point field goal (assisted by <strong>${this.getSecondaryPlayer().name}</strong>).`;
    }

    switch (this.getAction()) {
      case Action.FieldGoalMade_1:
        return "made free throw.";
      case Action.FieldGoalAttempted_1:
        return "missed free throw.";
      case Action.FieldGoalMade_2:
        return "made two point field goal.";
      case Action.FieldGoalAttempted_2:
        return "missed two point field goal.";
      case Action.FieldGoalMade_3:
        return "made three point field goal.";
      case Action.FieldGoalAttempted_3:
        return "missed three point field goal.";
      case Action.OffRebound:
        return "offensive rebound.";
      case Action.DefRebound:
        return "defensive rebound.";
      case Action.Steal:
        return "stole attempted pass."; /* link to turnover */
      case Action.Block:
        return "blocked attempted shot."; /* link to missed 2/3 */
      case Action.Turnover:
        return "turned the ball over.";
      case Action.SubstitutionOut:
        return "subbed out of the game.";
      case Action.SubstitutionIn:
        return "subbed into the game.";
      default:
        return "did something.";
    }
  }

  getFullActionText(): string {
    const minutes = this.minutesPipe.transform(this.eventLog().seconds);
    const player  = this.getPlayer().name;
    const action  = this.getActionText();

    return (
      `<small>${minutes}</small> <strong>${player}</strong> ${action}`
    );
  }

}
