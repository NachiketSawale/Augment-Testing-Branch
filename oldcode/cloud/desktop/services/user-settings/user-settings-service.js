/**
 * Created by alisch on 24.01.2017.
 */
(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name cloudDesktopUserSettingsService
	 * @function
	 * @requires $http, $q, _, basicsCommonDrawingUtilitiesService, cloudDesktopDisplaySettingsService, cloudDesktopSettingsState, cloudDesktopLanguageSettingsService, $translate, platformContextService,
	 *
	 * @description Manages the user settings.
	 */
	angular.module('cloud.desktop').factory('cloudDesktopUserSettingsService', ['$http', '$q', '_', 'basicsCommonDrawingUtilitiesService', 'cloudDesktopDisplaySettingsService', 'cloudDesktopSettingsState', 'cloudDesktopSettingsUserTypes', 'cloudDesktopLanguageSettingsService', '$translate', 'platformContextService', 'cloudDesktopDesktopLayoutSettingsService', 'cloudDesktopQuickstartSettingsService', 'cloudDesktopDataLayoutSettingsService', 'cloudDesktopAlertMessagesSettingsService', 'platformWysiwygEditorSettingsService',
		function ($http, $q, _, drawingUtils, udsService, dataStates, userTypes, languageService, $translate, platformContextService, dlsService, quickstartService, dataLayoutSettingsService, alertMessagesService, wysiwygEditorSettingsService) {
			const service = {
				getDlgOptions: getDlgOptions,
				// loadDataByKey: loadDataByKey,
				loadData: loadData,
				saveData: saveData,
				/**
				 * @ngdoc function
				 * @name saveSubServiceSettings
				 * @function
				 * @methodOf cloudDesktopUserSettingsService
				 * @description Save the settings of a subservice
				 * @param { object } settingsData The settings object which has to been saved
				 * @param { string } settingsKey The key of the settings data, e.g. "desktopSettings"
				 * @param { string } userType Optional type of the user, e.g. "system" or "user" or "portal". Use the cloudDesktopSettingsUserTypes const for this. If no user type is set, it is treated as if there are no user types for this settings key.
				 * @returns {}
				 */
				saveSubServiceSettings: saveSubServiceSettings,
				getCss: getCss
			};

			const subServices = [udsService, dlsService, quickstartService, dataLayoutSettingsService, languageService, alertMessagesService, wysiwygEditorSettingsService];
			const changedMember = '__changed';

			/**
			 * @ngdoc function
			 * @name fireOnSaved
			 * @function
			 * @methodOf userSettingsService
			 * @description Executes the onSave function in all services, if it exists.
			 * @param {object} data The user settings data.
			 */
			function fireOnSaved(data) {
				_.forEach(subServices, function (subService) {
					if (_.isFunction(subService.onSaved)) {
						subService.onSaved(data);
					}
				});
			}

			/**
			 * @ngdoc function
			 * @name getDlgOptions
			 * @function
			 * @methodOf userSettingsService
			 * @description Returns an UDS with default settings.
			 * @returns {object} The options object of the dialog.
			 */
			function getDlgOptions(editableData) {
				return {
					dialogTitle: 'cloud.desktop.sdSettingsHeader',
					height: 'max',
					width: '830px',
					resizeable: true,
					customTools: [{
						id: 'setDefault',
						sort: 1,
						caption: 'cloud.desktop.design.resetToDefault',
						iconClass: 'tlb-icons ico-reset',
						type: 'item',
						fn: function (id, item, info) {
							// udsService.setDefault(info, editableData);
							forEachSubService(info, function setDefault(subService, info) {
								if (_.isFunction(subService.hasDefault) && subService.hasDefault(info.selectedMasterItem.Id)) {
									subService.setDefault(info, editableData);
								}
							});
						},
						disabled: function (info) {
							// return !hasDefaultSettings(info);
							return !forEachSubService(info, function hasDefaultSettings(subService, info) {
								if (_.isFunction(subService.hasDefault)) {
									if (subService.hasDefault(info.selectedMasterItem.Id)) {
										return true;
									}
								}
							});
						}
					}],
					backdrop: 'static',
					itemDisabledMember: 'disabled',
					itemVisibleMember: 'visible',
					itemDisplayMember: 'name',
					dataChangedMember: changedMember,
					items: getMasterItems(editableData),
					windowClass: 'app-settings'
				};
			}

			function forEachSubService(info, func) {
				if (!info) {
					return false;
				}

				for (let i = 0; i < subServices.length; i++) {
					let subService = subServices[i];

					if (_.isFunction(func)) {
						let retVal = func.apply(null, [subService, info]);

						if (retVal) {
							return true;
						}
					}
				}

				return false;
			}

			function getMasterItems(editableData) {
				let masterItems = [];
				let masterItem;
				let temp = [];

				// system
				subServices.forEach(function (subService) {
					if (_.isFunction(subService.getMasterItem)) {
						masterItem = subService.getMasterItem(editableData, userTypes.system);
						if (masterItem) {
							temp.push(masterItem);
						}
					}
				});
				if (temp.length > 0) {
					masterItems.push({
						Id: 'sysSettings',
						name: $translate.instant('cloud.desktop.settings.systemTitle'),
						disabled: true,
						cssClass: 'title'
					});
					masterItems = masterItems.concat(temp);
					temp = [];
				}

				// user
				subServices.forEach(function (subService) {
					if (_.isFunction(subService.getMasterItem)) {
						masterItem = subService.getMasterItem(editableData, userTypes.user);
						if (masterItem) {
							temp.push(masterItem);
						}
					}
				});
				if (temp.length > 0) {
					masterItems.push({
						Id: 'userSettings',
						name: $translate.instant('cloud.desktop.settings.userTitle'),
						disabled: true,
						cssClass: 'title'
					});
					masterItems = masterItems.concat(temp);
					temp = [];
				}

				// portal
				subServices.forEach(function (subService) {
					if (_.isFunction(subService.getMasterItem)) {
						masterItem = subService.getMasterItem(editableData, userTypes.portal);
						if (masterItem) {
							temp.push(masterItem);
						}
					}
				});
				if (temp.length > 0) {
					masterItems.push({
						Id: 'portalSettings',
						name: $translate.instant('cloud.desktop.settings.portalTitle'),
						disabled: true,
						cssClass: 'title'
					});
					masterItems = masterItems.concat(temp);
					temp = [];
				}

				return masterItems;
			}

			/**
			 * @ngdoc function
			 * @name createWrapper
			 * @function
			 * @methodOf userSettingsService
			 * @description Creates a wrapper for loaded user settings data. The wrapper can transform the data between various
			 *              states optimized for different purposes.
			 * @param {object} usItems The user settings data.
			 * @param {string} initialState The current state of the user settings data.
			 * @returns {object} The wrapped user settings data.
			 */
			function createWrapper(usItems, initialState) {
				let wrapper = {
					items: usItems,
					state: initialState
				};

				wrapper.createEditableCopy = function () {
					let copy = _.cloneDeep(wrapper);
					copy.convertToEditable();
					return copy;
				};

				wrapper.findById = function (id, defValue) {
					return _.find(wrapper.items, {
						id: id
					}) || defValue;
				};

				wrapper.convertToTransferable = function (deleteUnchanged) {
					let data;

					function deleteFnc(settingsKey) {
						if (_.isString(settingsKey) && _.has(data, 'items.' + settingsKey)) {
							delete data.items[settingsKey];
						}
					}

					switch (this.state) {
						case dataStates.transferable:
							return;
						case dataStates.editable:
							break;
						default:
							throw new Error('Unsupported data state: ' + this.state);
					}

					data = this;

					_.forEach(subServices, function (subService) {
						if (_.isFunction(subService.convertToTransferable)) {

							subService.convertToTransferable(_.get(data.items, subService.settingsKey), deleteUnchanged, deleteFnc);
						}
					});

					// delete empty settings
					if (deleteUnchanged) {
						_.forEach(data.items, function (item, key) {
							if (_.isEmpty(item)) {
								delete data.items[key];
							}
						});
					}

					this.state = dataStates.transferable;
				};

				wrapper.convertToEditable = function () {
					switch (this.state) {
						case dataStates.editable:
							return;
						case dataStates.transferable:
							break;
						default:
							throw new Error('Unsupported data state: ' + this.state);
					}

					let data = this;

					subServices.forEach(function (subService) {
						if (_.isFunction(subService.convertToEditable)) {
							subService.convertToEditable(_.get(data.items, subService.settingsKey));
						}
					});

					this.state = dataStates.editable;
				};

				return wrapper;
			}

			/**
			 * @ngdoc function
			 * @name loadDataByKey
			 * @function
			 * @methodOf userSettingsService
			 * @param {string} settingsKey The key of the wanted settings, f.e. 'DesktopSettings'
			 * @description Loads the settings of the specified key from the server.
			 * @returns {Promise<Object>} A promise that is resolved when the data is loaded.
			 */
			function loadDataByKey(settingsKey) {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'cloud/desktop/usersettings/loadsetting',
					params: {settingsKey: settingsKey}
				});
			}

			/**
			 * @ngdoc function
			 * @name loadData
			 * @function
			 * @methodOf userSettingsService
			 * @description Loads all user settings from the server.
			 * @returns {Promise<Object>} A promise that is resolved when the data is loaded.
			 */
			function loadData() {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'cloud/desktop/usersettings/load'
				}).then(function (result) {
					if (angular.isObject(result.data)) {
						let promises = [];
						_.forEach(subServices, function (subService) {
							// individual loading of data, which are not automatically loaded from the userprofiles
							if (_.isFunction(subService.customGetSettings)) {
								promises.push($q.when(subService.customGetSettings(result.data)));
							}

							// individual alterations of the loaded data
							if (_.isFunction(subService.alterSettingsData)) {
								promises.push($q.when(subService.alterSettingsData(result.data)));
							}
						});

						return $q.all(promises).then(function () {
							let loadedData = createWrapper(result.data, dataStates.transferable);
							loadedData.convertToEditable();
							return loadedData;
						});
					}
				});
			}

			/**
			 * @ngdoc function
			 * @name getCss
			 * @function
			 * @methodOf userSettingsService
			 * @description Creates css string of all settings logics.
			 * @param { object } settingsKeys (Optional) String of the settings key or an array of settings keys. These keys will be used to identify the settings object in JavaScript from which the CSS file will be generated.
			 * @returns {Promise<Boolean>} A promise for value that indicates whether the operation was successful.
			 */
			function getCss(settingsKeys) {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'cloud/desktop/usersettings/getcss',
					params: {settingsKeys: !_.isUndefined(settingsKeys) ? (_.isArray(settingsKeys) ? settingsKeys : [settingsKeys]) : null}
				}).then(function (response) {
					return response.data;
				});
			}

			/**
			 * @ngdoc function
			 * @name saveData
			 * @function
			 * @methodOf userSettingsService
			 * @description Saves user display settings.
			 * @param {Object} userSettings The wrapped settings to save.
			 * @returns {Promise<Boolean>} A promise for value that indicates whether the operation was successful.
			 */
			function saveData(userSettings) {
				let settings, deferred;
				let promises = [];

				if (userSettings) {
					settings = _.cloneDeep(userSettings);
					settings.convertToTransferable(true);

					_.forEach(subServices, function (subService) {
						if (_.isFunction(subService.customSaveSettings)) {
							promises.push($q.when(subService.customSaveSettings(settings.items)));
						}
					});

					return $q.all(promises).then(function () {
						if (!_.isEmpty(settings.items)) {
							return $http.post(globals.webApiBaseUrl + 'cloud/desktop/usersettings/save', settings.items).then(function (response) {
								response.data.exceptionMessage = createExceptionMessage(response.data.exceptions);
								fireOnSaved(settings.items);
								return response.data;
							});
						}
					});
				} else {
					deferred = $q.defer();
					deferred.reject('missing userSettings');
				}

				return deferred.promise;
			}

			function saveSubServiceSettings(settingsData, settingsKey, userType) {
				if(_.isNil(settingsData)) {
					return $q.when();
				}

				if(_.isNil(settingsKey)){
					throw new Error('The parameter "subServiceName" must not be null.');
				}

				let propPath = settingsKey + (userType ? `.${userType}` : '');

				let settings = {};
				_.set(settings, propPath, settingsData);
				_.set(settings, propPath + '.' + changedMember, true);

				let tempSettingsData = createWrapper(settings, dataStates.editable);
				return saveData(tempSettingsData);
			}

			function createExceptionMessage(exceptions) {
				let message = '';

				if (_.isArray(exceptions) && exceptions.length > 0) {
					message += $translate.instant('cloud.desktop.design.errors.unsavedSettings');
					message += '<ul>' + exceptions.join('<li>') + '</ul>';
				}

				return message;
			}

			return service;
		}]);
})();
