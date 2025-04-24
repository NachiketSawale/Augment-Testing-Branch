/**
 * Created by welss on 04.04.2017.
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
	angular.module(moduleName).controller('schedulingMainActivityBaseLineComparisonListController', SchedulingMainActivityBaseLineComparisonListController);

	SchedulingMainActivityBaseLineComparisonListController.$inject = ['$scope', 'platformContainerControllerService'];
	function SchedulingMainActivityBaseLineComparisonListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, 'scheduling.main', 'DE783A504A284F64ABA8C473A95D0262');

	}
})();