/**
 * Created by baf on 19.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.layout';

	/**
	 * @ngdoc controller
	 * @name timekeepingLayoutInputPhaseGroupListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping layout inputPhaseGroup entities.
	 **/

	angular.module(moduleName).controller('timekeepingLayoutInputPhaseGroupListController', TimekeepingLayoutInputPhaseGroupListController);

	TimekeepingLayoutInputPhaseGroupListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingLayoutInputPhaseGroupListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c56ac5f039ec4cc7a911e9d22953a815');
	}
})(angular);