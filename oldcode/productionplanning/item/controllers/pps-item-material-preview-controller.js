(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('ppsItemMaterialPreviewController', PreviewController);
	PreviewController.$inject = ['$scope', 'ppsItemMaterialPreviewService', 'productionplanningItemDataService', 'platformFileUtilControllerFactory'];
	function PreviewController($scope, previewService, itemDataService, platformFileUtilControllerFactory) {
		platformFileUtilControllerFactory.initFileController($scope, itemDataService, previewService);
		itemDataService.registerMaterialFkChanged($scope.getFile);
	}
})(angular);