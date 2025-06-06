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

  constructor(private fb: FormBuilder) {
    this.editLegoPieceForm = this.fb.group(formsFields.editLegoPiece);
    console.log('Edit Lego Piece Form Initialized:', this.editLegoPieceForm);
  }

  ngOnChanges() {
    if (this.piece) {
      console.log('Received piece:', this.piece);
      this.editLegoPieceForm.patchValue(this.piece);
      console.log('Form patched with piece data:', this.editLegoPieceForm.value);
    }
  }


  close() {
    this.isOpen = false;
    this.closed.emit();
  }

  confirm() {
    this.confirmed.emit();
    this.close();
  }
}
