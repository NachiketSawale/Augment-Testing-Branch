(function () {
	'use strict';

	function cloudDesktopQuickstartTabsSettingsService($http, cloudDesktopSidebarUserSettingsService) {
		var service = {};

		// are the string-arrays for the modulename-ids
		service.sidebarUserSettings = {
			quickstart: {
				accordionstate: []
			}
		};

		return {
			setTabsExpandedStatus: setTabsExpandedStatus,
			getTabsExpandedStatus: getTabsExpandedStatus,
			deleteExpandedTabId: deleteExpandedTabId,
			getTabsByModulenames: getTabsByModulenames
		};

		function setTabsExpandedStatus(id) {
			if (!_.includes(service.sidebarUserSettings.quickstart.accordionstate, id)) {
				// push module-id in variable
				service.sidebarUserSettings.quickstart.accordionstate.push(id);
			}

			// save in localStorage
			cloudDesktopSidebarUserSettingsService.saveSidebarUserSettingsinLocalstorage(service.sidebarUserSettings);
		}

		function getTabsExpandedStatus() {
			var sidebarUserSettings = cloudDesktopSidebarUserSettingsService.getSidebarUserSettingValues();
			if (sidebarUserSettings && sidebarUserSettings.hasOwnProperty('quickstart')) {
				service.sidebarUserSettings.quickstart.accordionstate = sidebarUserSettings.quickstart.accordionstate;
				return _.uniq(service.sidebarUserSettings.quickstart.accordionstate);
			}
			return null;
		}

		function deleteExpandedTabId(id) {
			service.sidebarUserSettings.quickstart.accordionstate = service.sidebarUserSettings.quickstart.accordionstate.filter(function (value, index, arr) {
				return value !== id;
			});

			// save in localStorage
			cloudDesktopSidebarUserSettingsService.saveSidebarUserSettingsinLocalstorage(service.sidebarUserSettings);
		}

		function getTabsByModulenames(modulenames) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/layout/quickstarttabs',
				data: modulenames
			}).then(function (result) {
				return result.data;
			});
		}
	}

	cloudDesktopQuickstartTabsSettingsService.$inject = ['$http', 'cloudDesktopSidebarUserSettingsService'];
	angular.module('cloud.desktop').factory('cloudDesktopQuickstartTabsSettingsService', cloudDesktopQuickstartTabsSettingsService);
})();
