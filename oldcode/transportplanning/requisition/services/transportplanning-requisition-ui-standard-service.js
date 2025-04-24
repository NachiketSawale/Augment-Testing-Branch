(function (angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name RequisitionUIStandardService
     * @function
     *
     * @description
     * RequisitionUIStandardService is the data service for all Requisition related functionality.
     * */

	var moduleName = 'transportplanning.requisition';
	var RequisitionModul = angular.module(moduleName);

	RequisitionModul.factory('transportplanningRequisitionUIStandardService', RequisitionUIStandardService);
	RequisitionUIStandardService.$inject = ['ppsCommonLoggingUiService', 'platformTranslateService', 'platformSchemaService', 'platformUIStandardExtentService',
		'transportplanningRequisitionTranslationService', 'transportplanningRequisitionDetailLayout',
		'transportplanningRequisitionMainLayoutConfig', 'ppsCommonCustomColumnsServiceFactory'];

	function RequisitionUIStandardService(ppsCommonLoggingUiService, platformTranslateService, platformSchemaService, platformUIStandardExtentService,
		transportplanningRequisitionTranslationService, transportplanningRequisitionDetailLayout,
		transportplanningRequisitionMainLayoutConfig, customColumnsServiceFactory) {

		var BaseService = ppsCommonLoggingUiService;
		var schemaOption = { typeName: 'RequisitionDto', moduleSubModule: 'TransportPlanning.Requisition' };
		var dtoSchema = platformSchemaService.getSchemaFromCache(schemaOption);
		var schemaProperties;
		if (dtoSchema) {
			schemaProperties = dtoSchema.properties;
			var customColumnsService = customColumnsServiceFactory.getService(moduleName);
			_.merge(schemaProperties, customColumnsService.attributes);
		}

		var service = new BaseService(transportplanningRequisitionDetailLayout, schemaOption, transportplanningRequisitionTranslationService);

		platformUIStandardExtentService.extend(service, transportplanningRequisitionMainLayoutConfig.addition);
		platformTranslateService.translateFormConfig(service.getStandardConfigForDetailView());

		service.getProjectMainLayout = function () {
			return transportplanningRequisitionDetailLayout;
		};

		return service;
	}
})(angular);
