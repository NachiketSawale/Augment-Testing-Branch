(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).controller('productionplanningDrawingStackDetailController', StackDetailController);

	StackDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function StackDetailController($scope, platformContainerControllerService) {
		var guid = $scope.getContentValue('uuid');
		var _moduleName = $scope.getContentValue('moduleName') || moduleName;
		platformContainerControllerService.initController($scope, _moduleName, guid);
	}

})(angular);
