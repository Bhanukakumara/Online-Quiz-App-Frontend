import { TestBed } from '@angular/core/testing';

import { SubmissionChartService } from './submission-chart.service';

describe('SubmissionChartService', () => {
  let service: SubmissionChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmissionChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
