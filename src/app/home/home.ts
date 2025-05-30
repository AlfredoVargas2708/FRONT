import { Component, ChangeDetectorRef } from '@angular/core';
import { LegoService } from '../services/lego.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  legoPieces: any[] = [];
  isTableVisible: boolean = false;
  editLegoPieceForm: FormGroup;
  isUpdating: boolean = false;

  constructor(private legoService: LegoService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.editLegoPieceForm = this.fb.group({
      id: [''],
      code: [''],
      lego: [''],
      set: [''],
      task: [''],
      pedido: [''],
      completo: [''],
      reemplazado: [''],
    });
  }

  searchLegoPiece(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const code = inputElement.value.trim(); // Get the value from the input element
    if (!code) {
      console.error('Search code input is empty');
      return;
    }
    this.legoService.getLegoPieceByCode(code).subscribe({
      next: (data) => {
        if (data) {
          console.log('Lego piece found:', data);
          this.legoPieces = data.map((piece: any) => ({
            ...piece,
            pedido: piece.pedido !== '' ? 'Sí' : 'No',
            completo: piece.completo !== '' ? 'Sí' : 'No',
            reemplazado: piece.reemplazado !== '' ? 'Sí' : 'No'
          }));
          console.log('Lego pieces after processing:', this.legoPieces);
        } else {
          console.warn('No Lego piece found for code:', code);
          this.legoPieces = []; // Clear the list if not found
        }
      },
      error: (error) => {
        console.error('Error fetching Lego piece:', error);
        this.legoPieces = []; // Clear the list on error
      }
    })
  }

  viewTable() {
    this.isTableVisible = true;
  }

  editLegoPiece(id: number) {
    console.log('Edit Lego piece:', this.legoPieces[id]);
    this.editLegoPieceForm.patchValue(this.legoPieces[id]);
    console.log('Form values after patch:', this.editLegoPieceForm.value);
  }

  updateLegoPiece() {
    const updatedLegoPiece = this.editLegoPieceForm.value;
    this.isUpdating = true;
    this.isTableVisible = false; // Hide the table while updating

    this.legoService.editLegoPieceInBBDD(updatedLegoPiece.id, updatedLegoPiece).subscribe({
      next: (response) => {
        console.log('Lego piece updated successfully:', response);

        // Opción 1: Actualizar el elemento específico en el array
        const index = this.legoPieces.findIndex(p => p.id === updatedLegoPiece.id);
        if (index !== -1) {
          this.legoPieces[index] = {
            ...updatedLegoPiece,
            pedido: updatedLegoPiece.pedido === 'Sí' ? 'Sí' : 'No',
            completo: updatedLegoPiece.completo === 'Sí' ? 'Sí' : 'No',
            reemplazado: updatedLegoPiece.reemplazado === 'Sí' ? 'Sí' : 'No'
          };

          // Forzar la actualización de la vista
          this.legoPieces = [...this.legoPieces];
        }

        // Opción 2: Recargar los datos desde el servidor (más seguro)
        // this.legoService.getLegoPieceByCode(updatedLegoPiece.code).subscribe(data => {
        //   this.legoPieces = data.map((piece: any) => ({
        //     ...piece,
        //     pedido: piece.pedido ? 'Sí' : 'No',
        //     completo: piece.completo ? 'Sí' : 'No',
        //     reemplazado: piece.reemplazado ? 'Sí' : 'No'
        //   }));
        // });

        this.editLegoPieceForm.reset();
        this.isUpdating = false;
        this.isTableVisible = true; // Show the table again after updating
        this.cdr.detectChanges(); // Forzar detección de cambios
      },
      error: (error) => {
        console.error('Error updating Lego piece:', error);
        this.isUpdating = false;
      }
    });
  }
}
