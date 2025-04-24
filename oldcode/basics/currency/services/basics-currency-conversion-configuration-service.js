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
	angular.module(moduleName).factory('basicsCurrencyConversionConfigurationService', ['platformUIStandardConfigService', 'basicsCurrencyTranslationService', 'platformSchemaService', 'basicsCurrencyUIConfigurationService',

		function (platformUIStandardConfigService, basicsCurrencyTranslationService, platformSchemaService, basicsCurrencyUIConfigurationService) {

			var BaseService = platformUIStandardConfigService;
			var currencyConversionDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'CurrencyConversionDto', moduleSubModule: 'Basics.Currency'} );
			if(currencyConversionDomainSchema) {
				currencyConversionDomainSchema = currencyConversionDomainSchema.properties;
			}

			function CurrencyUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			CurrencyUIStandardService.prototype = Object.create(BaseService.prototype);
			CurrencyUIStandardService.prototype.constructor = CurrencyUIStandardService;

			return new BaseService(basicsCurrencyUIConfigurationService.getBasicsCurrencyConversionDetailLayout(), currencyConversionDomainSchema, basicsCurrencyTranslationService);
		}
	]);
})();
