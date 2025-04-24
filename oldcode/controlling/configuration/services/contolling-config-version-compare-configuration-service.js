/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	let moduleName = 'controlling.configuration';

	angular.module(moduleName).factory('controllingConfigVersionCompareConfigurationService', ['platformUIStandardConfigService','platformUIStandardExtentService', 'controllingConfigurationTranslationService', 'platformSchemaService', 'controllingConfigurationUIConfigurationService',
		function (platformUIStandardConfigService, platformUIStandardExtentService,controllingConfigurationTranslationService, platformSchemaService, controllingConfigurationUIConfigurationService) {
			let BaseService = platformUIStandardConfigService;
			let domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'MdcContrCompareconfigDto',
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

			return  new BaseService(controllingConfigurationUIConfigurationService.getVersionCompareConfDetailLayout(), domainSchema, controllingConfigurationTranslationService);
		}
	]);
})(angular);
