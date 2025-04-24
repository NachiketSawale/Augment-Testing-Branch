/**
 * Created by shen on 6/9/2021
 */


(function () {
	'use strict';

	let moduleName = 'timekeeping.worktimemodel';

	angular.module(moduleName).controller('timekeepingWorkTimeDerivationListController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) { // jshint ignore:line
			platformContainerControllerService.initController($scope, moduleName, '099dbd22e4334b27af27d080bee3dd65');
		}]);
})();
