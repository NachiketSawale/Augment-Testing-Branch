(function (angular){
	'use strict';

	angular.module('controlling.generalcontractor').factory('controllingGeneralContractorBudgetShiftConfigService',  ['platformUIStandardConfigService', 'controllingGeneralContractorTranslationService', 'platformSchemaService', 'controllingGeneralContractorUIConfigurationService','platformUIStandardExtentService',
		function (platformUIStandardConfigService, controllingGeneralContractorTranslationService, platformSchemaService, controllingGeneralContractorUIConfigurationService,platformUIStandardExtentService) {
			let BaseService = platformUIStandardConfigService;
			let domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'GccBudgetShiftDto',
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

			let service =  new BaseService(controllingGeneralContractorUIConfigurationService.getBudgetShiftDetailLayout(), domainSchema, controllingGeneralContractorTranslationService);

			platformUIStandardExtentService.extend(service, controllingGeneralContractorUIConfigurationService.getBudgetShiftDetailLayout().addition, domainSchema);

			return service;
		}
	]);
})(angular);