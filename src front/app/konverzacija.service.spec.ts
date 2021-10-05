import { TestBed } from '@angular/core/testing';

import { KonverzacijaService } from './konverzacija.service';

describe('KonverzacijaService', () => {
  let service: KonverzacijaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KonverzacijaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
