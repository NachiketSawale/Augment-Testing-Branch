((angular => {
	'use strict';

	angular.module('basics.reporting').factory('basicsReportingLanguageService', basicsReportingLanguageService);
	basicsReportingLanguageService.$inject = ['cloudDesktopSidebarUserSettingsService'];

	function basicsReportingLanguageService(cloudDesktopSidebarUserSettingsService) {
		let service = {};

		service.sidebarUserSettings = {
			report: {
				language: ''
			}
		};

		service.saveCommonFlagStatusInLocalStorage = function (itemLanguage) {
			//save selected language in object
			service.sidebarUserSettings.report.language = itemLanguage;

			//save in localStorage
			cloudDesktopSidebarUserSettingsService.saveSidebarUserSettingsinLocalstorage(service.sidebarUserSettings);
		};

		service.getLanguageFromStorage = function() {
			let reportObject = cloudDesktopSidebarUserSettingsService.getSidebarUserSettingsViaId('report');
			if(reportObject) {
				service.sidebarUserSettings.report.language = reportObject.language;
				return service.sidebarUserSettings.report.language;
			}
			return null;
		};

		return service;
	}
}))(angular);
