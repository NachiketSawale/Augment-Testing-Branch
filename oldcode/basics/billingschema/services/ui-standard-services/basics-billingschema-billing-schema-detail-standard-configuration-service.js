/**
 * Created by chm on 6/4/2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsBillingSchemaStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for for basics.billingSchema
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.billingschema').factory('basicsBillingSchemaBillingSchemaDetailStandardConfigurationService', ['platformUIStandardConfigService', 'basicsBillingschemaTranslationService', 'basicsBillingSchemaConfigurationValuesService', 'platformSchemaService','platformUIStandardExtentService',
		function (platformUIStandardConfigService, basicsBillingschemaTranslationService, basicsBillingSchemaConfigurationValuesService, platformSchemaService,platformUIStandardExtentService) {
			var BaseService = platformUIStandardConfigService,
				attributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'BillingSchemaDetailDto',
					moduleSubModule: 'Basics.BillingSchema'
				});

			function BasicsBillingSchemaUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			BasicsBillingSchemaUIStandardService.prototype = Object.create(BaseService.prototype);
			BasicsBillingSchemaUIStandardService.prototype.constructor = BasicsBillingSchemaUIStandardService;
			var layout=basicsBillingSchemaConfigurationValuesService.getBasicsBillingSchemaDetailLayout();
			var service= new BaseService(
				layout,
				attributeDomains.properties,
				basicsBillingschemaTranslationService);
			platformUIStandardExtentService.extend(service, layout.addition, attributeDomains.properties);
			return service;
		}
	]);
})(angular);