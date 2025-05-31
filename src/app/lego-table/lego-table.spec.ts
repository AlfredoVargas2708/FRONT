import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegoTable } from './lego-table';

describe('LegoTable', () => {
  let component: LegoTable;
  let fixture: ComponentFixture<LegoTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegoTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegoTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
