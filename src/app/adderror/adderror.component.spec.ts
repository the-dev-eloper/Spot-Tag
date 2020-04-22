import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdderrorComponent } from './adderror.component';

describe('AdderrorComponent', () => {
  let component: AdderrorComponent;
  let fixture: ComponentFixture<AdderrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdderrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdderrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
