/**
 * Created by welss on 04.04.2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingMainActivityBaseLineComparisonDetailController', SchedulingMainActivityBaseLineComparisonDetailController);

	SchedulingMainActivityBaseLineComparisonDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingMainActivityBaseLineComparisonDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '07901A0DDC2347698EB076C09CF8160D', 'schedulingMainTranslationService');
	}

})(angular);