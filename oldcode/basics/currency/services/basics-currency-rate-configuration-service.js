/**
 * Created by joshi on 18.11.2014.
 */
(function () {
	'use strict';
	var moduleName = 'basics.currency';

	/**
	 * @ngdoc service
	 * @name basicsCurrencyConversionConfigurationService
	 * @function
	 *
	 * @description
	 * basicsCurrencyConversionConfigurationService is the data service for Currency Conversion data functions.
	 */
	angular.module(moduleName).factory('basicsCurrencyRateConfigurationService', ['platformUIStandardConfigService', 'basicsCurrencyTranslationService', 'platformSchemaService', 'basicsCurrencyUIConfigurationService',

		function (platformUIStandardConfigService, basicsCurrencyTranslationService, platformSchemaService, basicsCurrencyUIConfigurationService) {

			var BaseService = platformUIStandardConfigService;
			var currencyRateDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'CurrencyRateDto', moduleSubModule: 'Basics.Currency'} );
			if(currencyRateDomainSchema) {
				currencyRateDomainSchema = currencyRateDomainSchema.properties;
			}

			function CurrencyUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			CurrencyUIStandardService.prototype = Object.create(BaseService.prototype);
			CurrencyUIStandardService.prototype.constructor = CurrencyUIStandardService;

			return new BaseService(basicsCurrencyUIConfigurationService.getBasicsCurrencyRateDetailLayout(), currencyRateDomainSchema, basicsCurrencyTranslationService);
		}
	]);
})();