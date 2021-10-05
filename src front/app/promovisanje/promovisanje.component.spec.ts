import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromovisanjeComponent } from './promovisanje.component';

describe('PromovisanjeComponent', () => {
  let component: PromovisanjeComponent;
  let fixture: ComponentFixture<PromovisanjeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromovisanjeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromovisanjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
