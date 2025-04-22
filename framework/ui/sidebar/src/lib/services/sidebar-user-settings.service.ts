/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { ISidebarUserSettingsVal, PlatformConfigurationService, isAppContextValISidebarUserSettings } from '@libs/platform/common';

import { assign, isEmpty } from 'lodash';

/**
 * Set/Get sidebar user settings value into local storage.
 */
@Injectable({
	providedIn: 'root',
})
export class UiSidebarUserSettingsService {
	/**
	 * Holds sidebar user setting value.
	 */
	public sidebarUserSettings!: ISidebarUserSettingsVal | null;

	/**
	 * Platform context service instance.
	 */
	private readonly platformConfigurationService = inject(PlatformConfigurationService);

	/**
	 * Checks sidebarUserSettings value.
	 * @returns sidebarUserSettings.
	 */
	public getSidebarUserSettings() {
		if (!this.sidebarUserSettings) {
			this.sidebarUserSettings = {
				sidebarpin: {
					active: false,
					lastButtonId: '',
				},
			};
		}
		return this.sidebarUserSettings;
	}

	/**
	 * Save sidebarUserSettings in local storage.
	 * @param object sidebar user settings value.
	 */
	public saveSidebarUserSettingsinLocalstorage(object: ISidebarUserSettingsVal) {
		assign(this.getSidebarUserSettings(), object);
		this.platformConfigurationService.setApplicationValue('sidebarUserSettings', this.sidebarUserSettings, true);
	}

	/**
	 * Get sidebarUserSettings value from local storage.
	 * @returns sidebarUserSettings.
	 */
	public getSidebarUserSettingValues(): ISidebarUserSettingsVal {
		if (!isEmpty(this.sidebarUserSettings)) {
			return this.sidebarUserSettings;
		}

		return this.getUserSettingsFromLocalStorage();
	}

	/**
	 * Get sidebarUserSettings value from local storage.
	 * @returns sidebarUserSettings.
	 */
	public getUserSettingsFromLocalStorage() {
		const sidebarUserSettings = this.platformConfigurationService.getApplicationValue('sidebarUserSettings') as ISidebarUserSettingsVal;
		if (sidebarUserSettings === null) {
			return sidebarUserSettings;
		}

		if (!isAppContextValISidebarUserSettings(sidebarUserSettings)) {
			throw new Error('Improper settings saved');
		}

		this.sidebarUserSettings = sidebarUserSettings;
		return this.sidebarUserSettings;
	}
}
