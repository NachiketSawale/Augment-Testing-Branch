/**
 * Created by jpfriedel on 30/3/2022
 */

(function (angular) {
	'use strict';

	let moduleName = 'timekeeping.worktimemodel';

	angular.module(moduleName).controller('timekeepingTimeSymbol2WorkTimeModelDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '79369d99b969492b830da0e62aea78bd');
		}]);
})(angular);