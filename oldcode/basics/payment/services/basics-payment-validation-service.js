(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsBaValidationService
	 * @description provides validation methods for Payment instances
	 */
	angular.module('basics.payment').factory('basicsPaymentValidationService', ['$http', 'basicsPaymentMainService', 'platformDataValidationService',

		function ($http, basicsPaymentMainService, platformDataValidationService) {

			var service = {};

			service.validateIsDefault = function validateIsDefault(entity, value) {
				if(value) {
					_.filter(basicsPaymentMainService.getList(), 'IsDefault', true)
						.forEach(function(item) {
							item.IsDefault = false;
						});
					basicsPaymentMainService.markItemAsModified(entity);
					basicsPaymentMainService.gridRefresh();
				}
				return { apply: value, valid: true };
			};
			service.validateIsDefaultCreditor = function validateIsDefaultCreditor(entity, value) {
				if(value) {
					_.filter(basicsPaymentMainService.getList(), 'IsDefaultCreditor', true)
						.forEach(function(item) {
							item.IsDefaultCreditor = false;
						});
					basicsPaymentMainService.markItemAsModified(entity);
					basicsPaymentMainService.gridRefresh();
				}
				return { apply: value, valid: true };
			};
			service.validateIsDefaultDebtor = function validateIsDefaultDebtor(entity, value) {
				if(value) {
					_.filter(basicsPaymentMainService.getList(), 'IsDefaultDebtor', true)
						.forEach(function(item) {
							item.IsDefaultDebtor = false;
						});
					basicsPaymentMainService.markItemAsModified(entity);
					basicsPaymentMainService.gridRefresh();
				}
				return { apply: value, valid: true };
			};

			service.validateCode = function (entity, value, model) {
				var items = basicsPaymentMainService.getList();
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, basicsPaymentMainService);
			};

			service.validateNetDays = function validateNetDays(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, basicsPaymentMainService);
			};

			service.validateDiscountDays = function validateDiscountDays(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, basicsPaymentMainService);
			};

			service.validateDiscountPercent = function validateDiscountPercent(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, basicsPaymentMainService);
			};

			service.validateCalculationTypeFk = function validateCalculationTypeFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, basicsPaymentMainService);
			};

			service.validateDayOfMonth = function validateDayOfMonth(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, basicsPaymentMainService);
			};

			service.validateSorting = function validateSorting(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, basicsPaymentMainService);
			};


			return service;
		}

	]);

})(angular);
