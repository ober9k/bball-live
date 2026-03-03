import { Player } from '@/types/Player';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-player-name',
  styleUrl: './player-name.css',
  templateUrl: './player-name.html',
  standalone: true,
})
export class PlayerName {

  player = input.required<Player>();
  active = input<boolean>(false);

}
