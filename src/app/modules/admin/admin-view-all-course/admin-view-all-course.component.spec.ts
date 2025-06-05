import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewAllCourseComponent } from './admin-view-all-course.component';

describe('AdminViewAllCourseComponent', () => {
  let component: AdminViewAllCourseComponent;
  let fixture: ComponentFixture<AdminViewAllCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewAllCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewAllCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
