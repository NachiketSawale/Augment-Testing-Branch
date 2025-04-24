(function(angular) {
	'use strict';
	/*global globlas, _*/

	const moduleName = 'productionplanning.item';
	const module = angular.module(moduleName);
	module.factory('ppsItemProductionOverviewUIStandardService', ppsItemProductionOverviewUIStandardService);

	ppsItemProductionOverviewUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'ppsItemProductionOverviewConfigurationService', 'productionplanningItemTranslationService'];

	function ppsItemProductionOverviewUIStandardService(platformUIStandardConfigService, platformSchemaService,
		configurationService, ppsItemTranslateService) {
		let BaseService = platformUIStandardConfigService;
		let domains = platformSchemaService.getSchemaFromCache({ typeName: 'PpsProductionOverviewVDto', moduleSubModule: 'ProductionPlanning.Item' }).properties;
		return new BaseService(configurationService, domains, ppsItemTranslateService);
	}
})(angular);