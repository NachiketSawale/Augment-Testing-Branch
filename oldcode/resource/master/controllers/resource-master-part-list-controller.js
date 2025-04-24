/**
 * Created by baf on 29.11.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc controller
	 * @name resourceMasterPartListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource master part entities.
	 **/

	angular.module(moduleName).controller('resourceMasterPartListController', ResourceMasterPartListController);

	ResourceMasterPartListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceMasterPartListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'dd7c02126a9c4654bb7d99ece8af7caa');
	}
})(angular);