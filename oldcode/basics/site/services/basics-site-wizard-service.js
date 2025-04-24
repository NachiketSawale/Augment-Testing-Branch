/**
 * Created by lav on 8/23/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.site';
	angular.module(moduleName).factory('basicsSiteWizardService', basicsSiteWizardService);
	basicsSiteWizardService.$inject = [
		'sidebarWizardPropertyChangeService',
		'basicsSiteMainService'
	];

	function basicsSiteWizardService(sidebarWizardPropertyChangeService, mainService) {
		var service = {};

		service.enableSite = sidebarWizardPropertyChangeService.provideEnableIsLiveInstance(mainService,
			'basics.site.wizard.enableSiteTitle', 'Code',
			'basics.site.wizard.enableDisableSiteDone',
			'basics.site.wizard.siteAlreadyEnabled',
			'item');

		service.disableSite = sidebarWizardPropertyChangeService.provideDisableIsLiveInstance(mainService,
			'basics.site.wizard.disableSiteTitle', 'Code',
			'basics.site.wizard.enableDisableSiteDone',
			'basics.site.wizard.siteAlreadyDisabled',
			'item');

		return service;
	}
})(angular);