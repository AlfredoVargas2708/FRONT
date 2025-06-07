import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { formsFields } from '../forms-fields/fields';

@Component({
  selector: 'app-lego-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lego-edit-modal.html',
  styleUrl: './lego-edit-modal.scss'
})
export class LegoEditModal {
  @Input() isOpen = false;
  @Input() showFooter = true;
  @Input() piece: any;

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  editLegoPieceForm: FormGroup;
  editLegoFields: any[] = Object.keys(formsFields.editLegoPiece);

  pedidos: any[] = [
    { value: 'Si', label: 'Si' },
    { value: 'No', label: 'No' },
    { value: 'Por pedir', label: 'Por pedir' }
  ];

  reemplazados: any[] = [
    { value: 'Si', label: 'Si' },
    { value: 'No', label: 'No' }
  ];

  completos: any[] = [
    { value: 'Si', label: 'Si' },
    { value: 'No', label: 'No' }
  ];

  constructor(private fb: FormBuilder) {
    this.editLegoPieceForm = this.fb.group(formsFields.editLegoPiece);
  }

  ngOnChanges() {
    if (this.piece) {
      this.editLegoPieceForm.patchValue(this.piece);
    }
  }


  close() {
    this.isOpen = false;
    this.closed.emit();
  }

  confirm() {
    this.confirmed.emit(this.editLegoPieceForm.value);
    this.close();
  }
}
