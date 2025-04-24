
(function (angular) {
	'use strict';

	let moduleName = 'controlling.generalcontractor';

	angular.module(moduleName).factory('controllingGeneralActualConfigurationService',['platformUIStandardConfigService', 'platformSchemaService', 'controllingGeneralContractorTranslationService', 'controllingGeneralContractorUIConfigurationService',
		function (platformUIStandardConfigService, platformSchemaService, controllingGeneralContractorTranslationService, controllingGeneralContractorUIConfigurationService) {
			let BaseService = platformUIStandardConfigService;
			let domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'GccActualVDto',
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

			let service = new BaseService(controllingGeneralContractorUIConfigurationService.getActualDetailLayout(), domainSchema, controllingGeneralContractorTranslationService);

			return service;
		}
	]);
})(angular);