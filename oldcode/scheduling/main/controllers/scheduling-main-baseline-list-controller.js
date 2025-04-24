/**
 * Created by leo on 17.08.2015.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainBAseLineListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of scheduling elements.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingMainBaseLineListController', SchedulingMainBaseLineListController);

	SchedulingMainBaseLineListController.$inject = ['$scope', 'platformContainerControllerService', 'schedulingMainBaselineService'];
	function SchedulingMainBaseLineListController($scope, platformContainerControllerService, schedulingMainBaselineService) {
		platformContainerControllerService.initController($scope, 'scheduling.main', 'F6B1110D6E2249A7BA25C8A0D9C27A82');

		schedulingMainBaselineService.assertIsLoaded();
	}
})();