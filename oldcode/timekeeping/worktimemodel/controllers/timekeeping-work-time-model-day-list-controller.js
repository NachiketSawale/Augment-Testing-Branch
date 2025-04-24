/**
 * Created by shen on 6/9/2021
 */

(function () {
	'use strict';

	let moduleName = 'timekeeping.worktimemodel';

	angular.module(moduleName).controller('timekeepingWorkTimeModelDayListController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) { // jshint ignore:line
			platformContainerControllerService.initController($scope, moduleName, '2c97189d84574b82a555e20301529c1c');
		}]);
})();
