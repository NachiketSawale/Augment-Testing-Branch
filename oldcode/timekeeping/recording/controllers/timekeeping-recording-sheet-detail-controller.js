/**
 * Created by baf on 04.06.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingSheetDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping recording sheet entities.
	 **/
	angular.module(moduleName).controller('timekeepingRecordingSheetDetailController', TimekeepingRecordingSheetDetailController);

	TimekeepingRecordingSheetDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingRecordingSheetDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'bc3f46599d584250baa1b35db1c361ad');
	}

})(angular);