/**
 * Created by shen on 6/9/2021
 */

(function (angular) {
	'use strict';

	let moduleName = 'timekeeping.worktimemodel';

	angular.module(moduleName).controller('timekeepingWorkTimeModelDayDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, 'e31e2637059e41d4a32856fb2126bdd5');
		}]);
})(angular);
