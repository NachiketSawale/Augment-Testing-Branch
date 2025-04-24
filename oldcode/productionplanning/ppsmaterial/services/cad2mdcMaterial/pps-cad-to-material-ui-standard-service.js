/**
 * Created by lav on 8/9/2019.
 */
(function () {
	'use strict';
	var moduleName = 'productionplanning.ppsmaterial';
	/**
	 * @ngdoc service
	 * @name ppsCadToMaterialUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of master entities
	 */
	angular.module(moduleName).factory('ppsCadToMaterialUIStandardService', ppsCadToMaterialUIStandardService);

	ppsCadToMaterialUIStandardService.$inject = ['platformUIStandardConfigService',
		'productionplanningPpsMaterialTranslationService',
		'platformSchemaService', 'ppsCadToMaterialLayout',
		'platformUIStandardExtentService', 'ppsCadToMaterialLayoutConfig'];

	function ppsCadToMaterialUIStandardService(platformUIStandardConfigService, ppsMaterialTranslationService,
											   platformSchemaService, ppsCadToMaterialLayout,
											   platformUIStandardExtentService, ppsCadToMaterialLayoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsCad2mdcMaterialDto',
			moduleSubModule: 'ProductionPlanning.PpsMaterial'
		});
		var schemaProperties;
		if (dtoSchema) {
			schemaProperties = dtoSchema.properties;
		}
		function EventTypeUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		EventTypeUIStandardService.prototype = Object.create(BaseService.prototype);
		EventTypeUIStandardService.prototype.constructor = EventTypeUIStandardService;

		var service = new BaseService(ppsCadToMaterialLayout, schemaProperties, ppsMaterialTranslationService);
		platformUIStandardExtentService.extend(service, ppsCadToMaterialLayoutConfig.addition, schemaProperties);
		return service;
	}
})();