/**
 * Created by anl on 4/3/2019.
 */

(function () {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).factory('productionplanningAccountingRuleSetUIStandardService', RuleSetUIStandardService);

	RuleSetUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningAccountingTranslationService',
		'platformSchemaService', 'productionplanningAccountingRuleSetLayout'];

	function RuleSetUIStandardService(platformUIStandardConfigService, ppsRAccountingTranslationService,
									  platformSchemaService, ruleSetLayout) {

		var BaseService = platformUIStandardConfigService;

		var ruleSetAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'RuleSetDto',
			moduleSubModule: 'ProductionPlanning.Accounting'
		});
		ruleSetAttributeDomains = ruleSetAttributeDomains.properties;

		return new BaseService(ruleSetLayout, ruleSetAttributeDomains, ppsRAccountingTranslationService);
	}
})();