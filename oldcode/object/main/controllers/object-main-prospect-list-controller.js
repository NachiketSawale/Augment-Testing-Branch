(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'object.main';
	var angModule = angular.module(moduleName);

	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('objectMainProspectListController', ObjectMainProspectListController);

	ObjectMainProspectListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainProspectListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '98e77e63a57443f096284f2ee00e8f66');
	}
})();