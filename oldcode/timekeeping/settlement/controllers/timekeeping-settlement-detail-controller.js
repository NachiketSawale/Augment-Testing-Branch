/**
 * Created by Sudarshan on 30.08.2020
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.settlement';

	/**
	 * @ngdoc controller
	 * @name timekeepingSettlementDetailController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping settlement entities.
	 **/

	angular.module(moduleName).controller('timekeepingSettlementDetailController', TimekeepingSettlementDetailController);

	TimekeepingSettlementDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingSettlementDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5608ca31f98343ee8fc34b832eabb893');
	}
})(angular);
