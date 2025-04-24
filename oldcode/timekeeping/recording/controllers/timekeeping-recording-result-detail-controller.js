/**
 * Created by baf on 28.12.2020
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingResultDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping recording result entities.
	 **/
	angular.module(moduleName).controller('timekeepingRecordingResultDetailController', TimekeepingRecordingResultDetailController);

	TimekeepingRecordingResultDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingRecordingResultDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'd4c21ec117cd4795aa6604ae56fea840');
	}

})(angular);