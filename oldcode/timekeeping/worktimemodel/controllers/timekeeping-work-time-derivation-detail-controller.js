/**
 * Created by shen on 6/9/2021
 */


(function (angular) {
	'use strict';

	let moduleName = 'timekeeping.worktimemodel';

	angular.module(moduleName).controller('timekeepingWorkTimeDerivationDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, 'f9bd8c7b94a74663900f47f8a2a5bb9e');
		}]);
})(angular);
