import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZahteviKorisnikComponent } from './zahtevi-korisnik.component';

describe('ZahteviKorisnikComponent', () => {
  let component: ZahteviKorisnikComponent;
  let fixture: ComponentFixture<ZahteviKorisnikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZahteviKorisnikComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZahteviKorisnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
