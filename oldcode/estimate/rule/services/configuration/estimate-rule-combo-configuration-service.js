/**
 * Created by joshi on 18.03.2015.
 */

(function () {
	'use strict';
	let moduleName = 'estimate.rule';

	/**
	 * @ngdoc service
	 * @name estimateRuleComboConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for project estimate rule container
	 */
	angular.module(moduleName).factory('estimateRuleComboConfigurationService', ['platformUIStandardConfigService', 'estimateRuleTranslationService', 'platformSchemaService', 'estimateRuleUIConfigurationService',

		function (platformUIStandardConfigService, estimateRuleTranslationService, platformSchemaService, estimateRuleUIConfigurationService) {

			let BaseService = platformUIStandardConfigService;

			let estimateRuleDomainSchema = platformSchemaService.getSchemaFromCache( {  typeName: 'PrjEstRuleDto', moduleSubModule: 'Estimate.Rule'} );

			function EstimateRuleUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}
			EstimateRuleUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateRuleUIStandardService.prototype.constructor = EstimateRuleUIStandardService;
			let estRuleComboDetailLayout = estimateRuleUIConfigurationService.getEstimateRuleComboDetailLayout(true);

			return new BaseService( estRuleComboDetailLayout, estimateRuleDomainSchema.properties, estimateRuleTranslationService);
		}
	]);

})();
