(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'object.main';
	var angModule = angular.module(moduleName);

	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('objectMainMeterTypeReadingListController', ObjectMainMeterTypeReadingListController);

	ObjectMainMeterTypeReadingListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainMeterTypeReadingListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2bb446f7ffa94d679d8ea9e7005d6431');
	}
})();