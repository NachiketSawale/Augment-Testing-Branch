/**
 * Created by sprotte on 15/09/21
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.timeallocation';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeallocationHeaderListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping timeallocation timeallocation header entities.
	 **/

	angular.module(moduleName).controller('timekeepingTimeallocationHeaderListController', TimekeepingTimeallocationHeaderListController);

	TimekeepingTimeallocationHeaderListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingTimeallocationHeaderListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ff09ff1314074aaf909b3e86c2d07c8c');
	}
})(angular);