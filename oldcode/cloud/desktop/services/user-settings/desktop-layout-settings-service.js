/**
 * Created by alisch on 20.11.2017.
 */
/* global globals */

(() => {
	/** @namespace globals.defaultState */
	'use strict';

	cloudDesktopDesktopLayoutSettingsService.$inject = ['platformDialogService', '$timeout', '$state', '$http', '$q', '_', 'basicsCommonDrawingUtilitiesService', 'cloudDesktopSettingsState', 'platformRuntimeDataService', 'platformPermissionService', '$translate', 'platformCreateUuid', 'platformGridAPI', 'platformManualGridService', 'cloudDesktopSettingsUserTypes', 'cloudDesktopModuleDialogService', 'cloudDesktopModuleService', 'cloudDesktopTilesConfig', 'cloudDesktopStateProvider', 'basicsLookupdataConfigGenerator', 'basicsLookupdataSimpleLookupService', '$log', '$injector', 'cloudDesktopModuleTypes', 'cloudDesktopTilesService'];

	function cloudDesktopDesktopLayoutSettingsService(platformDialogService, $timeout, $state, $http, $q, _, drawingUtils, dataStates, platformRuntimeDataService, platformPermissionService, $translate, platformCreateUuid, platformGridAPI, manualGridService, userTypes, moduleDialogService, desktopModuleService, cloudDesktopTilesConfig, stateProvider, basicsLookupdataConfigGenerator, basicsLookupdataSimpleLookupService, $log, $injector, moduleTypes, cloudDesktopTilesService) {
		const settingsKey = 'desktopSettings'; // the property name of display settings within the user settings object
		const desktopSettingsTypes = [userTypes.system, userTypes.user]; // which types of user this settings supports
		const accessRightDescriptors = [
			'68ac862ee72a459db4d3e6261d50c7ca',
			'90f208bce31440e59d7aba610d31989c'];

		let settingsPromise;
		let lastSettingsUpdate;
		let currentSettings;

		const gridIdPages = '00e9fd2759df5b92a0ff108c50440c70';
		const gridIdGroups = 'e5bfb88f971409fb47278b3aa15455f8';
		const gridIdTiles = 'abd0df9bc8cf6281f44bb72f6a471f73';
		const defaultTileValues = {tileOpacity: 0.9, tileColor: 690687, textColor: 16777215, tileSize: 1};
		const changedMember = '__changed';

		const desktopTiles = _.cloneDeep(cloudDesktopTilesConfig);

		// obsolete - will be deleted to v4.2
		function getCurrentSettings2() {
			return _.cloneDeep(currentSettings);
		}

		function setChanged(data) {
			data[changedMember] = true;
		}

		/**
		 * @ngdoc function
		 * @name getLastSettingsUpdate
		 * @function
		 * @methodOf cloudDesktopDesktopLayoutSettingsService
		 * @description Gets the date of the last css update
		 * @returns { string } A string with the date of the last css update
		 */
		function getLastSettingsUpdate() {
			return lastSettingsUpdate;
		}

		/**
		 * @ngdoc function
		 * @name onSaved
		 * @function
		 * @methodOf cloudDesktopDesktopLayoutSettingsService
		 * @description After Save function
		 */
		function onSaved(data) {
			if (isSettingsChanged(data)) {
				currentSettings = undefined;
				settingsPromise = undefined;
				lastSettingsUpdate = Date.now();
			}
		}

		/**
		 * @ngdoc function
		 * @name isSettingsChanged
		 * @function
		 * @methodOf cloudDesktopDesktopLayoutSettingsService
		 * @description Indicate whether the settings are changed.
		 * @returns { bool } True, if settings are changed, otherwise false.
		 */
		function isSettingsChanged(data) {
			var changed = false, desktopSettings = data[settingsKey];

			if (!_.isUndefined(desktopSettings)) {
				_.forEach(desktopSettingsTypes, function (type) {
					if (desktopSettings[type] && desktopSettings[type][changedMember]) {
						changed = true;
					}
				});
			}

			return changed;
		}

		function extendStateProvider(desktopStructure) {
			_.forEach(desktopStructure, function (page) {
				var state = _.find($state.get(), ['id', page.id]);
				if (!state) {
					stateProvider.addState(
						page.id,
						'cloud.desktop/partials/desktopview.html',
						'cloudDesktopController',
						page.pageName,
						page.routeUrl);
				}
			});
		}

		// the structure of desktop-tiles-config.js, in which we defined the basis desktop structure we deliver.
		// every page gets the property "rib = true"
		function getRibDesktopPagesStructure() {
			let ribConfig = desktopTiles;

			// mark page as rib default page
			_.forEach(ribConfig, function (page) {
				page.rib = true;
				_.forEach(page.groups, function (group) {
					_.forEach(group.tiles, function (tile) {
						tile.type = 0;
					});
				});
			});

			return ribConfig;
		}

		function insertMissingPages(source, target) {
			_.forEach(source, function (sourcePage) {
				var res = _.findIndex(target, function (targetPage) {
					return targetPage.id === sourcePage.id;
				});

				if (res === -1) {
					sourcePage.visibility = false;
					target.push(sourcePage);
				}
			});

			return target;
		}

		// individual alterations of the loaded user profiles data, after the Settings dialog does load all data.
		function alterSettingsData(data) {

			if (_.includes(desktopSettingsTypes, userTypes.system)) {
				const settings = data[settingsKey];
				if (!settings) {
					return;
				}
				var sysDesktopSettings = _.get(settings, userTypes.system + '.content');
				// Therefore only systemSettings, because with RIB pages only the visibility status and the id of the page is stored and must now be enriched with data.
				desktopModuleService.getModules(false, true).then(function (modules) {
					getMergedData(sysDesktopSettings, modules);
					var userDesktopSettings = _.get(settings, userTypes.user + '.content');
					getMergedData(userDesktopSettings, modules, false);
				});
			}
		}

		function getMergedData(pagesArray, modules, checkMissingPages = true) {
			var ribPageData, pagesToDelete = [], ribPages = getRibDesktopPagesStructure();

			_.forEach(pagesArray, function (userPage, idx) {
				if (userPage.rib) {
					// merge data of the rib pages structure object to the loaded settings object
					ribPageData = _.find(ribPages, function (ribPage) {
						return ribPage.id === userPage.id;
					});

					if (ribPageData) {
						pagesArray[idx] = _.assign(ribPageData, userPage);
					} else {
						// Delete, because the loaded page does no longer exits in rib pages structure
						pagesToDelete.push(idx);
					}
				} else {
					if (angular.isDefined(modules)) {
						// insert module properties into the tile configuration
						_.each(userPage.groups, function (group) {
							if (group.tiles && group.tiles.length) {
								group.tiles = _.reduce(group.tiles, function (result, tile) {
									let module = _.find(modules, function (module) {
										// after switching to string there were problems with existing database entries. These are now converted.
										let tileId = !_.isNil(tile) ? (_.isString(tile.id) ? tile.id : tile.id.toString()) : null;
										return module.id === tileId;
									});

									if (angular.isDefined(module)) {
										// delete displayName, because the name could be changed in the meanwhile
										// but web's displayName must be still there, because there is no basis module.
										if (tile.type !== moduleTypes.web) {
											delete tile.displayName;
										}

										result.push(_.assign(_.clone(module), tile));
									} else {
										if (!_.isNil(tile) && (tile.type === moduleTypes.web || tile.type === moduleTypes.quickstart || tile.type === moduleTypes.pinned)) {
											result.push(tile);
										}
									}

									return result;
								}, []);
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
			if (checkMissingPages) {
				pagesArray = insertMissingPages(ribPages, pagesArray);
			}

			return pagesArray;
		}

		function getSettings() {
			var settings = {};
			var pages = [];

			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'cloud/desktop/usersettings/loadsetting',
				params: {settingsKey: settingsKey}
			}).then(function (result) {
				if (angular.isObject(result.data)) {
					var desktopSettings = result.data;
					desktopSettingsTypes.forEach(function (type) {
						if (desktopSettings[type]) {
							if (desktopSettings[type].content) {
								pages = pages.concat(desktopSettings[type].content);
							}
							if (type === userTypes.user && desktopSettings[type].homeId) {
								settings.homeId = desktopSettings[type].homeId;
							}
						}
					});
				}
				return desktopModuleService.getModules().then(function (modules) {
					var externalIds = [];
					iterateExternalModules(pages, function (tile) {
						if (!_.includes(externalIds, tile.id)) {
							externalIds.push(tile.id.toString());
						}
					});

					return desktopModuleService.getExternalModulesExtended(externalIds).then(function (externalModules) {
						if (_.isArray(externalModules)) {
							modules = modules.concat(externalModules);
						}

						settings.webTiles = cloudDesktopTilesService.setWebTilesFromPages(pages);
						settings.modules = modules;
						settings.desktopPages = getMergedData(pages, modules);
						return settings;
					});
				});
			});
		}

		function iterateExternalModules(pages, fn) {
			var exit;

			for (var i = 0; i < pages.length && !exit; i++) {
				var page = pages[i];
				for (var j = 0; _.has(page, 'groups') && j < page.groups.length && !exit; j++) {
					var group = page.groups[j];
					for (var k = 0; _.has(group, 'tiles') && k < group.tiles.length; k++) {
						var tile = group.tiles[k];
						if (tile && tile.type === moduleTypes.external) {
							if (fn(tile)) {
								exit = true;
								break;
							}
						}
					}
				}
			}
		}

		function getExternalModuleUrl(tileId) {
			return desktopModuleService.getExternalModuleUrl(tileId);
		}

		function getPermittedStructure(pages) {
			var descriptors = desktopModuleService.getDescriptors(pages);

			return platformPermissionService.loadPermissions(descriptors, true)
				.then(function () {
					return getPagesStructure(pages);
				});
		}

		function getPagesStructure(pages) {
			if (pages) {
				let promises = _.map(pages, function (page, index) {
					page.groups = getGroupsStructure(page.groups, page.rib);

					if (!page.groups.length) {
						pages[index] = null;
					} else {
						return setPageName(page);
					}
					return $q.when();
				});

				return $q.all(promises).then(function () {
					_.remove(pages, function (page) {
						return !page;
					});

					return pages;
				});
			} else {
				return [];
			}
		}

		var groupProp = 'groupName';

		function getGroupsStructure(groups, rib) {
			if (groups) {
				return _.reduce(groups, function (result, group) {
					group.tiles = cloudDesktopTilesService.getTiles(group);

					if (group.tiles && group.tiles.length) {
						setGroupName(group, rib);
						result.push(group);
					}
					return result;
				}, []);
			} else {
				return [];
			}
		}

		function setGroupName(group, rib) {
			if (_.isUndefined(group)) {
				return;
			}

			if (rib) {
				// important for the lookup in settings dialog
				group.groupNameFk = group.id;

				if (group[groupProp + '$tr$']) {
					group[groupProp] = $translate.instant(group[groupProp + '$tr$']);
				}
			} else {
				if (!_.isUndefined(group.groupNameFk)) {
					var lookupOptions = {
						valueMember: 'Id',
						displayMember: 'Description',
						lookupModuleQualifier: 'basics.customize.desktopgroup'
					};
					basicsLookupdataSimpleLookupService.getItemById(group.groupNameFk, lookupOptions).then(function (result) {
						if (result && result.Description) {
							group.groupName = result.Description;
						} else {
							group.groupName = getRibGroupName(group.groupNameFk) || group.groupName;
						}
						/** else {
							$log.warn('Group name was not found for group id "' + group.id + '". Please add entries to the data type "Desktop Group" in the customizing module, which can be used as group name in the settings dialog.');
						} **/
					});
				}
			}
		}

		function getRibGroupName(_groupFk) {
			let existGroup = _.find(getRibGroups(), {groupNameFk: _groupFk});
			return existGroup ? existGroup.groupName : null;
		}

		function getRibGroups() {
			return desktopTiles ? _.flattenDeep(_.map(_.cloneDeep(desktopTiles), 'groups')) : null;
		}

		function setPageName(page) {
			if (_.isUndefined(page)) {
				return;
			}

			if (page.rib) {
				// important for the lookup in settings dialog
				page.pageNameFk = page.id;
				if (page.pageName$tr$) {
					page.pageName = $translate.instant(page.pageName$tr$);
				}
				return $q.when(page.pageName);
			} else {
				if (!_.isUndefined(page.pageNameFk)) {
					var lookupOptions = {
						valueMember: 'Id',
						displayMember: 'Description',
						lookupModuleQualifier: 'basics.customize.desktoppage'
					};

					return basicsLookupdataSimpleLookupService.getItemById(page.pageNameFk, lookupOptions).then(function (result) {
						if (result && result.Description) {
							page.pageName = result.Description;
						} else {
							$log.warn('Page name was not found for page id "' + page.id + '". Please add entries to the data type "Desktop Page" in the customizing module, which can be used as page name in the settings dialog.');
						}
						return page.pageName;
					});
				}
			}
		}

		/**
		 * @ngdoc function
		 * @name getDesktopPagesStructure
		 * @function
		 * @methodOf cloudDesktopDesktopLayoutSettingsService
		 * @description Returns an array of all pages (including the groups and tiles) that the user has permission to access. This array contains both the RIB default pages and the user created pages.
		 * @param {boolean} forceRefresh If true, the data is redetermined, that means loaded from the database. Otherwise the cached data will be returned.
		 * @return { array } An array of pages
		 */
		function getDesktopPagesStructure(forceRefresh) {
			return getCurrentSettings(forceRefresh).then(result => {
				return result.desktopPagesStructure;
			});
		}

		function getCurrentSettings(forceRefresh) {
			if (settingsPromise && !forceRefresh) {
				// there is already a running process for getting settings
				return settingsPromise;
			}

			return settingsPromise = getSettings()
				.then((result) => {
					currentSettings = {};
					currentSettings.homeId = result.homeId;
					currentSettings.modules = result.modules;

					return getPermittedStructure(result.desktopPages)
						.then(res => {
							currentSettings.desktopPagesStructure = removeInvisible(res);
							return currentSettings;
						});
				});
		}

		function removeInvisible(desktopPages) {
			let groups = [];
			var isNoVisible = _.findIndex(desktopPages, function (page) {
				return page.visibility === true;
			}) === -1;

			return _.reduce(desktopPages, function (result, page) {
				if (page.visibility && page.groups) {
					groups = [...page.groups];
					page.groups = [];
					if(groups.length > 0) {
						groups.forEach((group) => {
							if(_.isUndefined(group.visibility) || group.visibility) {
								page.groups.push(group);
							}
						});

						if(page.groups.length > 0) {
							result.push(page);
						}
					}
				} else {
					if (page.rib && isNoVisible) {
						// if no page is visible, rib default pages will be visible
						page.visibility = true;
						result.push(page);
					}
				}

				return result;
			}, []);
		}

		// /**
		//  * @ngdoc function
		//  * @name getDesktopStructureByPageId
		//  * @function
		//  * @methodOf cloudDesktopDesktopLayoutSettingsService
		//  * @description Returns an array of pages (including groups and tiles) of the searched page that the user has permission to access.
		//  * @return { array } An array of modules
		//  */
		// function getDesktopPageById(pageId) {
		//    var desktopStructure = getAllPages().filter(function (page) {
		//      return page.id === pageId;
		//    });
		//
		//    return getPermittedStructure(desktopStructure);
		// }

		/**
		 * @ngdoc function
		 * @name getMasterItem
		 * @function
		 * @methodOf cloudDesktopDesktopLayoutSettingsService
		 * @description Returns an master item object for the settings dialog definition.
		 * @return {object} The master item object
		 */
		function getMasterItem(editableData, userType) {
			switch (userType) {
				case userTypes.user:
					return {
						Id: getMasterItemId(userType),
						name: $translate.instant('cloud.desktop.design.desktop.layoutUser'),
						data: editableData.items[settingsKey].user,
						visible: hasWritePermission(userType),
						form: getFormData(userType, editableData.items[settingsKey].user, editableData)
					};
				case userTypes.system:
					return {
						Id: getMasterItemId(userType),
						name: $translate.instant('cloud.desktop.design.desktop.layoutSystem'),
						data: editableData.items[settingsKey].system,
						visible: hasWritePermission(userType),
						form: getFormData(userType, editableData.items[settingsKey].system, editableData)
					};
				default:
					return undefined;
			}
		}

		/**
		 * @ngdoc function
		 * @name getMasterItemId
		 * @function
		 * @methodOf cloudDesktopDesktopLayoutSettingsService
		 * @description Returns the id of the master item object of the specified user typ.
		 * @param { string } userType The type of the user
		 * @return { string } The id of the master item object
		 */
		function getMasterItemId(userType) {
			return _.includes(desktopSettingsTypes, userType) ? settingsKey + _.capitalize(userType) : undefined;
		}

		function convertToTransferable(userSettings, removeUnchanged) {
			if (!userSettings) {
				return;
			}

			var desktopSettings = userSettings;
			// delete unknown properties
			for (var property in desktopSettings) {
				if (Object.prototype.hasOwnProperty.call(desktopSettings, property)) {
					// if (desktopSettings.hasOwnProperty(property)) {      // rei@4.11.21 removed warning
					if (!_.includes(desktopSettingsTypes, property)) {
						delete desktopSettings[property];
					}
				}
			}

			_.forEach(desktopSettingsTypes, function (type) {
				if (desktopSettings[type] && desktopSettings[type].content) {
					if (type === userTypes.system) {
						// remove unecessary properties in rib default pages
						desktopSettings[type].content = _.map(desktopSettings[type].content, function (p) {
							if (p.rib) {
								return {id: p.id, rib: true, visibility: p.visibility};
							} else {
								return p;
							}
						});
					}
				}
			});

			// delete unchanged items
			if (removeUnchanged) {
				_.forEach(desktopSettingsTypes, function (type) {
					if (!desktopSettings[type] || !desktopSettings[type][changedMember]) {
						delete desktopSettings[type];
					}
				});
			}
		}

		platformPermissionService.loadPermissions(accessRightDescriptors, true);

		/**
		 * @ngdoc function
		 * @name hasWritePermission
		 * @function
		 * @methodOf cloudDesktopDesktopLayoutSettingsService
		 * @description Returns a bool value which indicates whether the user has write permissions
		 * @param { Object } userType The type of the user
		 * @return {bool} True, when system user has write permissions
		 */
		function hasWritePermission(userType) {
			switch (userType) {
				case userTypes.user:
					return platformPermissionService.hasWrite('68ac862ee72a459db4d3e6261d50c7ca', true);
				case userTypes.system:
					return platformPermissionService.hasWrite('90f208bce31440e59d7aba610d31989c', true);
				default:
					return false;
			}
		}

		function getNewGridItem(gridId) {
			if (platformGridAPI) {
				switch (gridId) {
					case gridIdPages:
						var uuid = platformCreateUuid();
						return {
							id: uuid,
							pageNameFk: undefined,
							pageName: '',
							visibility: true,
							url: '/' + uuid,
							routeUrl: globals.defaultState + '.' + uuid,
							groups: []
						};

					case gridIdGroups:
						return {
							id: platformCreateUuid(),
							groupName: '',
							tiles: [],
							visibility: true
						};
				}

				return {};
			}
		}

		function setGridData(gridId, data) {
			platformGridAPI.items.data(gridId, data);
		}

		function getGroupObjectForVisibility() {
			return {
				id: 'g2',
				field: 'visibility',
				formatter: 'boolean',
				editor: 'boolean',
				name: 'Visibility',
				name$tr$: 'cloud.desktop.visibility',
				width: 50,
				sortOrder: 2
			};
		}

		function getGroupGridConfigForSystem() {
			let toReturn = [];

			let structGroupName = {
				id: 'g1',
				field: 'groupNameFk',
				name: 'Group Name',
				name$tr$: 'cloud.desktop.design.desktop.groupName',
				sortOrder: 1,
				width: 400
			};

			let groupNameColumn = _.assign(basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsLookupdataDesktopGroupsLookupService'}).grid, structGroupName);
			groupNameColumn.editorOptions.lookupOptions.showClearButton = false;

			toReturn.push(groupNameColumn);
			toReturn.push(getGroupObjectForVisibility());

			return toReturn;
		}

		function getColDef(gridId, userType) {
			let structure = [];

			switch (gridId) {
				case gridIdPages:
					switch (userType) {
						case userTypes.system:
							var structPageName = {
								id: 'p2',
								field: 'pageNameFk',
								name: 'Page Name',
								name$tr$: 'cloud.desktop.design.desktop.pageName',
								sortOrder: 2
							};

							var pageNameColumn = _.assign(basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsLookupdataDesktopPagesLookupService'}).grid, structPageName);
							pageNameColumn.editorOptions.lookupOptions.showClearButton = false;
							pageNameColumn.editorOptions.lookupOptions.filterOptions = {
								fn: function (dataItem) {
									var pagesItemInGrid = platformGridAPI.items.data(gridIdPages);
									// only items, that are not available in grid
									return _.findIndex(pagesItemInGrid, {'pageNameFk': dataItem.Id}) < 0;
								}
							};

							structure = [{
								id: 'p1',
								field: 'rib',
								readonly: true,
								width: 30,
								resizable: false,
								formatter: 'image',
								formatterOptions: {
									imageSelector: 'cloudDesktopRibPagesIconService'
								},
								sortOrder: 1
							}, pageNameColumn, {
								id: 'p3',
								field: 'visibility',
								formatter: 'boolean',
								editor: 'boolean',
								name: 'Visibility',
								name$tr$: 'cloud.desktop.visibility',
								width: 50,
								sortOrder: 3
							}];

							break;
						case userTypes.user:
							structure = [{
								id: 'p2',
								field: 'pageName',
								formatter: 'description',
								editor: 'description',
								name: 'Page Name',
								name$tr$: 'cloud.desktop.design.desktop.pageName',
								sortOrder: 1
							}, {
								id: 'p3',
								field: 'visibility',
								formatter: 'boolean',
								editor: 'boolean',
								name: 'Visibility',
								name$tr$: 'cloud.desktop.visibility',
								width: 50,
								sortOrder: 2
							}];
							break;
					}

					return structure;

				case gridIdGroups:
					switch (userType) {
						case userTypes.system:
							structure = getGroupGridConfigForSystem();
							break;
						case userTypes.user:
							structure = [{
								id: 'g1',
								name: 'Group Name',
								name$tr$: 'cloud.desktop.design.desktop.groupName',
								width: 400,
								field: 'groupName',
								formatter: 'description',
								editor: 'description'
							}];

							structure.push(getGroupObjectForVisibility());
							break;
					}

					return structure;

				case gridIdTiles:
					return [
						{
							id: 't1',
							field: 'displayName',
							formatter: 'description',
							editor: 'description',
							name: 'Module',
							name$tr$: 'cloud.desktop.module',
							width: 200
						},
						{
							id: 't2',
							field: 'tileColor',
							formatter: 'color',
							editor: 'color',
							editorOptions: {
								showClearButton: false
							},
							name: 'Tile Colour',
							name$tr$: 'cloud.desktop.tileColor',
							width: 80
						},
						{
							id: 't3',
							field: 'tileOpacity',
							formatter: 'decimal',
							editor: 'decimal',
							editorOptions: {decimalPlaces: 1},
							formatterOptions: {decimalPlaces: 1},
							name: 'Tile Opacity',
							name$tr$: 'cloud.desktop.tileOpacity',
							width: 80
						},
						{
							id: 't4',
							field: 'textColor',
							formatter: 'color',
							editor: 'color',
							editorOptions: {
								showClearButton: false
							},
							name: 'Text Color',
							name$tr$: 'cloud.desktop.textColor',
							width: 80
						},
						{
							id: 't5',
							field: 'iconColor',
							formatter: 'color',
							editor: 'color',
							editorOptions: {
								showClearButton: false
							},
							name: 'Icon Color',
							name$tr$: 'cloud.desktop.iconColor',
							width: 80
						},
						{
							id: 't6',
							field: 'tileSize',
							formatter: 'select',
							formatterOptions: {
								items: getSizeSelectItems(),
								valueMember: 'id',
								displayMember: 'description'
							},
							editor: 'select',
							editorOptions: {
								items: getSizeSelectItems(),
								valueMember: 'id',
								displayMember: 'description'
							},
							name: 'Tile Size',
							name$tr$: 'cloud.desktop.tileSize',
							width: 50
						},
						{
							id: 't7',
							field: 'type',
							formatter: 'select',
							formatterOptions: {
								items: getTypeSelectItems(),
								valueMember: 'id',
								displayMember: 'description'
							},
							editor: 'select',
							editorOptions: {
								items: getTypeSelectItems(),
								valueMember: 'id',
								displayMember: 'description'
							},
							name: 'Tile Typ',
							name$tr$: 'cloud.desktop.type',
							width: 80
						}
					];
			}
		}

		function isRibPageSelected() {
			var selectedItems = platformGridAPI.rows.selection({gridId: gridIdPages, wantsArray: true});
			if (selectedItems && selectedItems.length > 0) {
				var item = selectedItems[0];
				return item.rib;
			}

			return false;
		}

		function isWebTileSelected() {
			var selectedItems = platformGridAPI.rows.selection({gridId: gridIdTiles, wantsArray: true});
			if (selectedItems && selectedItems.length > 0) {
				for (var i = 0; i < selectedItems.length; i++) {
					if (selectedItems[i].type === moduleTypes.web || selectedItems[i].type === moduleTypes.quickstart || selectedItems[i].type === moduleTypes.pinned) {
						return true;
					}
				}
			}

			return false;
		}

		function getUniqItemsValues(items) {
			return {
				tileColor: getUniqItem(items, 'tileColor'),
				tileOpacity: getUniqItem(items, 'tileOpacity'),
				textColor: getUniqItem(items, 'textColor'),
				iconColor: getUniqItem(items, 'iconColor'),
				tileSize: getUniqItem(items, 'tileSize')
			};
		}

		function getUniqItem(items, itemKey) {
			// returns the value of the first item, if all items have the same value, otherwise null
			return _.uniqBy(items, itemKey).length > 1 ? null : _.get(items[0], itemKey);
		}

		function getButtonConfigForSettingsTilesDialog() {
			return {
				id: 'ok',
				disabled: function (info) {
					if (info.value.type === 2) {
						if (info.value.url !== '') {
							info.value.displayName = info.value.displayName === '' ? info.value.url : info.value.displayName;
						} else {
							return true;
						}
					}

					if (info.value.type === 3 && info.value.hasOwnProperty('moduleTile') && info.value.displayName === '') {
						info.value.displayName = info.value.moduleTile.description;
					}

					return info.value.displayName === '' ? true : false;
				}
			};
		}

		function getDefaultTools(gridId, editableData, data, userType) {
			function getMoveGroup(disableFns) {
				disableFns = disableFns || {};
				return {
					id: 'moveGroup',
					type: 'sublist',
					list: {
						showTitles: true,
						items: [
							{
								id: '4',
								sort: 25,
								caption: 'cloud.common.toolbarMoveTop',
								type: 'item',
								iconClass: 'tlb-icons ico-grid-row-start',
								disabled: function () {
									return (disableFns.top ? disableFns.top() : isRibPageSelected()) || manualGridService.isMoveBtnDisabled(gridId, 'top');
								},
								fn: function () {
									manualGridService.moveRowInGrid(gridId, 'top');
									setChanged(data);
								}
							},
							{
								id: '5',
								sort: 30,
								caption: 'cloud.common.toolbarMoveUp',
								type: 'item',
								iconClass: 'tlb-icons ico-grid-row-up',
								disabled: function () {
									return (disableFns.up ? disableFns.top() : isRibPageSelected()) || manualGridService.isMoveBtnDisabled(gridId, 'up');
								},
								fn: function () {
									manualGridService.moveRowInGrid(gridId, 'up');
									setChanged(data);
								}
							},
							{
								id: '6',
								sort: 40,
								caption: 'cloud.common.toolbarMoveDown',
								type: 'item',
								iconClass: 'tlb-icons ico-grid-row-down',
								disabled: function () {
									return (disableFns.down ? disableFns.top() : isRibPageSelected()) || manualGridService.isMoveBtnDisabled(gridId, 'down');
								},
								fn: function () {
									manualGridService.moveRowInGrid(gridId, 'down');
									setChanged(data);
								}
							},
							{
								id: '7',
								sort: 42,
								caption: 'cloud.common.toolbarMoveBottom',
								type: 'item',
								iconClass: 'tlb-icons ico-grid-row-end',
								disabled: function () {
									return (disableFns.end ? disableFns.top() : isRibPageSelected()) || manualGridService.isMoveBtnDisabled(gridId, 'bottom');
								},
								fn: function () {
									manualGridService.moveRowInGrid(gridId, 'bottom');
									setChanged(data);
								}
							}]
					}
				};
			}

			switch (gridId) {
				case gridIdPages:
				case gridIdGroups:
					return {
						showImages: true,
						showTitles: true,
						cssClass: 'tools ',
						items: [
							// {
							//    id: '146',
							//    sort: 5,
							//    caption: 'Mein Test für den action select button',
							//    iconClass: 'tlb-icons ico-rec-new',
							//    type: 'action-btn'
							// },
							{
								id: '1',
								sort: 10,
								caption: 'cloud.common.toolbarInsert',
								iconClass: 'tlb-icons ico-rec-new',
								type: 'item',
								disabled: function () {
									return (gridId === gridIdPages ? false : (isRibPageSelected() || !manualGridService.isRowSelected(gridIdPages)));
								},
								fn: function () {
									manualGridService.addNewRowInGrid(gridId, getNewGridItem(gridId));
									setChanged(data);
								}
							},
							{
								id: '2',
								sort: 20,
								caption: 'cloud.common.toolbarDelete',
								iconClass: 'tlb-icons ico-rec-delete',
								type: 'item',
								disabled: function () {
									return isRibPageSelected() || manualGridService.isDeleteBtnDisabled(gridId);
								},
								fn: function () {
									manualGridService.deleteSelectedRow(gridId, true);
									setChanged(data);
								}
							},
							getMoveGroup({
								top: function () {
									return gridId === gridIdPages ? false : isRibPageSelected();
								},
								up: function () {
									return gridId === gridIdPages ? false : isRibPageSelected();
								},
								down: function () {
									return gridId === gridIdPages ? false : isRibPageSelected();
								},
								end: function () {
									return gridId === gridIdPages ? false : isRibPageSelected();
								}
							})
						]
					};
				case gridIdTiles:
					var toolbarItems = [
						{
							id: '1',
							sort: 10,
							caption: 'cloud.desktop.design.desktop.tileConfig',
							iconClass: 'tlb-icons ico-tiles',
							type: 'item',
							disabled: function () {
								return isRibPageSelected() || !manualGridService.isRowSelected(gridIdGroups);
							},
							fn: function () {
								var selectedItems = platformGridAPI.rows.selection({
									gridId: gridIdGroups,
									wantsArray: true
								});
								if (selectedItems && selectedItems.length > 0) {
									var item = selectedItems[0];

									moduleDialogService.showDialog(item.tiles || [], {
										sortItems: function sortSelection(l) {
											return _.sortBy(l, 'displayName');
										},
										withExternals: true
									}).then(function (result) {
										if (result.ok) {
											var currentTiles, newTiles = [];

											// take type "web" and all further selected modules
											currentTiles = _.filter(item.tiles, function (curMod) {
												if (curMod.type === moduleTypes.web || curMod.type === moduleTypes.quickstart || curMod.type === moduleTypes.pinned || _.find(result.value, {'id': curMod.id})) {
													return curMod;
												}
											});

											// remove already existing modules
											for (var i = 0; i < result.value.length; i++) {
												var newMod = result.value[i];
												var mod = _.find(currentTiles, {id: newMod.id});

												if (_.isUndefined(mod)) {
													newTiles.push({
														id: newMod.id,
														displayName: _.isUndefined(newMod.displayName$tr$) ? newMod.displayName : $translate.instant(newMod.displayName$tr$),
														tileColor: _.isUndefined(newMod.tileColor) ? defaultTileValues.tileColor : newMod.tileColor,
														tileOpacity: _.isUndefined(newMod.tileOpacity) ? defaultTileValues.tileOpacity : newMod.tileOpacity,
														tileSize: _.isUndefined(newMod.tileSize) ? defaultTileValues.tileSize : newMod.tileSize,
														textColor: _.isUndefined(newMod.textColor) ? defaultTileValues.textColor : newMod.textColor,
														iconColor: newMod.iconColor,
														type: newMod.type
													});
												}
											}

											// add new selected modules to current tiles
											currentTiles = currentTiles.concat(newTiles);

											item.tiles = currentTiles;
											platformGridAPI.items.data(gridIdTiles, item.tiles);
											setChanged(data);
										}
									});
								}
							}
						},
						{
							id: '2',
							sort: 20,
							caption: 'cloud.desktop.design.desktop.tileProperties',
							iconClass: 'tlb-icons ico-tile-properties',
							type: 'item',
							disabled: function () {
								return isRibPageSelected() || !manualGridService.isRowSelected(gridIdTiles);
							},
							fn: function () {
								var selectedItems = platformGridAPI.rows.selection({
									gridId: gridIdTiles,
									wantsArray: true
								});

								function checkShowIconColor(item) {
									if(item.type === 0 || item.type === 4) {
										return false;
									}
									return true;
								}

								if (selectedItems && selectedItems.length > 0) {
									let values, customTile, typeCustom;
									if (selectedItems.length > 1) {
										values = getUniqItemsValues(_.clone(selectedItems));
									} else {
										values = _.clone(selectedItems[0]);
										customTile = selectedItems[0].type === moduleTypes.web || selectedItems[0].type === moduleTypes.quickstart;
										typeCustom = selectedItems[0].type;
									}

									// show Icon-Color property only by type 0. ALM#113482
									values.showIconColor = !_.find(selectedItems, function (item) {
										return checkShowIconColor(item);
									});

									var dialogOption = {
										headerText$tr$: 'cloud.desktop.design.desktop.tileProperties',
										bodyTemplateUrl: globals.appBaseUrl + 'cloud.desktop/templates/tile-property-dialog.html',
										minWidth: '400px',
										width: '500px',
										showCancelButton: true,
										showOkButton: true,
										customTile: customTile,
										typeCustom: typeCustom,
										value: values,
										sizeOptions: {
											items: getSizeSelectItems(),
											valueMember: 'id',
											displayMember: 'description',
											modelIsObject: false
										},
										buttons: [
											getButtonConfigForSettingsTilesDialog()
										]
									};

									platformDialogService.showDialog(dialogOption).then(function (result) {
										if (result.ok) {
											var resultValue = _.pickBy(result.value, function (item) {
												return item !== null;
											});

											angular.forEach(selectedItems, function (item) {
												_.assign(item, resultValue);
											});

											platformGridAPI.grids.refresh(gridIdTiles, true);
											setChanged(data);
										}
									});
								}
							}
						}
					];

					if (userType === userTypes.user) {
						toolbarItems = toolbarItems.concat([
							{
								id: 'webGroup',
								type: 'sublist',
								list: {
									showTitles: true,
									items: [
										{
											id: 'w1',
											sort: 20,
											caption: 'cloud.desktop.design.desktop.customTileCreate',
											iconClass: 'tlb-icons ico-web-tile-add',
											type: 'item',
											disabled: function () {
												return !manualGridService.isRowSelected(gridIdGroups);
											},
											fn: function () {

												let dialogOption = {
													headerText$tr$: 'cloud.desktop.design.desktop.customTileCreate',
													bodyTemplateUrl: globals.appBaseUrl + 'cloud.desktop/templates/tile-add-dialog.html',
													minWidth: '400px',
													width: '500px',
													showCancelButton: true,
													showOkButton: true,
													config: {
														model: 'url'
													},
													value: {
														type: moduleTypes.web,
														url: '',
														icon: '',
														displayName: '',
														description: ''
													},
													typeWeb: true,
													buttons: [
														getButtonConfigForSettingsTilesDialog()
													]
												};

												platformDialogService.showDialog(dialogOption).then(function (result) {
													if (result.ok) {
														// use the color values of the selected item or use the default colors
														let selectedItem = _.pick(platformGridAPI.rows.selection({gridId: gridIdTiles, wantsArray: false}), 'tileOpacity', 'tileColor', 'textColor', 'tileSize') ||
															{
																tileOpacity: defaultTileValues.tileOpacity,
																tileColor: defaultTileValues.tileColor,
																textColor: defaultTileValues.textColor,
																tileSize: defaultTileValues.tileSize
															};

														let newItem = _.assign(_.clone(selectedItem), {
															id: platformCreateUuid(),
															iconColor: undefined,
															type: moduleTypes.web
														}, result.value);

														manualGridService.addNewRowInGrid(gridIdTiles, newItem);
														platformGridAPI.grids.refresh(gridIdTiles, true);
														setChanged(data);
													}
												});
											}
										},
										{
											id: '2',
											sort: 20,
											caption: 'cloud.desktop.design.desktop.customTileDelete',
											iconClass: 'tlb-icons ico-web-tile-delete',
											type: 'item',
											disabled: function () {
												return !isWebTileSelected() || manualGridService.isDeleteBtnDisabled(gridIdTiles);
											},
											fn: function () {
												manualGridService.deleteSelectedRow(gridIdTiles, true, function (row) {
													return row.type === moduleTypes.web || row.type === moduleTypes.quickstart || row.type === moduleTypes.pinned;
												});

												setChanged(data);
											}
										}
									]
								}
							}]);
					}

					toolbarItems = toolbarItems.concat([getMoveGroup()]);

					return {
						showImages: true,
						showTitles: true,
						cssClass: 'tools ',
						items: toolbarItems
					};

				default:
					return undefined;
			}
		}
		/**
		function getWebTileFormConfig() {
			return {
				fid: 'cloud.desktop.uds.form',
				version: '1.0.0',
				showGrouping: false,
				groups: [{
					gid: 'config',
					isOpen: true,
					isVisible: true,
					sortOrder: 1,
				}],
				rows: [{
					gid: 'config',
					rid: 'url',
					label$tr$: 'cloud.desktop.design.desktop.webTileUrl',
					type: 'url',
					visible: true,
					sortOrder: 1,
					model: 'url'
				}, {
					gid: 'config',
					rid: 'icon',
					label$tr$: 'cloud.desktop.design.desktop.webTileIcon',
					visible: true,
					sortOrder: 2,
					model: 'icon',
					type: 'fileselect',
					'options': {
						fileFilter: 'image/*',
						maxSize: '50KB',
						retrieveDataUrl: true
					}
				}, {
					gid: 'config',
					rid: 'name',
					label$tr$: 'cloud.desktop.design.desktop.webTileName',
					type: 'description',
					visible: true,
					sortOrder: 3,
					model: 'displayName',
					// validator: function () {
					//    return {apply: true, valid: false, error: 'Name muss ziemlich cool sein'};
					// }
				}, {
					gid: 'config',
					rid: 'description',
					label$tr$: 'cloud.desktop.design.desktop.webTileDescription',
					type: 'description',
					visible: true,
					sortOrder: 4,
					model: 'description'
				}]
			};
		}
		 */
		function getSizeSelectItems() {
			return [
				{id: 0, description: $translate.instant('cloud.desktop.design.desktop.tileSize0')},
				{id: 1, description: $translate.instant('cloud.desktop.design.desktop.tileSize1')}
			];
		}

		function getTypeSelectItems() {
			return [
				{id: 0, description: $translate.instant('cloud.desktop.design.desktop.typInternal')},
				{id: 1, description: $translate.instant('cloud.desktop.design.desktop.typExternal')},
				{id: 2, description: $translate.instant('cloud.desktop.design.desktop.typWeb')},
				{id: 3, description: $translate.instant('cloud.desktop.design.desktop.typQuickstart')},
				{id: 4, description: $translate.instant('cloud.desktop.design.desktop.typPinnedDocuments')}
			];
		}

		/**
		 * @ngdoc function
		 * @name getFormData
		 * @function
		 * @methodOf cloudDesktopDesktopLayoutSettingsService
		 * @description Returns the config object for the form-generator
		 * @return {Object} The config object
		 */
		function getFormData(userType, data, editableData) {
			var formData;

			function getInitializer(gridId) {

				if (!platformGridAPI.grids.exist(gridId)) {
					var gridConfig = {
						columns: getColDef(gridId, userType),
						data: data && data.content || [],
						id: gridId,
						lazyInit: true,
						enableConfigSave: false,
						options: {
							autoHeight: true,
							idProperty: 'id',
							editable: gridId !== gridIdTiles,
							indicator: true,
							skipPermissionCheck: true
						}
					};
					platformGridAPI.grids.config(gridConfig);

					switch (gridId) {
						case gridIdPages:
							platformGridAPI.events.register(gridId, 'onSelectedRowsChanged', handleGridPagesSelectedRowsChanged);
							platformGridAPI.events.register(gridId, 'onRenderCompleted', handleGridPagesOnRenderCompleted);
							platformGridAPI.events.register(gridId, 'onBeforeEditCell', handleGridPagesOnBeforeEditCell);
							platformGridAPI.events.register(gridId, 'onCellChange', handleGridPagesOnCellChanged);
							break;
						case gridIdGroups:
							platformGridAPI.events.register(gridId, 'onSelectedRowsChanged', handleGridGroupsSelectedRowsChanged);
							platformGridAPI.events.register(gridId, 'onCellChange', handleGridGroupsOnCellChanged);
							break;
						case gridIdTiles:
							platformGridAPI.events.register(gridId, 'onCellChange', handleGridTilesOnCellChanged);
							break;		
					}

					return function () {
						onDestroyGrid(gridId);
					};
				}
			}

			function handleGridPagesSelectedRowsChanged() {
				let selectedItems = platformGridAPI.rows.selection({gridId: gridIdPages, wantsArray: true});
				if (selectedItems && selectedItems.length > 0) {
					let item = selectedItems[0];
					platformGridAPI.grids.setOptions(gridIdGroups, {editable: !item.rib});
					platformGridAPI.grids.setOptions(gridIdTiles, {editable: !item.rib});

					//if new key not defined, the set true as default
					angular.forEach(item.groups, function(item) {
						item.visibility = _.isNil(item.visibility) ? true : item.visibility;
					});

					setGridData(gridIdGroups, item.groups);
				} else {
					setGridData(gridIdGroups, []);
				}

				selectRowInGrid(gridIdGroups);
			}

			function handleGridGroupsSelectedRowsChanged() {
				var selectedItems = platformGridAPI.rows.selection({gridId: gridIdGroups, wantsArray: true});
				if (selectedItems && selectedItems.length > 0) {
					let item = selectedItems[0];
					verifyTilesDisplayName(item);
					setGridData(gridIdTiles, item.tiles);
				} else {
					setGridData(gridIdTiles, []);
				}

				selectRowInGrid(gridIdTiles);
			}

			function showSettingsDisplayName(groupItem) {
				return groupItem.hasOwnProperty('moduleType') && groupItem.moduleType === 4;
			}

			function verifyTilesDisplayName(groupItem) {
				if(showSettingsDisplayName(groupItem)) {
					groupItem.tiles.forEach(i => {
						if(i.settingsDisplayName) {
							i.displayName = i.settingsDisplayName;
						}
					});
				}
				return groupItem;
			}

			function handleGridPagesOnBeforeEditCell(e, data) {
				if (data && data.item && data.item.rib) {
					return false;
				}
			}

			function handleGridPagesOnRenderCompleted() {
				selectRowInGrid(gridIdPages);
				platformGridAPI.events.unregister(gridIdPages, 'onRenderCompleted', handleGridPagesOnRenderCompleted);
			}

			function selectRowInGrid(gridId) {
				$timeout(function () {
					manualGridService.selectRowByIndex(gridId, 0);
				}, 10);
			}

			function handleGridPagesOnCellChanged() {
				setChanged(data);
				platformGridAPI.events.unregister(gridIdPages, 'onCellChange', handleGridPagesOnCellChanged);
			}

			function handleGridGroupsOnCellChanged() {
				setChanged(data);
				platformGridAPI.events.unregister(gridIdGroups, 'onCellChange', handleGridGroupsOnCellChanged);
			}

			function handleGridTilesOnCellChanged() {
				setChanged(data);
			    platformGridAPI.grids.refresh(gridIdTiles, true);
			}

			function onDestroyGrid(gridId) {
				if (platformGridAPI.grids.exist(gridId)) {

					switch (gridId) {
						case gridIdPages:
							platformGridAPI.events.unregister(gridId, 'onSelectedRowsChanged', handleGridPagesSelectedRowsChanged);
							platformGridAPI.events.unregister(gridId, 'onRenderCompleted', handleGridPagesOnRenderCompleted);
							platformGridAPI.events.unregister(gridId, 'onBeforeEditCell', handleGridPagesOnBeforeEditCell);
							platformGridAPI.events.unregister(gridId, 'onCellChange', handleGridPagesOnCellChanged);
							break;
						case gridIdGroups:
							platformGridAPI.events.unregister(gridId, 'onSelectedRowsChanged', handleGridGroupsSelectedRowsChanged);
							platformGridAPI.events.unregister(gridId, 'onCellChange', handleGridGroupsOnCellChanged);
							break;
						case gridIdTiles:
							platformGridAPI.events.unregister(gridId, 'onCellChange', handleGridTilesOnCellChanged);
							break;	
					}

					platformGridAPI.grids.unregister(gridId);
				}
			}

			function prepareGrid(gridId, scope) {
				scope.$on('$destroy', function () {
					onDestroyGrid(gridId);
				});
			}

			formData = {
				fid: 'cloud.desktop.uds.form',
				version: '1.0.0',
				showGrouping: true,
				initializers: [function () {
					// var item = _.get(scope, selectedItemPath);
					return getInitializer(gridIdPages);
				}, function () {
					return getInitializer(gridIdGroups);
				}, function () {
					return getInitializer(gridIdTiles);
				}],
				prepareData: function (item, scope) {
					// this will be executed once, when changing to this masterItem first
					scope.dataLoading = true;
					item.data.grids = {
						pages: {
							state: gridIdPages
						},
						groups: {
							state: gridIdGroups
						},
						tiles: {
							state: gridIdTiles
						}
					};

					prepareGrid(gridIdPages, scope);
					prepareGrid(gridIdGroups, scope);
					prepareGrid(gridIdTiles, scope);

					scope.dataLoading = false;
				},
				groups: [{
					gid: 'pages',
					header$tr$: 'cloud.desktop.design.desktop.groupPages',
					isOpen: true,
					isVisible: true,
					sortOrder: 2
				}, {
					gid: 'groups',
					header$tr$: 'cloud.desktop.design.desktop.groupGroups',
					isOpen: true,
					isVisible: true,
					sortOrder: 3
				}, {
					gid: 'tiles',
					header$tr$: 'cloud.desktop.design.desktop.groupTiles',
					isOpen: true,
					isVisible: true,
					sortOrder: 4
				}],
				rows: [{
					gid: 'pages',
					rid: 'gridPages',
					visible: true,
					sortOrder: 2,
					model: 'data.grids.pages',
					type: 'directive',
					directive: 'platform-grid-form-control',
					options: {
						tools: getDefaultTools(gridIdPages, editableData, data, userType),
						gridId: gridIdPages,
						//height: '120px'
					}
				}, {
					gid: 'groups',
					rid: 'gridGroups',
					visible: true,
					sortOrder: 3,
					model: 'data.grids.groups',
					type: 'directive',
					directive: 'platform-grid-form-control',
					options: {
						tools: getDefaultTools(gridIdGroups, editableData, data, userType),
						gridId: gridIdGroups,
						//height: '170px'
					}
				}, {
					gid: 'tiles',
					rid: 'gridTiles',
					visible: true,
					sortOrder: 4,
					model: 'data.grids.tiles',
					type: 'directive',
					directive: 'platform-grid-form-control',
					options: {
						tools: getDefaultTools(gridIdTiles, editableData, data, userType),
						gridId: gridIdTiles,
						//height: '170px'
					}
				}]
			};

			if (userType === userTypes.user) {
				formData.groups.unshift({
					gid: 'common',
					header$tr$: 'cloud.desktop.design.desktop.groupHome',
					isOpen: true,
					isVisible: true,
					sortOrder: 1
				});

				formData.rows.unshift({
					gid: 'common',
					rid: 'home',
					type: 'select',
					visible: true,
					sortOrder: 1,
					model: 'data.homeId',
					options: {
						items: currentSettings.desktopPagesStructure,
						valueMember: 'id',
						displayMember: 'pageName',
						modelIsObject: false
					}
				});
			}

			return formData;
		}

		/**
		 * @ngdoc function
		 * @name getNexPageForPager
		 * @function
		 * @methodOf cloudDesktopDesktopLayoutSettingsService
		 * @description Returns the url for the next page
		 * @return string
		 */
		function getNexPageForPager(pageIndex, desktopPages) {
			var page, url = 'app.desktop';

			/*
				 looping the page.
				 if nextPageIndex < 0 --> get last page from $scope.pageInformation.
				 if nextPageIndex > maxPageSize --> go to first Page from $scope.pageInformation.
				 */
			if (pageIndex < 0) {
				page = _.last(desktopPages);
			} else if (pageIndex >= desktopPages.length) {
				page = _.first(desktopPages);
			} else {
				page = desktopPages[pageIndex];
			}

			if (page) {
				var state = _.find($state.get(), ['id', page.id]);
				url = state.name || state.routeUrl;
			}

			return url;
		}

		return {
			/**
			 * @ngdoc function
			 * @name getExternalModuleUrl
			 * @function
			 * @methodOf cloudDesktopDesktopLayoutSettingsService
			 * @description Returns the module object, that contains the url.
			 * @param { number } tileId The id of the tile.
			 * @return {object} The module's data
			 */
			getExternalModuleUrl: getExternalModuleUrl,
			/**
			 * @ngdoc function
			 * @name getMasterItem
			 * @function
			 * @methodOf cloudDesktopDesktopLayoutSettingsService
			 * @description Returns an master item object for the settings dialog definition.
			 * @param { Object } editableData The editableData object
			 * @param { Object } userType The type of the user
			 * @return {object} The master item object
			 */
			getMasterItem: getMasterItem,
			/**
			 * @ngdoc function
			 * @name getMasterItemId
			 * @function
			 * @methodOf cloudDesktopDesktopLayoutSettingsService
			 * @description Returns the id of the master item object of the specified user typ.
			 * @param { string } userType The type of the user
			 * @return { string } The id of the master item object
			 */
			getMasterItemId: getMasterItemId,
			// convertToEditable: convertToEditable,
			/**
			 * @ngdoc function
			 * @name convertToTransferable
			 * @function
			 * @methodOf cloudDesktopDesktopLayoutSettingsService
			 * @description Converts the DesktopSettings from the UserSettings-object to the transportable format. This is necessary to save the data into the db.
			 * @param {Object} userSettings The User Settings data.
			 */
			convertToTransferable: convertToTransferable,
			/**
			 * @ngdoc function
			 * @name hasWritePermission
			 * @function
			 * @methodOf cloudDesktopDesktopLayoutSettingsService
			 * @description Returns a bool value which indicates whether the user has write permissions
			 * @param { Object } userType The type of the user
			 * @return {bool} True, when system user has write permissions
			 */
			hasWritePermission: hasWritePermission,
			/**
			 * @ngdoc function
			 * @name getDesktopPagesStructure
			 * @function
			 * @methodOf cloudDesktopDesktopLayoutSettingsService
			 * @description Returns an array of all pages (including the groups and tiles) that the user has permission to access. This array contains both the RIB default pages and the user created pages.
			 * @param {boolean} forceRefresh If true, the data is redetermined, that means loaded from the database. Otherwise the cached data will be returned.
			 * @return { array } An array of pages
			 */
			getDesktopPagesStructure: getDesktopPagesStructure,
			/**
			 * @ngdoc function
			 * @name alterSettingsData
			 * @function
			 * @methodOf cloudDesktopDesktopLayoutSettingsService
			 * @description General function to alter the settings after loading it.
			 * @param {object} data The data object with all user settings
			 */
			alterSettingsData: alterSettingsData,
			/**
			 * @ngdoc function
			 * @name extendStateProvider
			 * @function
			 * @methodOf cloudDesktopDesktopLayoutSettingsService
			 * @description Extends the StateProvider by the new routes of the user pages.
			 * @param {array} desktopStructure An array of all pages (including the groups and tiles) which should be added to the stateprovider.
			 */
			extendStateProvider: extendStateProvider,
			/**
			 * @ngdoc function
			 * @name getLastSettingsUpdate
			 * @function
			 * @methodOf cloudDesktopDesktopLayoutSettingsService
			 * @description Gets the date of the last desktop settings update
			 * @returns { string } A string with the date of the last css update
			 */
			getLastSettingsUpdate: getLastSettingsUpdate,
			/**
			 * @ngdoc function
			 * @name onSaved
			 * @function
			 * @methodOf cloudDesktopDesktopLayoutSettingsService
			 * @description Will be executed after saving the user settings
			 * @param {object} data The data object with all user settings
			 */
			onSaved: onSaved,
			getNexPageForPager: getNexPageForPager,

			getCurrentSettings: getCurrentSettings2,
			/**
			 * @ngdoc function
			 * @name getSettings
			 * @function
			 * @methodOf cloudDesktopDesktopLayoutSettingsService
			 * @description Returns the current settings object
			 * @returns { object } The current settings object
			 */
			getSettings: getCurrentSettings,
			/**
			 * @ngdoc function
			 * @name getRibGroups
			 * @function
			 * @methodOf cloudDesktopDesktopLayoutSettingsService
			 * @description Returns the default rib-groups object
			 * @returns { object } The default rib-groups object
			 */
			getRibGroups: getRibGroups,
			/**
			 * @ngdoc property
			 * @name .#settingsKey
			 * @propertyOf cloudDesktopDesktopLayoutSettingsService
			 * @returns { string } The id of the settings object
			 */
			settingsKey: settingsKey
		};
	}

	/**
	 * @ngdoc service
	 * @name cloudDesktopStateProvider
	 * @function
	 * @requires $stateProvider
	 * @description A provider to add new states to the state provider
	 */
	angular.module('cloud.desktop').provider('cloudDesktopStateProvider', ['$stateProvider',
		function ($stateProvider) {
			this.$get = function () {
				return {
					addState: function (id, url, controllerAs, pageName) {
						$stateProvider.state(globals.defaultState + '.' + id, {
							id: id,
							displayName: pageName,
							url: '/' + id,
							templateUrl: window.location.pathname + url,
							controller: controllerAs ? controllerAs : null,
							isDesktop: true
						});
					}
					// setFallbackPath: function(path) {
					//    //Defines a path that is used when an invalid route is requested, f.e. '/app/desktop'
					//    $urlRouterProvider.otherwise(path);
					// }
				};
			};
		}]);

	/**
	 * @ngdoc service
	 * @name cloudDesktopDesktopLayoutSettingsService
	 * @function
	 * @requires $http, $q, _, PlatformMessenger
	 * @description Manages desktop settings.
	 */
	angular.module('cloud.desktop').factory('cloudDesktopDesktopLayoutSettingsService', cloudDesktopDesktopLayoutSettingsService);
})();
