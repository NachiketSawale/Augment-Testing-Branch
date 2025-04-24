/**
 * Created by leo on 10.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.paymentgroup';

	/**
	 * @ngdoc controller
	 * @name timekeepingPaymentGroupRateLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping paymentgroup rate entity.
	 **/
	angular.module(moduleName).service('timekeepingPaymentGroupRateLayoutService', TimekeepingPaymentGroupRateLayoutService);

	TimekeepingPaymentGroupRateLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingPaymentgroupContainerInformationService', 'timekeepingPaymentGroupTranslationService'];

	function TimekeepingPaymentGroupRateLayoutService(platformUIConfigInitService, timekeepingPaymentgroupContainerInformationService, timekeepingPaymentGroupTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingPaymentgroupContainerInformationService.getPaymentGroupRateLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Timekeeping.PaymentGroup',
				typeName: 'PaymentGroupRateDto'
			},
			translator: timekeepingPaymentGroupTranslationService
		});
	}
})(angular);
