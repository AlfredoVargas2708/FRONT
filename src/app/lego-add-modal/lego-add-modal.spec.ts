import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegoAddModal } from './lego-add-modal';

describe('LegoAddModal', () => {
  let component: LegoAddModal;
  let fixture: ComponentFixture<LegoAddModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegoAddModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegoAddModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
