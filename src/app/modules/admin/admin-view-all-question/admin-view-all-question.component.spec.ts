import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewAllQuestionComponent } from './admin-view-all-question.component';

describe('AdminViewAllQuestionComponent', () => {
  let component: AdminViewAllQuestionComponent;
  let fixture: ComponentFixture<AdminViewAllQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewAllQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewAllQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
