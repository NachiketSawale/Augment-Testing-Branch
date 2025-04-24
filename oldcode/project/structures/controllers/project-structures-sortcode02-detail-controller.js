/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode02DetailController
	 * @description
	 * Controller for the detail view of project sortcodes01
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode02DetailController', ProjecStructuresSortcode02DetailController);

	ProjecStructuresSortcode02DetailController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode02DetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '77058c67284b412e92a65bfab55f8beb', 'projectMainTranslationService');
	}
})(angular);