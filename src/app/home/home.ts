import { Component, ChangeDetectorRef } from '@angular/core';
import { LegoService } from '../services/lego.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { LegoPiece } from '../interfaces/forms';
import { formsFields } from '../forms-fields/fields';
import { LegoAddModal } from '../lego-add-modal/lego-add-modal';
import { LegoEditModal } from '../lego-edit-modal/lego-edit-modal';
import { tableHeaders } from '../forms-fields/table-fields';
import { LegoTable } from '../lego-table/lego-table';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule, LegoAddModal, LegoEditModal, LegoTable],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  legoPieces: LegoPiece[] = [];
  originalLegoPieces: LegoPiece[] = [];
  addLegoFields: any[] = Object.keys(formsFields.addLegoPiece);
  editLegoFields: any[] = Object.keys(formsFields.editLegoPiece);
  tableHeaders: string[] = Object.values(tableHeaders);
  currentTaskFilter: string = '';
  currentLegoFilter: string = '';
  isSearching: boolean = false;
  editLegoPieceForm: FormGroup;
  addLegoPieceForm: FormGroup;
  isUpdating: boolean = false;
  isOpenSearchTask: boolean = false;
  isOpenSearchLego: boolean = false;

  constructor(private legoService: LegoService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.editLegoPieceForm = this.fb.group(formsFields.editLegoPiece);
    this.addLegoPieceForm = this.fb.group(formsFields.addLegoPiece);
  }

  async searchLegoPiece(event: Event) {
    const code = this.getInputValue(event);

    if (!this.isValidCode(code)) {
      return;
    }

    this.startSearch();

    try {
      const data = await this.legoService.getLegoPieceByCode(code).toPromise();
      this.handleSearchResults(data, code);
    } catch (error) {
      this.handleSearchError(error);
    } finally {
      this.finishSearch();
    }
  }

  // Métodos auxiliares separados por responsabilidad
  private getInputValue(event: Event): string {
    const inputElement = event.target as HTMLInputElement;
    return inputElement.value.trim();
  }

  private isValidCode(code: string): boolean {
    if (!code) {
      console.error('Search code input is empty');
      return false;
    }
    return true;
  }

  private startSearch(): void {
    this.isSearching = true;
  }

  private finishSearch(): void {
    this.isSearching = false;
    this.cdr.detectChanges();
  }

  private handleSearchResults(data: any, code: string): void {
    if (data) {
      this.processFoundPieces(data);
      console.log('Lego piece found:', data);
    } else {
      this.legoPieces = [];
      console.warn('No Lego piece found for code:', code);
    }
  }

  private processFoundPieces(pieces: any[]): void {
    this.legoPieces = pieces.map(piece => ({
      ...piece,
      pedido: this.translateBoolean(piece.pedido),
      completo: this.translateBoolean(piece.completo)
    }));
    this.originalLegoPieces = [...this.legoPieces];
  }

  private translateBoolean(value: string): string {
    return value !== '' ? 'Sí' : 'No';
  }

  private handleSearchError(error: any): void {
    console.error('Error fetching Lego piece:', error);
    this.legoPieces = [];
  }

  handleLegoUpdate(event: any): void {
    this.isUpdating = true;
    console.log('Lego piece updated:', event);
    this.legoService.editLegoPieceInBBDD(event.id, event).subscribe({
      next: (response) => {
        console.log('Lego piece updated successfully:', response);
        setTimeout(() => {
          this.processFoundPieces([response.data]);
          this.isUpdating = false;
          this.cdr.detectChanges();
        }, 1000);
      },
      error: (error) => {
        console.error('Error updating Lego piece:', error);
      }
    })
  }
}
