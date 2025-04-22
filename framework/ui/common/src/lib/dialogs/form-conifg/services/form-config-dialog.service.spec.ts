import { TestBed } from '@angular/core/testing';

import { UiCommonFormConfigDialogService } from './form-config-dialog.service';

describe('FormConfigDialogService', () => {
  let service: UiCommonFormConfigDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiCommonFormConfigDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
