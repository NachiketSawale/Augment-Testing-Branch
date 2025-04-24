/**
 * Created by waz on 3/6/2018.
 */
(function () {
	'use strict';
	var moduleName = 'productionplanning.common';
	var module = angular.module(moduleName);

	module.factory('productionplanningCommonDocumentRevisionUIStandardService', DocumentRevisionUIStandardService);

	DocumentRevisionUIStandardService.$inject = [
		'platformUIStandardConfigService',
		'productionplanningCommonTranslationService',
		'platformSchemaService',
		'platformUIStandardExtentService',
		'productionplanningCommonDocumentRevisionLayout'];

	function DocumentRevisionUIStandardService(PlatformUIStandardConfigService,
	                                           productionplanningCommonTranslationService,
	                                           platformSchemaService,
	                                           platformUIStandardExtentService,
	                                           layout) {

		var properties = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsDocumentRevisionDto',
			moduleSubModule: 'ProductionPlanning.Common'
		}).properties;

		var service = new PlatformUIStandardConfigService(layout, properties, productionplanningCommonTranslationService);
		platformUIStandardExtentService.extend(service, layout.addition, properties);

		return service;
	}
})();