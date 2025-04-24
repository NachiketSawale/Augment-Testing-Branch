/**
 * Created by joshi on 18.03.2015.
 */

(function () {
	'use strict';
	let moduleName = 'estimate.rule';

	/**
	 * @ngdoc service
	 * @name estimateRuleStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for estimate rule container
	 */
	angular.module(moduleName).factory('estimateRuleStandardConfigurationService', ['platformUIStandardConfigService', 'estimateRuleTranslationService', 'platformSchemaService', 'estimateRuleUIConfigurationService',

		function (platformUIStandardConfigService, estimateRuleTranslationService, platformSchemaService, estimateRuleUIConfigurationService) {

			let BaseService = platformUIStandardConfigService;

			let estimateRuleDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'EstRuleDto',
				moduleSubModule: 'Estimate.Rule'
			});

			if (estimateRuleDomainSchema) {
				estimateRuleDomainSchema = estimateRuleDomainSchema.properties;
			}

			function EstimateRuleUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			EstimateRuleUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateRuleUIStandardService.prototype.constructor = EstimateRuleUIStandardService;

			let estimateProjectEstHeaderDetailLayout = estimateRuleUIConfigurationService.getEstimateRuleDetailLayout();

			return new BaseService(estimateProjectEstHeaderDetailLayout, estimateRuleDomainSchema, estimateRuleTranslationService);
		}
	]);
})();
