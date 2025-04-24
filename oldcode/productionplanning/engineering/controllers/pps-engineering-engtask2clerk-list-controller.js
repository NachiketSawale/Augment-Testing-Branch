(function () {

	'use strict';
	var moduleName = 'productionplanning.engineering';
	var angModule = angular.module(moduleName);

	angModule.controller('ppsEngTask2ClerkListController', ListController);

	ListController.$inject = ['$scope', 'platformContainerControllerService'];
	function ListController($scope, platformContainerControllerService) {

		platformContainerControllerService.initController($scope, moduleName, $scope.getContentValue('uuid'));
	}
})();