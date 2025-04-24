/**
 * Created by alisch on 19.02.2020.
 */
(function () {
	'use strict';

	cloudDesktopDataLayoutSettingsService.$inject = ['$http', '$q', '_', 'basicsCommonDrawingUtilitiesService', 'cloudDesktopSettingsState',
		'platformRuntimeDataService', 'platformPermissionService', '$translate', 'cloudDesktopSettingsUserTypes', 'cloudDesktopImprovedHierarchicalService',
		'platformGridAPI', 'platformManualGridService', '$timeout'];

	function cloudDesktopDataLayoutSettingsService($http, $q, _, drawingUtils, dataStates, platformRuntimeDataService, platformPermissionService,
		$translate, userTypes, cloudDesktopImprovedHierarchicalService, platformGridAPI, platformManualGridService, $timeout) {
		let cachedSettings, cachedSchemesItems;
		var lastSettingsChange;
		var settingsKey = 'dataLayoutSettings'; // the property name of display settings within the user settings object
		var dataLayoutSettingsTypes = [userTypes.system, userTypes.user]; // which types of user this settings supports
		var accessRightDescriptors = [
			'dfa8042363744c7bb9b886b441419df3',
			'75ae78531ea54374b8cbbf8da5a4a2a8',
			'8eda9ac9d5b94b5b981a0609f1bf6878'];
		var dataLayoutSettingsColorProps = ['roBackgroundColor', 'roSymbolColor', 'selectionBackgroundColor', 'selectionBorderColor',
			'backgroundColor', 'fontColor'];

		const gridIdDSettings = '40c4eaf7fb8f4cd5a357804dde9dbe2d';
		const gridIdSSettings = '581092d1500e4d88b02ac3d7d5762598';
		const changedMember = '__changed';

		platformPermissionService.loadPermissions(accessRightDescriptors);

		function convertColor(owner, propName, defaultColor) {
			if(typeof owner[propName] === 'object') {
				if (owner[propName]) {
					owner[propName] = drawingUtils.rgbColorToInt(owner[propName]);
				} else {
					owner[propName] = drawingUtils.rgbColorToInt(defaultColor);
				}
			}
		}

		function setChanged(data) {
			data[changedMember] = true;
		}

		/**
		 * @ngdoc function
		 * @name getMasterItemId
		 * @function
		 * @methodOf cloudDesktopDataLayoutSettingsService
		 * @description Returns the id of the master item object of the specified user typ.
		 * @param { string } userType The type of the user
		 * @return { string } The id of the master item object
		 */
		function getMasterItemId(userType) {
			return _.includes(dataLayoutSettingsTypes, userType) ? settingsKey + _.capitalize(userType) : undefined;
		}

		/**
		 * @ngdoc function
		 * @name convertToEditable
		 * @function
		 * @methodOf cloudDesktopDataLayoutSettingsService
		 * @description Converts the Settings from the UserSettings to the editable format. This is necessary to display it in the form.
		 * @param {Object} userSettings The User Settings data.
		 */
		function convertToEditable(userSettings) {
			if (userSettings) {
				getColorSchemes(true).then(function() {
					dataLayoutSettingsTypes.forEach(function (type) {
						if (userSettings[type]) {
							if(userSettings[type].ColorScheme === 4) {
								Object.assign(userSettings[type], userSettings[type].CustomScheme);
								convertToEditableIntern(userSettings[type]);

								if(userSettings[type].levelSettings) {
									angular.forEach(userSettings[type].levelSettings, function(level) {
										convertToEditableIntern(level);
									});
								}
							}
							else {
								let colorscheme = cachedSchemesItems[userSettings[type].ColorScheme]
								Object.assign(userSettings[type], _.cloneDeep(colorscheme));
							}
						}
					});
				});
			}
		}

		function convertToEditableIntern(dataLayoutSettings) {
			if (_.isUndefined(dataLayoutSettings) || !_.isObject(dataLayoutSettings)) {
				return;
			}
			// Converts the color property to meet the color control's requirements.
			dataLayoutSettingsColorProps.forEach(function (prop) {
				if (dataLayoutSettings[prop]) {
					convertColor(dataLayoutSettings, prop, new drawingUtils.RgbColor(255, 255, 255));
				}
			});
		}

		function convertColorFromEditable(owner, propName) {
			if (angular.isDefined(owner[propName])) {
				if(typeof owner[propName] === 'number') {
					owner[propName] = drawingUtils.intToRgbColor(owner[propName]);
				}
			} else {
				delete owner[propName];
			}
		}

		/**
		 * @ngdoc function
		 * @name hasDefault
		 * @function
		 * @methodOf cloudDesktopDataLayoutSettingsService
		 * @description Returns true if default settings exist for the setting object, otherwise false.
		 * @param {string} selectedMasterItemId The id of the selected master item.
		 * @return {bool} True, when default settings exist, otherwise false.
		 */
		function hasDefault(selectedMasterItemId) {
			return (selectedMasterItemId === getMasterItemId(userTypes.user) || selectedMasterItemId === getMasterItemId(userTypes.system));
		}

		/**
		 * @ngdoc function
		 * @name setDefault
		 * @function
		 * @methodOf cloudDesktopDataLayoutSettingsService
		 * @description Sets the default settings to the current master item.
		 * @param {Object} info The info object of the master detail dialog
		 * @param {Object} editableData The data object of the selected master item.
		 */
		function setDefault(info, editableData) {
			if (!info || !info.selectedMasterItem) {
				return;
			}

			if (info.selectedMasterItem.Id === getMasterItemId(userTypes.user)) {
				// set the system settings to the user or portal settings
				_.assign(editableData.items[settingsKey][userTypes.user], editableData.items[settingsKey][userTypes.system]);
			} else if (info.selectedMasterItem.Id === getMasterItemId(userTypes.portal)) {
				_.assign(editableData.items[settingsKey][userTypes.portal], editableData.items[settingsKey][userTypes.system]);
			} else if (info.selectedMasterItem.Id === getMasterItemId(userTypes.system)) {
				// get settings from backend
				getDefaultSettings().then(function (result) {
					_.assign(editableData.items[settingsKey][userTypes.system], result);
				});
			}

			if (info.dataChangeMember) {
				info.data[info.dataChangeMember] = true;
			}
		}

		function getColorSchemes(reload = false) {
			if (cachedSchemesItems && !reload) {
				return $q.when(cachedSchemesItems);
			} else {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'cloud/desktop/usersettings/loadcolorschemes'
				}).then(function (result) {
					angular.forEach(result.data, function(item) {
						convertToEditableIntern(item);
						angular.forEach(item.levelSettings, function(level) {
							convertToEditableIntern(level);
						});
					});
					cachedSchemesItems = result.data;
					return cachedSchemesItems;
				});
			}
		}

		function getDefaultSettings() {
			// todo: default Settings backend implementieren
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'cloud/desktop/usersettings/loaddefaultsetting',
				params: {settingsKey: settingsKey}
			}).then(function (result) {
				if (angular.isObject(result.data)) {
					convertToEditableIntern(result.data[settingsKey]);
					return result.data[settingsKey];
				}
			});
		}

		function convertColorForSaving(setting) {
			dataLayoutSettingsColorProps.forEach(function (prop) {
				if (angular.isDefined(setting[prop])) {
					convertColorFromEditable(setting, prop);
				}
			});
		}

		/**
		 * @ngdoc function
		 * @name convertToTransferable
		 * @function
		 * @methodOf cloudDesktopDataLayoutSettingsService
		 * @description Converts the settings from the UserSettings-object to the transportable format. This is necessary to save the data into the db.
		 * @param {Object} userSettings The User Settings data.
		 * @param {Boolean} removeUnchanged When true unchanged settings will be removed from object.
		 */
		function convertToTransferable(userSettings, removeUnchanged) {
			if (!userSettings) {
				return;
			}

			let dataLayoutSettings = userSettings;

			// delete unknown properties
			for (let property in dataLayoutSettings) {
				if (dataLayoutSettings.hasOwnProperty(property)) {
					if (!_.includes(dataLayoutSettingsTypes, property)) {
						delete dataLayoutSettings[property];
					}
				}
			}

			// delete unchanged items
			if (removeUnchanged) {
				_.forEach(dataLayoutSettingsTypes, function (type) {
					if (!dataLayoutSettings[type] || !dataLayoutSettings[type].__changed) {
						delete dataLayoutSettings[type];
					}
				});
			}

			// convert properties
			_.forEach(dataLayoutSettings, function (setting) {
				convertColorForSaving(setting);
				angular.forEach(setting.levelSettings, function(level) {
					convertColorForSaving(level);
				});
				if(setting.ColorScheme === 4) {
					for (const key of Object.keys(setting.CustomScheme)) {
						if (key in setting) {
							setting.CustomScheme[key] = setting[key];
						}
					}
				}
			});
		}

		/**
		 * @ngdoc function
		 * @name hasWritePermission
		 * @function
		 * @methodOf cloudDesktopDataLayoutSettingsService
		 * @description Returns a bool value which indicates whether the user has write permissions
		 * @param { Object } userType The type of the user
		 * @return {bool} True, when system user has write permissions
		 */
		function hasWritePermission(userType) {
			switch (userType) {
				case userTypes.user:
					return platformPermissionService.hasWrite('75ae78531ea54374b8cbbf8da5a4a2a8');
				case userTypes.system:
					return platformPermissionService.hasWrite('dfa8042363744c7bb9b886b441419df3');
				case userTypes.portal:
					return platformPermissionService.hasWrite('8eda9ac9d5b94b5b981a0609f1bf6878');
				default:
					return false;
			}
		}

		/**
		 * @ngdoc function
		 * @name getMasterItem
		 * @function
		 * @methodOf cloudDesktopDataLayoutSettingsService
		 * @description Returns an master item object for the settings dialog definition.
		 * @return {object} The master item object
		 */
		function getMasterItem(editableData, userType) {
			switch (userType) {
				case userTypes.user:
					return {
						Id: getMasterItemId(userType),
						name: $translate.instant('cloud.desktop.design.dataLayout.dataLayoutUser'),
						// data: editableData.items[settingsKey].user,
						data: _.get(editableData.items[settingsKey], 'user'),
						visible: hasWritePermission(userType),
						form: getFormData(userType, editableData.items[settingsKey].user, editableData)
					};
				case userTypes.system:
					return {
						Id: getMasterItemId(userType),
						name: $translate.instant('cloud.desktop.design.dataLayout.dataLayoutSystem'),
						data: _.get(editableData.items[settingsKey], 'system'),
						visible: hasWritePermission(userType),
						form: getFormData(userType, editableData.items[settingsKey].system, editableData)
					};
				case userTypes.portal:
					return {
						Id: getMasterItemId(userType, editableData),
						name: $translate.instant('cloud.desktop.design.dataLayout.dataLayoutPortal'),
						// data: editableData.items[settingsKey].portal,
						data: _.get(editableData.items[settingsKey], 'portal'),
						visible: hasWritePermission(userType),
						// disabled: !this.hasWritePermission(userType),
						form: getFormData(userType, editableData)
					};
				default:
					return undefined;
			}
		}

		function setGridData(gridId, data) {
			platformGridAPI.items.data(gridId, data);
		}

		function selectRowInGrid(gridId) {
			$timeout(function () {
				platformManualGridService.selectRowByIndex(gridId, 0);
			}, 10);
		}

		function setDisableToolbar(data) {
			let toReturn = true;
			if((_.isUndefined(data.useSettings) && data.ColorScheme === 4) || (data.useSettings && data.ColorScheme === 4)) {
				toReturn = false;
			}
			return toReturn;
		}

		/**
		 * @ngdoc function
		 * @name getFormData
		 * @function
		 * @methodOf cloudDesktopDataLayoutSettingsService
		 * @description Returns the config object for the form-generator
		 * @return {Object} The config object
		 */
		function getFormData(userType, data, editableData) {
			let formData;

			function handleSettingsOnCellChanged(e, gridData, c) {
				let level;

				if(gridData.hasOwnProperty('item')) {
					level = _.find(data.levelSettings, {'level': gridData.item.level});

					for (const key of Object.keys(level)) {
						if (key in gridData.item) {
							level[key] = gridData.item[key];
						}
					}

					setChanged(data);
				}
			}

			function getInitializer(gridId, gridType) {
				if (!platformGridAPI.grids.exist(gridId)) {
					let gridConfig = cloudDesktopImprovedHierarchicalService.getGridConfigDefaultSettings(gridId, gridType, data);

					platformGridAPI.grids.config(gridConfig);

					switch (gridId) {
						case gridIdDSettings:
							platformGridAPI.events.register(gridId, 'onCellChange', handleSettingsOnCellChanged);
							break;
						case gridIdSSettings:
							platformGridAPI.events.register(gridId, 'onCellChange', handleSettingsOnCellChanged);
							break;
					}

					return function () {
						onDestroyGrid(gridId);
					};
				}
			}

			function processreadonlyFields(scope, selectedItemPath, value, isUserSetting) {
				let _Boolean;
				let item = _.get(scope, selectedItemPath);
				let userSetting = _.get(item, 'data.useSettings');
				let colorValue = _.get(item, 'data.ColorScheme');
				const filterProps = ['useSettings', 'ColorScheme'];

				if(_.isUndefined(userSetting) || userSetting)  {
					_Boolean = colorValue === 4 ? false : true;
				} else {
					_Boolean = true;
				}

				if (item) {
					let props = Object.keys(item.data);
					props = props.filter(item => !filterProps.includes(item));

					props.forEach(function (prop) {
						platformRuntimeDataService.readonly(item, [{
							field: 'data.' + prop,
							readonly: _Boolean
						}]);
					});

					if(!_.isUndefined(userSetting)) {
						platformRuntimeDataService.readonly(item, [{
							field: 'data.ColorScheme',
							readonly: userSetting ? false : true
						}]);
					}

					//set editable for grid. ONly in custom-status is it editable
					platformGridAPI.grids.setOptions(gridIdDSettings, {editable: !_Boolean});
					platformGridAPI.grids.setOptions(gridIdSSettings, {editable: !_Boolean});
				}
			}

			function prepareGrid(gridId, scope) {
				scope.$on('$destroy', function () {
					onDestroyGrid(gridId);
				});
			}

			function onDestroyGrid(gridId) {
				if (platformGridAPI.grids.exist(gridId)) {
					switch (gridId) {
						case gridIdDSettings:
							platformGridAPI.events.register(gridId, 'onCellChange', handleSettingsOnCellChanged);
							break;
						case gridIdSSettings:
							platformGridAPI.events.unregister(gridIdSSettings, 'onCellChange', handleSettingsOnCellChanged);
							break;
					}

					platformGridAPI.grids.unregister(gridId);
				}
			}

			switch (userType) {
				case userTypes.system:
				case userTypes.portal:
				case userTypes.user:
					formData = {
						fid: 'cloud.desktop.gls.form',
						version: '1.0.0',
						showGrouping: true,
						initializers: [
							function (scope, selectedItemPath) {
								if (userType === userTypes.user) {
									return scope.$watch(selectedItemPath + '.data.useSettings', function (newValue) {
										processreadonlyFields(scope, selectedItemPath, newValue, true);
									});
								}
							},
							function (scope, selectedItemPath) {
								return scope.$watch(selectedItemPath + '.data.ColorScheme', function (newValue) {
									processreadonlyFields(scope, selectedItemPath, newValue, false);
								});
							},
							function () {
								return getInitializer(gridIdDSettings, 'gridIdDSettings');

							},
							function () {
								return getInitializer(gridIdSSettings, 'gridIdSSettings');
							}],
						groups: cloudDesktopImprovedHierarchicalService.getFormGroups(),
						rows: [{
							gid: 'readonly',
							rid: 'ro-color',
							label$tr$: 'cloud.desktop.design.dataLayout.roBackgroundColor',
							type: 'color',
							visible: true,
							sortOrder: 1,
							model: 'data.roBackgroundColor'
						}, {
							gid: 'readonly',
							rid: 'ro-symbolcolor',
							label$tr$: 'cloud.desktop.design.dataLayout.roSymbolColor',
							type: 'color',
							visible: true,
							sortOrder: 2,
							model: 'data.roSymbolColor'
						}, {
							gid: 'formular',
							rid: 'displayReadOnlyForm',
							label$tr$: 'cloud.desktop.design.dataLayout.displayReadOnlyFields',
							type: 'select',
							visible: false,
							sortOrder: 10,
							model: 'data.formDisplayReadOnly',
							options: {
								items: [
									{id: 0, description: $translate.instant('cloud.desktop.design.dataLayout.roShowNothing')},
									{id: 1, description: $translate.instant('cloud.desktop.design.dataLayout.roShowColor')},
									{id: 2, description: $translate.instant('cloud.desktop.design.dataLayout.roShowSymbol')},
									{id: 3, description: $translate.instant('cloud.desktop.design.dataLayout.roShowColorSymbol')}
								],
								valueMember: 'id',
								displayMember: 'description',
								modelIsObject: false
							}
						}, {
							gid: 'readonly',
							rid: 'displayReadOnlyGrid',
							label$tr$: 'cloud.desktop.design.dataLayout.displayReadOnlyFields',
							type: 'select',
							visible: true,
							sortOrder: 3,
							model: 'data.gridDisplayReadOnly',
							options: {
								items: [
									{id: 0, description: $translate.instant('cloud.desktop.design.dataLayout.roShowNothing')},
									{id: 1, description: $translate.instant('cloud.desktop.design.dataLayout.roShowColor')},
									{id: 2, description: $translate.instant('cloud.desktop.design.dataLayout.roShowSymbol')},
									{id: 3, description: $translate.instant('cloud.desktop.design.dataLayout.roShowColorSymbol')},
									{id: 4, description: $translate.instant('cloud.desktop.design.dataLayout.roShowStripes')}
								],
								valueMember: 'id',
								displayMember: 'description',
								modelIsObject: false
							}
						},
							{
								gid: 'dataselection',
								rid: 'selection-border-color',
								label$tr$: 'cloud.desktop.design.dataLayout.borderColor',
								type: 'color',
								visible: true,
								sortOrder: 10,
								model: 'data.selectionBorderColor'
							}, {
								gid: 'dataselection',
								rid: 'selection-background-color',
								label$tr$: 'cloud.desktop.design.dataLayout.backgroundColor',
								type: 'color',
								visible: true,
								sortOrder: 20,
								model: 'data.selectionBackgroundColor'
							},
							{
								gid: 'theme',
								rid: 'co-theme',
								label$tr$: 'cloud.desktop.design.dataLayout.colorScheme',
								type: 'select',
								visible: true,
								sortOrder: 10,
								model: 'data.ColorScheme',
								options: {
									items: cloudDesktopImprovedHierarchicalService.getColorSchemeItems(),
									valueMember: 'id',
									displayMember: 'description',
									modelIsObject: false
								},
								change: function(entity, modelName, item) {
									//get schemes items
									getColorSchemes().then(function (result) {
										let schemeId = _.get(entity, modelName);
										let changedItems = result[schemeId];

										if(schemeId === 4) {
											changedItems = entity.data.CustomScheme;
											convertToEditableIntern(changedItems);

											if(changedItems.levelSettings) {
												angular.forEach(changedItems.levelSettings, function(level) {
													convertToEditableIntern(level);
												});
											}
										}

										_.assign(entity.data, changedItems);

										let defaultSetting = cloudDesktopImprovedHierarchicalService.getGridDataDefaultSettings('gridIdDSettings', changedItems);
										setGridData(gridIdDSettings, defaultSetting);

										let specificSettings = cloudDesktopImprovedHierarchicalService.getGridDataDefaultSettings('gridIdSSettings', changedItems);
										setGridData(gridIdSSettings, specificSettings);
									});
								}
							},
							{
								gid: 'hierarchical',
								rid: 'defaultSettings',
								type: 'directive',
								directive: 'platform-grouped-accordion',
								model: 'data.grids.dSettings',
								sortOrder: 1,
								options: {
									label$tr$: 'cloud.desktop.design.dataLayout.hierarchicalDefaultTitle',
									description$tr$: 'cloud.desktop.design.dataLayout.hierarchicalDefaultDesc',
									type: 'directive',
									directive: 'platform-grid-form-control',
									options: {
										gridConfig: { id: gridIdDSettings },
										height: 'auto'
									}
								}
							},
							{
								gid: 'hierarchical',
								rid: 'defaultSettings2',
								type: 'directive',
								directive: 'platform-grouped-accordion',
								model: 'data.grids.dSettings2',
								sortOrder: 1,
								options: {
									label$tr$: 'cloud.desktop.design.dataLayout.hierarchicalSpecificTitle',
									description$tr$: 'cloud.desktop.design.dataLayout.hierarchicalSpecificDesc',
									type: 'directive',
									directive: 'platform-grid-form-control',
									options: {
										tools: {
											showImages: true,
											showTitles: true,
											cssClass: 'tools ',
											items: [
												{
													id: '1',
													sort: 10,
													caption: 'cloud.common.toolbarInsert',
													iconClass: 'tlb-icons ico-rec-new',
													type: 'item',
													disabled: function () {
														return setDisableToolbar(data);
													},
													fn: function () {
														cloudDesktopImprovedHierarchicalService.addNewSpecificLevelInGrid(gridIdSSettings, data);
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
														return setDisableToolbar(data);
													},
													fn: function () {
														cloudDesktopImprovedHierarchicalService.removeNewSpecificLevelInGrid(gridIdSSettings, data);
														setChanged(data);
													}
												}
											]
										},
										gridConfig: { id: gridIdSSettings },
										height: 'auto'
									}
								}
							}]
					};

					formData.prepareData = function (item, scope) {
						// this will be executed once, when changing to this masterItem first
						item.data.grids = {
							dSettings: {
								state: gridIdDSettings
							},
							dSettings2: {
								state: gridIdSSettings
							}
						};

						prepareGrid(gridIdDSettings, scope);
						prepareGrid(gridIdSSettings, scope);
					};
			}

			if (userType === userTypes.user) {
				formData = cloudDesktopImprovedHierarchicalService.addUserSettingToFormData(formData);
			}

			return formData;
		}

		/**
		 * @ngdoc function
		 * @name getLastSettingsUpdate
		 * @function
		 * @methodOf cloudDesktopDataLayoutSettingsService
		 * @description Gets the date of the last settings change
		 * @returns { string } A string with the date of the last css update
		 */
		function getLastSettingsUpdate() {
			return lastSettingsChange;
		}

		/**
		 * @ngdoc function
		 * @name isSettingsChanged
		 * @function
		 * @methodOf cloudDesktopDataLayoutSettingsService
		 * @description Indicate whether the settings are changed.
		 * @returns { bool } True, if settings are changed, otherwise false.
		 */
		function isSettingsChanged(data) {
			var changed = false;
			var dataLayoutSettings = data[settingsKey];

			if (!_.isUndefined(dataLayoutSettings)) {
				_.forEach(dataLayoutSettingsTypes, function (type) {
					if (dataLayoutSettings[type] && dataLayoutSettings[type].__changed) {
						changed = true;
						return true;
					}
				});
			}

			return changed;
		}

		/**
		 * @ngdoc function
		 * @name onSaved
		 * @function
		 * @methodOf cloudDesktopDataLayoutSettingsService
		 * @description This function will be processed after the settings dialog has saved his settings.
		 * @param { Object } data The data object of the selected master item.
		 */
		function onSaved(data) {
			if (isSettingsChanged(data)) {
				cachedSettings = undefined;
				lastSettingsChange = Date.now();
				cachedSchemesItems = undefined;
			}
		}

		/**
		 * @ngdoc function
		 * @name getSettings
		 * @function
		 * @methodOf cloudDesktopDataLayoutSettingsService
		 * @description Loads the available settings from the server.
		 * @returns {Promise<Object>} A promise that is resolved when the data is loaded.
		 */
		function getSettings() {
			if (cachedSettings) {
				return $q.when(cachedSettings);
			} else {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'cloud/desktop/usersettings/loadmergedsetting',
					params: {settingsKey: settingsKey}
				}).then(function (result) {
					if (angular.isObject(result.data)) {
						var loadedData = result.data;
						convertToEditableIntern(loadedData);
						cachedSettings = loadedData;
						return loadedData;
					}

					return undefined;
				});
			}
		}

		return {
			getMasterItemId: getMasterItemId,
			convertToEditable: convertToEditable,
			hasDefault: hasDefault,
			setDefault: setDefault,
			convertToTransferable: convertToTransferable,
			hasWritePermission: hasWritePermission,
			getMasterItem: getMasterItem,
			getLastSettingsUpdate: getLastSettingsUpdate,
			onSaved: onSaved,
			getSettings: getSettings,
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
	 * @name cloudDesktopDataLayoutSettingsService
	 * @function
	 * @requires $http, $q, _, PlatformMessenger
	 *
	 * @description Manages object display settings.
	 */
	angular.module('cloud.desktop').factory('cloudDesktopDataLayoutSettingsService', cloudDesktopDataLayoutSettingsService);
})();
