import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateQuestionComponent } from './admin-update-question.component';

describe('AdminUpdateQuestionComponent', () => {
  let component: AdminUpdateQuestionComponent;
  let fixture: ComponentFixture<AdminUpdateQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpdateQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpdateQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
