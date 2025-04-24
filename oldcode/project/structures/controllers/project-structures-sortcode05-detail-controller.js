/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode05DetailController
	 * @description
	 * Controller for the detail view of project sortcodes05
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode05DetailController', ProjecStructuresSortcode05DetailController);

	ProjecStructuresSortcode05DetailController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode05DetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e5c93bd4eba44faeb922d79718f9d69e', 'projectMainTranslationService');
	}
})(angular);