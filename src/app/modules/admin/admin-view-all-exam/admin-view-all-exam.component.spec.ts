import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewAllExamComponent } from './admin-view-all-exam.component';

describe('AdminViewAllExamComponent', () => {
  let component: AdminViewAllExamComponent;
  let fixture: ComponentFixture<AdminViewAllExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewAllExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewAllExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
