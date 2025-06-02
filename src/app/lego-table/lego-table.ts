import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LegoService } from '../services/lego.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-lego-table',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lego-table.html',
  styleUrl: './lego-table.scss'
})
export class LegoTable {
  @Input() tableHeaders: string[] = [];
  @Input() legoPieces: any[] = [];
  @Input() isSearching: boolean = false;
  @Input() isUpdating: boolean = false;
  @Input() editLegoPieceForm: any;
  originalLegoPieces: any[] = [];
  isOpenSearchTask: boolean = false;
  isOpenSearchLego: boolean = false;
  currentTaskFilter: string = '';
  currentLegoFilter: string = '';

  @Output() applyFilters = new EventEmitter<any>();

  constructor() { }

  openSearchTask() {
    this.isOpenSearchTask = !this.isOpenSearchTask;
  }

  openSearchLego() {
    this.isOpenSearchLego = !this.isOpenSearchLego;
  }

  // Modifica tus funciones de filtrado
  searchTaskInput(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.currentTaskFilter = inputElement.value.trim().toLowerCase();
    console.log('Current Task Filter:', this.currentTaskFilter);
    this.applyFilters.emit({
      taskFilter: this.currentTaskFilter,
      legoFilter: this.currentLegoFilter
    })
    //this.applyFilters();
  }

  searchLegoInput(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.currentLegoFilter = inputElement.value.trim().toLowerCase();
    console.log('Current Lego Filter:', this.currentLegoFilter);
    this.applyFilters.emit({
      taskFilter: this.currentTaskFilter,
      legoFilter: this.currentLegoFilter
    })
    //this.applyFilters();
  }

/*   // Nueva función que aplica todos los filtros
  private applyFilters() {
    this.legoPieces = [...this.originalLegoPieces];

    // Aplicar filtro por task si existe
    if (this.currentTaskFilter) {
      this.legoPieces = this.legoPieces.filter(piece =>
        piece.task?.toLowerCase().includes(this.currentTaskFilter)
      );
    }

    // Aplicar filtro por lego si existe
    if (this.currentLegoFilter) {
      this.legoPieces = this.legoPieces.filter(piece =>
        piece.lego?.toLowerCase().includes(this.currentLegoFilter)
      );
    }
  } */

  editLegoPiece(id: number) {
    this.editLegoPieceForm.patchValue(this.legoPieces[id]);
    console.log('Form values after patch:', this.editLegoPieceForm.value);
  }
}
