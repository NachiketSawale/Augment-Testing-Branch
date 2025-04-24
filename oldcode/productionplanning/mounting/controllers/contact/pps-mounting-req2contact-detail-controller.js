(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	var module = angular.module(moduleName);

	module.controller('productionplanningMountingReq2ContactDetailController', ListController);

	ListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b6b09aa862f44939a28afd2f2de2b69f');
	}
})();
