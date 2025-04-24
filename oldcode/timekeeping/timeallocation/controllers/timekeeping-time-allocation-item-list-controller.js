/**
 * Created by sprotte on 15/09/21
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.timeallocation';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeallocationItemListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping timeallocation timeallocation header entities.
	 **/

	angular.module(moduleName).controller('timekeepingTimeallocationItemListController', TimekeepingTimeallocationItemListController);

	TimekeepingTimeallocationItemListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingTimeallocationItemListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a3b5c55c64f74de89c84f8265b8cef42');
	}
})(angular);