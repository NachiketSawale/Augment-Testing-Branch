(function () {
	'use strict';

	function cloudDesktopSidebarPinSettingsService(cloudDesktopSidebarUserSettingsService) {
		var service = {};

		service.sidebarUserSettings = {
			sidebarpin: {}
		};

		return {
			setPinStatus: setPinStatus,
			getPinStatus: getPinStatus
		};

		function setPinStatus(pinStatus, lastButtonId) {
			service.sidebarUserSettings.sidebarpin.active = pinStatus;
			service.sidebarUserSettings.sidebarpin.lastButtonId = lastButtonId;

			cloudDesktopSidebarUserSettingsService.saveSidebarUserSettingsinLocalstorage(service.sidebarUserSettings);
		}

		function getPinStatus() {
			var sidebarUserSettings = cloudDesktopSidebarUserSettingsService.getSidebarUserSettingValues();
			if (sidebarUserSettings && sidebarUserSettings.hasOwnProperty('sidebarpin')) {
				service.sidebarUserSettings.sidebarpin = sidebarUserSettings.sidebarpin;
			}
			return service.sidebarUserSettings.sidebarpin;
		}
	}

	cloudDesktopSidebarPinSettingsService.$inject = ['cloudDesktopSidebarUserSettingsService'];
	angular.module('cloud.desktop').factory('cloudDesktopSidebarPinSettingsService', cloudDesktopSidebarPinSettingsService);
})();