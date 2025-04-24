/**
 * Created by Sudarshan on 30.03.2023.
 */
(function () {
	'use strict';
	const moduleName = 'timekeeping.employee';
	const angModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('timekeepingEmployeeCertificationController', TimekeepingEmployeeCertificationController);

	TimekeepingEmployeeCertificationController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeeCertificationController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '16e0f41c255e48038090ab70a92692e7');
	}
})();