/**
 * Created by baf on 04.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping recording recording entities.
	 **/

	angular.module(moduleName).controller('timekeepingRecordingListController', TimekeepingRecordingListController);

	TimekeepingRecordingListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingRecordingListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '1682021f88cb489c9edb67fd77ba0500');
	}
})(angular);