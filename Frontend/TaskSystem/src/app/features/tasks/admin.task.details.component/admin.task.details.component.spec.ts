import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTaskDetailsComponent } from './admin.task.details.component';

describe('AdminTaskDetailsComponent', () => {
  let component: AdminTaskDetailsComponent;
  let fixture: ComponentFixture<AdminTaskDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTaskDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTaskDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
