(function () {
	'use strict';
	var moduleName = 'productionplanning.formulaconfiguration';
	/**
     * @ngdoc service
     * @name ppsPlannedQuantityUIStandardService
     * @function
     *
     * @description
     *
     */
	angular.module(moduleName).factory('ppsPlannedQuantityUIStandardService',PpsPlannedQuantityUIStandardService );

	PpsPlannedQuantityUIStandardService.$inject = ['platformUIStandardConfigService', 'productionPlanningFormulaConfigurationTranslationService',
		'platformSchemaService', 'ppsPlannedQuantityLayout', 'platformUIStandardExtentService', 'ppsPlannedQuantityLayoutConfig',
		'ppsPlannedQuantityDataServiceFactory'];

	function PpsPlannedQuantityUIStandardService(platformUIStandardConfigService, translationService,
		platformSchemaService, ppsPlannedQuantityLayout, platformUIStandardExtentService, ppsPlannedQuantityLayoutConfig,
		ppsPlannedQuantityDataServiceFactory) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({ typeName: 'PpsPlannedQuantityDto', moduleSubModule: 'ProductionPlanning.FormulaConfiguration' });
		var schemaProperties;
		if(dtoSchema)
		{
			schemaProperties = dtoSchema.properties;
		}
		function PlannedQuantityUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		PlannedQuantityUIStandardService.prototype = Object.create(BaseService.prototype);
		PlannedQuantityUIStandardService.prototype.constructor = PlannedQuantityUIStandardService;

		var service =  new BaseService(ppsPlannedQuantityLayout, schemaProperties, translationService);

		platformUIStandardExtentService.extend(service, ppsPlannedQuantityLayoutConfig.addition, schemaProperties);

		// set the callback function manually, in case the detail container not load
		service.handerRowChanged = function (dataService){
			_.forEach(service.getStandardConfigForDetailView().rows, function (row) {
				row.change = function (entity, field) {
					dataService.onPropertyChanged(entity, field);
				};
			});
		};

		service.getProjectMainLayout = function () {
			return ppsPlannedQuantityLayout;
		};

		return service;
	}
})();