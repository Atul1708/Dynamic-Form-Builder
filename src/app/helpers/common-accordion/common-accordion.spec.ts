import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAccordion } from './common-accordion';

describe('CommonAccordion', () => {
  let component: CommonAccordion;
  let fixture: ComponentFixture<CommonAccordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonAccordion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonAccordion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
