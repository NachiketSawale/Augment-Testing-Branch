/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

((angular) => {
	'use strict';
	let moduleName = 'privacy.main';

	angular.module(moduleName).service('privacyMainPrivacyRequestLayoutService', PrivacyRequestLayoutService);

	PrivacyRequestLayoutService.$inject = ['platformUIConfigInitService', 'privacyMainContainerInformationService',
		'privacyMainTranslationService'];

	function PrivacyRequestLayoutService(platformUIConfigInitService, privacyMainContainerInformationService, privacyMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: privacyMainContainerInformationService.getPrivacyRequestLayout(),
			dtoSchemeId: {typeName: 'PrivacyRequestDto', moduleSubModule: 'Privacy.Main'},
			translator: privacyMainTranslationService
		});
	}
})(angular);
