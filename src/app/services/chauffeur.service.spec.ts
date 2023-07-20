import { TestBed } from '@angular/core/testing';

import { ChauffeurService } from './chauffeur.service';

describe('ChauffeurService', () => {
  let service: ChauffeurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChauffeurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
