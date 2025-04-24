/**
 * Created by joshi on 18.11.2014.
 */

(function () {
	'use strict';
	var moduleName = 'basics.currency';

	/**
	 * @ngdoc service
	 * @name basicsCurrencyStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of currency entities
	 */
	angular.module(moduleName).factory('basicsCurrencyStandardConfigurationService', ['platformUIStandardConfigService', 'basicsCurrencyTranslationService', 'platformSchemaService', 'basicsCurrencyUIConfigurationService',

		function (platformUIStandardConfigService, basicsCurrencyTranslationService, platformSchemaService, basicsCurrencyUIConfigurationService) {

			var BaseService = platformUIStandardConfigService;
			var currencyDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'CurrencyDto', moduleSubModule: 'Basics.Currency'} );
			if(currencyDomainSchema) {
				currencyDomainSchema = currencyDomainSchema.properties;
			}

			function CurrencyUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			CurrencyUIStandardService.prototype = Object.create(BaseService.prototype);
			CurrencyUIStandardService.prototype.constructor = CurrencyUIStandardService;

			return new BaseService( basicsCurrencyUIConfigurationService.getBasicsCurrencyDetailLayout(), currencyDomainSchema, basicsCurrencyTranslationService);
		}
	]);
})();
