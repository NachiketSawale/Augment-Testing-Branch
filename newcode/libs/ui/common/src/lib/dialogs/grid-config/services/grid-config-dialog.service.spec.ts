/*
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';

import { UiCommonGridConfigDialogService } from './grid-config-dialog.service';

describe('GridConfigDialogService', () => {
  let service: UiCommonGridConfigDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiCommonGridConfigDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
