/**
 * Created by zwz on 7/25/2022.
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.product';
	/**
	 * @ngdoc service
	 * @name productionplanningProductCuttingProductUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of CuttingProduct entities
	 */
	angular.module(moduleName).factory('productionplanningProductCuttingProductUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformSchemaService',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'productionplanningProductTranslationService',
		'productionplanningProductCuttingProductLayout',
		'productionplanningProductCuttingProductLayoutConfig'];

	function UIStandardService(platformSchemaService,
							   platformUIStandardConfigService,
							   platformUIStandardExtentService,
							   translationServ,
							   layout,
							   layoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsCuttingProductVDto',
			moduleSubModule: 'ProductionPlanning.Product'
		});
		var schemaProperties = dtoSchema.properties;

		function CuttingProductUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}
		CuttingProductUIStandardService.prototype = Object.create(BaseService.prototype);
		CuttingProductUIStandardService.prototype.constructor = CuttingProductUIStandardService;

		var service = new BaseService(layout, schemaProperties, translationServ);

		platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

		service.getProjectMainLayout = function () {
			return layout;
		};

		return service;
	}
})();
