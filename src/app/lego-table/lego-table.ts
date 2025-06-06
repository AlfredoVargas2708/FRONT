import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { LegoService } from '../services/lego.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LegoEditModal } from '../lego-edit-modal/lego-edit-modal';

@Component({
  selector: 'app-lego-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LegoEditModal],
  templateUrl: './lego-table.html',
  styleUrl: './lego-table.scss'
})
export class LegoTable implements AfterViewInit {
  @Input() tableHeaders: string[] = [];
  @Input() legoPieces: any[] = [];
  @Input() isLoading: boolean = false;
  isOpenSearchTask: boolean = false;
  isOpenSearchLego: boolean = false;
  isOpenSearchPedido: boolean = false;
  originalLegoPieces: any[] = [];
  modalIsOpen = false;
  selectedPiece: any = null;

  constructor(private legoService: LegoService) { }

  ngAfterViewInit() {
    this.originalLegoPieces = [...this.legoPieces];
  }

  openSearch(category: string) {
    if (category === 'task') {
      this.isOpenSearchTask = !this.isOpenSearchTask;
    } else if (category === 'lego') {
      this.isOpenSearchLego = !this.isOpenSearchLego;
    } else if (category === 'pedido') {
      this.isOpenSearchPedido = !this.isOpenSearchPedido;
    }
  }

  searchPieceBy(event: any, category: string) {
    if (event.target.value) {
      this.legoPieces = this.originalLegoPieces.filter(piece =>
        piece[category].toLowerCase().includes(event.target.value.toLowerCase())
      );
      if (this.legoPieces.length === 0) {
        this.legoPieces = [...this.originalLegoPieces];
      }
    } else {
      this.legoPieces = [...this.originalLegoPieces];
    }
  }

  openModal(piece: any) {
    this.modalIsOpen = true;
    this.selectedPiece = { ...piece };
  }

  onModalClosed() {
    this.modalIsOpen = false;
  }

  onModalConfirmed() {
    this.modalIsOpen = false;
  }
}
