import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrNekretnineComponent } from './str-nekretnine.component';

describe('StrNekretnineComponent', () => {
  let component: StrNekretnineComponent;
  let fixture: ComponentFixture<StrNekretnineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrNekretnineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrNekretnineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
