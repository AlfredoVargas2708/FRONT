import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LegoService } from '../services/lego.service';

@Component({
  selector: 'app-lego-add-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lego-add-modal.html',
  styleUrl: './lego-add-modal.scss'
})
export class LegoAddModal {
  @Input() addLegoPieceForm: any;
  @Input() addLegoFields: string[] = [];
  @Input() legoPieces: any[] = [];

  constructor(private legoService: LegoService) {}

  addLegoPiece() {
    const newLegoPiece = this.addLegoPieceForm.value;
    this.legoService.addLegoPieceToBBDD(newLegoPiece).subscribe({
      next: (response) => {
        console.log('Lego piece added successfully:', response);
        this.legoPieces.push(response);
        this.addLegoPieceForm.reset();
      },
      error: (error) => {
        console.error('Error adding Lego piece:', error);
      }
    });
  }
}
