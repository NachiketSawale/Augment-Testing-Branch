/**
 * Created by baf on 04.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingSheetListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping recording sheet entities.
	 **/

	angular.module(moduleName).controller('timekeepingRecordingSheetListController', TimekeepingRecordingSheetListController);

	TimekeepingRecordingSheetListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingRecordingSheetListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a99560462228495790fa8a2cb66f3fe3');
	}
})(angular);