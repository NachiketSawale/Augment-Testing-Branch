/**
 * Created by alisch on 07.02.2020.
 */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name cloudDesktopCommonUserSettingsService
	 * @function
	 * @requires $http, $q, _, basicsCommonDrawingUtilitiesService, cloudDesktopDisplaySettingsService, cloudDesktopSettingsState, cloudDesktopLanguageSettingsService, $translate, platformContextService,
	 *
	 * @description Manages the user settings.
	 */
	angular.module('cloud.desktop').factory('cloudDesktopCommonUserSettingsService', ['$http', '$q', '_',
		function ($http, $q, _) {

			var service = {
				getLastSettingsUpdate: getLastSettingsUpdate,
				loadData: loadData,
				saveData: saveData
			};

			var commonSettingsName = 'commonUserSettings';

			// the property names of the settings object
			// exampel settings object:
			//             {
			//                 commonUserSettings: {
			//                     items: [],
			//                     lastUpdate: '...'
			//                 }, businessPartner: {
			//                     items: [],
			//                     lastUpdate: '...'
			//                 }
			//             };
			var structPropNames = {
				items: 'items',
				lastUpdate: 'lastUpdate'
			};

			var userSettingsList = {};

			// returns the settings name depending whether a module name is set. If no module name is set, then the common name is used.
			function getSettingsName(module) {
				return _.isString(module) ? module : commonSettingsName;
			}

			/**
			 * @ngdoc function
			 * @name loadData
			 * @function
			 * @methodOf cloudDesktopCommonUserSettingsService
			 * @param {string} module Optional module name to load the settings especially for this module.'
			 * @description Loads the common user settings from the server.
			 * @returns {Promise<Object>} A promise that is resolved when the data is loaded.
			 */
			function loadData(module) {
				var settings = getSettingsFromList(module);

				// return already loaded data if exists
				if (settings) {
					return $q.when(settings);
				}

				// load settings from server
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'cloud/desktop/commonusersettings/load',
					params: {module: module}
				}).then(function (result) {
					if (angular.isObject(result.data)) {
						setSettingsToList(result.data, module, false);
						return result.data;
					}

					return undefined;
				});
			}

			function getSettingsFromList(module) {
				return _.get(userSettingsList, getSettingsName(module) + '.' + structPropNames.items);
			}

			function setSettingsToList(settings, module, updateDate) {
				updateDate = _.isUndefined(updateDate) ? true : updateDate;

				var item = {};
				if (updateDate) {
					item[structPropNames.lastUpdate] = Date.now();
				}
				item[structPropNames.items] = settings;
				_.set(userSettingsList, getSettingsName(module), item);
			}

			/**
			 * @ngdoc function
			 * @name saveData
			 * @function
			 * @methodOf cloudDesktopCommonUserSettingsService
			 * @description Saves user display settings.
			 * @param {Object} userSettings The wrapped settings to save.
			 * @param {string} module Optional module name. If no module name ist set the settings are set to the common settings.
			 * @param {bool} merge Determines whether the passed data should be merged with the already existing data. If true, the values of all enumerable own properties from the new settings object are copied to the old settings object. Default is false.
			 * @returns {Promise<Boolean>} A promise for value that indicates whether the operation was successful.
			 */
			function saveData(userSettings, module, merge) {
				var deferred;
				merge = _.isUndefined(merge) ? true : merge;

				if (userSettings) {
					return $http.post(globals.webApiBaseUrl + 'cloud/desktop/commonusersettings/save', {
						settings: userSettings,
						module: module
					}).then(function (response) {
						var settings = merge ? _.assign(getSettingsFromList(module), userSettings) : userSettings;
						setSettingsToList(settings, module);
						return response.data;
					});
				} else {
					deferred = $q.defer();
					deferred.reject('missing userSettings');
					return deferred.promise;
				}
			}

			/**
			 * @ngdoc function
			 * @name getLastSettingsUpdate
			 * @function
			 * @methodOf cloudDesktopDesktopLayoutSettingsService
			 * @description Gets the date of the last css update
			 * @param {string} module Optional module name. If no module name ist set the common settings update time will be returned.
			 * @returns { string } A string with the date of the last css update
			 */
			function getLastSettingsUpdate(module) {
				return _.get(userSettingsList, getSettingsName(module) + '.' + structPropNames.lastUpdate);
			}

			return service;
		}]);
})();
