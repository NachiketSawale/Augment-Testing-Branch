(function () {
	'use strict';
	var moduleName = 'productionplanning.header';

	angular.module(moduleName).factory('ppsHeaderDocumentUIStandardService', DocumentUIStandardService);

	DocumentUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningHeaderTranslationService',
		'platformSchemaService', 'platformUIStandardExtentService', 'ppsHeaderDocumentLayout'];

	function DocumentUIStandardService(PlatformUIStandardConfigService, translationService,
									   platformSchemaService, platformUIStandardExtentService, documentLayout) {

		var masterAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'DocumentDto',
			moduleSubModule: 'ProductionPlanning.Header'
		});
		masterAttributeDomains = masterAttributeDomains.properties;

		var service = new PlatformUIStandardConfigService(documentLayout, masterAttributeDomains, translationService);

		platformUIStandardExtentService.extend(service, documentLayout.addition, masterAttributeDomains);

		service.getProjectMainLayout = function () {
			return documentLayout;
		};

		return service;
	}
})();