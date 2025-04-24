/**
 * Created by baf on 26.01.2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingMainEventDetailController', SchedulingMainEventDetailController);

	SchedulingMainEventDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingMainEventDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'E006376F2DBA4A8D97D6BAB94F1E36E0', 'schedulingMainTranslationService');
	}

})(angular);