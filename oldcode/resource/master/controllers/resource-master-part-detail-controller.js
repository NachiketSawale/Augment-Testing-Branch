/**
 * Created by baf on 29.11.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc controller
	 * @name resourceMasterPartDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource master part entities.
	 **/
	angular.module(moduleName).controller('resourceMasterPartDetailController', ResourceMasterPartDetailController);

	ResourceMasterPartDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceMasterPartDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'bb8ddc00f77c4535ada29aa2fd3b21d7');
	}

})(angular);