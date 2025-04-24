(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingMainBaseLineDetailController', SchedulingMainBaseLineDetailController);

	SchedulingMainBaseLineDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingMainBaseLineDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '991140E3E8864074821A60EF3D8286A6', 'schedulingMainTranslationService');
	}

})(angular);