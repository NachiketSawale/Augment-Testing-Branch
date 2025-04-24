/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkForScheduleListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of basics clerk forSchedule entities.
	 **/

	angular.module(moduleName).controller('basicsClerkForScheduleListController', BasicsClerkForScheduleListController);

	BasicsClerkForScheduleListController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsClerkForScheduleListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e84e703543fd4cb2b8d9bd8e48ecce94');
	}
})(angular);