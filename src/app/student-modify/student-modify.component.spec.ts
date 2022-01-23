import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentModifyComponent } from './student-modify.component';

describe('StudentModifyComponent', () => {
  let component: StudentModifyComponent;
  let fixture: ComponentFixture<StudentModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentModifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
