/**
 * Created by Sudarshan on 30.08.2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.settlement';

	/**
	 * @ngdoc controller
	 * @name timekeepingSettlementItemListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping settlement item entities.
	 **/

	angular.module(moduleName).controller('timekeepingSettlementItemListController', TimekeepingSettlementItemListController);

	TimekeepingSettlementItemListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingSettlementItemListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6f4303109d94448bb98e71852946e039');
	}
})(angular);