/**
 * Created by Frank Baedeker on 30.01.2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainCurrencyRateValidationService
	 * @description provides validation methods for change entities
	 */
	angular.module(moduleName).factory('projectMainCurrencyRateValidationService', ['$injector',

		function ($injector) {

			var service = {};

			service.validateCurrencyConversionFk = function (entity, value) {
				var dataService = $injector.get('basicsCurrencyConversionLookupDataService');
				var item = dataService.getItemById(value,{lookupType:'basicsCurrencyConversionLookupDataService'});
				if(item){
					entity.CurrencyForeignFk = item.CurrencyForeignFk;
					entity.CurrencyHomeFk = item.CurrencyHomeFk;
				}
				return true;
			};

			return service;
		}

	]);

})(angular);
