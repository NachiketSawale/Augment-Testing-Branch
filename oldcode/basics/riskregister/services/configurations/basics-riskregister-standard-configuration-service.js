/*
 * Created by salopek on 26.09.2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.riskregister';
	/*global angular,_*/
	/**
     * @ngdoc service
     * @name basicsRiskRegisterStandardConfigurationService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers of risk register entities
     */
	angular.module(moduleName).factory('basicsRiskRegisterStandardConfigurationService',
		['platformUIStandardConfigService', 'basicsRiskRegisterTranslationService', 'platformSchemaService', 'basicsRiskRegisterUIConfigurationService',
			function (platformUIStandardConfigService, basicsRiskRegisterTranslationService, platformSchemaService, basicsRiskRegisterUIConfigurationService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'RiskRegisterDto',
					moduleSubModule: 'Basics.RiskRegister'
				});
				if(domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function BasicsRiskRegisterUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				BasicsRiskRegisterUIStandardService.prototype = Object.create(BaseService.prototype);
				BasicsRiskRegisterUIStandardService.prototype.constructor = BasicsRiskRegisterUIStandardService;

				return new BaseService(basicsRiskRegisterUIConfigurationService.getRiskRegisterDetailLayout(), domainSchema, basicsRiskRegisterTranslationService);
			}
		]);
})(angular);
