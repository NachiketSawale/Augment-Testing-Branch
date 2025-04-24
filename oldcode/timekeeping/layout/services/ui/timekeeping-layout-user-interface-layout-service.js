/*
 * $Id: timekeeping-layout-user-interface-layout-service.js 548315 2019-06-19 12:26:42Z baf $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	angular.module('timekeeping.layout').service('timekeepingLayoutUserInterfaceLayoutService', TimekeepingLayoutUserInterfaceLayoutService);

	TimekeepingLayoutUserInterfaceLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingLayoutContainerInformationService',
		'timekeepingLayoutConstantValues', 'timekeepingLayoutTranslationService'];

	function TimekeepingLayoutUserInterfaceLayoutService(platformUIConfigInitService, timekeepingLayoutContainerInformationService, timekeepingLayoutConstantValues, timekeepingLayoutTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingLayoutContainerInformationService.getUserInterfaceLayoutLayout(),
			dtoSchemeId: timekeepingLayoutConstantValues.schemes.userInterfaceLayout,
			translator: timekeepingLayoutTranslationService
		});
	}
})();
