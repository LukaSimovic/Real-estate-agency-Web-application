import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojeNekrComponent } from './moje-nekr.component';

describe('MojeNekrComponent', () => {
  let component: MojeNekrComponent;
  let fixture: ComponentFixture<MojeNekrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MojeNekrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MojeNekrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
