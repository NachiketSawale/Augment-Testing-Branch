/**
 * Created by zwz on 9/29/2019.
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.header';
	/**
	 * @ngdoc service
	 * @name productionplanningHeader2ContactUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of Header2Contact entities
	 */
	angular.module(moduleName).factory('productionplanningHeader2ContactUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformSchemaService',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'productionplanningHeaderTranslationService',
		'productionplanningHeader2ContactLayout',
		'productionplanningHeader2ContactLayoutConfig'];

	function UIStandardService(platformSchemaService,
							   platformUIStandardConfigService,
							   platformUIStandardExtentService,
							   translationServ,
							   layout,
							   layoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'Header2ContactDto',
			moduleSubModule: 'ProductionPlanning.Header'
		});
		var schemaProperties = dtoSchema.properties;

		function Header2ContactUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}
		Header2ContactUIStandardService.prototype = Object.create(BaseService.prototype);
		Header2ContactUIStandardService.prototype.constructor = Header2ContactUIStandardService;

		var service = new BaseService(layout, schemaProperties, translationServ);

		platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

		service.getProjectMainLayout = function () {
			return layout;
		};

		return service;
	}
})();
