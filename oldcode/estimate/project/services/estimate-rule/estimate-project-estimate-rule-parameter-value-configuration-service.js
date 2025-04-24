/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.project';

	angular.module(moduleName).factory('estimateProjectEstRuleParamValueConfigService',
		['platformUIStandardConfigService', 'estimateRuleTranslationService', 'platformSchemaService', 'estimateProjectRuleParameterValueUIConfigurationService',

			function (platformUIStandardConfigService, estimateRuleTranslationService, platformSchemaService, estimateProjectRuleParameterValueUIConfigurationService) {

				let BaseService = platformUIStandardConfigService;

				let estimateRuleDomainSchema = platformSchemaService.getSchemaFromCache( {  typeName: 'EstRuleParamValueDto', moduleSubModule: 'Estimate.Rule'} );

				function ProjectMainRuleParameterValueUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ProjectMainRuleParameterValueUIStandardService.prototype = Object.create(BaseService.prototype);
				ProjectMainRuleParameterValueUIStandardService.prototype.constructor = ProjectMainRuleParameterValueUIStandardService;
				let layout = estimateProjectRuleParameterValueUIConfigurationService;

				return new BaseService( layout, estimateRuleDomainSchema.properties, estimateRuleTranslationService);
			}
		]);
})();
