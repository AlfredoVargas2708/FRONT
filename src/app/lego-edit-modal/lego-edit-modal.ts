import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-lego-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lego-edit-modal.html',
  styleUrl: './lego-edit-modal.scss'
})
export class LegoEditModal {
/*   @Input() editLegoPieceForm: any;
  @Input() editLegoFields: any[] = [];

  @Output() updateLegoPieceEvent = new EventEmitter<any>();

  constructor() { }

  updateLegoPiece() {
    this.updateLegoPieceEvent.emit(this.editLegoPieceForm.value);
  } */
}
