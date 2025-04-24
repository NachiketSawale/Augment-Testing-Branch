/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Observable, Subject, map, of } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { PlatformConfigurationService, PlatformModuleManagerService } from '@libs/platform/common';
import { IQuickstartData, IQuickstartMergedSetting, IQuickstartSettings, IQuickstartTabSettings, SettingType } from '../../../index';


/**
 * Service prepares the quickstart data.
 */
@Injectable({
	providedIn: 'root',
})
export class UiSidebarQuickstartDataHandlingService {
	/**
	 * Service performing http requests.
	 */
	private readonly http = inject(HttpClient);

	/**
	 * Keeps track of all available modules in the application
	 */
	private readonly platformModuleManagerService = inject(PlatformModuleManagerService);

	/**
	 * Subject to emit event when settings(page, module) changed by settings dialog.
	 */
	public settingsChanged$ = new Subject<string>();

	private readonly configurationService = inject(PlatformConfigurationService);

	/**
	 * Different setting types.
	 */
	private readonly settingsTypes = [SettingType.system, SettingType.user];

	/**
	 * Settings key.
	 */
	private readonly settingsKey = 'quickstartSettings';

	/**
	 * Loaded quickstart data.
	 */
	private cachedSettings?: IQuickstartData;

	/**
	 * This function Loads the available settings from the server and system.
	 *
	 * @param {boolean} forceReload If true, the data is redetermined, that means loaded from the database. Otherwise the cached data will be returned.
	 * @returns {Observable<IQuickstartData>} Prepared quickstart data.
	 */
	public loadSettings$(forceReload: boolean = false): Observable<IQuickstartData> {
		const settingsKey = 'quickstartSettings';
		const params = new HttpParams().set('settingsKey', settingsKey);

		if (!forceReload && this.cachedSettings) {
			return of(this.cachedSettings);
		}

		return this.http.get<IQuickstartMergedSetting>(this.configurationService.webApiBaseUrl + 'cloud/desktop/usersettings/loadmergedsetting', { params: params }).pipe(
			map((response) => {
				const settings: IQuickstartData = {
					showPages: response.showPages,
					showTabs: response.showTabs,
					useSettings: response.useSettings,
					desktopItems: this.getPreloadDesktopTileData(),
					modules: response.modules,
				};

				if (response.showPages) {
					settings.pages = this.getPageData();
				}

				this.cachedSettings = settings;

				return settings;
			}),
		);
	}

	/**
	 * Function to get desktop tiles data from Preload Module
	 *
	 * @returns {IQuickstartSettings[]} Desktop tile data.
	 */
	private getPreloadDesktopTileData(): IQuickstartSettings[] {
		const tileData = this.platformModuleManagerService.preloadDesktopTileData();
		const processedTileData: IQuickstartSettings[] = [];
		tileData.forEach((data) => {
			const processedData: IQuickstartSettings = {
				id: data.id,
				iconClass: data.iconClass,
				displayName: data.displayName,
				description: data.description,
				targetRoute: data.targetRoute,
				defaultGroupId: data.defaultGroupId,
			};
			processedTileData.push(processedData);
		});
		return processedTileData;
	}

	/**
	 * Function to get pages data.
	 *
	 * @returns {IQuickstartSettings[]} Page data.
	 */
	private getPageData(): IQuickstartSettings[] {
		let processedPageData: IQuickstartSettings[] = [];
		processedPageData = this.getPreloadDesktopTileData();
		processedPageData.forEach((data) => {
			const processedData: IQuickstartSettings = {
				id: data.id,
				iconClass: data.iconClass,
				displayName: data.displayName,
				description: data.description,
				targetRoute: data.targetRoute,
			};
			processedPageData.push(processedData);
		});

		return processedPageData;
	}

	/**
	 * 
	 * Function emits change event when settings are changed.
	 * 
	 * @param {IQuickstartTabSettings} settingsData.
	 */
	public onSettingsChanged(settingsData: IQuickstartTabSettings):void {
		const changedMember = 'changed';
		let changed = false;
		const quickstartSettings = settingsData[this.settingsKey];

		this.settingsTypes.forEach((type) => {
			if (quickstartSettings[type] && quickstartSettings[type][changedMember]) {
				changed = true;
			}
		});

		if (changed && this.cachedSettings) {
			const systemSettings = quickstartSettings[SettingType.system];
			this.cachedSettings.showPages = systemSettings['showPages'];
			this.cachedSettings.showTabs = systemSettings['showTabs'];
			if (!this.cachedSettings.pages && this.cachedSettings.showPages) {
				this.cachedSettings.pages = this.getPageData();
			}

			this.settingsChanged$.next('changed');
		}
	}
}
