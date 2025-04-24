/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { BasicsSharedMaterialBlobService } from './material-blob.service';
import {HttpClientModule} from '@angular/common/http';

describe('MaterialBlobService', () => {
  let service: BasicsSharedMaterialBlobService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(BasicsSharedMaterialBlobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
