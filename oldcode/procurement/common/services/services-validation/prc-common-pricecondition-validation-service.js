(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementCommonPriceConditionValidationService  'procurementCommonPriceConditionDataService',
	 * @description provides validation methods for materialRecordItem
	 */
	angular.module('procurement.common').factory('procurementCommonPriceConditionValidationService',
		['validationService', function (validationService) {
			var validation = {};

			validation.createService = function (dataService) {
				var service = validationService.create('materialPriceCondition', 'procurement/common/pricecondition/schema');


				service.validateValue = dataService.validateValue;

				/** @namespace dataService.validateType */
				service.asyncValidatePrcPriceConditionTypeFk = dataService.validateType;

				return service;
			};

			return validation;
		}
		]);
})(angular);
