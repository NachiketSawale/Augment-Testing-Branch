(function () {
	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationEventTypeQtySlotUIStandardService', UIStandardService);

	UIStandardService.$inject = ['_',
		'$translate',
		'platformUIStandardConfigService',
		'platformSchemaService',
		'productionplanningConfigurationTranslationService',
		'productionplanningConfigurationEventTypeSlotLayout'];

	function UIStandardService(_,
							   $translate,
							   platformUIStandardConfigService,
							   platformSchemaService,
							   translationServ,
							   originalLayout) {
		// set layout
		var layout = _.cloneDeep(originalLayout);

		// all qty slot columns(e.g. `EngTaskPlanningQuantity` column in ProductionUnit container of ProductionUnit module) should be readonly, so here we remove `isreadonly` column.
		var baseGroup = _.find(layout.groups, {gid: 'baseGroup'});
		_.remove(baseGroup.attributes, function (attr) {
			return attr ==='isreadonly';
		});

		// set qty columnSelections
		var columnSelections = [
			{id: 6, description: $translate.instant('basics.common.Quantity')},
			{id: 7, description: $translate.instant('productionplanning.common.actualQuantity')},
			{id: 8, description: $translate.instant('productionplanning.common.remainingQuantity')}
		];
		layout.overloads.columnselection.grid.formatterOptions.items = columnSelections;
		layout.overloads.columnselection.grid.editorOptions.items = columnSelections;

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'EventTypeSlotDto',
			moduleSubModule: 'ProductionPlanning.Configuration'
		});
		var schemaProperties = dtoSchema.properties;

		function EngTypeUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		EngTypeUIStandardService.prototype = Object.create(BaseService.prototype);
		EngTypeUIStandardService.prototype.constructor = EngTypeUIStandardService;

		var service = new BaseService(layout, schemaProperties, translationServ);

		service.getProjectMainLayout = function getProjectMainLayout () {
			return layout;
		};

		return service;
	}
})(angular);