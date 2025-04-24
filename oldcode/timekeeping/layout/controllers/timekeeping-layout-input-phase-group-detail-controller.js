/**
 * Created by baf on 19.06.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.layout';

	/**
	 * @ngdoc controller
	 * @name timekeepingLayoutInputPhaseGroupDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping layout inputPhaseGroup entities.
	 **/
	angular.module(moduleName).controller('timekeepingLayoutInputPhaseGroupDetailController', TimekeepingLayoutInputPhaseGroupDetailController);

	TimekeepingLayoutInputPhaseGroupDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingLayoutInputPhaseGroupDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'dc9c2426a7d442bb9dd7eb343773cad9');
	}

})(angular);