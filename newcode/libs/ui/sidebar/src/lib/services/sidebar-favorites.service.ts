/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { PlatformConfigurationService } from '@libs/platform/common';

import { FavoritesSettings } from '../model/class/favorite-setting.class';

import { ISidebarFavorites } from '../model/interfaces/favorites/sidebar-favorites.interface';
import { ISidebarFavoritesData } from '../model/interfaces/favorites/sidebar-favorites-data.interface';
import { ISidebarFavoritesFavInfo } from '../model/interfaces/favorites/sidebar-favorites-info.interface';

/**
 * Implements the basic functionality for favorites sidebar like add project to favorites,
 * remove project from favorites, gets the favorites data.
 */
@Injectable({
	providedIn: 'root',
})
export class UiSidebarFavoritesService {
	/**
	 * Settings of the projects available.
	 */
	public favoritesSettings: Record<string | number, ISidebarFavorites> = {};

	/**
	 * Information of favorites type available.
	 */
	public favtypeInfo: Record<number, ISidebarFavoritesFavInfo> = {
		0: {
			moduleName: 'project.main',
			sort: 0,
			name: 'ProjectMain',
			ico: 'ico-project',
			projectContext: true,
		},
		1: {
			moduleName: 'procurement.package',
			sort: 4,
			name: 'Package',
			ico: 'ico-package',
			furtherFilters: { Token: 'PRC_PACKAGE', Value: 'key' },
			projectContext: true,
		},
		2: {
			moduleName: 'estimate.main',
			sort: 3,
			name: 'Estimate',
			ico: 'ico-estimate',
			furtherFilters: { Token: 'EST_HEADER', Value: 'key' },
			projectContext: true,
		},
		3: {
			moduleName: 'boq.main',
			sort: 1,
			name: 'BoqMain',
			ico: 'ico-project-boq',
			projectContext: true,
		},
		4: {
			moduleName: 'scheduling.main',
			sort: 2,
			name: 'SchedulingMain',
			ico: 'ico-scheduling',
			furtherFilters: { Token: 'PSD_SCHEDULE', Value: 'key' },
		},
		5: {
			moduleName: 'constructionsystem.main',
			sort: 5,
			name: 'ConstructionSystemInstance',
			ico: 'ico-construction-system',
			furtherFilters: { Token: 'COS_INS_HEADER', Value: 'key' },
			projectContext: true,
		},
		6: { moduleName: '', sort: 0, name: 'BusinessBid', ico: 'ico-bid' },
		7: {
			moduleName: 'model.main',
			sort: 7,
			name: 'Model',
			ico: 'ico-model',
			naviServiceConnector: {
				retrieveItem: (modelId: number) => {
					return this.http.get(this.configurationService.webApiBaseUrl + 'model/project/model/getbyid?id=' + modelId).subscribe((response) => {
						return response;
					});
				},
			},
		},
		8: {
			moduleName: 'productionplanning.item',
			sort: 8,
			name: 'cloud.desktop.moduleDisplayNamePPSItem',
			ico: 'ico-production-planning',
			furtherFilters: { Token: 'productionplanning.item', Value: 'key' },
			projectContext: true,
		},
		9: {
			moduleName: 'productionplanning.mounting',
			sort: 9,
			name: 'cloud.desktop.moduleDisplayNamePpsMounting',
			ico: 'ico-mounting',
			furtherFilters: { Token: 'productionplanning.mounting', Value: 'key' },
			projectContext: true,
		},
		10: {
			moduleName: 'productionplanning.engineering',
			sort: 10,
			name: 'cloud.desktop.moduleDisplayNameEngineering',
			ico: 'ico-engineering-planning',
			furtherFilters: { Token: 'productionplanning.engineering', Value: 'key' },
			projectContext: true,
		},
	};

	/**
	 * Service performs http requests.
	 */
	private http = inject(HttpClient);

	private configurationService = inject(PlatformConfigurationService);

	/**
	 * Function adds project to the favorites project list if project is not added previously.
	 *
	 * @param {number} projectId Unique id of project.
	 * @param {string} projectName Name of project.
	 * @param {boolean} expanded Expanded state of project.
	 * @returns {boolean} Project add status.
	 */
	public addProjectToFavorites(projectId: number, projectName: string, expanded: boolean): boolean {
		if (this.favoritesSettings[projectId]) {
			return false;
		}
		this.favoritesSettings[projectId] = new FavoritesSettings(projectId, projectName, expanded);
		return true;
	}

	/**
	 * Function removes project from favorites project list.
	 *
	 * @param {number} projectId Unique id of project.
	 * @returns {boolean} Project removal status.
	 */
	public removeProjectFromFavorites(projectId: number): boolean {
		if (this.favoritesSettings && !this.favoritesSettings[projectId]) {
			return false;
		}

		//Remove the entire property from favorites.
		delete this.favoritesSettings[projectId];
		return true;
	}

	/**
	 * Function returns the favorites project data received from database.
	 *
	 * @returns {Observable<ISidebarFavoritesData>} favoritesData.
	 */
	public readFavorites$(): Observable<ISidebarFavoritesData> {
		return this.http.get<ISidebarFavoritesData>(this.configurationService.webApiBaseUrl + 'project/favorites/getprojectfavorites').pipe(
			map((response) => {
				if (response) {
					this.favoritesSettings = response.favoritesSetting;
				}
				return response;
			})
		);
	}

	/**
	 * Function saves favorites data to database.
	 *
	 * @returns {Observable<Record<string | number, ISidebarFavorites>>}
	 */
	public saveFavoritesSetting$(): Observable<Record<string | number, ISidebarFavorites>> {
		return this.http.post<Record<string | number, ISidebarFavorites>>(this.configurationService.webApiBaseUrl + 'project/favorites/savefavoritessetting', this.favoritesSettings);
	}

	/**
	 * Function checks if the received data when parsed is string or object.
	 *
	 * @param {string} data
	 * @returns {boolean} Is object
	 */
	public isJsonObj(data: string): boolean {
		try {
			const projectData = JSON.parse(data);
			return typeof projectData === 'object';
		} catch (e) {
			return false;
		}
	}
}
