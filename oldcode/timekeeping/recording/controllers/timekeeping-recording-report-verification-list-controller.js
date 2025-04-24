/**
 * Created by Mohit on 29.04.2024
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingReportVerificationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping recording Employee Report Verification entities.
	 **/

	angular.module(moduleName).controller('timekeepingReportVerificationListController', TimekeepingReportVerificationListController);

	TimekeepingReportVerificationListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingReportVerificationListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2deddcc178a84cfebdfa8d7a094032bf');
	}
})(angular);