
(function (angular) {
	'use strict';

	let moduleName = 'controlling.configuration';

	angular.module(moduleName).factory('controllingConfigChartConfigConfigurationService', ['platformUIStandardConfigService','platformUIStandardExtentService', 'controllingConfigurationTranslationService', 'platformSchemaService', 'controllingConfigurationUIConfigurationService',
		function (platformUIStandardConfigService, platformUIStandardExtentService,controllingConfigurationTranslationService, platformSchemaService, controllingConfigurationUIConfigurationService) {
			let BaseService = platformUIStandardConfigService;
			let domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'MdcContrChartDto',
				moduleSubModule: 'Controlling.Configuration'
			});

			if (domainSchema) {
				domainSchema = domainSchema.properties;
			}

			function ControllingConfUIStandardService(layout, scheme, translateService) {
				BaseService.call(layout, scheme, translateService);
			}

			ControllingConfUIStandardService.prototype = Object.create(BaseService.prototype);
			ControllingConfUIStandardService.prototype.constructor = ControllingConfUIStandardService;

			return  new BaseService(controllingConfigurationUIConfigurationService.getColumnChartConfigDetailLayout(), domainSchema, controllingConfigurationTranslationService);
		}
	]);
})(angular);
