/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { UiSidebarSimpleSearchFilterService } from './simple-search-filter.service';
import { HttpClientModule } from '@angular/common/http';

describe('UiSidebarSimpleSearchFilterService', () => {
  let service: UiSidebarSimpleSearchFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule]
    });
    service = TestBed.inject(UiSidebarSimpleSearchFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
