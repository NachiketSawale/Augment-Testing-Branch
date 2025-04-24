/**
 * Created by baf on 19.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.layout';

	/**
	 * @ngdoc controller
	 * @name timekeepingLayoutInputPhaseListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping layout inputPhase entities.
	 **/

	angular.module(moduleName).controller('timekeepingLayoutInputPhaseListController', TimekeepingLayoutInputPhaseListController);

	TimekeepingLayoutInputPhaseListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingLayoutInputPhaseListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'bb17574b8bdb4c969bc7f13f78e2ba3c');
	}
})(angular);