(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'object.main';
	var angModule = angular.module(moduleName);

	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('objectMainUnitPriceListController', ObjectMainUnitPriceListController);

	ObjectMainUnitPriceListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainUnitPriceListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f288176f4614422f95e33d79dee8dba5');
	}
})();