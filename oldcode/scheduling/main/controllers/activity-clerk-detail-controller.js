/**
 * Created by baf on 04.09.2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingMainClerkDetailController', SchedulingMainClerkDetailController);

	SchedulingMainClerkDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingMainClerkDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '13C7FF9D5FB24B96A2274507FA453422', 'schedulingMainTranslationService');
	}
})(angular);
