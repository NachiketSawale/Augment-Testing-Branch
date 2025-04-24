/**
 * Created by leo on 10.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.paymentgroup';

	/**
	 * @ngdoc controller
	 * @name timekeepingPaymentGroupRateListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping paymentgroup rate entities.
	 **/

	angular.module(moduleName).controller('timekeepingPaymentGroupRateListController', TimekeepingPaymentGroupRateListController);

	TimekeepingPaymentGroupRateListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingPaymentGroupRateListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'faadbbc815c7406ca8c1032a1998b36a');
	}
})(angular);
