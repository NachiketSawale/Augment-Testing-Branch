/**
 * Created by jpfriedel on 30/3/2022
 */


(function () {
	'use strict';

	let moduleName = 'timekeeping.worktimemodel';

	angular.module(moduleName).controller('timekeepingTimeSymbol2WorkTimeModelListController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) { // jshint ignore:line
			platformContainerControllerService.initController($scope, moduleName, 'b3aa28b1d5db4b4b884679a95c3a32b8');
		}]);
})();
