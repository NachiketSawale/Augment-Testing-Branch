
(function (angular) {
	'use strict';

	let moduleName = 'controlling.generalcontractor';

	angular.module(moduleName).factory('controllingGeneralPrcInvoiceConfigurationService',['platformUIStandardConfigService', 'platformSchemaService', 'controllingGeneralContractorTranslationService', 'controllingGeneralContractorUIConfigurationService', 'platformUIStandardExtentService',
		function (platformUIStandardConfigService, platformSchemaService, controllingGeneralContractorTranslationService, controllingGeneralContractorUIConfigurationService,platformUIStandardExtentService) {
			let BaseService = platformUIStandardConfigService;
			let domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'InvHeaderCompeleteDto',
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

			let service = new BaseService(controllingGeneralContractorUIConfigurationService.getInvoicesDetailLayout(), domainSchema, controllingGeneralContractorTranslationService);

			platformUIStandardExtentService.extend(service,controllingGeneralContractorUIConfigurationService.getInvoicesDetailLayout().addition,domainSchema);

			return service;
		}
	]);
})(angular);