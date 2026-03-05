import { Component, model } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.css',
  standalone: true,
})
export class Modal {

  open = model.required<boolean>();

  handleClose(): void {
    this.open.set(false);
  }

}
