/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode04ListController
	 * @description
	 * Controller for the list view of project sortcodes04
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode04ListController', ProjecStructuresSortcode04ListController);

	ProjecStructuresSortcode04ListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode04ListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '4232f7b7aa174dc9b9b1cbfb2d92e61b');
	}
})(angular);