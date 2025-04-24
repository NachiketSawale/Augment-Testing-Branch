/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode09ListController
	 * @description
	 * Controller for the list view of project sortcodes09
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode09ListController', ProjecStructuresSortcode09ListController);

	ProjecStructuresSortcode09ListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode09ListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7eb96a183423427c8427f809c658359b');
	}
})(angular);