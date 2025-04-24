/**
 * Created by lav on 10/22/2020.
 */
(function () {
	'use strict';
	var moduleName = 'productionplanning.common';
	/**
	 * @ngdoc service
	 * @name ppsCommonNotificationUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of master entities
	 */
	angular.module(moduleName).factory('ppsCommonNotificationUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService',
		'productionplanningCommonTranslationService',
		'platformSchemaService', 'ppsCommonNotificationConfigLayout'];

	function UIStandardService(platformUIStandardConfigService, translationService,
							   platformSchemaService, layout) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'NotificationDto',
			moduleSubModule: 'Basics.Common'
		});
		var schemaProperties;
		if (dtoSchema) {
			schemaProperties = dtoSchema.properties;
		}

		return new BaseService(layout, schemaProperties, translationService);
	}
})();