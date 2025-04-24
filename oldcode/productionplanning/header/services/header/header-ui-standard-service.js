(function () {
	'use strict';
	var moduleName = 'productionplanning.header';
	/**
	 * @ngdoc service
	 * @name productionplanningHeaderUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of PPS Header entities
	 */
	angular.module(moduleName).factory('productionplanningHeaderUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService',
		'platformUIStandardExtentService',
		'productionplanningHeaderTranslationService',
		'productionplanningHeaderDetailLayout',
		'productionplanningHeaderLayoutConfig'];

	function UIStandardService(platformUIStandardConfigService,
							   platformSchemaService,
							   platformUIStandardExtentService,
							   translationServ,
							   layout,
							   layoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'HeaderDto',
			moduleSubModule: 'ProductionPlanning.Header'
		});
		var schemaProperties;
		if (dtoSchema) {
			schemaProperties = dtoSchema.properties;
		}

		function HeaderUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}
		HeaderUIStandardService.prototype = Object.create(BaseService.prototype);
		HeaderUIStandardService.prototype.constructor = HeaderUIStandardService;

		var service = new BaseService(layout, schemaProperties, translationServ);

		platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

		service.getProjectMainLayout = function () {
			return layout;
		};

		return service;
	}
})();
