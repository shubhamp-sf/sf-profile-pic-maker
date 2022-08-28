import { TestBed } from '@angular/core/testing';

import { RenderPFPService } from './render-pfp.service';

describe('RenderPFPService', () => {
  let service: RenderPFPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenderPFPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
