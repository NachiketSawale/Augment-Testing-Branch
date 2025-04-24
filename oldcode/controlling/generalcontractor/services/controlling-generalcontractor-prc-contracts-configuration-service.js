(function (angular) {
	'use strict';

	let moduleName = 'controlling.generalcontractor';

	angular.module(moduleName).factory('controllingGeneralContractorPrcContractsConfigurationService', ['platformUIStandardConfigService', 'platformUIStandardExtentService', 'controllingGeneralContractorTranslationService', 'platformSchemaService', 'controllingGeneralContractorUIConfigurationService',
		function (platformUIStandardConfigService, platformUIStandardExtentService, controllingGeneralContractorTranslationService, platformSchemaService, controllingGeneralContractorUIConfigurationService) {
			let BaseService = platformUIStandardConfigService;
			let domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'PrcContractsDto',
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

			let service = new BaseService(controllingGeneralContractorUIConfigurationService.getPrcContractsDetailLayout(), domainSchema, controllingGeneralContractorTranslationService);
			platformUIStandardExtentService.extend(service, controllingGeneralContractorUIConfigurationService.getPrcContractsDetailLayout().addition, domainSchema);
			return service;
		}
	]);
})(angular);


