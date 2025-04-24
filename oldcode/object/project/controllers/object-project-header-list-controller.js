(function (angular) {
	'use strict';
	var moduleName = 'object.project';
	var angModule = angular.module(moduleName);

	angModule.controller('objectProjectHeaderListController', ObjectProjectHeaderListController);

	ObjectProjectHeaderListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectProjectHeaderListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '34ce2fbe7aa74734b5389b19df8646b6');
	}
})(angular);