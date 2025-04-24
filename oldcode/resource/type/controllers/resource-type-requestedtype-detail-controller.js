/**
 * Created by shen on 1/18/2024
 */

(function (angular) {

	'use strict';
	let moduleName = 'resource.type';

	/**
	 * @ngdoc controller
	 * @name resourceTypeRequestedTypeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource type requested type entities.
	 **/
	angular.module(moduleName).controller('resourceTypeRequestedTypeDetailController', ResourceTypeRequestedTypeDetailController);

	ResourceTypeRequestedTypeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceTypeRequestedTypeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f7836fe22b9445e69cd2f881d69fa610');
	}

})(angular);