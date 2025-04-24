/**
 * Created by shen on 6/9/2021
 */
(function () {
	'use strict';

	let moduleName = 'timekeeping.worktimemodel';

	angular.module(moduleName).controller('timekeepingWorkTimeModelDtlListController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) { // jshint ignore:line
			platformContainerControllerService.initController($scope, moduleName, 'b49b64d4b0204eb190350168633ef306');
		}]);
})();
