/**
 * Created by baf on 05.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.period';

	/**
	 * @ngdoc controller
	 * @name timekeepingPeriodListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping period period entities.
	 **/

	angular.module(moduleName).controller('timekeepingPeriodListController', TimekeepingPeriodListController);

	TimekeepingPeriodListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingPeriodListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7d9965a4006c4a9fac97f8514baf6b4d');
	}
})(angular);