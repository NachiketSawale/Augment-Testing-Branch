/**
 * Created by baf on 2017/08/23.
 */
(function () {

	'use strict';
	var moduleName = 'resource.type';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceTypeListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of resource type entities.
	 **/
	angModule.controller('resourceTypeListController', ResourceTypeListController);

	ResourceTypeListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceTypeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b881141e03c14ddfb1aa965c0cb9ea2c');
	}
})();