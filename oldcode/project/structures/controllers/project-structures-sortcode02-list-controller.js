/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode02ListController
	 * @description
	 * Controller for the list view of project sortcodes02
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode02ListController', ProjecStructuresSortcode02ListController);

	ProjecStructuresSortcode02ListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode02ListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '8a747d2e83ab42ed8c918f9840af2b2e');
	}
})(angular);