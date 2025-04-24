/**
 * Created by lnt on 7/31/2019.
 */

(function (angular) {
	/*global angular*/
	'use strict';
	var moduleName = 'basics.costgroups';

	/**
	 * @ngdoc controller
	 * @name basicsCostGroupListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of basics costGroup entities.
	 **/

	angular.module(moduleName).controller('basicsCostGroupListController', BasicsCostGroupListController);

	BasicsCostGroupListController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCostGroupListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '53BBF195FCA0C866020EB155E43DB648');
	}
})(angular);
