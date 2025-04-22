/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { PendingAsyncValidationService } from './pending-async-validation.service';

describe('PendingAsyncValidationService', () => {
  let service: PendingAsyncValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingAsyncValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
