import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { LegoService } from '../services/lego.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { LegoPiece } from '../interfaces/forms';
import { formsFields } from '../forms-fields/fields';
import { LegoAddModal } from '../lego-add-modal/lego-add-modal';
import { LegoEditModal } from '../lego-edit-modal/lego-edit-modal';
import { tableHeaders } from '../forms-fields/table-fields';
import { LegoTable } from '../lego-table/lego-table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule, LegoAddModal, LegoEditModal, LegoTable],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
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

  ngOnInit() {
    this.getAllLegoPieces();
  }

  getAllLegoPieces() {
    this.legoService.getAllLegoPieces().subscribe({
      next: (response) => {
        console.log('All Lego pieces:', response);
        this.legoPieces = response;
      },
      error: (error) => {
        console.error('Error fetching all Lego pieces:', error);
      }
    });
  }

    searchLegoPiece(event: any) {
      const code = this.getInputValue(event);

      if (!this.isValidCode(code)) {
        return;
      }

      this.isSearching = true;

      this.legoService.getLegoPieceByCode(code).subscribe({
        next: (response) => {
          console.log('Lego piece found:', response);
          this.legoPieces = response;
          this.originalLegoPieces = [...response];
          setTimeout(() => {
            this.isSearching = false;
            this.cdr.detectChanges();
          }, 1000);
        },
        error: () => {
          Swal.fire({
            title: 'Error!',
            text: 'No se encontró ninguna pieza de Lego con ese código.',
            icon: 'error',
            timerProgressBar: true,
            timer: 2000,
            position: 'top-end',
            showConfirmButton: false,
            toast: true
          });
          setTimeout(() => {
            this.isSearching = false;
            this.legoPieces = [];
            this.originalLegoPieces = [];
            this.cdr.detectChanges();
          }, 1000);
        }
      });
    }

  // Métodos auxiliares separados por responsabilidad
  private getInputValue(event: any): string {
    return event.target.value.trim();
  }

  private isValidCode(code: string): boolean {
    if (!code) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, introduce un código de pieza válido.',
        icon: 'error',
        timerProgressBar: true,
        timer: 2000,
        position: 'top-end',
        showConfirmButton: false,
        toast: true
      });
      return false;
    }
    return true;
  }

  handleLegoUpdate(event: any): void {
    this.isUpdating = true;
    console.log('Lego piece updated:', event);
    this.legoService.editLegoPieceInBBDD(event.id, event).subscribe({
      next: (response) => {
        console.log('Lego piece updated successfully:', response);
        Swal.fire({
          title: 'Success!',
          text: 'Pieza de Lego actualizada correctamente.',
          icon: 'success',
          timerProgressBar: true,
          timer: 2000,
          position: 'top-end',
          showConfirmButton: false,
          toast: true
        });
      },
      error: (error) => {
        console.error('Error updating Lego piece:', error);
      },
      complete: () => {
        this.legoPieces = this.legoPieces.map(piece =>
          piece.id === event.id ? { ...piece, ...event } : piece
        );
        this.originalLegoPieces = [...this.legoPieces];
        setTimeout(() => {
          this.isUpdating = false;
          this.cdr.detectChanges();
        }, 1000);
      }
    })
  }

  applyFilters(filters: any) {
    console.log('Applying filters:', filters);
    this.currentTaskFilter = filters.taskFilter || '';
    this.currentLegoFilter = filters.legoFilter || '';

    console.log(this.legoPieces.filter(piece => {
      const matchesLego = this.currentLegoFilter ? piece.lego.toLowerCase().includes(this.currentLegoFilter.toLowerCase()) : true;
      const matchesTask = this.currentTaskFilter ? piece.task.toLowerCase().includes(this.currentTaskFilter.toLowerCase()) : true;
      return matchesTask && matchesLego;
    }))
  }
}
