import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegAzurInfoComponent } from './reg-azur-info.component';

describe('RegAzurInfoComponent', () => {
  let component: RegAzurInfoComponent;
  let fixture: ComponentFixture<RegAzurInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegAzurInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegAzurInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
