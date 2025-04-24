/**
 * Created by zos on 3/23/2016.
 */
(function () {
	'use strict';
	let moduleName = 'estimate.rule';

	/**
	 * @ngdoc service
	 * @name estimateRuleParameterConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for estimate rule parameter container
	 */
	angular.module(moduleName).factory('estimateRuleParameterConfigurationService',
		['platformUIStandardConfigService', 'estimateRuleTranslationService', 'platformSchemaService', 'estimateRuleUIConfigurationService',

			function (platformUIStandardConfigService, estimateRuleTranslationService, platformSchemaService, estimateRuleUIConfigurationService) {

				let BaseService = platformUIStandardConfigService;

				let estimateRuleParameterDomainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'EstRuleParamDto',
					moduleSubModule: 'Estimate.Rule'
				});
				if (estimateRuleParameterDomainSchema) {
					estimateRuleParameterDomainSchema = estimateRuleParameterDomainSchema.properties;
					estimateRuleParameterDomainSchema.Info = {domain: 'image'};
				}

				function EstimateRuleUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				EstimateRuleUIStandardService.prototype = Object.create(BaseService.prototype);
				EstimateRuleUIStandardService.prototype.constructor = EstimateRuleUIStandardService;
				let layout = estimateRuleUIConfigurationService.getEstimateRuleParameterLayout();
				return new BaseService(layout, estimateRuleParameterDomainSchema, estimateRuleTranslationService);
			}
		]);
})();
