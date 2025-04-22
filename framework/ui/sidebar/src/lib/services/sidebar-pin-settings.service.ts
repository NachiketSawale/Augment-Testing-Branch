/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { UiSidebarUserSettingsService } from './sidebar-user-settings.service';
import { ISidebarUserSettingsVal } from '@libs/platform/common';

/**
 * Set/Get sidebar pin status and lastButtonId from local storage.
 */
@Injectable({
  providedIn: 'root'
})
export class UiSidebarPinSettingsService {

  /**
   * Stores sidebar pin object.
   */
  public sidebarUserSettings:ISidebarUserSettingsVal={
    sidebarpin: {
      active:false,
      lastButtonId:''
    }
  };

  /**
   * Sidebar user setting service instance.
   */
  public sidebarUserSettingsService = inject(UiSidebarUserSettingsService);

  /**
   * Set sidebar pin status and lastButtonId to local storage.
   * @param pinStatus sidebar pin status.
   * @param lastButtonId Sidebar tab ID.
   */
  public setPinStatus(pinStatus:boolean, lastButtonId:string) {
    this.sidebarUserSettings.sidebarpin.active = pinStatus;
    this.sidebarUserSettings.sidebarpin.lastButtonId = lastButtonId;

    this.sidebarUserSettingsService.saveSidebarUserSettingsinLocalstorage(this.sidebarUserSettings);
  }

  /**
   * provide lastButtonId and pin status form local storage.
   * @returns sidebar pin status and active sidebar tab id.
   */
  public getPinStatus() {
    const sidebarUserSettings = this.sidebarUserSettingsService.getSidebarUserSettingValues();
    if (sidebarUserSettings && Object.prototype.hasOwnProperty.call(sidebarUserSettings, 'sidebarpin')) {
      this.sidebarUserSettings.sidebarpin = sidebarUserSettings.sidebarpin;
    }
    return this.sidebarUserSettings.sidebarpin;
  }
}
