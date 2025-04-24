/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { UiNumericConverterService } from './numeric-converter.service';
import { HttpClientModule } from '@angular/common/http';

describe('UiNumericConverterService', () => {
  let service: UiNumericConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
	    imports: [HttpClientModule]
    });
    service = TestBed.inject(UiNumericConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be called formatValue with decimal', () => {
    const viewValue = '1,23,45';
    const inputMode = 'decimal';
    const precision = 2;

    expect(service.formatValue(viewValue, inputMode, precision)).toBe('123.45');

  });

  it('should be called formatValue with integer', () => {
    const viewValue = '1,23,45.02';
    const inputMode = 'numeric';
    const precision = 0;

    expect(service.formatValue(viewValue, inputMode, precision)).toBe('1234502');
  });


  it('should be called formatValue', () => {
    const viewValue = '';
    const inputMode = 'numeric';
    const precision = 0;

    expect(service.formatValue(viewValue, inputMode, precision)).toBe('');
  });

  it('should be called getOptions', () => {
    const inputMode = 'numeric';
    const precision = 0;
    const options = {
      decimal: '.',
      thousand: '',
      precision: 0
    };

    expect(service.getOptions(inputMode, precision)).toEqual(options);
  });


  it('should be called formatters', () => {
    const options = {
      decimal: '.',
      thousand: ',',
      precision: 0
    };
    const modelValue = null;

    expect(service.formatters(modelValue, options)).toBe('');

  });
});
