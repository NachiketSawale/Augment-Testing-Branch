
(function (angular) {
	'use strict';

	let moduleName = 'controlling.generalcontractor';

	angular.module(moduleName).factory('controllingGeneralContractorAdditionalExpensesConfigurationService',['platformUIStandardConfigService', 'platformSchemaService', 'controllingGeneralContractorTranslationService', 'controllingGeneralContractorUIConfigurationService', 'platformUIStandardExtentService',
		function (platformUIStandardConfigService, platformSchemaService, controllingGeneralContractorTranslationService, controllingGeneralContractorUIConfigurationService,platformUIStandardExtentService) {
			let BaseService = platformUIStandardConfigService;
			let domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'GccAddExpenseDto',
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

			let service = new BaseService(controllingGeneralContractorUIConfigurationService.getAdditionalExpensesDetailLayout(), domainSchema, controllingGeneralContractorTranslationService);

			platformUIStandardExtentService.extend(service,controllingGeneralContractorUIConfigurationService.getAdditionalExpensesDetailLayout().addition,domainSchema);

			return service;
		}
	]);
})(angular);