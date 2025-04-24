import { TestBed } from '@angular/core/testing';

import { UiCommonProfileDialogService } from './profile-dialog.service';

describe('UiCommonProfileDialogService', () => {
  let service: UiCommonProfileDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiCommonProfileDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});