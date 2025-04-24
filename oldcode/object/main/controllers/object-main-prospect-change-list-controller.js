(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'object.main';
	var angModule = angular.module(moduleName);

	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('objectMainProspectChangeListController', ObjectMainProspectChangeListController);

	ObjectMainProspectChangeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainProspectChangeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '47c8300404b9436282791d79db6d9cb6');
	}
})();