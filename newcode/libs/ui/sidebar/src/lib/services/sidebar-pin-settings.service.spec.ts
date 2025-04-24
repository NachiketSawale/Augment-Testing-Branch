/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { UiSidebarPinSettingsService } from './sidebar-pin-settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SidebarPinSettingsService', () => {
  let service: UiSidebarPinSettingsService;

  beforeEach(() => {
	  TestBed.configureTestingModule({
		  imports: [HttpClientTestingModule],
		  providers: [UiSidebarPinSettingsService]
	  });
    service = TestBed.inject(UiSidebarPinSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call setPinStatus', () => {
    service.sidebarUserSettings={
      sidebarpin: {
        active:false,
        lastButtonId:'sidebar-lastobjects'
      }
    };
    service.setPinStatus(true,'hii');
  });

  it('should call getPinStatus', () => {
    service.sidebarUserSettingsService.sidebarUserSettings={
      sidebarpin: {
        active:false,
        lastButtonId:'sidebar-lastobjects'
      }
    };
    service.getPinStatus();
  });
});
