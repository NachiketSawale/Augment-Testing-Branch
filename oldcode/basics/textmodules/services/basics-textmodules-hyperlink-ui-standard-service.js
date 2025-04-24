/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.textmodules';

	angular.module(moduleName).factory('basicsTextModulesHyperlinkUIStandardService', basicsTextModulesHyperlinkUIStandardService);

	basicsTextModulesHyperlinkUIStandardService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService',
		'basicsTextModulesHyperlinkLayout',
		'basicsTextModulesTranslationService'];

	function basicsTextModulesHyperlinkUIStandardService(platformUIStandardConfigService,
		platformSchemaService,
		basicsTextModulesHyperlinkLayout,
		basicsTextModulesTranslationService){
		let BaseService = platformUIStandardConfigService;
		let domains = platformSchemaService.getSchemaFromCache({ typeName: 'TextModuleHyperlinkDto', moduleSubModule: 'Basics.TextModules' }).properties;
		return new BaseService(basicsTextModulesHyperlinkLayout, domains, basicsTextModulesTranslationService);
	}

})(angular);