/**
 * Created by mohit on 29/8/2023
 */


(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingVacationAccountListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping employee vacation account entities.
	 **/

	angular.module(moduleName).controller('timekeepingVacationAccountListController', TimekeepingVacationAccountListController);

	TimekeepingVacationAccountListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingVacationAccountListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'k9903131mo4a48l1a6524c4927252f47');

		let createBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 'create';
		});
		$scope.tools.items.splice(createBtnIdx, 1);

		let deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 'delete';
		});
		$scope.tools.items.splice(deleteBtnIdx, 1);

	}
})(angular);
