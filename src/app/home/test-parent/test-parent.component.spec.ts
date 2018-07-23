import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestParentComponent } from './test-parent.component';

describe('TestParentComponent', () => {
  let component: TestParentComponent;
  let fixture: ComponentFixture<TestParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
