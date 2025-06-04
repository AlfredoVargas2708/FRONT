import { Component, ChangeDetectorRef, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  currentPedidoFilter: string = '';
  isSearching: boolean = false;
  editLegoPieceForm: FormGroup;
  addLegoPieceForm: FormGroup;
  isUpdating: boolean = false;
  isOpenSearchTask: boolean = false;
  isOpenSearchLego: boolean = false;

  @ViewChild('searchInput') searchInput!: ElementRef;

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
        this.legoPieces = response;
        this.originalLegoPieces = [...response];
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 1000);
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
        this.legoPieces = response;
        setTimeout(() => {
          this.isSearching = false;
          this.cdr.detectChanges();
        }, 1000);
      },
      error: () => {
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
    this.legoService.editLegoPieceInBBDD(event.id, event).subscribe({
      next: (response) => {
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
    this.currentTaskFilter = filters.taskFilter || '';
    this.currentLegoFilter = filters.legoFilter || '';
    this.currentPedidoFilter = filters.pedidoFilter || '';

    this.legoPieces = this.originalLegoPieces.filter(piece => {
      const matchesLego = this.currentLegoFilter ? piece.lego.toLowerCase().includes(this.currentLegoFilter.toLowerCase()) : true;
      const matchesTask = this.currentTaskFilter ? piece.task.toLowerCase().includes(this.currentTaskFilter.toLowerCase()) : true;
      const matchesPedido = this.currentPedidoFilter ? piece.pedido.toLowerCase().includes(this.currentPedidoFilter.toLowerCase()) : true;

      return matchesTask && matchesLego && matchesPedido;
    });

    if (this.legoPieces.length === 0) {
      Swal.fire({
        title: 'No results found',
        text: 'No se encontraron piezas de Lego que coincidan con los filtros aplicados.',
        icon: 'info',
        timerProgressBar: true,
        timer: 2000,
        position: 'top-end',
        showConfirmButton: false,
        toast: true
      });
      this.legoPieces = [...this.originalLegoPieces]; // Reset to original if no matches
    }
  }

  cancelSearch() {
    this.isUpdating = true;
    this.searchInput.nativeElement.value = '';
    setTimeout(() => {
      this.legoPieces = [...this.originalLegoPieces];
      this.isUpdating = false;
      this.cdr.detectChanges();
    });
  }

  deleteLegoPiece(event: any) {
    this.isUpdating = true;
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'No, cancelar!',
      position: 'top-end',
      toast: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.legoService.deleteLegoPieceFromBBDD(event.id).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'La pieza de Lego ha sido eliminada.',
              icon: 'success',
              timerProgressBar: true,
              timer: 2000,
              position: 'top-end',
              showConfirmButton: false,
              toast: true
            });
            this.legoPieces = this.legoPieces.filter(piece => piece.id !== event.id);
            this.originalLegoPieces = this.legoPieces;
          },
          error: (error) => {
            console.error('Error deleting Lego piece:', error);
            Swal.fire({
              title: 'Error!',
              text: 'No se pudo eliminar la pieza de Lego.',
              icon: 'error',
              timerProgressBar: true,
              timer: 2000,
              position: 'top-end',
              showConfirmButton: false,
              toast: true
            });
            setTimeout(() => {
              this.isUpdating = false;
              this.cdr.detectChanges();
            });
          },
          complete: () => {
            setTimeout(() => {
              this.isUpdating = false;
              this.cdr.detectChanges();
            }, 1000);
          }
        });
      } else {
        setTimeout(() => {
          this.isUpdating = false;
          this.cdr.detectChanges();
        });
      }
    });
  }
}
