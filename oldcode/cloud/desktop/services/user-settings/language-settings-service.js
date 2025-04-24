/* globals app  */
/* globals globals */
/**
 * Created by alisch on 16.10.2017.
 */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name cloudDesktopLanguageSettingsService
	 * @function
	 * @requires $http, $q, _, $translate, platformLogonService, platformContextService, cloudCommonLanguageService
	 *
	 * @description Manages language settings.
	 */
	angular.module('cloud.desktop').factory('cloudDesktopLanguageSettingsService',
		['$http', '$q', '_', '$translate', 'platformLogonService', 'platformContextService', 'cloudDesktopSettingsState', 'cloudDesktopSettingsUserTypes',
			function ($http, $q, _, $translate, platformLogonService, platformContextService, dataStates, userTypes) {
				var service;
				service = {};
				var settingsKey = 'languageSettings'; // the property name of display settings within the user settings object

				/**
				 * @ngdoc property
				 * @name .#settingsKey
				 * @propertyOf cloudDesktopLanguageSettingsService
				 * @returns { string } The id of the settings object
				 */
				service.settingsKey = settingsKey;

				/**
				 * @ngdoc function
				 * @name getMasterItemId
				 * @function
				 * @methodOf cloudDesktopLanguageSettingsService
				 * @description Returns the id of the master item object of the specified user typ.
				 * @return { string } The id of the master item object
				 */
				service.getMasterItemId = function () {
					return settingsKey;
				};

				service.getMasterItem = function (editableData, userType) {
					switch (userType) {
						case userTypes.user:
							return {
								Id: service.getMasterItemId(userType),
								name: $translate.instant('cloud.desktop.settings.language'),
								form: getFormData(),
								data: editableData.items[settingsKey]
							};
						default:
							return undefined;
					}
				};

				/**
				 * @ngdoc function
				 * @name customGetSettings
				 * @function
				 * @methodOf cloudDesktopLanguageSettingsService
				 * @description Loads the settings. These settings aren't from the user profiles like the normal settings.
				 * @returns {Promise<Object>} A promise that is resolved when the data is loaded.
				 */
				service.customGetSettings = function (data) {
					return $q.when(service.getLocalLanguageData()).then(function (localData) {
						_.set(data, 'languageSettings', localData);
					});
				};

				/**
				 * @ngdoc function
				 * @name customSaveSettings
				 * @function
				 * @methodOf cloudDesktopLanguageSettingsService
				 * @description Saves the available settings. These settings are not saved in the user profiles like the normal settings.
				 * @returns {Promise<Object>} A promise that is resolved when the data is saved.
				 */
				service.customSaveSettings = function (settings) {
					var languageSettings;
					languageSettings = _.get(settings, service.getMasterItemId());

					return $q.when((function () {
						// saves to client
						if (languageSettings && !!languageSettings['__changed']) {
							return $q.when(service.saveLanguage(languageSettings)).then(function () {

							});
						}
					})()).then(function () {
						delete settings[settingsKey]; // delete because there are no settings for the user profiles
					});
				};

				function getUiLanguageItems() {
					return platformLogonService.getUiLanguages();
				}

				function getDataLanguageItems() {
					return globals.datalanguages;
				}

				/**
				 * @ngdoc function
				 * @name getLocalLanguageData
				 * @function
				 * @methodOf languageSettingsService
				 * @description Gets the local language data from the client
				 * @return {Object} An object with the language data
				 */
				service.getLocalLanguageData = function () {
					return {
						'uiLanguage': platformContextService.getLanguage(),
						'userDataLangId': platformContextService.getDataLanguageId()
					};
				};

				function culture2Language(uiLanguage) {
					var items = getUiLanguageItems();
					var item = _.find(items, {'language': uiLanguage});
					if (item) {
						return item.culture;
					}
				}

				/**
				 * @ngdoc function
				 * @name saveLanguage
				 * @function
				 * @methodOf languageSettingsService
				 * @description Saves the language to the clients local store
				 * @param {Object} data The language settings to be saved
				 * @param {Object} onlySave If True then no reload
				 */
				service.saveLanguage = function (data, onlySave) {
					var changed = (platformContextService.getDataLanguageId() !== data.userDataLangId) ||
						(platformContextService.getLanguage() !== data.uiLanguage);

					if (changed) {
						// if there is an change in the ui or data language we save and then reload the app,
						// because of making sure services not holding data with wrong language.
						platformContextService.setDataLanguageId(data.userDataLangId);
						var theCulture = culture2Language(data.uiLanguage);
						if (theCulture) {
							platformContextService.setCulture(theCulture);
						}
						platformContextService.setLanguage(data.uiLanguage);

						platformContextService.saveContextToLocalStorage();
						platformLogonService.saveUiDataLanguages()
							.then(function () {
								if (!onlySave) {
									app.reloadDesktop();
								}
							});
					}
				};

				/**
				 * @ngdoc function
				 * @name getFormData
				 * @function
				 * @methodOf languageSettingsService
				 * @description Returns the config object for the form-generator
				 * @return {Object} The config object
				 */
				function getFormData() {
					return {
						fid: 'cloud.desktop.uls.form',
						version: '1.0.0',
						showGrouping: true,
						groups: [{
							gid: 'language',
							header$tr$: 'cloud.desktop.settings.languageSettings',
							isOpen: true,
							isVisible: true,
							sortOrder: 1
						}],
						rows: [
							{
								gid: 'language',
								rid: 'uilangcombo',
								model: 'data.uiLanguage',
								label: 'UI Language', label$tr$: 'cloud.desktop.settingsUILanguage',
								type: 'select',
								options: {
									items: getUiLanguageItems(),
									displayMember: 'languageName',
									valueMember: 'language'
								},
								visible: true,
								sortOrder: 5
							},
							{
								gid: 'language',
								rid: 'userdatalangcombosvc',
								model: 'data.userDataLangId',
								label: 'User Data Language', label$tr$: 'cloud.desktop.settingsUserDataLang',
								type: 'select',
								options: {
									items: getDataLanguageItems(),
									displayMember: 'DescriptionInfo.Translated',
									valueMember: 'Id'
								},
								visible: true,
								sortOrder: 6
							}
						]
					};
				}

				return service;
			}]);
})();
