(function () {
	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonGenericDocumentUIStandardService', DocumentUIStandardService);

	DocumentUIStandardService.$inject = [
		'platformSchemaService',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'productionplanningCommonTranslationService',
		'ppsCommonGenericDocumentLayout'];

	function DocumentUIStandardService(platformSchemaService,
									   PlatformUIStandardConfigService,
									   platformUIStandardExtentService,
									   translationService,
									   documentLayout) {

		var attributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'GenericDocumentDto',
			moduleSubModule: 'ProductionPlanning.Common'
		});
		attributeDomains = attributeDomains.properties;

		var service = new PlatformUIStandardConfigService(documentLayout, attributeDomains, translationService);

		platformUIStandardExtentService.extend(service, documentLayout.addition, attributeDomains);

		service.getProjectMainLayout = function () {
			return documentLayout;
		};

		return service;
	}
})();
