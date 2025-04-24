(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.paymentgroup';

	/**
	 * @ngdoc service
	 * @name timekeepingPaymentGroupValidationService
	 * @description provides validation methods for timekeeping payment group entities
	 */
	angular.module(moduleName).service('timekeepingPaymentGroupValidationService', TimekeepingPaymentGroupValidationService);

	TimekeepingPaymentGroupValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingPaymentGroupDataService'];

	function TimekeepingPaymentGroupValidationService(platformValidationServiceFactory, timekeepingPaymentGroupDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface({ typeName: 'PaymentGroupDto', moduleSubModule: 'Timekeeping.PaymentGroup'}, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties({ typeName: 'PaymentGroupDto', moduleSubModule: 'Timekeeping.PaymentGroup'})
		},
		self,
		timekeepingPaymentGroupDataService);
	}
})(angular);
