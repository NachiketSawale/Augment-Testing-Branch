(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainLineItemProgressListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of scheduling elements.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('schedulingMainLineItemProgressListController', SchedulingMainLineItemProgressListController);

	SchedulingMainLineItemProgressListController.$inject = ['$scope', 'platformContainerControllerService','platformTranslateService','schedulingMainLineItemProgressConfigurationService'];
	function SchedulingMainLineItemProgressListController($scope, platformContainerControllerService, platformTranslateService, schedulingMainLineItemProgressConfigurationService) {

		platformTranslateService.translateGridConfig(schedulingMainLineItemProgressConfigurationService.getStandardConfigForListView().columns);

		platformContainerControllerService.initController($scope, 'scheduling.main', '5c2a4c1d66c5438981aa934f449e1d4d');
	}

})(angular);