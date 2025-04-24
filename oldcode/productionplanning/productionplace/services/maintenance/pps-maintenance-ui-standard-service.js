
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.productionplace';

	angular.module(moduleName).factory('ppsMaintenanceUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService',
		'productionplanningProductionPlaceTranslationService',
		'platformSchemaService'];

	function UIStandardService(platformUIStandardConfigService,
		translationService,
		platformSchemaService) {

		var layoutConfig =
			{
				'fid': 'productionplanning.productionplace.ppsmaintenancelayout',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						gid: 'baseGroup',
						attributes: ['startdate', 'enddate', 'commenttext']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				'overloads': {}
			};

		var BaseService = platformUIStandardConfigService;

		var ruleSetAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsMaintenanceDto',
			moduleSubModule: 'ProductionPlanning.ProductionPlace'
		});
		ruleSetAttributeDomains = ruleSetAttributeDomains.properties;

		return new BaseService(layoutConfig, ruleSetAttributeDomains, translationService);
	}
})(angular);