(function () {
	'use strict';
	var moduleName = 'transportplanning.transport';
	/**
	 * @ngdoc service
	 * @name transportplanningTransportUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of transport entities
	 */
	angular.module(moduleName).factory('transportplanningTransportUIStandardService', transportplanningTransportUIStandardService);

	transportplanningTransportUIStandardService.$inject = ['ppsCommonLoggingUiService',
		'platformUIStandardExtentService',
		'platformSchemaService',
		'transportplanningTransportTranslationService',
		'transportplanningTransportLayout',
		'ppsCommonCustomColumnsServiceFactory'];

	function transportplanningTransportUIStandardService(ppsCommonLoggingUiService,
														 platformUIStandardExtentService,
														 platformSchemaService,
														 translationServ,
														 transportLayout,
														 customColumnsServiceFactory) {

		var BaseService = ppsCommonLoggingUiService;

		var schemaOption = {
			typeName: 'TrsRouteDto',
			moduleSubModule: 'TransportPlanning.Transport'
		};

		var dtoSchema = platformSchemaService.getSchemaFromCache(schemaOption);
		var schemaProperties;
		if (dtoSchema) {
			schemaProperties = dtoSchema.properties;
			var customColumnsService = customColumnsServiceFactory.getService(moduleName);
			_.merge(schemaProperties, customColumnsService.attributes);
		}

		var service = new BaseService(transportLayout, schemaOption, translationServ);

		platformUIStandardExtentService.extend(service, transportLayout.addition);

		service.getProjectMainLayout = function () {
			return transportLayout;
		};

		return service;
	}
})();