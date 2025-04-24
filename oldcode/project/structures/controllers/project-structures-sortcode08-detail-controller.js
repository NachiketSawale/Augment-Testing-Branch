/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode08DetailController
	 * @description
	 * Controller for the detail view of project sortcodes08
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode08DetailController', ProjecStructuresSortcode08DetailController);

	ProjecStructuresSortcode08DetailController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode08DetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f4055b7677cb48609b5346cf1c52c480', 'projectMainTranslationService');
	}
})(angular);