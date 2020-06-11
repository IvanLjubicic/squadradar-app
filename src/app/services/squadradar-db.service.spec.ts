import { TestBed } from '@angular/core/testing';

import { SquadradarDbService } from './squadradar-db.service';

describe('SquadradarDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SquadradarDbService = TestBed.get(SquadradarDbService);
    expect(service).toBeTruthy();
  });
});
