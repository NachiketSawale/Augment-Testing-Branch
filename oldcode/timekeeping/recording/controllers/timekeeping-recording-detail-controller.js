/**
 * Created by baf on 04.06.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping recording recording entities.
	 **/
	angular.module(moduleName).controller('timekeepingRecordingDetailController', TimekeepingRecordingDetailController);

	TimekeepingRecordingDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingRecordingDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e252166b26c249da88abd3165e45e651');
	}
})(angular);