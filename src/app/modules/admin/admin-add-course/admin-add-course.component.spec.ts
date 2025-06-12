import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddCourseComponent } from './admin-add-course.component';

describe('AdminAddCourseComponent', () => {
  let component: AdminAddCourseComponent;
  let fixture: ComponentFixture<AdminAddCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
