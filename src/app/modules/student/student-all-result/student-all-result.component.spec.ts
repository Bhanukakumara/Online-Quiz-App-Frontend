import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAllResultComponent } from './student-all-result.component';

describe('StudentAllResultComponent', () => {
  let component: StudentAllResultComponent;
  let fixture: ComponentFixture<StudentAllResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentAllResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentAllResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
