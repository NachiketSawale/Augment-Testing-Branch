/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { IQuickstartAccordionState, PlatformConfigurationService } from '@libs/platform/common';
import { UiSidebarUserSettingsService } from '../sidebar-user-settings.service';

import { IQuickstartModuleTab, IQuickstartState } from '../../../index';



/**
 * Service handles the module tabs state.
 */
@Injectable({
	providedIn: 'root',
})
export class UiSidebarQuickstartTabsSettingsService {
	/**
	 * Quickstart data accordion state.
	 */
	private sidebarUserSettings: IQuickstartState = {
		quickstart: {
			accordionstate: [],
		},
	};

	/**
	 * Service performing http requests.
	 */
	private http = inject(HttpClient);

	/**
	 * Set/Get sidebar user settings value into local storage.
	 */
	private sidebarUserSettingsService = inject(UiSidebarUserSettingsService);

	private configurationService = inject(PlatformConfigurationService);

	/**
	 * Module tab data.
	 */
	private tabsData!: { [key: string]: IQuickstartModuleTab[] };

	/**
	 * Function saves the Module accordion states in local storage.
	 *
	 * @param {string} id Module id.
	 */
	public setTabsExpandedStatus(id: string) {
		if (!this.sidebarUserSettings.quickstart.accordionstate.includes(id)) {
			this.sidebarUserSettings.quickstart.accordionstate.push(id);
		}
		const sidebarUserSettings = this.sidebarUserSettingsService.getSidebarUserSettingValues();
		if (sidebarUserSettings) {
			sidebarUserSettings.quickstart = this.sidebarUserSettings.quickstart;
			this.sidebarUserSettingsService.saveSidebarUserSettingsinLocalstorage(sidebarUserSettings);
		}
	}

	/**
	 * Function gets the Module accordion states from local storage.
	 *
	 * @returns {Array<string>} Module accordion states.
	 */
	public getTabsExpandedStatus(): Array<string> {
		const sidebarUserSettings = this.sidebarUserSettingsService.getSidebarUserSettingValues();
		if (sidebarUserSettings && typeof sidebarUserSettings === 'object' && 'quickstart' in sidebarUserSettings) {
			this.sidebarUserSettings.quickstart.accordionstate = (sidebarUserSettings.quickstart as IQuickstartAccordionState).accordionstate || [];
		}
		return this.sidebarUserSettings.quickstart.accordionstate;
	}

	/**
	 * Function deletes the accordion status entry for module id from local storage.
	 *
	 * @param {string} id Module tab id.
	 */
	public deleteExpandedTabId(id: string) {
		this.sidebarUserSettings.quickstart.accordionstate = this.sidebarUserSettings.quickstart.accordionstate.filter((value) => {
			return value !== id;
		});

		const sidebarUserSettings = this.sidebarUserSettingsService.getSidebarUserSettingValues();
		if (sidebarUserSettings) {
			sidebarUserSettings.quickstart = this.sidebarUserSettings.quickstart;
			this.sidebarUserSettingsService.saveSidebarUserSettingsinLocalstorage(sidebarUserSettings);
		}
	}

	/**
	 * Function gets Module tabs data from server.
	 *
	 * @param {Array<string>} modulenames Array of module names.
	 * @returns {Observable<{ [key: string]: IQuickstartModuleTab[] }>} Mdodule tabs data.
	 */
	public getTabsByModulenames$(modulenames: Array<string>): Observable<{ [key: string]: IQuickstartModuleTab[] }> {
		if (this.tabsData) {
			return of(this.tabsData);
		}

		return this.http.post<{ [key: string]: IQuickstartModuleTab[] }>(this.configurationService.webApiBaseUrl + 'basics/layout/quickstarttabs', modulenames).pipe(
			map((response) => {
				this.tabsData = response;
				return response;
			}),
			catchError(() => {
				return [];
			}),
		);
	}
}
