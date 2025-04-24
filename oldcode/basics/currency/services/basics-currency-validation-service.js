/**
 * Created by joshi on 18.11.2014.
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCurrencyValidationService
	 * @description provides validation methods for currency instances
	 */
	angular.module('basics.currency').factory('basicsCurrencyValidationService', ['platformDataValidationService',

		function (platformDataValidationService) {
			var service = {};

			service.validateCurrency = function validateCurrency(entity, value, field) {
				return platformDataValidationService.isMandatory(value, field);
			};

			return service;
		}

	]);

})(angular);
