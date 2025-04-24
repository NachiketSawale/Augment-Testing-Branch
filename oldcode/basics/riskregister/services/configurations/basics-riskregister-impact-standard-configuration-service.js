/*
 * Created by salopek on 26.09.2019.
 */

(function (angular) {
	'use strict';
	/*global angular,_*/
	var moduleName = 'basics.riskregister';

	/**
	 * @ngdoc service
	 * @name basicsRiskRegisterStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of risk register entities
	 */
	angular.module(moduleName).factory('basicsRiskRegisterImpactStandardConfigurationService',
		['platformUIStandardConfigService', 'basicsRiskRegisterTranslationService', 'platformSchemaService', 'basicsRiskRegisterUIConfigurationService',
			function (platformUIStandardConfigService, basicsRiskRegisterTranslationService, platformSchemaService, basicsRiskRegisterUIConfigurationService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'RiskRegisterImpactDto',
					moduleSubModule: 'Basics.RiskRegister'
				});
				if(domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function BasicsRiskRegisterImpactUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				BasicsRiskRegisterImpactUIStandardService.prototype = Object.create(BaseService.prototype);
				BasicsRiskRegisterImpactUIStandardService.prototype.constructor = BasicsRiskRegisterImpactUIStandardService;

				return new BaseService(basicsRiskRegisterUIConfigurationService.getRiskRegisterImpactDetailLayout(), domainSchema, basicsRiskRegisterTranslationService);
			}
		]);
})(angular);
