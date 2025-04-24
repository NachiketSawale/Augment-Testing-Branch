(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).factory('productionplanningMountingReq2ContactUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService', 'productionplanningMountingReq2ContactLayout', 'productionplanningMountingTranslationService'];

	function UIStandardService(platformUIStandardConfigService, platformSchemaService, layout, translationService) {
		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'Requisition2ContactDto',
			moduleSubModule: 'ProductionPlanning.Mounting'
		});

		var schemaProperties = dtoSchema.properties;

		function Req2ContactUIStandardService(layout, schema, translateService) {
			BaseService.call(this, layout, schema, translateService);
		}

		Req2ContactUIStandardService.prototype = Object.create(BaseService.prototype);
		Req2ContactUIStandardService.prototype.constructor = Req2ContactUIStandardService;

		var service = new BaseService(layout, schemaProperties, translationService);

		service.getProjectMainLayout = function () {
			return layout;
		};

		return service;
	}
})();
