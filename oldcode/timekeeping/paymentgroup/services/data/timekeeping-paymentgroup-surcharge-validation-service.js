/**
 * Created by leo on 10.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.paymentgroup';

	/**
	 * @ngdoc service
	 * @name timekeepingPaymentGroupSurchargeValidationService
	 * @description provides validation methods for timekeeping paymentgroup surcharge entities
	 */
	angular.module(moduleName).service('timekeepingPaymentGroupSurchargeValidationService', TimekeepingPaymentGroupSurchargeValidationService);

	TimekeepingPaymentGroupSurchargeValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingPaymentGroupSurchargeDataService', 'timekeepingPaymentGroupConstantValues'];

	function TimekeepingPaymentGroupSurchargeValidationService(platformValidationServiceFactory, timekeepingPaymentGroupSurchargeDataService, timekeepingPaymentGroupConstantValues) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingPaymentGroupConstantValues.schemes.surcharge, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingPaymentGroupConstantValues.schemes.surcharge)
		},
		self,
		timekeepingPaymentGroupSurchargeDataService);
	}

})(angular);
