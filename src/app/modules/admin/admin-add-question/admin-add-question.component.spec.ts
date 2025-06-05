import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddQuestionComponent } from './admin-add-question.component';

describe('AdminAddQuestionComponent', () => {
  let component: AdminAddQuestionComponent;
  let fixture: ComponentFixture<AdminAddQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
