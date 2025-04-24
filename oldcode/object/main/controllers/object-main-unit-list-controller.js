(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'object.main';
	var angModule = angular.module(moduleName);

	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('objectMainUnitListController', ObjectMainUnitListController);

	ObjectMainUnitListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainUnitListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f863261368cb4f2c90224df8b9847afe');
	}
})();