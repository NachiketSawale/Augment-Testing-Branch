/**
 * Created by sprotte on 15/09/21
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.timeallocation';
	
	/**
	 * @ngdoc controller
	 * @name timekeepingTimeallocationHeaderDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping timeallocation timeallocationheader entities.
	 **/
	angular.module(moduleName).controller('timekeepingTimeallocationHeaderDetailController', TimekeepingTimeallocationHeaderDetailController);

	TimekeepingTimeallocationHeaderDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingTimeallocationHeaderDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6ee25aa6370247a3bf908a58eeaa5e1d');
	}

})(angular);