/**
 * Created by Sudarshan on 30.08.2022
 */

(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.settlement';

	/**
	 * @ngdoc controller
	 * @name timekeepingSettlementItemDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping settlement item entities.
	 **/
	angular.module(moduleName).controller('timekeepingSettlementItemDetailController', TimekeepingSettlementItemDetailController);

	TimekeepingSettlementItemDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingSettlementItemDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '643fbcea9f8a44df94c7483549af3ef0');
	}

})(angular);