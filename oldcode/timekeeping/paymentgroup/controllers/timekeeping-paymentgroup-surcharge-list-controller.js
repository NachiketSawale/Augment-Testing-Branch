/**
 * Created by leo on 10.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.paymentgroup';

	/**
	 * @ngdoc controller
	 * @name timekeepingPaymentgroupSurchargeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping paymentgroup surcharge entities.
	 **/

	angular.module(moduleName).controller('timekeepingPaymentGroupSurchargeListController', TimekeepingPaymentGroupSurchargeListController);

	TimekeepingPaymentGroupSurchargeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingPaymentGroupSurchargeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b02e6c0517ba4d548e8cadcf1e322353');
	}
})(angular);
