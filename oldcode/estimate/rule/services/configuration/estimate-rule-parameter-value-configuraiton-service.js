/**
 * Created by spr on 2017-05-10.
 */

(function (angular) {

	'use strict';

	let moduleName = 'estimate.rule';

	angular.module(moduleName).factory('estimateRuleParameterValueConfigurationService', [
		'platformUIStandardConfigService', 'platformSchemaService', 'estimateRuleParameterValueUIConfigurationService', 'estimateRuleTranslationService',
		function (platformUIStandardConfigService, platformSchemaService, estimateRuleParameterValueUIConfigurationService, estimateRuleTranslationService) {
			let BaseService = platformUIStandardConfigService;

			let estimateRuleParameterValueDomainSchema = platformSchemaService.getSchemaFromCache( {  typeName: 'EstRuleParamValueDto', moduleSubModule: 'Estimate.Rule'} );

			function EstimateRuleParameterValueUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			EstimateRuleParameterValueUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateRuleParameterValueUIStandardService.prototype.constructor = EstimateRuleParameterValueUIStandardService;
			let layout = estimateRuleParameterValueUIConfigurationService;
			return new BaseService( layout, estimateRuleParameterValueDomainSchema.properties, estimateRuleTranslationService);
		}
	]);

})(angular);
