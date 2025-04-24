(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'object.main';
	var angModule = angular.module(moduleName);

	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('objectMainProspectActivityListController', ObjectMainProspectActivityListController);

	ObjectMainProspectActivityListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainProspectActivityListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5ce1540a85eb4de0b13ddbd7b7ab09cf');
	}
})();