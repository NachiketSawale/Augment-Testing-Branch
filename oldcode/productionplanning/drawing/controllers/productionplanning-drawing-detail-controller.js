/**
 * Created by zov on 23/04/2019.
 */
(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).controller('productionplanningDrawingDetailController', [
		'$scope',
		'platformContainerControllerService',
		function ($scope,
				  platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, 'b43f4d685979413e9ca350b38ced33af');
		}
	]);
})();