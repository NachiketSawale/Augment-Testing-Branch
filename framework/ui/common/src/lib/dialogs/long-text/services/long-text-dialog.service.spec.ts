import { TestBed } from '@angular/core/testing';

import { UiCommonLongTextDialogService } from './long-text-dialog.service';

describe('UiCommonLongTextDialogService', () => {
  let service: UiCommonLongTextDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiCommonLongTextDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
