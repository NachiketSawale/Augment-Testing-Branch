(function () {
	'use strict';
	/*global angular*/

	let moduleName = 'productionplanning.product';
	angular.module(moduleName).controller('ppsProductRackassignmentListController', [
		'$scope', 'platformContainerControllerService', 'platformTranslateService', 'ppsProductRackassignmentUIService',
		function ($scope, platformContainerControllerService, platformTranslateService, uiStandardService) {
			platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
			let containerUUid = $scope.getContentValue('uuid');
			platformContainerControllerService.initController($scope, moduleName, containerUUid);
		}
	]);
})();