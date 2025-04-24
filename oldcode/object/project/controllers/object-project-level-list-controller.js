(function () {
	'use strict';
	var moduleName = 'object.project';
	var angModule = angular.module(moduleName);

	angModule.controller('objectProjectLevelListController', ObjectProjectLevelListController);

	ObjectProjectLevelListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectProjectLevelListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '230a2d63c31e429486325c62660afcca');
	}
})(angular);