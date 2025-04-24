/**
 * Created by las on 1/25/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.engineering';
	var engtaskModule = angular.module(moduleName);

	engtaskModule.factory('productionplanningEngineeringTaskUIStandardService', taskUIStandardService);
	taskUIStandardService.$inject = ['ppsCommonLoggingUiService',
		'platformSchemaService',
		'platformUIStandardExtentService',
		'productionplanningEngineeringTranslationService',
		'productionplanningEngineeringTaskDetailLayout',
		'productionplanningEngineeringTaskLayoutConfig',
		'platformTranslateService',
		'ppsCommonCustomColumnsServiceFactory'];

	function taskUIStandardService(ppsCommonLoggingUiService,
								   platformSchemaService,
								   platformUIStandardExtentService,
								   translationServ,
								   taskDetailLayout,
								   taskLayoutConfig,
								   platformTranslateService,
								   customColumnsServiceFactory) {
		var BaseService = ppsCommonLoggingUiService;

		var schemaOption = { typeName: 'EngTaskDto', moduleSubModule: 'ProductionPlanning.Engineering' };
		var dtoSchema = platformSchemaService.getSchemaFromCache(schemaOption);
		var schemaProperties;
		if (dtoSchema) {
			schemaProperties = dtoSchema.properties;
			var customColumnsService = customColumnsServiceFactory.getService(moduleName);
			_.merge(schemaProperties, customColumnsService.attributes);
		}

		var service = new BaseService(taskDetailLayout, schemaOption, translationServ);

		platformUIStandardExtentService.extend(service, taskLayoutConfig.addition, schemaProperties);
		platformTranslateService.translateFormConfig(service.getStandardConfigForDetailView());

		service.getProjectMainLayout = function () {
			return taskDetailLayout;

		};

		return service;
	}
})(angular);