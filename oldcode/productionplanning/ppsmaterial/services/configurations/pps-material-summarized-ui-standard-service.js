(function () {
	'use strict';
	let moduleName = 'productionplanning.ppsmaterial';

	angular.module(moduleName).factory('productionplanningPpsMaterialSummarizedUIStandardService', MaterialSummarizedUIStandardService );

	MaterialSummarizedUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningPpsMaterialTranslationService',
		'platformSchemaService', 'productionplanningPpsMaterialSummarizedLayout'];

	function MaterialSummarizedUIStandardService(platformUIStandardConfigService, ppsMaterialTranslationService,
		platformSchemaService, materialSummarizedLayout) {

		let BaseService = platformUIStandardConfigService;

		let dtoSchema = platformSchemaService.getSchemaFromCache({ typeName: 'PpsSummarizedMatDto', moduleSubModule: 'ProductionPlanning.PpsMaterial'});

		function ProductDescUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ProductDescUIStandardService.prototype = Object.create(BaseService.prototype);
		ProductDescUIStandardService.prototype.constructor = ProductDescUIStandardService;

		let service = new BaseService(materialSummarizedLayout, dtoSchema.properties, ppsMaterialTranslationService);
		return service;
	}
})(angular);