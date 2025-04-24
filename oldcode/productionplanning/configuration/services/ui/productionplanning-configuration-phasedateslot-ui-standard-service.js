(function () {
	/* global angular */
	'use strict';
	const moduleName = 'productionplanning.configuration';
	let angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationPhaseDateSlotUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService',
		'productionplanningConfigurationTranslationService',
		'productionplanningConfigurationPhaseDateSlotLayout'];

	function UIStandardService(platformUIStandardConfigService,
	                           platformSchemaService,
	                           translationServ,
	                           layout) {

		let BaseService = platformUIStandardConfigService;

		let dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsPhaseDateSlotDto',
			moduleSubModule: 'ProductionPlanning.Configuration'
		});
		let schemaProperties = dtoSchema.properties;

		function PpsPhaseDateUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		PpsPhaseDateUIStandardService.prototype = Object.create(BaseService.prototype);
		PpsPhaseDateUIStandardService.prototype.constructor = PpsPhaseDateUIStandardService;

		let service = new BaseService(layout, schemaProperties, translationServ);

		service.getProjectMainLayout = function () {
			return layout;
		};

		return service;
	}
})(angular);