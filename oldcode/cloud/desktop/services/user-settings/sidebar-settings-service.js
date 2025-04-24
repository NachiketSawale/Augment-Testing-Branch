/**
 * Created by ong on 05.10.2022.
 */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name cloudDesktopSidebarSettingsService
	 * @function
	 * @requires $http, $q, _, PlatformMessenger
	 *
	 * @description Manages object display settings.
	 */

	cloudDesktopSidebarSettingsService.$inject = ['$http', '_', '$q', '$log', '$rootScope', 'platformContextService'];

	angular.module('cloud.desktop').factory('cloudDesktopSidebarSettingsService', cloudDesktopSidebarSettingsService);

	function cloudDesktopSidebarSettingsService($http, _, $q, $log, $rootScope, platformContextService) {
		var service = {};
		var cachedSettings;
		var settingsToSave = [];
		var settingsKey = 'sidebarSettings'; // the property name of sidebar settings within the user settings object

		/**
		 * @ngdoc property
		 * @name .#settingsKey
		 * @propertyOf cloudDesktopSidebarSettingsService
		 * @returns { string } The id of the settings object
		 */
		service.settingsKey = settingsKey;

		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState/* , fromParams */) {
			if (settingsToSave.length > 0) {
				service.getAllSettings().then(function (resp) {
					if (resp) {
						_.forEach(settingsToSave, function (setting) {
							let found = resp.sidebarSetting.find(item => item.moduleName === setting.moduleName && item.sidebarId === setting.sidebarId);
							if (found) {
								found.pinnedSidebarElements = setting.pinnedSidebarElements;
								found.expandedGroups = setting.expandedGroups;
							}
							else {
								resp.sidebarSetting.push(setting);
							}
						});
						saveData(resp.sidebarSetting).then(function (res) {
							if (res.exceptions.length !== 0) {
								$log.error(res.exceptions);
							}
							else {
								cachedSettings = resp;
							}
						});
					}
					else {
						saveData(settingsToSave).then(function (res) {
							if (res.exceptions.length !== 0) {
								$log.error(res.exceptions);
							}
							else {
								cachedSettings.sidebarSetting = settingsToSave;
							}
						});
					}
					settingsToSave = [];
				});
			}
		});

		/**
		 * @ngdoc function
		 * @name getSettings
		 * @function
		 * @methodOf cloudDesktopSidebarSettingsService
		 * @description Loads the available settings from the server.
		 * @returns {Promise<Object>} A promise that is resolved when the data is loaded.
		 */
		service.getAllSettings = function getSettings() {
			if (cachedSettings) {
				return $q.when(cachedSettings);
			} else {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'cloud/desktop/usersettings/loadmergedsetting',
					params: {settingsKey: settingsKey},
				}).then(function (result) {
					let loadedData = result.data;
					if(loadedData.sidebarSetting) {
						loadedData.sidebarSetting = loadedData.sidebarSetting.filter(function (a) {
							var key = a.moduleName + '|' + a.sidebarId;
							if (!this[key]) {
								this[key] = true;
								return true;
							}
						}, Object.create(null));
					}
					cachedSettings = loadedData;

					return loadedData;
				});
			}
		};

		/**
		 * @ngdoc function
		 * @name getSettings
		 * @function
		 * @methodOf cloudDesktopSidebarSettingsService
		 * @description Retrieve the available settings based on module name and sidebar id
		 * @param {string} moduleName Module Name
		 * @param {string} sidebarId Sidebar Id
		 * @returns {Promise<Object>} A promise that is resolved when the data is loaded.
		 */
		service.getSettings = function getSettings(moduleName, sidebarId) {
			const deferred = $q.defer();

			service.getAllSettings().then(function (response) {
				let result;
				if (response) {
					result = response.sidebarSetting.filter((x) => (moduleName ? x.moduleName === moduleName : x.moduleName !== '') && (sidebarId ? x.sidebarId === sidebarId : x.sidebarId !== ''));
				}
				deferred.resolve(result);
			});
			return deferred.promise;
		};

		/**
		 * @ngdoc function
		 * @name saveData
		 * @function
		 * @methodOf cloudDesktopSidebarSettingsService
		 * @description Saves sidebar display settings.
		 * @param {Object} sidebarSettings The wrapped settings to save.
		 * @returns {Promise<Boolean>} A promise for value that indicates whether the operation was successful.
		 */
		function saveData(settings) {
			if (!platformContextService.isLoggedIn) {
				// prevent from additional 401 errors after logout
				return $q.reject(false);
			}

			let deferred;
			const promises = [];

			if (!_.isEmpty(settings)) {
				return $q.all(promises).then(function () {
					return $http.post(globals.webApiBaseUrl + 'cloud/desktop/usersettings/saveSidebarSettings', {sidebarSettings: {sidebarSetting: settings}}).then(function (response) {
						return response.data;
					});
				});
			} else {
				deferred = $q.defer();
				deferred.reject('missing sidebarSettings');
			}

			return deferred.promise;
		}

		/**
		 * @ngdoc function
		 * @name saveSidebarSetting
		 * @function
		 * @methodOf cloudDesktopSidebarSettingsService
		 * @description Saves sidebar setting.
		 * @param {string} moduleName Name of the module this sidebar setting is intended for
		 * @param {string} sidebarId Name of the sidebar container this setting is intended for
		 * @param {[]} pinnedSidebarElements List of ids indicating which elements are pinned
		 * @param {[]} expandedGroups List of ids indicating which elements groups are expanded
		 * @returns {[Promise<Boolean>]} A promise for value that indicates whether the operation was successful.
		 */
		service.saveSidebarSetting = function saveSidebarSetting(moduleName, sidebarId, pinnedSidebarElements, expandedGroups) {
			let hasValue = settingsToSave.filter((x) => x.moduleName === moduleName && x.sidebarId === sidebarId);
			if(hasValue.length === 0) {
				let sidebarElement = {moduleName: moduleName, sidebarId: sidebarId, pinnedSidebarElements: pinnedSidebarElements, expandedGroups: expandedGroups};
				settingsToSave.push(sidebarElement);
			}
		};

		return service;
	}
})();
