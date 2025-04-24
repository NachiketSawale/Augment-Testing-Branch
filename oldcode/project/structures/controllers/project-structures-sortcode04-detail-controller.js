/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode04DetailController
	 * @description
	 * Controller for the detail view of project sortcodes01
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode04DetailController', ProjecStructuresSortcode04DetailController);

	ProjecStructuresSortcode04DetailController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode04DetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b47caaaecb014b9cabbbcc547eeb83f8', 'projectMainTranslationService');
	}
})(angular);