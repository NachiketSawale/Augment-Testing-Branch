/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';

import { UiCommonHotkeyService } from './hotkey.service';

describe('UiCommonHotkeyService', () => {
  let service: UiCommonHotkeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiCommonHotkeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test getTooltip', () => {
    service.getTooltip('shortcut');
   expect(service.getTooltip('shortcut')).toBeUndefined();
    const shortcuts={
      shortcut:{tooltip:'ctrl + alt'}
    };
    service.shortcuts=shortcuts;
    expect(service.getTooltip('shortcut')).toEqual(shortcuts.shortcut.tooltip);
  });
});
