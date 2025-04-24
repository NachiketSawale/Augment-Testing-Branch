
(function (angular) {
	'use strict';

	let moduleName = 'controlling.generalcontractor';

	angular.module(moduleName).factory('controllingGeneralContractorCostControlConfigurationService', ['platformUIStandardConfigService', 'controllingGeneralContractorTranslationService', 'platformSchemaService', 'controllingGeneralContractorUIConfigurationService',
		function (platformUIStandardConfigService, controllingGeneralContractorTranslationService, platformSchemaService, controllingGeneralContractorUIConfigurationService) {
			let BaseService = platformUIStandardConfigService;
			let domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'GccCostControlGetProcDto',
				moduleSubModule: 'Controlling.GeneralContractor'
			});

			if (domainSchema) {
				domainSchema = domainSchema.properties;
			}

			function controllingUIStandardService(layout, scheme, translateService) {
				BaseService.call(layout, scheme, translateService);
			}

			controllingUIStandardService.prototype = Object.create(BaseService.prototype);
			controllingUIStandardService.prototype.constructor = controllingUIStandardService;

			return new BaseService(controllingGeneralContractorUIConfigurationService.getCostControlDetailLayout(), domainSchema, controllingGeneralContractorTranslationService);
		}
	]);
})(angular);


