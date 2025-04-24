/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode06DetailController
	 * @description
	 * Controller for the detail view of project sortcodes06
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode06DetailController', ProjecStructuresSortcode06DetailController);

	ProjecStructuresSortcode06DetailController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode06DetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2ae50bf1b5074521a66f799b5b2db27b', 'projectMainTranslationService');
	}
})(angular);