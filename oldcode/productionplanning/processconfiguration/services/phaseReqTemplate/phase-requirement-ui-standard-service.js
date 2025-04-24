
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('ppsProcessConfigurationPhaseRequirementUIStandardService', UIStandardService);

	UIStandardService.$inject = ['phaseRequirementLayout',
		'platformUIStandardConfigService',
		'productionplanningProcessConfigurationTranslationService',
		'platformSchemaService'];

	function UIStandardService(phaseRequirementLayout,
		platformUIStandardConfigService,
		translationService,
		platformSchemaService) {

		var factory = {};

		var serviceCache = {};

		var ruleSetAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsPhaseRequirementDto',
			moduleSubModule: 'Productionplanning.ProcessConfiguration'
		});
		ruleSetAttributeDomains = ruleSetAttributeDomains.properties;

		var BaseService = platformUIStandardConfigService;

		factory.createNewService = function (dataService){
			return new BaseService(phaseRequirementLayout.createLayout(dataService), ruleSetAttributeDomains, translationService);
		};


		factory.getService = function (dataService) {
			var key = dataService.getServiceName();
			if (_.isNil(serviceCache[key])) {
				serviceCache[key] = factory.createNewService(dataService);
			}
			return serviceCache[key];
		};

		return factory;
	}
})(angular);