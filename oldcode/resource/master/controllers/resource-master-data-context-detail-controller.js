/**
 * Created by baf on 01.02.2021
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc controller
	 * @name resourceMasterDataContextDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource master dataContext entities.
	 **/
	angular.module(moduleName).controller('resourceMasterDataContextDetailController', ResourceMasterDataContextDetailController);

	ResourceMasterDataContextDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceMasterDataContextDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '05193fdb6814494ba4553ccdd6c7279e');
	}

})(angular);