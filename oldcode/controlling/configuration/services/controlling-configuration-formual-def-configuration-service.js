
(function (angular) {
	'use strict';

	let moduleName = 'controlling.configuration';

	angular.module(moduleName).factory('controllingConfigurationFormulaDefinitionConfigurationService', ['platformUIStandardConfigService','platformUIStandardExtentService', 'controllingConfigurationTranslationService', 'platformSchemaService', 'controllingConfigurationUIConfigurationService',
		function (platformUIStandardConfigService, platformUIStandardExtentService,controllingConfigurationTranslationService, platformSchemaService, controllingConfigurationUIConfigurationService) {
			let BaseService = platformUIStandardConfigService;
			let domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'MdcContrFormulaPropDefDto',
				moduleSubModule: 'Controlling.Configuration'
			});

			if (domainSchema) {
				domainSchema = domainSchema.properties;
			}

			function controllingConfUIStandardService(layout, scheme, translateService) {
				BaseService.call(layout, scheme, translateService);
			}

			controllingConfUIStandardService.prototype = Object.create(BaseService.prototype);
			controllingConfUIStandardService.prototype.constructor = controllingConfUIStandardService;

			let service =  new BaseService(controllingConfigurationUIConfigurationService.getFormulaDefinitionDetailLayout(), domainSchema, controllingConfigurationTranslationService);

			return  service;
		}
	]);
})(angular);

