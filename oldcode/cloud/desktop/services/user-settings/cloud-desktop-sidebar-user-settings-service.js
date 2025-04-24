(function () {
	'use strict';

	function cloudDesktopSidebarUserSettingsService(platformContextService) {

		var service = {};

		service.getSidebarUserSettings = function () {
			if (!service.sidebarUserSettings) {
				service.sidebarUserSettings = {};
			}
			return service.sidebarUserSettings;
		};

		function getUserSettingsFromLocalStorage() {
			service.sidebarUserSettings = platformContextService.getApplicationValue('sidebarUserSettings');
			return service.sidebarUserSettings;
		}

		service.getSidebarUserSettingValues = function () {
			if (!_.isEmpty(service.sidebarUserSettings)) {
				return service.sidebarUserSettings;
			}

			return getUserSettingsFromLocalStorage();
		};

		service.getSidebarUserSettingsViaId = function (sidebarId) {
			var sidebarUserSettings = service.getSidebarUserSettingValues();
			if (sidebarUserSettings && sidebarUserSettings.hasOwnProperty(sidebarId)) {
				return sidebarUserSettings[sidebarId];
			}
			return null;
		};

		service.saveSidebarUserSettingsinLocalstorage = function (object) {
			_.assign(service.getSidebarUserSettings(), object);
			platformContextService.setApplicationValueWithSave('sidebarUserSettings', service.sidebarUserSettings);
		};

		return service;
	}

	cloudDesktopSidebarUserSettingsService.$inject = ['platformContextService'];
	angular.module('cloud.desktop').factory('cloudDesktopSidebarUserSettingsService', cloudDesktopSidebarUserSettingsService);

})();
