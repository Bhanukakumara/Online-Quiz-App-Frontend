import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubmissionChartComponent } from './admin-submission-chart.component';

describe('AdminSubmissionChartComponent', () => {
  let component: AdminSubmissionChartComponent;
  let fixture: ComponentFixture<AdminSubmissionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSubmissionChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSubmissionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
