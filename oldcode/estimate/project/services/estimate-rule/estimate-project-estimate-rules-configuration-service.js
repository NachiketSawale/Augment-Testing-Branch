/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.project';

	/**
	 * @ngdoc service
	 * @name estimateProjectEstimateRulesConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for project estimate rule container for Project Main module
	 */
	angular.module(moduleName).factory('estimateProjectEstimateRulesConfigurationService', ['platformUIStandardConfigService', 'estimateRuleTranslationService', 'platformSchemaService', 'estimateRuleUIConfigurationService',

		function (platformUIStandardConfigService, estimateRuleTranslationService, platformSchemaService, estimateRuleUIConfigurationService) {

			let BaseService = platformUIStandardConfigService;

			let estimateRuleDomainSchema = platformSchemaService.getSchemaFromCache( {  typeName: 'PrjEstRuleDto', moduleSubModule: 'Estimate.Rule'} );

			function EstimateRuleUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}
			EstimateRuleUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateRuleUIStandardService.prototype.constructor = EstimateRuleUIStandardService;
			let estimateProjectRuleDetailLayout = estimateRuleUIConfigurationService.getEstimateRuleComboDetailLayout();
			let prjMainEstRuleLayout = estimateRuleUIConfigurationService.getProjectMainEstRuleLayout();
			estimateProjectRuleDetailLayout.overloads = {};
			angular.extend(estimateProjectRuleDetailLayout, prjMainEstRuleLayout);
			return new BaseService( estimateProjectRuleDetailLayout, estimateRuleDomainSchema.properties, estimateRuleTranslationService);
		}
	]);
})();
