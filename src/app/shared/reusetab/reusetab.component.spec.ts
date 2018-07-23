import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusetabComponent } from './reusetab.component';

describe('ReusetabComponent', () => {
  let component: ReusetabComponent;
  let fixture: ComponentFixture<ReusetabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReusetabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReusetabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
