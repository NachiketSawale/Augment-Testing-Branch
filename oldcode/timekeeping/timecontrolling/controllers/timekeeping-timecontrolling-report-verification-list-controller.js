/**
 * Created by Mohit on 29.04.2024
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.timecontrolling';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeControllingReportVerificationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping recording Employee Report Verification entities.
	 **/

	angular.module(moduleName).controller('timekeepingTimeControllingReportVerificationListController', TimekeepingTimeControllingReportVerificationListController);

	TimekeepingTimeControllingReportVerificationListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingTimeControllingReportVerificationListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a6bf0eb6d1ca4e5cb945fef7fb3f6ab8');
		let createBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 'create';
		});
		$scope.tools.items.splice(createBtnIdx, 1);

		let deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 'delete';
		});
		$scope.tools.items.splice(deleteBtnIdx, 1);
	}
})(angular);