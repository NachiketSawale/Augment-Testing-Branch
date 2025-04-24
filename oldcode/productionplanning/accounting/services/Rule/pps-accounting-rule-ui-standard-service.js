/**
 * Created by anl on 4/3/2019.
 */

(function () {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).factory('productionplanningAccountingRuleUIStandardService', RuleUIStandardService);

	RuleUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningAccountingTranslationService',
		'platformSchemaService', 'platformUIStandardExtentService', 'productionplanningAccountingRuleLayout',
		'productionplanningAccountingRuleLayoutConfig'];

	function RuleUIStandardService(platformUIStandardConfigService, ppsAccountingTranslationService,
									  platformSchemaService, platformUIStandardExtentService, ruleLayout, ruleLayoutConfig) {
		function createService(dataService) {
			var BaseService = platformUIStandardConfigService;

			var ruleAttributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'RuleDto',
				moduleSubModule: 'ProductionPlanning.Accounting'
			});
			ruleAttributeDomains = ruleAttributeDomains.properties;

			var service = new BaseService(ruleLayout, ruleAttributeDomains, ppsAccountingTranslationService);

			var detailView = service.getStandardConfigForDetailView();
			_.forEach(detailView.rows, function (row) {
				row.change = function (entity, field) {
					dataService.handleFieldChanged(entity, field);
				};
			});

			platformUIStandardExtentService.extend(service, ruleLayoutConfig.addition, ruleAttributeDomains);

			return service;
		}

		var serviceCache = {};

		function getService(dataService) {
			var key = dataService.getServiceName();
			if (!serviceCache[key]) {
				serviceCache[key] = createService(dataService);
			}
			return serviceCache[key];
		}

		var service = createService();
		service.getService = getService;
		return service;
	}
})();