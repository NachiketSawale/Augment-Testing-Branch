/**
 * Created by ysl on 5/18/2017.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.assemblies';

	angular.module(moduleName).factory('estimateAssembliesRuleConfigrationService', ['platformUIStandardConfigService', 'estimateRuleTranslationService', 'platformSchemaService', 'estimateRuleUIConfigurationService',

		function (platformUIStandardConfigService, estimateRuleTranslationService, platformSchemaService, estimateRuleUIConfigurationService) {

			let BaseService = platformUIStandardConfigService;

			let estimateRuleDomainSchema = platformSchemaService.getSchemaFromCache( {  typeName: 'EstRuleDto', moduleSubModule: 'Estimate.Rule'} );

			function EstimateRuleUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			EstimateRuleUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateRuleUIStandardService.prototype.constructor = EstimateRuleUIStandardService;
			let estimateProjectEstHeaderDetailLayout = estimateRuleUIConfigurationService.getAssembliesRuleDetailLayout();
			return new BaseService( estimateProjectEstHeaderDetailLayout, estimateRuleDomainSchema.properties, estimateRuleTranslationService);
		}
	]);

})();
