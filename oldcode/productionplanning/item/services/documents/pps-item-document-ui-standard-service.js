(function () {
	'use strict';
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItemDocumentUIStandardService', DocumentUIStandardService);

	DocumentUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningItemTranslationService',
		'platformSchemaService', 'platformUIStandardExtentService', 'ppsItemDocumentLayout'];

	function DocumentUIStandardService(PlatformUIStandardConfigService, translationService,
										  platformSchemaService, platformUIStandardExtentService, documentLayout) {

		var masterAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'DocumentDto',
			moduleSubModule: 'ProductionPlanning.Item'
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