/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { BasicsSharedMaterialSearchService } from './material-search.service';
import {HttpClientModule} from '@angular/common/http';

describe('MaterialSearchService', () => {
  let service: BasicsSharedMaterialSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(BasicsSharedMaterialSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
