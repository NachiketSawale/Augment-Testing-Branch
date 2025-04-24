/**
 * Created by leo on 10.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.paymentgroup';

	/**
	 * @ngdoc service
	 * @name timekeepintPaymentGroupRateValidationService
	 * @description provides validation methods for timekeepint paymentgroup rate entities
	 */
	angular.module(moduleName).service('timekeepingPaymentGroupRateValidationService', TimekeepingPaymentGroupRateValidationService);

	TimekeepingPaymentGroupRateValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingPaymentGroupRateDataService', 'timekeepingPaymentGroupConstantValues'];

	function TimekeepingPaymentGroupRateValidationService(platformValidationServiceFactory, timekeepingPaymentGroupRateDataService, timekeepingPaymentGroupConstantValues) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingPaymentGroupConstantValues.schemes.rate, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingPaymentGroupConstantValues.schemes.rate)
		},
		self,
		timekeepingPaymentGroupRateDataService);
	}

})(angular);
