/**
 * Created by shen on 6/9/2021
 */

(function () {
	'use strict';

	let moduleName = 'timekeeping.worktimemodel';

	angular.module(moduleName).controller('timekeepingWorkTimeModelListController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) { // jshint ignore:line
			platformContainerControllerService.initController($scope, moduleName, '990a46ae64d74fa4ae226a74730c5ccf');
		}]);
})();
