/**
 * Created by baf on 01.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc controller
	 * @name resourceMasterDataContextListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource master dataContext entities.
	 **/

	angular.module(moduleName).controller('resourceMasterDataContextListController', ResourceMasterDataContextListController);

	ResourceMasterDataContextListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceMasterDataContextListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '37f6e0ad6d0f4f50acbd4b74d294ebdd');
	}
})(angular);