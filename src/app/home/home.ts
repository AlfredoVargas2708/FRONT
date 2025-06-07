import { Component, ChangeDetectorRef, OnInit, Output, EventEmitter} from '@angular/core';
import { LegoService } from '../services/lego.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { LegoPiece } from '../interfaces/forms';
import { tableHeaders } from '../forms-fields/table-fields';
import { LegoTable } from '../lego-table/lego-table';
import Swal from 'sweetalert2';
import { LegoAddModal } from '../lego-add-modal/lego-add-modal';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule, LegoTable, LegoAddModal],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  legoPieces: LegoPiece[] = [];
  originalLegoPieces: LegoPiece[] = [];
  tableHeaders: string[] = Object.values(tableHeaders);
  isLoading: boolean = false;
  modalAddIsOpen: boolean = false;

  @Output() getLegoPiecesUpdated = new EventEmitter<void>();

  ngOnInit(): void {
    this.getAllLegoPieces();
  }

  constructor(
    private legoService: LegoService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  getAllLegoPieces() {
    this.isLoading = true;
    this.legoPieces = []; // Limpiar las piezas antes de cargar nuevas
    this.originalLegoPieces = []; // Limpiar las piezas originales antes de cargar nuevas
    this.legoService.getAllLegoPieces().subscribe({
      next: async (response) => {
        this.legoPieces = response;
        this.loadSetImages();
        this.originalLegoPieces = [...this.legoPieces]; // Guardar las piezas originales
      },
      error: (error) => {
        console.error('Error fetching all Lego pieces:', error);
        this.isLoading = false;
      }
    })
  }

  loadSetImages() {
    this.legoService.getAllSetImages().subscribe({
      next: (images) => {
        this.legoPieces.forEach(piece => {
          const image = images.find((img: any) => img.code_sets === piece.lego);
          piece.image = image ? image.image_set : 'https://assets.lego.com/logos/v4.5.0/brand-lego.svg';
        });
        this.isLoading = false; // Desactivar loading cuando todo está listo
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching set images:', error);
        this.isLoading = false; // Desactivar loading en error
      }
    });
  }

  searchLegoPiece(event: any) {
    const code = event.target.value;

    if (!code) {
      this.getAllLegoPieces();
      return;
    }

    this.isLoading = true;

    this.legoService.getLegoPieceByCode(code).subscribe({
      next: (response) => {
        this.legoPieces = response;
        this.loadSetImages();
      },
      error: (error) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Error!',
          text: error.error.error || 'No se encontraron piezas de Lego con ese código.',
          icon: 'error',
          timerProgressBar: true,
          timer: 2000,
          position: 'top-end',
          showConfirmButton: false,
          toast: true
        })
        this.legoPieces = this.originalLegoPieces; // Restaura las piezas originales si hay un error
      }
    })
  }

  openAddModal() {
    this.modalAddIsOpen = true;
  }

  onModalClosed() {
    this.modalAddIsOpen = false;
  }

  onModalConfirmed(event: any) {
    this.modalAddIsOpen = false;
    this.legoService.addLegoPieceToBBDD(event).subscribe({
      next: (response) => {
        console.log('Response from addLegoPieceToBBDD:', response);
        this.getLegoPiecesUpdated.emit();
      },
      error: (error) => {
        console.error('Error from addLegoPieceToBBDD:', error);
      }
    })
  }
}
