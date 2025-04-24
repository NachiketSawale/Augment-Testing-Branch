/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlatformPermissionService, PlatformModuleManagerService } from '@libs/platform/common';
import * as _ from 'lodash';
import { ICurrentSetting } from '../models/interfaces/current-settings.interface';
import { IDefaultPage } from '../models/interfaces/default-page.interface';
import { IGroup } from '../models/interfaces/group.interface';
import { ITilesData } from '../models/interfaces/tile.interface';
import { DesktopModuleService } from './desktop-module.service';
import { DesktopSettingsUserTypesService } from './desktop-settings-user-types.service';

@Injectable({
	providedIn: 'root',
})

/**
 * Service for settings of Desktop Layout
 */
export class DesktopLayoutSettingsService {
	/**
	 *Variable that shows which types of user this settings supports.
	 */
	desktopSettingsTypes: string[] = [this.userTypes.system, this.userTypes.user];

	/**
	 * Variable for settingsPromise
	 */
	settingsPromise!: Promise<IDefaultPage>;

	/**
	 * Variable for modules
	 */
	modules!: ITilesData[];

	/**
	 * Variable for grouped prop
	 */
	groupProp: string = 'groupName';

	constructor(
		private userTypes: DesktopSettingsUserTypesService,
		public http: HttpClient,
		public platformPermissionService: PlatformPermissionService,
		public desktopModuleService: DesktopModuleService,
		public moduleManagerService: PlatformModuleManagerService
	) { }

	/**
	 *To get current settings
	 * @param {boolean} forceRefresh
	 */
	getCurrentSettings(forceRefresh: boolean): Promise<any> {
		if (this.settingsPromise && !forceRefresh) {
			// there is already a running process for getting settings
			return this.settingsPromise;
		}
		return (this.settingsPromise = this.getSettings().then((result) => {
			return result;
		}));
	}

	/**
	 * @return {*}  {Promise<IDefaultPage>}
	 * @memberof DesktopLayoutSettingsService
	 */
	getSettings(): Promise<IDefaultPage> {
		const settings: ICurrentSetting = {};
		const pages: IDefaultPage[] = [];
		let modulesData:any = this.desktopModuleService.getModules(false);
		return modulesData.then((modules: ITilesData[]) => {
			settings.modules = modules;
			settings.desktopPages = this.getMergedData(pages, modules);
			return settings;
		});
	}

	/**
	 *	To Merged the tiles data.
	 * @param pagesArray
	 * @param modules
	 * @returns {IDefaultPage[]}
	 */
	getMergedData(pagesArray: IDefaultPage[], modules: ITilesData[]): IDefaultPage[] {
		let ribPageData,
			pagesToDelete: number[] = [],
			ribPages = this.getRibDesktopPagesStructure();
		pagesArray.forEach((userPage, idx) => {
			if (userPage.rib) {
				// merge data of the rib pages structure object to the loaded settings object
				ribPageData = _.find(ribPages, (ribPage) => {
					return ribPage.id === userPage.id;
				});

				if (ribPageData) {
					pagesArray[idx] = _.assign(ribPageData, userPage);
				} else {
					// Delete, because the loaded page does no longer exits in rib pages structure
					pagesToDelete.push(idx);
				}
			} else {
				if (modules) {
					_.each(userPage.groups, (group) => {
						if (group.tiles && group.tiles.length) {
							group.tiles = _.reduce(
								group.tiles,
								(result: ITilesData[], tile: ITilesData) => {
									const module = _.find(modules, (module) => {
										return module.id === tile.id;
									});

									if (module) {
										if (tile.type !== this.desktopModuleService.moduleTypes.web) {
											delete tile.displayName;
										}
										result.push(_.assign(_.clone(module), tile));
									} else {
										if (tile.type === this.desktopModuleService.moduleTypes.web) {
											result.push(tile);
										}
									}
									return result;
								},
								[]
							);
						}
					});
				}
			}
		});

		// delete non existent rib pages
		_.forEachRight(pagesToDelete, function deletePage(idx) {
			pagesArray.splice(idx, 1);
		});

		// insert new rib pages
		pagesArray = this.insertMissingPages(ribPages, pagesArray);

		return pagesArray;
	}

	/**
	 *To get the RIB Desktop pages structure
	 * @return {IDefaultPage[]}
	 */
	getRibDesktopPagesStructure(): IDefaultPage[] {
		const defaultTilesData = this.desktopModuleService.desktopTileList;
		const ribConfig = _.clone(defaultTilesData);
		//mark page as rib default page
		ribConfig.forEach((page: IDefaultPage) => {
			page.rib = true;
			page.groups.forEach((group: IGroup) => {
				if (group.tiles) {
					group.tiles.forEach((tile: ITilesData) => {
						tile.type = 0;
					});
				}
			});
		});
		return ribConfig;
	}

	/**
	 * For inserting missing pages
	 * @param source
	 * @param target
	 * @returns {IDefaultPage[]}
	 */
	insertMissingPages(source: IDefaultPage[], target: IDefaultPage[]): IDefaultPage[] {
		source.forEach((sourcePage: IDefaultPage) => {
			const res = _.findIndex(target, (targetPage: IDefaultPage) => targetPage.id === sourcePage.id);

			if (res === -1) {
				sourcePage.visibility = false;
				target.push(sourcePage);
			}
		});

		return target;
	}

	/**
	 * Used for pagination purpose.
	 * @param pageIndex
	 * @param desktopPages
	 * @return {string | undefined}
	 */

	getNexPageForPager(pageIndex: number, desktopPages: IDefaultPage[]): string | undefined {
		let page,
			url: string | undefined = 'app.desktop';
		if (pageIndex < 0) {
			page = _.last(desktopPages);
		} else if (pageIndex >= desktopPages.length) {
			page = _.first(desktopPages);
		} else {
			page = desktopPages[pageIndex];
		}
		if (page) {
			url = page.id || page.targetRoute;
		}
		return url;
	}

	/**
	 *To remove the invisibility of desktop pages
	 * @param desktopPages
	 * @returns {IDefaultPage[]}
	 */
	removeInvisible(desktopPages: IDefaultPage[]): IDefaultPage[] {
		const isNoVisible =
			_.findIndex(desktopPages, (page) => {
				return page.visibility === true;
			}) === -1;

		return _.reduce(
			desktopPages,
			(result: IDefaultPage[], page: IDefaultPage) => {
				if (page.visibility) {
					result.push(page);
				} else {
					if (page.rib && isNoVisible) {
						// if no page is visible, rib default pages will be visible
						page.visibility = true;
						result.push(page);
					}
				}
				return result;
			},
			[]
		);
	}

	/**
	 *To get the permmited structure
	 * @param pages
	 * @returns {*} Promise<IDefaultPage[]
	 */
	getPermittedStructure(pages: IDefaultPage[]): Promise<IDefaultPage[]> {
		const descriptors = this.desktopModuleService.getDescriptors(pages);

		return this.platformPermissionService.loadPermissions(descriptors, true).then(() => {
			return this.getPagesStructure(pages);
		});
	}

	/**
	 *To get the structure of page
	 * @param pages
	 * @returns {IDefaultPage[]}
	 */
	getPagesStructure(pages: any): IDefaultPage[] {
		if (pages) {
			const promises = _.map(pages, (page, index: number) => {
				page.groups = this.getGroupsStructure(page.groups, page.rib);

				if (!page.groups.length) {
					pages[index] = null;
				}
				return true;
			});
			_.remove(pages, (page) => {
				return !page;
			});
			return pages;
		} else {
			return [];
		}
	}

	/**
	 * To get the grouped structure
	 * @param groups
	 * @param rib
	 * @returns {IGroup[]}
	 */
	getGroupsStructure(groups: IGroup[], rib: boolean | undefined): IGroup[] {
		if (groups) {
			return _.reduce(
				groups,
				(result: IGroup[], group: IGroup) => {
					group.tiles = this.desktopModuleService.getTilesByGroup(group, false);

					if (group.tiles && group.tiles.length) {
						result.push(group);
					}
					return result;
				},
				[]
			);
		} else {
			return [];
		}
	}
}
