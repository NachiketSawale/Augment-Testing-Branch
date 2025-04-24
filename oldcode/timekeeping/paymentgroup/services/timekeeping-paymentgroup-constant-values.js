(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.paymentgroup';

	/**
	 * @ngdoc service
	 * @name timekeepingPaymentGroupConstantValues
	 * @function
	 *
	 * @description
	 * timekeepingPaymentGroupConstantValues provides definitions and constants frequently used in timekeeping recording module
	 */
	angular.module(moduleName).value('timekeepingPaymentGroupConstantValues', {
		schemes: {
			paymentGroup: {typeName: 'PaymentGroupDto', moduleSubModule: 'Timekeeping.PaymentGroup'},
			rate: {typeName: 'PaymentGroupRateDto', moduleSubModule: 'Timekeeping.PaymentGroup'},
			surcharge: {typeName: 'PaymentGroupSurDto', moduleSubModule: 'Timekeeping.PaymentGroup'}
		}
	});
})(angular);
