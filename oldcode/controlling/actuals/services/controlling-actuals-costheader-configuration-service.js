/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.actuals';

	/**
	 * @ngdoc service
	 * @name controllingActualsCostHeaderConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of controlling-actuals
	 */
	angular.module(moduleName).factory('controllingActualsCostHeaderConfigurationService', ['platformUIStandardConfigService', 'controllingActualsTranslationService', 'platformSchemaService', 'controllingActualsUIConfigurationService',
		function (platformUIStandardConfigService, controllingActualsTranslationService, platformSchemaService, controllingActualsUIConfigurationService) {
			var BaseService = platformUIStandardConfigService;
			var costheaderDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'CompanyCostHeaderDto',
				moduleSubModule: 'Controlling.Actuals'
			});

			if (costheaderDomainSchema) {
				costheaderDomainSchema = costheaderDomainSchema.properties;

				// add additional columns
				costheaderDomainSchema.CompanyYearFkStartDate = {domain: 'dateutc'};
				costheaderDomainSchema.CompanyYearFkEndDate = {domain: 'dateutc'};
				costheaderDomainSchema.CompanyPeriodFkStartDate = {domain: 'dateutc'};
				costheaderDomainSchema.CompanyPeriodFkEndDate = {domain: 'dateutc'};

			}

			function controllingActualsUIStandardService(layout, scheme, translateService) {
				BaseService.call(layout, scheme, translateService);
			}

			controllingActualsUIStandardService.prototype = Object.create(BaseService.prototype);
			controllingActualsUIStandardService.prototype.constructor = controllingActualsUIStandardService;

			return new BaseService(controllingActualsUIConfigurationService.getCompanyCostHeaderDetailLayout(), costheaderDomainSchema, controllingActualsTranslationService);
		}
	]);
})(angular);


