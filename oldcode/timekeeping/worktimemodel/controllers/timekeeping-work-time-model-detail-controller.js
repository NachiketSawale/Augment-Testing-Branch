/**
 * Created by shen on 6/9/2021
 */

(function (angular) {
	'use strict';

	let moduleName = 'timekeeping.worktimemodel';

	angular.module(moduleName).controller('timekeepingTimeModelDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, 'ad495e8fb0ff4cf09296789ee58fd6af');
		}]);
})(angular);




