/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiCommonLoadingComponent } from './loading.component';

describe('UiCommonLoadingComponent', () => {
  let component: UiCommonLoadingComponent;
  let fixture: ComponentFixture<UiCommonLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiCommonLoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCommonLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
