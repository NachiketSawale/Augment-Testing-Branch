/*
 * Copyright(c) RIB Software GmbH
 */

import {TestBed} from '@angular/core/testing';

import {UnhandledValidationErrorService} from './unhandled-validation-error.service';

describe('UnhandledValidationErrorService', () => {
  let service: UnhandledValidationErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnhandledValidationErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
