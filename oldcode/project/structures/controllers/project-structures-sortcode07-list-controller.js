/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode07ListController
	 * @description
	 * Controller for the list view of project sortcodes07
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode07ListController', ProjecStructuresSortcode07ListController);

	ProjecStructuresSortcode07ListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode07ListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '76cf8afdfef64049b7820423d83c24c5');
	}
})(angular);