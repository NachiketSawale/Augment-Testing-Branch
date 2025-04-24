/**
 * Created by zwz on 9/29/2019.
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.header';
	/**
	 * @ngdoc service
	 * @name productionplanningHeader2BpUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of Header2Bp entities
	 */
	angular.module(moduleName).factory('productionplanningHeader2BpUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformSchemaService',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'productionplanningHeaderTranslationService',
		'productionplanningHeader2BpLayout',
		'productionplanningHeader2BpLayoutConfig'];

	function UIStandardService(platformSchemaService,
							   platformUIStandardConfigService,
							   platformUIStandardExtentService,
							   translationServ,
							   layout,
							   layoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'Header2BpDto',
			moduleSubModule: 'ProductionPlanning.Header'
		});
		var schemaProperties = dtoSchema.properties;

		function Header2BpUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}
		Header2BpUIStandardService.prototype = Object.create(BaseService.prototype);
		Header2BpUIStandardService.prototype.constructor = Header2BpUIStandardService;

		var service = new BaseService(layout, schemaProperties, translationServ);

		platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

		service.getProjectMainLayout = function () {
			return layout;
		};

		return service;
	}
})();
