import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LegoService } from '../services/lego.service';

@Component({
  selector: 'app-lego-edit-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lego-edit-modal.html',
  styleUrl: './lego-edit-modal.scss'
})
export class LegoEditModal {
  @Input() editLegoPieceForm: any;
  @Input() editLegoFields: any[] = [];
  @Input() legoPieces: any[] = [];
  @Input() isUpdating: boolean = false;

  constructor(private legoService: LegoService, private cdr: ChangeDetectorRef) {}

  updateLegoPiece() {
    const updatedLegoPiece = this.editLegoPieceForm.value;
    this.isUpdating = true;

    this.legoService.editLegoPieceInBBDD(updatedLegoPiece.id, updatedLegoPiece).subscribe({
      next: (response) => {
        console.log('Lego piece updated successfully:', response);

        const index = this.legoPieces.findIndex(p => p.id === updatedLegoPiece.id);
        if (index !== -1) {
          this.legoPieces[index] = {
            ...updatedLegoPiece,
            pedido: updatedLegoPiece.pedido === 'Sí' ? 'Sí' : 'No',
            completo: updatedLegoPiece.completo === 'Sí' ? 'Sí' : 'No',
          };

          // Forzar la actualización de la vista
          this.legoPieces = [...this.legoPieces];
        }

        this.editLegoPieceForm.reset();
        setTimeout(() => {
          this.isUpdating = false; // Reset the updating flag
          this.cdr.detectChanges(); // Ensure the view is updated
        });
      },
      error: (error) => {
        console.error('Error updating Lego piece:', error);
        setTimeout(() => {
          this.isUpdating = false; // Reset the updating flag
          this.cdr.detectChanges(); // Ensure the view is updated
        });
      }
    });
  }
}
