import { TestBed } from '@angular/core/testing';

import { AiRequestService } from './ai-request.service';

describe('AiRequestService', () => {
  let service: AiRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
