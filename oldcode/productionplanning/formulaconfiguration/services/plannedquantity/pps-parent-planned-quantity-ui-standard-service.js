(function () {
	/* global _ */
	'use strict';
	var moduleName = 'productionplanning.formulaconfiguration';
	/**
     * @ngdoc service
     * @name ppsParentPlannedQuantityUIStandardService
     * @function
     *
     * @description
     *
     */
	angular.module(moduleName).factory('ppsParentPlannedQuantityUIStandardService',PpsParentPlannedQuantityUIStandardService );

	PpsParentPlannedQuantityUIStandardService.$inject = ['platformUIStandardConfigService', 'productionPlanningFormulaConfigurationTranslationService',
		'platformSchemaService', 'ppsPlannedQuantityLayout', 'platformUIStandardExtentService', 'ppsPlannedQuantityLayoutConfig', 'ppsCommonCustomColumnsServiceFactory'];

	function PpsParentPlannedQuantityUIStandardService(platformUIStandardConfigService, translationService,
		platformSchemaService, ppsPlannedQuantityLayout, platformUIStandardExtentService, ppsPlannedQuantityLayoutConfig, customColumnsServiceFactory) {

		var BaseService = platformUIStandardConfigService;
		let customColumnService = customColumnsServiceFactory.getService(moduleName);

		var dtoSchema = platformSchemaService.getSchemaFromCache({ typeName: 'PpsPlannedQuantityDto', moduleSubModule: 'ProductionPlanning.FormulaConfiguration' });
		var schemaProperties;
		if(dtoSchema)
		{
			schemaProperties = dtoSchema.properties;
			var customColumnsService = customColumnsServiceFactory.getService(moduleName);
			_.merge(schemaProperties, customColumnsService.attributes);
		}
		function PpsParentPlannedQuantityUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		PpsParentPlannedQuantityUIStandardService.prototype = Object.create(BaseService.prototype);
		PpsParentPlannedQuantityUIStandardService.prototype.constructor = PpsParentPlannedQuantityUIStandardService;


		let layoutCopy = _.cloneDeep(ppsPlannedQuantityLayout);
		customColumnService.setPlannedQuantityConfig(layoutCopy);
		var service =  new BaseService(layoutCopy, schemaProperties, translationService);

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
			return layoutCopy;
		};

		return service;
	}
})();