import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewAllResultComponent } from './admin-view-all-result.component';

describe('AdminViewAllResultComponent', () => {
  let component: AdminViewAllResultComponent;
  let fixture: ComponentFixture<AdminViewAllResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewAllResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewAllResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
