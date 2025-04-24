(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingMainActivityDetailController', SchedulingMainActivityDetailController);

	SchedulingMainActivityDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingMainActivityDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '0B1F0E40DA664E4A8081FE8FA6111403', 'schedulingMainTranslationService');
	}

})(angular);




