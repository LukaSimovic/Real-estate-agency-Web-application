import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UgovoreneProdajeComponent } from './ugovorene-prodaje.component';

describe('UgovoreneProdajeComponent', () => {
  let component: UgovoreneProdajeComponent;
  let fixture: ComponentFixture<UgovoreneProdajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UgovoreneProdajeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UgovoreneProdajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
