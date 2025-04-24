(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationEventTypeSlotUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService',
		'productionplanningConfigurationTranslationService',
		'productionplanningConfigurationEventTypeSlotLayout'];

	function UIStandardService(platformUIStandardConfigService,
	                           platformSchemaService,
	                           translationServ,
	                           layout) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'EventTypeSlotDto',
			moduleSubModule: 'ProductionPlanning.Configuration'
		});
		var schemaProperties = dtoSchema.properties;

		function EngTypeUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		EngTypeUIStandardService.prototype = Object.create(BaseService.prototype);
		EngTypeUIStandardService.prototype.constructor = EngTypeUIStandardService;

		var service = new BaseService(layout, schemaProperties, translationServ);

		service.getProjectMainLayout = function () {
			return layout;
		};

		return service;
	}
})(angular);