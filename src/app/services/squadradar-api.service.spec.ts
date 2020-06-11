import { TestBed } from '@angular/core/testing';

import { SquadradarApiService } from './squadradar-api.service';

describe('SquadradarApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SquadradarApiService = TestBed.get(SquadradarApiService);
    expect(service).toBeTruthy();
  });
});
