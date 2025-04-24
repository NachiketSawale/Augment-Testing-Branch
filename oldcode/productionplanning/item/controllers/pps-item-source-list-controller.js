(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('ppsItemSourceListController', PpsItemSourceListController);

	PpsItemSourceListController.$inject = ['$scope', 'platformContainerControllerService'];

	function PpsItemSourceListController($scope, controllerService) {
		controllerService.initController($scope, moduleName, $scope.getContentValue('uuid'));
	}

})(angular);