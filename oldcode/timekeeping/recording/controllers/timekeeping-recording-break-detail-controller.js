/**
 * Created by Sudarshan on 27.06.2023
 */

(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingBreakDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping recording break entities.
	 **/
	angular.module(moduleName).controller('timekeepingRecordingBreakDetailController', TimekeepingRecordingBreakDetailController);

	TimekeepingRecordingBreakDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingRecordingBreakDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '39574ea27504449187506297fbd24e10');
	}

})(angular);