/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.actuals';

	/**
	 * @ngdoc service
	 * @name controllingActualsCostDataConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of controlling-actuals
	 */
	angular.module(moduleName).factory('controllingActualsCostDataConfigurationService', ['platformUIStandardConfigService', 'controllingActualsTranslationService', 'platformSchemaService', 'controllingActualsUIConfigurationService',
		function (platformUIStandardConfigService, controllingActualsTranslationService, platformSchemaService, controllingActualsUIConfigurationService) {
			var BaseService = platformUIStandardConfigService;
			var costdataDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'CompanyCostDataDto',
				moduleSubModule: 'Controlling.Actuals'
			});
			if (costdataDomainSchema) {
				costdataDomainSchema = costdataDomainSchema.properties;
			}

			function controllingActualsUIStandardService(layout, scheme, translateService) {
				BaseService.call(layout, scheme, translateService);
			}

			controllingActualsUIStandardService.prototype = Object.create(BaseService.prototype);
			controllingActualsUIStandardService.prototype.constructor = controllingActualsUIStandardService;

			return new BaseService(controllingActualsUIConfigurationService.getCompanyCostDataDetailLayout(), costdataDomainSchema, controllingActualsTranslationService);
		}
	]);
})(angular);


