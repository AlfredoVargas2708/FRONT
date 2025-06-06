import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { LegoService } from '../services/lego.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-lego-table',
  imports: [CommonModule, ReactiveFormsModule],
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
}
