/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	const moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainRuleConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for estimate main rule container
	 */
	angular.module(moduleName).factory('estimateMainRuleConfigurationService', ['platformUIStandardConfigService', 'estimateRuleTranslationService', 'platformSchemaService', 'estimateRuleUIConfigurationService',

		function (platformUIStandardConfigService, estimateRuleTranslationService, platformSchemaService, estimateRuleUIConfigurationService) {

			let BaseService = platformUIStandardConfigService;

			let estMainRuleDomainSchema = platformSchemaService.getSchemaFromCache( {  typeName: 'PrjEstRuleDto', moduleSubModule: 'Estimate.Rule'} );

			function EstimateMainRuleUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}
			EstimateMainRuleUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateMainRuleUIStandardService.prototype.constructor = EstimateMainRuleUIStandardService;
			let estMainRuleDetailLayout = estimateRuleUIConfigurationService.getEstimateRuleComboDetailLayout(true);

			return new BaseService( estMainRuleDetailLayout, estMainRuleDomainSchema.properties, estimateRuleTranslationService);
		}
	]);

})();
