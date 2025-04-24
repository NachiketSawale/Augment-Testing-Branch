(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'object.main';
	var angModule = angular.module(moduleName);

	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('objectMainUnitPhotoListController', ObjectMainUnitPhotoListController);

	ObjectMainUnitPhotoListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainUnitPhotoListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e175af97563843b9925adcd0b60e8d3b');
	}
})();