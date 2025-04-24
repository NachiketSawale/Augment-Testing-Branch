/**
 * Created by leo on 10.02.2021
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.paymentgroup';

	/**
	 * @ngdoc controller
	 * @name timekeepingPaymentGroupRateDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping paymentgroup rate entities.
	 **/
	angular.module(moduleName).controller('timekeepingPaymentGroupRateDetailController', TimekeepingPaymentGroupRateDetailController);

	TimekeepingPaymentGroupRateDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingPaymentGroupRateDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '33b18a1eea52466d9bfb81c335671a6a', 'timekeepingPaymentGroupTranslationService');
	}

})(angular);
