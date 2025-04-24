/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.project';

	/**
     * @ngdoc service
     * @name estimateProjectEstRuleParamConfigService
     * @function
     *
     * @description
     * This service provides standard layouts for estimate rule parameter container
     */
	angular.module(moduleName).factory('estimateProjectEstRuleParamConfigService',
		['platformUIStandardConfigService', 'estimateRuleTranslationService', 'platformSchemaService', 'estimateRuleUIConfigurationService',

			function (platformUIStandardConfigService, estimateRuleTranslationService, platformSchemaService, estimateRuleUIConfigurationService) {

				let BaseService = platformUIStandardConfigService;

				let estimateRuleDomainSchema = platformSchemaService.getSchemaFromCache( {  typeName: 'PrjEstRuleParamDto', moduleSubModule: 'Estimate.Rule'} );

				if(estimateRuleDomainSchema)
				{
					estimateRuleDomainSchema = estimateRuleDomainSchema.properties;
					estimateRuleDomainSchema.Info ={ domain : 'image'};
				}

				function EstimateRuleUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				EstimateRuleUIStandardService.prototype = Object.create(BaseService.prototype);
				EstimateRuleUIStandardService.prototype.constructor = EstimateRuleUIStandardService;
				let layout = estimateRuleUIConfigurationService.getProjectMainEstRuleParamLayout();

				return new BaseService( layout, estimateRuleDomainSchema, estimateRuleTranslationService);
			}
		]);
})();
