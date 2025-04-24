/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode10ListController
	 * @description
	 * Controller for the list view of project sortcodes10
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode10ListController', ProjecStructuresSortcode10ListController);

	ProjecStructuresSortcode10ListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode10ListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '138e7d85bbc141a29501b08ec1e3d92e');
	}
})(angular);