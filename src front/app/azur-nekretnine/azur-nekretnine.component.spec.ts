import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AzurNekretnineComponent } from './azur-nekretnine.component';

describe('AzurNekretnineComponent', () => {
  let component: AzurNekretnineComponent;
  let fixture: ComponentFixture<AzurNekretnineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AzurNekretnineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AzurNekretnineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
