import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegoEditModal } from './lego-edit-modal';

describe('LegoEditModal', () => {
  let component: LegoEditModal;
  let fixture: ComponentFixture<LegoEditModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegoEditModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegoEditModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
