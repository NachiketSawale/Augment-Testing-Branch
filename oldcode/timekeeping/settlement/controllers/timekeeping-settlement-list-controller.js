/**
 * Created by Sudarshan on 30.08.2020
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.settlement';

	/**
	 * @ngdoc controller
	 * @name timekeepingSettlementListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping settlement entities.
	 **/

	angular.module(moduleName).controller('timekeepingSettlementListController', TimekeepingSettlementListController);

	TimekeepingSettlementListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingSettlementListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '128de81cbbe945759306123364a20cb1');
	}
})(angular);