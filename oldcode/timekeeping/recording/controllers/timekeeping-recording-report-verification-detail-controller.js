/**
 * Created by Mohit on 29.04.2024
 */

(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingReportVerificationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping recording Employee Report Verification entities.
	 **/
	angular.module(moduleName).controller('timekeepingReportVerificationDetailController', TimekeepingReportVerificationDetailController);

	TimekeepingReportVerificationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingReportVerificationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '67045a0fa32d41fe92d0083d5997c49c');
	}

})(angular);