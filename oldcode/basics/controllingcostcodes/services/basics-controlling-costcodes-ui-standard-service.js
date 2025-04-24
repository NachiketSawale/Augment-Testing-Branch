/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.controllingcostcodes';

	angular.module(moduleName).factory('basicsControllingCostCodesUIStandardService', ['platformUIStandardConfigService', 'platformSchemaService',
		'basicsControllingCostCodesUIConfig', 'basicsControllingCostCodesTranslationService',
		function (platformUIStandardConfigService, platformSchemaService,
			basicsControllingCostCodesUIConfig, basicsControllingCostCodesTranslationService) {
			let BaseService = platformUIStandardConfigService;

			let controllingCostCodeSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'ContrCostCodeDto',
				moduleSubModule: 'Basics.ControllingCostCodes'
			});
			if (controllingCostCodeSchema) {
				controllingCostCodeSchema = controllingCostCodeSchema.properties;
			}
			function ControllingCostCodeUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			ControllingCostCodeUIStandardService.prototype = Object.create(BaseService.prototype);
			ControllingCostCodeUIStandardService.prototype.constructor = ControllingCostCodeUIStandardService;

			return new BaseService(basicsControllingCostCodesUIConfig.getControllingCostCodesUILayout(), controllingCostCodeSchema, basicsControllingCostCodesTranslationService);
		}]);
})(angular);
