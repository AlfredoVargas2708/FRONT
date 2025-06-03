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
  isOpenSearchPedido: boolean = false;
  currentTaskFilter: string = '';
  currentLegoFilter: string = '';
  currentPedidoFilter: string = '';

  @Output() applyFilters = new EventEmitter<any>();
  @Output() deleteLegoPieceEvent = new EventEmitter<any>();

  constructor() { }

  openSearchTask() {
    this.isOpenSearchTask = !this.isOpenSearchTask;
  }

  openSearchLego() {
    this.isOpenSearchLego = !this.isOpenSearchLego;
  }

  openSearchPedido() {
    this.isOpenSearchPedido = !this.isOpenSearchPedido; // Alterna el estado de búsqueda de Pedido
  }

  // Modifica tus funciones de filtrado
  searchTaskInput(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.currentTaskFilter = inputElement.value.trim().toLowerCase();
    this.applyFilters.emit({
      taskFilter: this.currentTaskFilter,
      legoFilter: this.currentLegoFilter,
      pedidoFilter: this.currentPedidoFilter
    });
  }

  searchLegoInput(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.currentLegoFilter = inputElement.value.trim().toLowerCase();
    this.applyFilters.emit({
      taskFilter: this.currentTaskFilter,
      legoFilter: this.currentLegoFilter,
      pedidoFilter: this.currentPedidoFilter
    });
  }

  searchPedidoInput(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.currentPedidoFilter = inputElement.value.trim().toLowerCase();
    this.applyFilters.emit({
      taskFilter: this.currentTaskFilter,
      legoFilter: this.currentLegoFilter,
      pedidoFilter: this.currentPedidoFilter
    });
  }


  editLegoPiece(id: number) {
    this.editLegoPieceForm.patchValue(this.legoPieces[id]);
  }

  deleteLegoPiece(legoPiece: any) {
    this.deleteLegoPieceEvent.emit(legoPiece);
  }
}
