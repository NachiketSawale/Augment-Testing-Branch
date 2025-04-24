/**
 * Created by uestuenel on 12.02.2018.
 */
(globals => {
	'use strict';

	function cloudDesktopQuickstartSettingsService($translate, platformPermissionService, dataStates, userTypes, desktopModuleService, platformGridAPI, moduleDialogService, $http, _, $q, cloudDesktopQuickstartDataHandligService, cloudDesktopDesktopLayoutSettingsService) {
		let lastQuickstartUpdate;
		let gridIdQuickstart = '77e9fd2759df5b92a0bb108c50220e73';
		let settingsKey = 'quickstartSettings'; // the property name of display settings within the user settings object
		let settingsTypes = [userTypes.system, userTypes.user]; // which types of user this settings supports
		let gridOptions; // reference to the grid options
		let accessRightDescriptors = ['67fb15aa099b488390999dab3e3ff7ae', '7444f703f8b745829498595215b89e2e'];
		const changedMember = '__changed';
		let cachedPromise, cachedSettings; // cached data layout settings

		/**
		 * @ngdoc function
		 * @name getMasterItemId
		 * @function
		 * @methodOf cloudDesktopQuickstartSettingsService
		 * @description Returns the id of the master item object of the specified user typ.
		 * @param { string } userType The type of the user
		 * @return { string } The id of the master item object
		 */
		function getMasterItemId(userType) {
			return _.includes(settingsTypes, userType) ? settingsKey + _.capitalize(userType) : undefined;
		}

		/**
		 * @ngdoc function
		 * @name getMasterItem
		 * @function
		 * @methodOf cloudDesktopQuickstartSettingsService
		 * @description Returns an master item object for the settings dialog definition.
		 * @param { Object } editableData The editableData object
		 * @param { Object } userType The type of the user
		 * @return {object} The master item object
		 */
		function getMasterItem(editableData, userType) {
			switch (userType) {
				case userTypes.user:
					return {
						Id: getMasterItemId(userType),
						name: $translate.instant('cloud.desktop.design.quickstartUser'),
						form: getFormData(editableData.items[settingsKey], userType),
						data: editableData.items[settingsKey].user,
						visible: hasWritePermission(userType)
					};
				case userTypes.system:
					return {
						Id: getMasterItemId(userType),
						name: $translate.instant('cloud.desktop.design.quickstartSystem'),
						form: getFormData(editableData.items[settingsKey], userType),
						data: editableData.items[settingsKey].system,
						visible: hasWritePermission(userType)
					};
				default:
					return undefined;
			}
		}

		/**
		 * @ngdoc function
		 * @name hasWritePermission
		 * @function
		 * @methodOf cloudDesktopQuickstartSettingsService
		 * @description Returns a bool value which indicates whether the user has write permissions
		 * @param { Object } userType The type of the user
		 * @return {bool} True, when system user has write permissions
		 */
		function hasWritePermission(userType) {
			switch (userType) {
				case userTypes.user:
					return platformPermissionService.hasWrite('67fb15aa099b488390999dab3e3ff7ae', true);
				case userTypes.system:
					return platformPermissionService.hasWrite('7444f703f8b745829498595215b89e2e', true);
				default:
					return false;
			}
		}

		platformPermissionService.loadPermissions(accessRightDescriptors);

		/**
		 * @ngdoc function
		 * @name convertToTransferable
		 * @function
		 * @methodOf cloudDesktopQuickstartSettingsService
		 * @description Converts the quickstart settings from the UserSettings-object to the transportable format. This is necessary to save the data into the db.
		 * @param {Object} userSettings The User Settings data.
		 * @param {requestCallback} deleteFunc The function to delete the whole setting data for this service
		 * @param {Boolean} removeUnchanged When true unchanged settings will be removed from object.
		 */
		function convertToTransferable(userSettings, removeUnchanged) {
			if (!userSettings) {
				return;
			}

			// delete unknown properties, e.g. unused settingsTypes
			for (let property in userSettings) {
				if (userSettings.hasOwnProperty(property)) {
					if (!_.includes(settingsTypes, property)) {
						delete userSettings[property];
					}
				}
			}

			// delete unchanged items
			if (removeUnchanged) {
				_.forEach(settingsTypes, (type) => {
					if (!userSettings[type] || !userSettings[type][changedMember]) {
						delete userSettings[type];
					}
				});
			}
		}

		function getColDef() {
			return [
				{
					id: '1',
					field: 'displayName',
					formatter: 'description',
					editor: 'description',
					name: 'Module',
					name$tr$: 'cloud.desktop.modules'
				}
			];
		}

		function prepareGrid(gridId, scope) {
			currentData = undefined;

			scope.$on('$destroy', () => {
				onDestroyGrid(gridId);
			});
		}

		function onDestroyGrid(gridId) {
			if (platformGridAPI.grids.exist(gridId)) {
				platformGridAPI.grids.unregister(gridId);
			}
		}

		let currentData;

		function getInitializer(gridId, data) {
			if (!platformGridAPI.grids.exist(gridId)) {
				let grid = {
					columns: getColDef(),
					data: [],
					id: gridId,
					lazyInit: true,
					enableConfigSave: false,
					options: {
						idProperty: 'id',
						editable: false,
						indicator: true,
						skipPermissionCheck: true,
						autoHeight: true
					}
				};
				platformGridAPI.grids.config(grid);

				if (currentData) {
					platformGridAPI.items.data(gridId, currentData);
				} else {
					desktopModuleService.getModulesById(data.modules, undefined, true, true).then(result => {
						platformGridAPI.items.data(gridId, result);
					});
				}

				return () => {
					currentData = platformGridAPI.items.data(gridId);
					onDestroyGrid(gridId);
				};
			}
		}

		/**
		 * @ngdoc function
		 * @name getFormData
		 * @function
		 * @methodOf quickstartSettingsService
		 * @description Returns the config object for the form-generator
		 * @return {Object} The config object
		 */
		function getFormData(data, userType) {
			gridOptions = getGridOptions(data, userType);

			switch (userType) {
				case userTypes.user:
					return {
						fid: 'cloud.desktop.uls.form',
						version: '1.0.0',
						showGrouping: true,
						initializers: [
							(scope, selectedItemPath) => scope.$watch(selectedItemPath + '.data.useSettings', newValue => {
								if (gridOptions) {
									gridOptions.overlay.show = !newValue;
								}
							}),
							(scope, selectedItemPath) => {
								let item = _.get(scope, selectedItemPath);
								return getInitializer(gridIdQuickstart, item.data);
							}],
						prepareData: function (item, scope) {
							scope.dataLoading = true;
							item.data.modulesGrid = {
								state: gridIdQuickstart
							};
							prepareGrid(gridIdQuickstart, scope);

							scope.dataLoading = false;
						},
						groups: [{
							gid: 'config',
							header$tr$: 'cloud.desktop.design.config',
							isOpen: true,
							isVisible: true,
							sortOrder: 1
						}, {
							gid: 'modulelist',
							header$tr$: 'cloud.desktop.design.quickstart.moduleList',
							isOpen: true,
							isVisible: true,
							sortOrder: 2
						}],
						rows: [
							{
								gid: 'config',
								rid: 'useSettings',
								model: 'data.useSettings',
								label$tr$: 'cloud.desktop.design.quickstart.useSettings',
								type: 'boolean',
								visible: true,
								sortOrder: 1
							}, {
								gid: 'config',
								rid: 'showPages',
								model: 'data.showPages',
								label$tr$: 'cloud.desktop.design.quickstart.showPages',
								type: 'boolean',
								visible: true,
								sortOrder: 2
							}, {
								gid: 'config',
								rid: 'showTabs',
								model: 'data.showTabs',
								label$tr$: 'cloud.desktop.design.quickstart.showTabs',
								type: 'boolean',
								visible: true,
								sortOrder: 3
							},
							{
								gid: 'modulelist',
								rid: 'modulelistgrid',
								model: 'data.modulesGrid',
								type: 'directive',
								directive: 'platform-grid-form-control',
								readonly: false,
								visible: true,
								sortOrder: 2,
								options: gridOptions
							}
						]
					};
				case userTypes.system:
					return {
						fid: 'cloud.desktop.uls.form',
						version: '1.0.0',
						showGrouping: true,
						groups: [{
							gid: 'config',
							header$tr$: 'cloud.desktop.design.config',
							isOpen: true,
							isVisible: true,
							sortOrder: 1
						}],
						rows: [
							{
								gid: 'config',
								rid: 'showPages',
								model: 'data.showPages',
								label$tr$: 'cloud.desktop.design.quickstart.showPages',
								type: 'boolean',
								visible: true,
								sortOrder: 2
							}, {
								gid: 'config',
								rid: 'showTabs',
								model: 'data.showTabs',
								label$tr$: 'cloud.desktop.design.quickstart.showTabs',
								type: 'boolean',
								visible: true,
								sortOrder: 3
							}
						]
					};

				default:
					return undefined;
			}
		}

		let getGridOptions = function (data, userType) {
			return {
				tools: getDefaultTools(data, userType),
				gridId: gridIdQuickstart,
				//height: '400px',
				overlay: { show: true, info: $translate.instant('cloud.desktop.design.quickstart.infoMessage')}
			};
		};

		function setChanged(data) {
			data.__changed = true;
		}

		function getDefaultTools(data, userType) {
			return {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: '1',
						sort: 10,
						caption: 'cloud.desktop.design.desktop.tileConfig',
						iconClass: 'tlb-icons tlb-icons ico-tiles',
						type: 'item',
						fn: () => {
							moduleDialogService.showDialog(_.isUndefined(data) ? [] : data[userType].modules, {
								sortItems: (l) => _.sortBy(l, 'displayName'),
								withExternals: true,
								withWebTiles: true
							}).then(result => {
								if (result.ok) {
									data[userType].modules = _.map(result.value, ({id}) => id);
									platformGridAPI.items.data(gridIdQuickstart, result.value);
									setChanged(data[userType]);
								}
							});
						}
					}
				]
			};
		}

		/**
		 * @ngdoc function
		 * @name getSettings
		 * @function
		 * @methodOf quickstartSettingsService
		 * @description Loads the available settings from the server.
		 * @param {boolean} refreshData If true, the data is redetermined, that means loaded from the database. Otherwise the cached data will be returned.
		 * @returns {Promise<Object>} A promise that is resolved when the data is loaded.
		 */
		function getSettings(refreshData) {
			if (cachedSettings && !refreshData) {
				return $q.when(_.cloneDeep(cachedSettings));
			} else {
				return loadSettings().then(result => {
					cachedSettings = result;
					return cachedSettings;
				});
			}
		}

		function getDesktopSettingsItems(loadedData) {
			return cloudDesktopDesktopLayoutSettingsService.getSettings().then(result => {
				return cloudDesktopQuickstartDataHandligService.getDesktopItems(loadedData, result);
			});
		}

		function loadSettings() {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'cloud/desktop/usersettings/loadmergedsetting',
				params: {settingsKey: settingsKey}
			}).then(result => {
				if (angular.isObject(result.data)) {
					let loadedData = result.data;

					if (loadedData.useSettings) {
						return desktopModuleService.getModulesById(loadedData.modules, undefined, true, true).then(modules => {
							var externalTilesIds = _.map(_.filter(modules, {'type': 1}), 'id');
							if (externalTilesIds.length > 0) {
								return checkExternalTiles(modules, externalTilesIds).then(response => {
									loadedData.modules = response;
									return getDesktopSettingsItems(loadedData);
								});
							} else {
								loadedData.modules = modules;
								return getDesktopSettingsItems(loadedData);
							}
						});
					} else {
						return getDesktopSettingsItems(loadedData);
					}
				}

				return undefined;
			});
		}

		function checkExternalTiles(modules, externalTilesIds) {
			return desktopModuleService.getExternalModulesExtended(externalTilesIds).then(function (externalModules) {
				angular.forEach(modules, function (item) {
					var tile = _.find(externalModules, {'id': item.id});
					if (tile) {
						_.extend(item, tile);
					}
				});

				return modules;
			});
		}

		function getTabsByModuleName(modulename) {
			if (_.isString(modulename)) {
				return $http({
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/layout/quickstarttabs',
					data: [modulename]
				}).then(result => {
					return result.data[modulename] || [];
				});
			}
			return $q.when([]);
		}

		/**
		 * @ngdoc function
		 * @name isSettingsChanged
		 * @function
		 * @methodOf quickstartSettingsService
		 * @description Indicate whether the settings are changed.
		 * @returns { bool } True, if settings are changed, otherwise false.
		 */
		function isSettingsChanged(data) {
			let changed = false, quickstartSettings = data[settingsKey];

			if (!_.isUndefined(quickstartSettings)) {
				_.forEach(settingsTypes, (type) => {
					if (quickstartSettings[type] && quickstartSettings[type][changedMember]) {
						changed = true;
					}
				});
			}

			return changed;
		}

		/**
		 * @ngdoc function
		 * @name getLastSettingsUpdate
		 * @function
		 * @methodOf quickstartSettingsService
		 * @description Gets the date of the last settings update
		 * @returns { string } A string with the date of the last update
		 */
		function getLastSettingsUpdate() {
			return lastQuickstartUpdate;
		}

		/**
		 * @ngdoc function
		 * @name onSaved
		 * @function
		 * @methodOf quickstartSettingsService
		 * @description This function will be processed after the settings dialog has saved his settings.
		 * @param { Object } data The data object of the selected master item.
		 */
		function onSaved(data) {
			if (isSettingsChanged(data)) {
				cachedPromise = undefined;
				cachedSettings = undefined;
				lastQuickstartUpdate = Date.now();
			}
		}

		return {
			getMasterItem: getMasterItem,
			getMasterItemId: getMasterItemId,
			convertToTransferable: convertToTransferable,
			hasWritePermission: hasWritePermission,
			getLastSettingsUpdate: getLastSettingsUpdate,
			onSaved: onSaved,
			getSettings: getSettings,
			loadSettings: loadSettings,
			getTabsByModuleName: getTabsByModuleName,
			/**
			 * @ngdoc property
			 * @name .#settingsKey
			 * @propertyOf cloudDesktopQuickstartSettingsService
			 * @returns { string } The id of the settings object
			 */
			settingsKey: settingsKey
		};
	}

	cloudDesktopQuickstartSettingsService.$inject = ['$translate', 'platformPermissionService', 'cloudDesktopSettingsState', 'cloudDesktopSettingsUserTypes', 'cloudDesktopModuleService', 'platformGridAPI', 'cloudDesktopModuleDialogService', '$http', '_', '$q', 'cloudDesktopQuickstartDataHandligService', 'cloudDesktopDesktopLayoutSettingsService'];

	angular.module('cloud.desktop').factory('cloudDesktopQuickstartSettingsService', cloudDesktopQuickstartSettingsService);
})(globals);
