(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingMainLineItemProgressDetailController', SchedulingMainLineItemProgressDetailController);

	SchedulingMainLineItemProgressDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingMainLineItemProgressDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7DCAA269EC3F4BAC8059B6C2AF97BAE2', 'schedulingMainTranslationService');
	}

})(angular);