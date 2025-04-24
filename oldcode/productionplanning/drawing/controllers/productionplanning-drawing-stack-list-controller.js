(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).controller('productionplanningDrawingStackListController', StackListController);

	StackListController.$inject = ['$scope', 'platformContainerControllerService'];

	function StackListController($scope, platformContainerControllerService) {
		var guid = $scope.getContentValue('uuid');
		var _moduleName = $scope.getContentValue('moduleName') || moduleName;
		platformContainerControllerService.initController($scope, _moduleName, guid);
	}

})(angular);
