/**
 * Created by baf on 19.06.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.layout';

	/**
	 * @ngdoc controller
	 * @name timekeepingLayoutInputPhaseDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping layout inputPhase entities.
	 **/
	angular.module(moduleName).controller('timekeepingLayoutInputPhaseDetailController', TimekeepingLayoutInputPhaseDetailController);

	TimekeepingLayoutInputPhaseDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingLayoutInputPhaseDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c437bd6038b0485ea206aac36172ee2f');
	}

})(angular);