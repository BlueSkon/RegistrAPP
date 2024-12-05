import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditClassPage } from './edit-class.page';

describe('EditClassPage', () => {
  let component: EditClassPage;
  let fixture: ComponentFixture<EditClassPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
