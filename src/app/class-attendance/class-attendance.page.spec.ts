import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassAttendancePage } from './class-attendance.page';

describe('ClassAttendancePage', () => {
  let component: ClassAttendancePage;
  let fixture: ComponentFixture<ClassAttendancePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassAttendancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
