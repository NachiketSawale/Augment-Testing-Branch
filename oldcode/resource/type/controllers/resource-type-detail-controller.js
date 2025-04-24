/**
 * Created by baf on 2017/08/29.
 */
(function () {

	'use strict';
	var moduleName = 'resource.type';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceTypeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of resource type entities
	 **/
	angModule.controller('resourceTypeDetailController', ResourceTypeDetailController);

	ResourceTypeDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceTypeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '02941383fd24429f9ba46df30b2f6d6c');
	}
})();