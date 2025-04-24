/**
 * Created by shen on 6/9/2021
 */

(function (angular) {
	'use strict';

	let moduleName = 'timekeeping.worktimemodel';

	angular.module(moduleName).controller('timekeepingWorkTimeModelDtlDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '7a1e913380024d598a65902a6e24fc27');
		}]);
})(angular);
