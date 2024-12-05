import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsTeachersPage } from './tabs-teachers.page';

describe('TabsTeachersPage', () => {
  let component: TabsTeachersPage;
  let fixture: ComponentFixture<TabsTeachersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsTeachersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
