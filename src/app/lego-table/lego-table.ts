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
  currentSearchCategory: string = '';
  currentCategory: string = '';
  originalLegoPieces: any[] = [];
  modalIsOpen = false;
  selectedPiece: any = null;

  @Output() getLegoPiecesUpdated = new EventEmitter<any>();

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
      this.currentSearchCategory = event.target.value;
      this.currentCategory = category;
      if (this.legoPieces.length === 0) {
        this.legoPieces = [...this.originalLegoPieces];
      }
    } else {
      this.legoPieces = [...this.originalLegoPieces];
    }
  }

  deleteLego(id: number) {
    this.legoService.deleteLegoPieceFromBBDD(id).subscribe({
      next: (response) => {
        console.log('Response from deleteLegoPieceInBBDD:', response);
        this.getLegoPiecesUpdated.emit();
      },
      error: (error) => {
        console.error('Error from deleteLegoPieceInBBDD:', error);
      }
    });
  }

  openModal(piece: any) {
    this.modalIsOpen = true;
    this.selectedPiece = { ...piece };
  }

  onModalClosed() {
    this.modalIsOpen = false;
  }

  onModalConfirmed(event: any) {
    this.modalIsOpen = false;
    this.legoService.editLegoPieceInBBDD(event.id, event).subscribe({
      next: (response) => {
        console.log('Response from editLegoPieceInBBDD:', response);
        this.getLegoPiecesUpdated.emit({ category: this.currentCategory, value: this.currentSearchCategory });
      },
      error: (error) => {
        console.error('Error from editLegoPieceInBBDD:', error);
      }
    })
  }
}
