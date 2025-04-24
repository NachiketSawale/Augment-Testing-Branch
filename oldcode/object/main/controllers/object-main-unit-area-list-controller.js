(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'object.main';
	var angModule = angular.module(moduleName);

	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('objectMainUnitAreaListController', ObjectMainUnitAreaListController);

	ObjectMainUnitAreaListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainUnitAreaListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '283a88b5a04a423d938180b0774c3040');
	}
})();