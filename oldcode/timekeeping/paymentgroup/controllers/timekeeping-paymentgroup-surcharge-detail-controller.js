/**
 * Created by leo on 10.02.2021
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.paymentgroup';

	/**
	 * @ngdoc controller
	 * @name timekeepingPaymentGroupSurchargeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping paymentgroup surcharge entities.
	 **/
	angular.module(moduleName).controller('timekeepingPaymentGroupSurchargeDetailController', TimekeepingPaymentGroupSurchargeDetailController);

	TimekeepingPaymentGroupSurchargeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingPaymentGroupSurchargeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6f04b27dea9244759d2bbbff88bd13a2', 'timekeepingPaymentGroupTranslationService');
	}

})(angular);
