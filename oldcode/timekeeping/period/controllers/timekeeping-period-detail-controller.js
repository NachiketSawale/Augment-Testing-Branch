/**
 * Created by baf on 05.06.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.period';

	/**
	 * @ngdoc controller
	 * @name timekeepingPeriodDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping period period entities.
	 **/
	angular.module(moduleName).controller('timekeepingPeriodDetailController', TimekeepingPeriodDetailController);

	TimekeepingPeriodDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingPeriodDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '670b62e97f124e208db778cb7135220a');
	}

})(angular);