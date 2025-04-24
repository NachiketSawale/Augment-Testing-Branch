(function () {
	'use strict';

	var moduleName = 'productionplanning.ppsmaterial';
	/**
	 * @ngdoc servicproductionplanning.ppsmateriale
	 * @name ppsMaterialMappingUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of master entities
	 */
	angular.module(moduleName).factory('productionplanningPpsMaterialMappingUIStandardService',productionplanningPpsMaterialMappingUIStandardService );

	productionplanningPpsMaterialMappingUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningPpsMaterialTranslationService','platformSchemaService', 'productionplanningPpsMaterialMappingLayout', 'platformUIStandardExtentService'];

	function productionplanningPpsMaterialMappingUIStandardService(platformUIStandardConfigService, ppsMaterialTranslationService, platformSchemaService, ppsMaterialMappingLayout)
	{
		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({ typeName: 'PpsMaterialMappingDto', moduleSubModule: 'ProductionPlanning.PpsMaterial' });
		var schemaProperties;
		if(dtoSchema)
		{
			schemaProperties = dtoSchema.properties;
		}
		function MaterialMappingUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		MaterialMappingUIStandardService.prototype = Object.create(BaseService.prototype);
		MaterialMappingUIStandardService.prototype.constructor = MaterialMappingUIStandardService;

		var service =  new BaseService(ppsMaterialMappingLayout, schemaProperties, ppsMaterialTranslationService);

		service.getProjectMainLayout = function () {
			return ppsMaterialMappingLayout;
		};

		return service;
	}
})();