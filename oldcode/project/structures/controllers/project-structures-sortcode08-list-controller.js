/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode08ListController
	 * @description
	 * Controller for the list view of project sortcodes08
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode08ListController', ProjecStructuresSortcode08ListController);

	ProjecStructuresSortcode08ListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode08ListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3a86e227a1d245148a04d0da26162ac4');
	}
})(angular);