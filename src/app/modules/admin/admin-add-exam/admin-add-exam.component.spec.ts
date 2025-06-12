import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddExamComponent } from './admin-add-exam.component';

describe('AdminAddExamComponent', () => {
  let component: AdminAddExamComponent;
  let fixture: ComponentFixture<AdminAddExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
