/**
 * Created by lav on 4/29/2019.
 */
(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).controller('productionplanningDrawingComponentDetailController', [
		'$scope',
		'platformContainerControllerService',
		'productionplanningDrawingTranslationService',
		function ($scope,
				  platformContainerControllerService,
				  drawingTranslationService) {
			var containerUid = $scope.getContentValue('uuid');
			platformContainerControllerService.initController($scope, moduleName, containerUid, drawingTranslationService);
		}
	]);
})();