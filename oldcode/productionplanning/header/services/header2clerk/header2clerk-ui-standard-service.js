/**
 * Created by zwz on 10/10/2019.
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.header';
	/**
	 * @ngdoc service
	 * @name productionplanningHeader2ClerkUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of Header2Clerk entities
	 */
	angular.module(moduleName).factory('productionplanningHeader2ClerkUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformSchemaService',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'productionplanningHeaderTranslationService',
		'productionplanningHeader2ClerkLayout',
		'productionplanningHeader2ClerkLayoutConfig'];

	function UIStandardService(platformSchemaService,
							   platformUIStandardConfigService,
							   platformUIStandardExtentService,
							   translationServ,
							   layout,
							   layoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'Header2ClerkDto',
			moduleSubModule: 'ProductionPlanning.Header'
		});
		var schemaProperties = dtoSchema.properties;

		function Header2ClerkUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}
		Header2ClerkUIStandardService.prototype = Object.create(BaseService.prototype);
		Header2ClerkUIStandardService.prototype.constructor = Header2ClerkUIStandardService;

		var service = new BaseService(layout, schemaProperties, translationServ);

		platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

		service.getProjectMainLayout = function () {
			return layout;
		};

		return service;
	}
})();
