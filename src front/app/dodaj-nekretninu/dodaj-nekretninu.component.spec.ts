import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajNekretninuComponent } from './dodaj-nekretninu.component';

describe('DodajNekretninuComponent', () => {
  let component: DodajNekretninuComponent;
  let fixture: ComponentFixture<DodajNekretninuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DodajNekretninuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DodajNekretninuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
