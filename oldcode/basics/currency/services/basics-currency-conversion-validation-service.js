/**
 * Created by baf on 14.12.2020.
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCurrencyConversionValidationService
	 * @description provides validation methods for currency instances
	 */
	angular.module('basics.currency').service('basicsCurrencyConversionValidationService', BasicsCurrencyConversionValidationService);

	BasicsCurrencyConversionValidationService.$inject = ['platformDataValidationService', 'basicsCurrencyConversionService'];

	function BasicsCurrencyConversionValidationService(platformDataValidationService, basicsCurrencyConversionService) {
		var self = this;

		this.validateCurrencyHomeFk = function validateCurrencyHomeFk(entity, value, model) {
			// validateMandatory(entity, value, model, validationService, dataService)
			return platformDataValidationService.isMandatory(entity, value, model, self, basicsCurrencyConversionService);
		};

		this.validateCurrencyForeignFk = function validateCurrencyForeignFk(entity, value, model) {
			// validateIsUnique(entity, value, model, itemList, validationService, dataService)
			var allCurrencyConversions = basicsCurrencyConversionService.getList();
			return platformDataValidationService.validateIsUnique(entity, value, model, allCurrencyConversions, self, basicsCurrencyConversionService);
		};
	}

})(angular);
