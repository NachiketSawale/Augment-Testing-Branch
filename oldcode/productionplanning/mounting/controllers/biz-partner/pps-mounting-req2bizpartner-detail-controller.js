(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	var module = angular.module(moduleName);

	module.controller('productionplanningMountingReq2BizPartnerDetailController', ListController);

	ListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '64121517908e403e980ff5f6d641e03f');
	}
})();
