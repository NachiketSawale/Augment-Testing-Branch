/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { UiCommonDatePickerConverterService } from './date-picker-converter.service';

describe('UiCommonDatePickerConverterService', () => {
  let service: UiCommonDatePickerConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiCommonDatePickerConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should called setSelectedDate', () => {
    const selectedDate = new Date();
    service.setSelectedDate(selectedDate);
    expect(service.selectedDateFromInput).toBe(selectedDate);
  });

  it('should called getSelectedDateFromInput', () => {
    expect(service.getSelectedDateFromInput());
  });

  it('should called getUtcDate', () => {
    const selectedDate = new Date();
    expect(service.getUtcDate(selectedDate));
  });

  it('should called formatInputDate with utcMode', () => {
    const selectedDate = new Date();
    service.utcMode = true;
    expect(service.formatInputDate(selectedDate));
  });

  it('should called formatInputDate without utcMode', () => {
    const selectedDate = new Date();
    service.utcMode = false;
    expect(service.formatInputDate(selectedDate));
  });
});
