/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, inject } from '@angular/core';

import { UiSidebarUserSettingsService } from '../sidebar-user-settings.service';

import { IReportUserSettings, IReportPinState } from '@libs/platform/common';



/**
 * Service manages the state for report sidebar.
 */
@Injectable({
	providedIn: 'root',
})
export class UiSidebarReportSettingsService {
	/**
	 * Set/Get sidebar user settings value into local storage.
	 */
	private readonly sidebarUserSettingsService = inject(UiSidebarUserSettingsService);

	/**
	 * Report sidebar setting data.
	 */
	private readonly sidebarUserSettings: IReportUserSettings = {
		report: {
			language: '',
			pinState: [],
			expandState: [],
		},
	};

	/**
	 * Saves the report sidebar state into local storage.
	 */
	private saveState(): void {
		const sidebarUserSettings = this.sidebarUserSettingsService.getSidebarUserSettingValues();

		if (sidebarUserSettings) {
			sidebarUserSettings.report = this.sidebarUserSettings.report;
			this.sidebarUserSettingsService.saveSidebarUserSettingsinLocalstorage(sidebarUserSettings);
		}
	}

	/**
	 * Saves the selected language in local storage.
	 *
	 * @param {string} itemLanguage Selected language.
	 */
	public saveCommonFlagStatusInLocalStorage(itemLanguage: string): void {
		this.sidebarUserSettings.report.language = itemLanguage;
		this.saveState();
	}

	/**
	 * Retrieves the saved language from local storage or returns null if language not saved previously.
	 *
	 * @returns {String|null} Saved language.
	 */
	public getLanguageFromStorage(): string | null {
		const reportObject = this.sidebarUserSettingsService.getSidebarUserSettingValues();

		if (reportObject && reportObject.report && reportObject.report.language.length) {
			this.sidebarUserSettings.report.language = reportObject.report.language;
			return this.sidebarUserSettings.report.language;
		}

		return null;
	}

	/**
	 * Saves the pinned item data in local storage.
	 *
	 * @param {IReportPinState} pinState Pinned item.
	 */
	public setPinState(pinState: IReportPinState): void {
		const isPresent = this.sidebarUserSettings.report.pinState.find((pinItem) => {
			return pinItem.groupId === pinState.groupId && pinItem.id === pinState.id;
		});

		if (isPresent) {
			return;
		}

		this.sidebarUserSettings.report.pinState.push(pinState);
		this.saveState();
	}

	/**
	 * Retrieves the pinned elements data from local storage or returns empty array
	 * if pinned items not saved previously.
	 *
	 * @returns {IReportPinState[]} Pinned elements data.
	 */
	public getPinState(): IReportPinState[] {
		const reportObject = this.sidebarUserSettingsService.getSidebarUserSettingValues();

		if (reportObject && reportObject.report && reportObject.report.pinState.length) {
			this.sidebarUserSettings.report.pinState = reportObject.report.pinState;
			return this.sidebarUserSettings.report.pinState;
		}

		return [];
	}

	/**
	 * Method removes the pinned item data from local storage.
	 *
	 * @param {number|string} id Id of the unpinned element.
	 * @param {number|undefined} groupId Group id of the unpinned element.
	 */
	public deletePinState(id: number | string, groupId: number | undefined): void {
		const itemIndex = this.sidebarUserSettings.report.pinState.findIndex((item) => {
			return item.id === id && item.groupId === groupId;
		});

		if (itemIndex > -1) {
			this.sidebarUserSettings.report.pinState.splice(itemIndex, 1);
			this.saveState();
		}
	}

	/**
	 * Method saves the id of expanded group in local storage.
	 *
	 * @param {number} groupId Expanded group id.
	 */
	public setExpandState(groupId: number): void {
		const isPresent = this.sidebarUserSettings.report.expandState.find((id) => {
			return id === groupId;
		});

		if (isPresent) {
			return;
		}

		this.sidebarUserSettings.report.expandState.push(groupId);
		this.saveState();
	}

	/**
	 * Method returns the Array of group id in expanded state.
	 *
	 * @returns {number[]} Group id's.
	 */
	public getExpandState(): number[] {
		const reportObject = this.sidebarUserSettingsService.getSidebarUserSettingValues();

		if (reportObject && reportObject.report && reportObject.report.expandState.length) {
			this.sidebarUserSettings.report.expandState = reportObject.report.expandState;
			return this.sidebarUserSettings.report.expandState;
		}

		return [];
	}

	/**
	 * Method removes the group id from local storage.
	 *
	 * @param {number} groupId Group id.
	 */
	public deleteExpandState(groupId: number): void {
		const itemIndex = this.sidebarUserSettings.report.expandState.findIndex((id) => {
			return id === groupId;
		});

		if (itemIndex > -1) {
			this.sidebarUserSettings.report.expandState.splice(itemIndex, 1);
			this.saveState();
		}
	}
}
