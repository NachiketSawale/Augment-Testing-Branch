/**
 * Created by leo on 25.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.period';

	/**
	 * @ngdoc controller
	 * @name timekeepingPeriodValidationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping validation  entities.
	 **/

	angular.module(moduleName).controller('timekeepingPeriodValidationListController', TimekeepingValidationListController);

	TimekeepingValidationListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingValidationListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c1f889062e564495853240e4d8f8b5e2');
	}
})(angular);
