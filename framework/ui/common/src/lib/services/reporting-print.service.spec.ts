/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { ReportingPrintService } from './reporting-print.service';

describe('ReportingPrintService', () => {
  let service: ReportingPrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({
		providers: [HttpClient, HttpHandler],
	 });
    service = TestBed.inject(ReportingPrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
