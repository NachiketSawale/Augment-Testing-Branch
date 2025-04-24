/**
 * Created by Sudarshan on 27.06.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingBreakListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping recording break entities.
	 **/

	angular.module(moduleName).controller('timekeepingRecordingBreakListController', TimekeepingRecordingBreakListController);

	TimekeepingRecordingBreakListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingRecordingBreakListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5d34ff4e0bf347e3976e6ef2079bf91d');
	}
})(angular);