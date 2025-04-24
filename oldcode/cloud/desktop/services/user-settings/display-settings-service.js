/**
 * Created by alisch on 15.02.2017.
 */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name cloudDesktopDisplaySettingsService
	 * @function
	 * @requires $http, $q, _, PlatformMessenger
	 *
	 * @description Manages object display settings.
	 */
	angular.module('cloud.desktop').factory('cloudDesktopDisplaySettingsService', ['$http', '_', 'basicsCommonDrawingUtilitiesService', 'cloudDesktopSettingsState', 'platformRuntimeDataService', 'platformPermissionService', '$translate', 'cloudDesktopSettingsUserTypes',
		function ($http, _, drawingUtils, dataStates, platformRuntimeDataService, platformPermissionService, $translate, userTypes) {
			var service = {};
			var cachedCssPromise;
			var lastCssUpdate;
			var settingsKey = 'displaySettings'; // the property name of display settings within the user settings object
			var displaySettingsTypes = [userTypes.system, userTypes.user, userTypes.portal]; // which types of user this settings supports
			var accessRightDescriptors = [
				'7950b1e07e454e608aeb4fdbac4fd993',
				'68b3616561394e7396ef54fa07ab5929',
				'83bb311bd39b4b87aa2f7585c8704ad6',
				'f08983fb2fd94f1387d4f44a9d29cd62'];
			var displaySettingsColorProps = ['mainColor', 'headerTextColor2', 'textColor', 'iconColor', 'selectedColor', 'mouseHoverColor', 'loadingBarColor1', 'loadingBarColor2','iconColorSelected','iconColorHovered'];
			const fileFilter = new RegExp('/bmp|gif|jpg|png|webp|jpeg|x-icon|icon/g'); //allowed extension for fileupload

			function convertColor(owner, propName, defaultColor) {
				if (owner[propName]) {
					owner[propName] = drawingUtils.rgbColorToInt(owner[propName]);
				} else {
					owner[propName] = drawingUtils.rgbColorToInt(defaultColor);
				}
			}

			/**
			 * @ngdoc property
			 * @name .#settingsKey
			 * @propertyOf cloudDesktopDisplaySettingsService
			 * @returns { string } The id of the settings object
			 */
			service.settingsKey = settingsKey;

			/**
			 * @ngdoc function
			 * @name getMasterItemId
			 * @function
			 * @methodOf cloudDesktopDisplaySettingsService
			 * @description Returns the id of the master item object of the specified user typ.
			 * @param { string } userType The type of the user
			 * @return { string } The id of the master item object
			 */
			service.getMasterItemId = function (userType) {
				return _.includes(displaySettingsTypes, userType) ? settingsKey + _.capitalize(userType) : undefined;
			};

			/**
			 * @ngdoc function
			 * @name convertToEditable
			 * @function
			 * @methodOf cloudDesktopDisplaySettingsService
			 * @description Converts the DisplaySettings from the UserSettings to the editable format. This is necessary to display it in the form.
			 * @param {Object} userSettings The User Settings data.
			 */
			service.convertToEditable = function (userSettings) {

				if (userSettings) {
					displaySettingsTypes.forEach(function (type) {
						if (userSettings[type]) {
							convertToEditable(userSettings[type]);
						}
					});
				}
			};

			function convertToEditable(displaySettings) {
				if (_.isUndefined(displaySettings) || !_.isObject(displaySettings)) {
					return;
				}
				// Converts the color property to meet the color control's requirements.
				displaySettingsColorProps.forEach(function (prop) {
					if (displaySettings[prop]) {
						convertColor(displaySettings, prop, new drawingUtils.RgbColor(255, 255, 255));
					}
				});
			}

			function convertColorFromEditable(owner, propName) {
				if (angular.isDefined(owner[propName])) {
					owner[propName] = drawingUtils.intToRgbColor(owner[propName]);
				} else {
					delete owner[propName];
				}
			}

			/**
			 * @ngdoc function
			 * @name hasDefault
			 * @function
			 * @methodOf cloudDesktopDisplaySettingsService
			 * @description Returns true if default settings exist for the setting object, otherwise false.
			 * @param {string} selectedMasterItemId The id of the selected master item.
			 * @return {bool} True, when default settings exist, otherwise false.
			 */
			service.hasDefault = function (selectedMasterItemId) {
				return (selectedMasterItemId === service.getMasterItemId(userTypes.user) || selectedMasterItemId === service.getMasterItemId(userTypes.system));
			};

			/**
			 * @ngdoc function
			 * @name setDefault
			 * @function
			 * @methodOf cloudDesktopDisplaySettingsService
			 * @description Sets the default settings to the current master item.
			 * @param {Object} info The info object of the master detail dialog
			 * @param {Object} editableData The data object of the selected master item.
			 */
			service.setDefault = function (info, editableData) {
				if (!info || !info.selectedMasterItem) {
					return;
				}

				if (info.selectedMasterItem.Id === service.getMasterItemId(userTypes.user)) {
					// set the system settings to the user or portal settings
					_.assign(editableData.items[settingsKey][userTypes.user], editableData.items[settingsKey][userTypes.system]);
				} else if (info.selectedMasterItem.Id === service.getMasterItemId(userTypes.portal)) {
					_.assign(editableData.items[settingsKey][userTypes.portal], editableData.items[settingsKey][userTypes.system]);
				} else if (info.selectedMasterItem.Id === service.getMasterItemId(userTypes.system)) {
					// get settings from backend
					getDefaultSettings().then(function (result) {
						_.assign(editableData.items[settingsKey][userTypes.system], result);
					});
				}

				if (info.dataChangeMember) {
					info.data[info.dataChangeMember] = true;
				}
			};

			function getDefaultSettings() {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'cloud/desktop/usersettings/loaddefaultsetting',
					params: {settingsKey: settingsKey}
				}).then(function (result) {
					if (angular.isObject(result.data)) {
						convertToEditable(result.data[settingsKey]);
						return result.data[settingsKey];
					}
				});
			}

			/**
			 * @ngdoc function
			 * @name convertToTransferable
			 * @function
			 * @methodOf cloudDesktopDisplaySettingsService
			 * @description Converts the DisplaySettings from the UserSettings-object to the transportable format. This is necessary to save the data into the db.
			 * @param {Object} userSettings The User Settings data.
			 * @param {Boolean} removeUnchanged When true unchanged settings will be removed from object.
			 */
			service.convertToTransferable = function (userSettings, removeUnchanged) {
				if (!userSettings) {
					return;
				}

				var displaySettings = userSettings;

				// delete unknown properties
				for (var property in displaySettings) {
					if (displaySettings.hasOwnProperty(property)) {

						if(property && displaySettings[property].iconColorSelected === null){
							displaySettings[property].iconColorSelected = displaySettings[property].iconColor;
						}

						if(property && displaySettings[property].iconColorHovered === null){
							displaySettings[property].iconColorHovered = displaySettings[property].iconColor;
						}

						if (!_.includes(displaySettingsTypes, property)) {
							delete displaySettings[property];
						}
					}
				}

				// delete unchanged items
				if (removeUnchanged) {
					_.forEach(displaySettingsTypes, function (type) {
						if (!displaySettings[type] || !displaySettings[type].__changed) {
							delete displaySettings[type];
						}
					});
				}

				// convert properties
				_.forEach(displaySettings, function (setting) {
					displaySettingsColorProps.forEach(function (prop) {
						if (angular.isDefined(setting[prop])) {
							convertColorFromEditable(setting, prop);
						}
					});
				});
			};

			/**
			 * @ngdoc function
			 * @name hasWritePermission
			 * @function
			 * @methodOf cloudDesktopDisplaySettingsService
			 * @description Returns a bool value which indicates whether the user has write permissions
			 * @param { Object } userType The type of the user
			 * @return {bool} True, when system user has write permissions
			 */
			service.hasWritePermission = function (userType) {
				switch (userType) {
					case userTypes.user:
						return platformPermissionService.hasWrite('68b3616561394e7396ef54fa07ab5929') || platformPermissionService.hasWrite('7950b1e07e454e608aeb4fdbac4fd993');
					case userTypes.system:
						return platformPermissionService.hasWrite('83bb311bd39b4b87aa2f7585c8704ad6');
					case userTypes.portal:
						return platformPermissionService.hasWrite('f08983fb2fd94f1387d4f44a9d29cd62');
					default:
						return false;
				}
			};

			/**
			 * @ngdoc function
			 * @name getMasterItem
			 * @function
			 * @methodOf cloudDesktopDisplaySettingsService
			 * @description Returns an master item object for the settings dialog definition.
			 * @return {object} The master item object
			 */
			service.getMasterItem = function (editableData, userType) {
				switch (userType) {
					case userTypes.user:
						return {
							Id: service.getMasterItemId(userType),
							name: $translate.instant('cloud.desktop.design.brandingUser'),
							data: editableData.items[settingsKey].user,
							visible: this.hasWritePermission(userType),
							form: getFormData(userType)
						};
					case userTypes.system:
						return {
							Id: service.getMasterItemId(userType),
							name: $translate.instant('cloud.desktop.design.brandingSystem'),
							data: editableData.items[settingsKey].system,
							visible: this.hasWritePermission(userType),
							form: getFormData(userType)
						};
					case userTypes.portal:
						return {
							Id: service.getMasterItemId(userType),
							name: $translate.instant('cloud.desktop.design.brandingPortal'),
							data: editableData.items[settingsKey].portal,
							visible: this.hasWritePermission(userType),
							// disabled: !this.hasWritePermission(userType),
							form: getFormData(userType)
						};
					default:
						return undefined;
				}
			};

			/**
			 * @ngdoc function
			 * @name getFormData
			 * @function
			 * @methodOf cloudDesktopDisplaySettingsService
			 * @description Returns the config object for the form-generator
			 * @return {Object} The config object
			 */
			function getFormData(userType) {
				switch (userType) {
					case userTypes.user:
						return {
							fid: 'cloud.desktop.uds.form',
							version: '1.0.0',
							showGrouping: true,
							initializers: [
								function (scope, selectedItemPath) {
									return scope.$watch(selectedItemPath + '.data.useSettings', function (newValue) {
										var item = _.get(scope, selectedItemPath);

										if (item) {
											var props = Object.keys(item.data);
											props.forEach(function (prop) {
												if (prop !== 'useSettings') {
													platformRuntimeDataService.readonly(item, [{
														field: 'data.' + prop,
														readonly: !newValue
													}]);
												}
											});
										}
									});
								}],
							groups: [{
								gid: 'tool',
								header$tr$: '',
								isOpen: true,
								isVisible: true,
								sortOrder: 1
							}, {
								gid: 'config',
								header$tr$: 'cloud.desktop.design.config',
								isOpen: true,
								isVisible: true,
								sortOrder: 2
							}, {
								gid: 'personal',
								header$tr$: 'cloud.desktop.design.personal',
								isOpen: true,
								isVisible: true,
								sortOrder: 3
							}],
							rows: [{
								gid: 'tool',
								rid: 'useSettings',
								label$tr$: 'cloud.desktop.design.useSettings',
								type: 'boolean',
								visible: true,
								sortOrder: 1,
								model: 'data.useSettings'
							}, {
								gid: 'config',
								rid: 'mainColor',
								label$tr$: 'cloud.desktop.design.mainColor',
								type: 'color',
								visible: true,
								sortOrder: 1,
								model: 'data.mainColor',
								options: {
									infoText: $translate.instant('cloud.desktop.design.mainColorTooltip')
								}
							}, {
								gid: 'config',
								rid: 'selectedColor',
								label$tr$: 'cloud.desktop.design.selectedColor',
								type: 'color',
								visible: true,
								sortOrder: 2,
								model: 'data.selectedColor',
								options: {
									infoText: $translate.instant('cloud.desktop.design.selectedColorTooltip')
								}
							}, {
								gid: 'config',
								rid: 'mouseHoverColor',
								label$tr$: 'cloud.desktop.design.mouseHoverColor',
								type: 'color',
								visible: true,
								sortOrder: 3,
								model: 'data.mouseHoverColor',
								options: {
									infoText: $translate.instant('cloud.desktop.design.mouseHoverColorTooltip')
								}
							}, {
								gid: 'config',
								rid: 'iconColor',
								label$tr$: 'cloud.desktop.design.iconColor',
								type: 'color',
								visible: true,
								sortOrder: 4,
								model: 'data.iconColor',
								options: {
									infoText: $translate.instant('cloud.desktop.design.iconColorTooltip')
								}
							}, {
								gid: 'config',
								rid: 'iconColorSelected',
								label$tr$: 'cloud.desktop.design.iconColorSelected',
								type: 'color',
								visible: true,
								sortOrder: 5,
								model: 'data.iconColorSelected',
								options: {
									infoText: $translate.instant('cloud.desktop.design.iconColorSelectedTooltip')
								}
							}, {
								gid: 'config',
								rid: 'iconColorHovered',
								label$tr$: 'cloud.desktop.design.iconColorHovered',
								type: 'color',
								visible: true,
								sortOrder: 6,
								model: 'data.iconColorHovered',
								options: {
									infoText: $translate.instant('cloud.desktop.design.iconColorHoveredTooltip')
								}
							}, {
								gid: 'config',
								rid: 'headerTextColor2',
								label$tr$: 'cloud.desktop.design.headerTextColor',
								type: 'color',
								visible: true,
								sortOrder: 7,
								model: 'data.headerTextColor2',
								options: {
									infoText: $translate.instant('cloud.desktop.design.headerTextColorTooltip')
								}
							}, {
								gid: 'config',
								rid: 'textColor',
								label$tr$: 'cloud.desktop.design.textColor',
								type: 'color',
								visible: true,
								sortOrder: 8,
								model: 'data.textColor',
								options: {
									infoText: $translate.instant('cloud.desktop.design.textColorTooltip')
								}
							}, {
								gid: 'config',
								rid: 'loadingBarColor1',
								label$tr$: 'cloud.desktop.design.loadingBarColor1',
								type: 'color',
								visible: true,
								sortOrder: 9,
								model: 'data.loadingBarColor1',
								options: {
									infoText: $translate.instant('cloud.desktop.design.loadingBarColor1Tooltip')
								}
							}, {
								gid: 'config',
								rid: 'loadingBarColor2',
								label$tr$: 'cloud.desktop.design.loadingBarColor2',
								type: 'color',
								visible: true,
								sortOrder: 10,
								model: 'data.loadingBarColor2',
								options: {
									infoText: $translate.instant('cloud.desktop.design.loadingBarColor2Tooltip')
								}
							}, {
								gid: 'config',
								rid: 'logo1',
								label$tr$: 'cloud.desktop.design.logo1',
								visible: true,
								sortOrder: 11,
								model: 'data.logo1',
								type: 'fileselect',
								'options': {
									fileFilter: fileFilter,
									maxSize: '2MB',
									retrieveDataUrl: true
								}
							}, {
								gid: 'config',
								rid: 'logo2',
								label$tr$: 'cloud.desktop.design.logo2',
								visible: true,
								sortOrder: 12,
								model: 'data.logo2',
								type: 'fileselect',
								'options': {
									fileFilter: fileFilter,
									maxSize: '2MB',
									retrieveDataUrl: true
								}
							}, {
								gid: 'personal',
								rid: 'backgroundImage',
								label$tr$: 'cloud.desktop.design.backgroundImage',
								model: 'data.backgroundImage',
								sortOrder: 1,
								type: 'fileselect',
								'options': {
										fileFilter: fileFilter,
									maxSize: '2MB',
									retrieveDataUrl: true
								}
							}, {
								gid: 'personal',
								rid: 'sidebarPos',
								label$tr$: 'cloud.desktop.design.sidebarPos',
								type: 'select',
								visible: true,
								sortOrder: 2,
								model: 'data.sidebarPos',
								options: {
									items: [
										{id: 0, description: $translate.instant('cloud.desktop.design.left')},
										{id: 1, description: $translate.instant('cloud.desktop.design.right')}
									],
									valueMember: 'id',
									displayMember: 'description',
									modelIsObject: false
								}
							}]
						};

					case userTypes.system:
					case userTypes.portal:
						return {
							fid: 'cloud.desktop.uds.form2',
							version: '1.0.0',
							showGrouping: true,
							groups: [{
								gid: 'config',
								header$tr$: 'cloud.desktop.design.config',
								isOpen: true,
								isVisible: true,
								sortOrder: 2
							}, {
								gid: 'personal',
								header$tr$: 'cloud.desktop.design.personal',
								isOpen: true,
								isVisible: true,
								sortOrder: 3
							}],
							rows: [{
								gid: 'config',
								rid: 'mainColor',
								label$tr$: 'cloud.desktop.design.mainColor',
								type: 'color',
								visible: true,
								sortOrder: 1,
								model: 'data.mainColor',
								options: {
									infoText: $translate.instant('cloud.desktop.design.mainColorTooltip')
								}
							}, {
								gid: 'config',
								rid: 'headerTextColor2',
								label$tr$: 'cloud.desktop.design.headerTextColor',
								type: 'color',
								visible: true,
								sortOrder: 7,
								model: 'data.headerTextColor2',
								options: {
									infoText: $translate.instant('cloud.desktop.design.headerTextColorTooltip')
								}
							}, {
								gid: 'config',
								rid: 'textColor',
								label$tr$: 'cloud.desktop.design.textColor',
								type: 'color',
								visible: true,
								sortOrder: 8,
								model: 'data.textColor',
								options: {
									infoText: $translate.instant('cloud.desktop.design.textColorTooltip')
								}
							}, {
								gid: 'config',
								rid: 'iconColor',
								label$tr$: 'cloud.desktop.design.iconColor',
								type: 'color',
								visible: true,
								sortOrder: 4,
								model: 'data.iconColor',
								options: {
									infoText: $translate.instant('cloud.desktop.design.iconColorTooltip')
								}
							}, {
								gid: 'config',
								rid: 'selectedColor',
								label$tr$: 'cloud.desktop.design.selectedColor',
								type: 'color',
								visible: true,
								sortOrder: 2,
								model: 'data.selectedColor',
								options: {
									infoText: $translate.instant('cloud.desktop.design.selectedColorTooltip')
								}
							}, {
								gid: 'config',
								rid: 'mouseHoverColor',
								label$tr$: 'cloud.desktop.design.mouseHoverColor',
								type: 'color',
								visible: true,
								sortOrder: 3,
								model: 'data.mouseHoverColor',
								options: {
									infoText: $translate.instant('cloud.desktop.design.mouseHoverColorTooltip')
								}
							}, {
								gid: 'config',
								rid: 'loadingBarColor1',
								label$tr$: 'cloud.desktop.design.loadingBarColor1',
								type: 'color',
								visible: true,
								sortOrder: 9,
								model: 'data.loadingBarColor1',
								options: {
									infoText: $translate.instant('cloud.desktop.design.loadingBarColor1Tooltip')
								}
							}, {
								gid: 'config',
								rid: 'loadingBarColor2',
								label$tr$: 'cloud.desktop.design.loadingBarColor2',
								type: 'color',
								visible: true,
								sortOrder: 10,
								model: 'data.loadingBarColor2',
								options: {
									infoText: $translate.instant('cloud.desktop.design.loadingBarColor2Tooltip')
								}
							}, {
								gid: 'config',
								rid: 'iconColorSelected',
								label$tr$: 'cloud.desktop.design.iconColorSelected',
								type: 'color',
								visible: true,
								sortOrder: 5,
								model: 'data.iconColorSelected',
								options: {
									infoText: $translate.instant('cloud.desktop.design.iconColorSelectedTooltip')
								}
							}, {
								gid: 'config',
								rid: 'iconColorHovered',
								label$tr$: 'cloud.desktop.design.iconColorHovered',
								type: 'color',
								visible: true,
								sortOrder: 6,
								model: 'data.iconColorHovered',
								options: {
									infoText: $translate.instant('cloud.desktop.design.iconColorHoveredTooltip')
								}
							}, {
								gid: 'config',
								rid: 'logo1',
								label$tr$: 'cloud.desktop.design.logo1',
								visible: true,
								sortOrder: 13,
								model: 'data.logo1',
								type: 'fileselect',
								'options': {
									fileFilter: fileFilter,
									maxSize: '1MB',
									retrieveDataUrl: true
								}
							}, {
								gid: 'config',
								rid: 'logo2',
								label$tr$: 'cloud.desktop.design.logo2',
								visible: true,
								sortOrder: 14,
								model: 'data.logo2',
								type: 'fileselect',
								'options': {
									fileFilter: fileFilter,
									maxSize: '1MB',
									retrieveDataUrl: true
								}
							}, {
								gid: 'config',
								rid: 'logo3',
								label$tr$: 'cloud.desktop.design.logo3',
								visible: true,
								sortOrder: 15,
								model: 'data.loginLogo',
								type: 'fileselect',
								'options': {
									fileFilter: fileFilter,
									maxSize: '1MB',
									retrieveDataUrl: true
								}
							}, {
								gid: 'personal',
								rid: 'backgroundImage',
								label$tr$: 'cloud.desktop.design.backgroundImage',
								model: 'data.backgroundImage',
								sortOrder: 1,
								type: 'fileselect',
								'options': {
									fileFilter: fileFilter,
									maxSize: '2MB',
									retrieveDataUrl: true
								}
							}, {
								gid: 'personal',
								rid: 'sidebarPos',
								label$tr$: 'cloud.desktop.design.sidebarPos',
								type: 'select',
								visible: true,
								sortOrder: 2,
								model: 'data.sidebarPos',
								options: {
									items: [
										{id: 0, description: $translate.instant('cloud.desktop.design.left')},
										{id: 1, description: $translate.instant('cloud.desktop.design.right')}
									],
									valueMember: 'id',
									displayMember: 'description',
									modelIsObject: false
								}
							}]
						};

					default:
						return undefined;
				}
			}

			/**
			 * @ngdoc function
			 * @name getCss
			 * @function
			 * @methodOf cloudDesktopDisplaySettingsService
			 * @description Saves user display settings.
			 * @returns {Promise<Boolean>} A promise for value that indicates whether the operation was successful.
			 */
			service.getCss = function () {
				if (cachedCssPromise) {
					return cachedCssPromise;
				} else {
					cachedCssPromise = $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'cloud/desktop/usersettings/getcss',
						params: {settingsKeys: [settingsKey]}
					}).then(function (response) {
						return response.data;
					});

					return cachedCssPromise;
				}
			};

			/**
			 * @ngdoc function
			 * @name getLastSettingsUpdate
			 * @function
			 * @methodOf cloudDesktopDisplaySettingsService
			 * @description Gets the date of the last css update
			 * @returns { string } A string with the date of the last css update
			 */
			service.getLastSettingsUpdate = function () {
				return lastCssUpdate;
			};

			/**
			 * @ngdoc function
			 * @name isSettingsChanged
			 * @function
			 * @methodOf cloudDesktopDisplaySettingsService
			 * @description Indicate whether the settings are changed.
			 * @returns { bool } True, if settings are changed, otherwise false.
			 */
			function isSettingsChanged(data) {
				var changed = false;
				var displaySettings = data[settingsKey];

				if (!_.isUndefined(displaySettings)) {
					_.forEach(displaySettingsTypes, function (type) {
						if (displaySettings[type] && displaySettings[type].__changed) {
							changed = true;
						}
					});
				}

				return changed;
			}

			/**
			 * @ngdoc function
			 * @name onSaved
			 * @function
			 * @methodOf cloudDesktopDisplaySettingsService
			 * @description This function will be processed after the settings dialog has saved his settings.
			 * @param { Object } data The data object of the selected master item.
			 */
			service.onSaved = function (data) {
				if (isSettingsChanged(data)) {
					cachedCssPromise = undefined;
					lastCssUpdate = Date.now();
				}
			};

			platformPermissionService.loadPermissions(accessRightDescriptors);

			return service;
		}]);
})();
