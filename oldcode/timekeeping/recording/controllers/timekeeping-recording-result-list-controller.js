/**
 * Created by baf on 28.12.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingResultListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping recording result entities.
	 **/

	angular.module(moduleName).controller('timekeepingRecordingResultListController', TimekeepingRecordingResultListController);

	TimekeepingRecordingResultListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingRecordingResultListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'd8ee0744ffac416a871546728e6e82bb');
	}
})(angular);