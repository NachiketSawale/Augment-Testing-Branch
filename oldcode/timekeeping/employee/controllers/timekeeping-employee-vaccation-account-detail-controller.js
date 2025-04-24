/**
 * Created by mohit on 29.08.2023
 */

(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingVacationAccountDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping Vacation Account entities.
	 **/
	angular.module(moduleName).controller('timekeepingVacationAccountDetailController', TimekeepingVacationAccountDetailController);

	TimekeepingVacationAccountDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingVacationAccountDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '1829a2061c0f45a790536a4741ec897c');
	}

})(angular);
