import { TestBed } from '@angular/core/testing';

import { BgRemoveService } from './bg-remove.service';

describe('BgRemoveService', () => {
  let service: BgRemoveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BgRemoveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
