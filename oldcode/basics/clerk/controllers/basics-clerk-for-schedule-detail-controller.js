/**
 * Created by baf on 15.05.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkForScheduleDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of basics clerk forSchedule entities.
	 **/
	angular.module(moduleName).controller('basicsClerkForScheduleDetailController', BasicsClerkForScheduleDetailController);

	BasicsClerkForScheduleDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsClerkForScheduleDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'be18520a1fb34649bf3c4ebcd6da2eea');
	}

})(angular);