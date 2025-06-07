import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LegoService } from '../services/lego.service';
import { formsFields } from '../forms-fields/fields';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-lego-add-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lego-add-modal.html',
  styleUrl: './lego-add-modal.scss'
})
export class LegoAddModal {
  @Input() isOpenAdd = false;
  @Input() showFooter = true;

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  addLegoPieceForm: FormGroup;
  addLegoFields: any[] = Object.keys(formsFields.addLegoPiece);

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
    this.addLegoPieceForm = this.fb.group(formsFields.addLegoPiece);
  }

  close() {
    this.isOpenAdd = false;
    this.closed.emit();
  }

  confirm() {
    this.confirmed.emit(this.addLegoPieceForm.value);
    this.close();
  }
}
