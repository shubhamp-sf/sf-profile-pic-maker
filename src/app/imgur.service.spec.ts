import { TestBed } from '@angular/core/testing';

import { ImgurService } from './imgur.service';

describe('ImgurService', () => {
  let service: ImgurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImgurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
