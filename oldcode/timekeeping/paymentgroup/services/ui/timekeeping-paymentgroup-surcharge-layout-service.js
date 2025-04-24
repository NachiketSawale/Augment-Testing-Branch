/**
 * Created by leo on 10.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.paymentgroup';

	/**
	 * @ngdoc controller
	 * @name timekeepingPaymentGroupSurchargeLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping paymentgroup surcharge entity.
	 **/
	angular.module(moduleName).service('timekeepingPaymentGroupSurchargeLayoutService', TimekeepingPaymentGroupSurchargeLayoutService);

	TimekeepingPaymentGroupSurchargeLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingPaymentgroupContainerInformationService', 'timekeepingPaymentGroupTranslationService'];

	function TimekeepingPaymentGroupSurchargeLayoutService(platformUIConfigInitService, timekeepingPaymentgroupContainerInformationService, timekeepingPaymentGroupTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingPaymentgroupContainerInformationService.getPaymentGroupSurchargeLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Timekeeping.PaymentGroup',
				typeName: 'PaymentGroupSurDto'
			},
			translator: timekeepingPaymentGroupTranslationService
		});
	}
})(angular);
