/**
 * Created by leo on 08.05.2018.
 */
(function () {
	'use strict';
	const moduleName = 'timekeeping.employee';
	const angModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('timekeepingEmployeePictureListController', TimekeepingEmployeePictureListController);

	TimekeepingEmployeePictureListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeePictureListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'cb717989d7494402a312e14f00974d51');
	}
})();