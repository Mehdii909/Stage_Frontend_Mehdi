import { TestBed } from '@angular/core/testing';

import { ClasseService } from './classe.service';

describe('ClasseService', () => {
  let service: ClasseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClasseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
