/**
 * Created by chm on 6/3/2015.
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
	angular.module('basics.billingschema').factory('basicsBillingSchemaStandardConfigurationService', ['platformUIStandardConfigService', 'basicsBillingschemaTranslationService', 'basicsBillingSchemaConfigurationValuesService', 'platformSchemaService',
		function (platformUIStandardConfigService, basicsBillingschemaTranslationService, basicsBillingSchemaConfigurationValuesService, platformSchemaService) {
			var BaseService = platformUIStandardConfigService;
			var attributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'BillingSchemaDto',
				moduleSubModule: 'Basics.BillingSchema'
			});

			attributeDomains = attributeDomains.properties;

			function BasicsBillingSchemaUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			BasicsBillingSchemaUIStandardService.prototype = Object.create(BaseService.prototype);
			BasicsBillingSchemaUIStandardService.prototype.constructor = BasicsBillingSchemaUIStandardService;

			return new BaseService(
				basicsBillingSchemaConfigurationValuesService.getBasicsBillingSchemaLayout(),
				attributeDomains,
				basicsBillingschemaTranslationService);
		}
	]);
})(angular);