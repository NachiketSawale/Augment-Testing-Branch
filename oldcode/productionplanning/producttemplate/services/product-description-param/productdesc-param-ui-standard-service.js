/**
 * Created by zwz on 5/13/2019.
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.producttemplate';
	/**
	 * @ngdoc service
	 * @name productionplanningProducttemplateProductDescParamUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of ProductDescParam entities
	 */
	angular.module(moduleName).factory('productionplanningProducttemplateProductDescParamUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformSchemaService',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'productionplanningProducttemplateTranslationService',
		'productionplanningProducttemplateProductDescParamLayout',
		'productionplanningProducttemplateProductDescParamLayoutConfig'];

	function UIStandardService(platformSchemaService,
							   platformUIStandardConfigService,
							   platformUIStandardExtentService,
							   translationServ,
							   layout,
							   layoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ProductDescParamDto',
			moduleSubModule: 'ProductionPlanning.ProductTemplate'
		});
		var schemaProperties = dtoSchema.properties;

		function ProductDescParamUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ProductDescParamUIStandardService.prototype = Object.create(BaseService.prototype);
		ProductDescParamUIStandardService.prototype.constructor = ProductDescParamUIStandardService;

		var service = new BaseService(layout, schemaProperties, translationServ);

		platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

		service.getProjectMainLayout = function () {
			return layout;
		};

		return service;
	}
})();
