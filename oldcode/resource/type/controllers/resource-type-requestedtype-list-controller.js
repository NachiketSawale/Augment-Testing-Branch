/**
 * Created by shen on 1/18/2024
 */

(function (angular) {
	'use strict';
	let moduleName = 'resource.type';

	/**
	 * @ngdoc controller
	 * @name resourceTypeRequestedTypeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource type requested type entities.
	 **/

	angular.module(moduleName).controller('resourceTypeRequestedTypeListController', ResourceTypeRequestedTypeListController);

	ResourceTypeRequestedTypeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceTypeRequestedTypeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '009af8b7d07b48d5879e220f684e207e');
	}
})(angular);