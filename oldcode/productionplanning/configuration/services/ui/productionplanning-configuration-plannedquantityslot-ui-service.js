/**
 * Created by zwz on 9/23/2022.
 */
(function () {
	'use strict';
	/* global angular */
	const moduleName = 'productionplanning.configuration';
	let angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationPlannedQuantitySlotUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService',
		'productionplanningConfigurationTranslationService',
		'productionplanningConfigurationPlannedQuantitySlotLayout'];

	function UIStandardService(platformUIStandardConfigService,
		platformSchemaService,
		translationServ,
		layout) {

		let BaseService = platformUIStandardConfigService;

		let dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsPlannedQuantitySlotDto',
			moduleSubModule: 'ProductionPlanning.Configuration'
		});
		let schemaProperties = dtoSchema.properties;

		function UIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}
		UIStandardService.prototype = Object.create(BaseService.prototype);
		UIStandardService.prototype.constructor = UIStandardService;

		return new BaseService(layout, schemaProperties, translationServ);

	}
})();