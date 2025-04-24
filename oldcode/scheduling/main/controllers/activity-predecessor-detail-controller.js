/**
 * Created by baf on 04.09.2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingMainPredecessorDetailController', SchedulingMainPredecessorDetailController);

	SchedulingMainPredecessorDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingMainPredecessorDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e65b9fddd0a7404c9cbf6c111e1dac81', 'schedulingMainTranslationService');
	}

})(angular);