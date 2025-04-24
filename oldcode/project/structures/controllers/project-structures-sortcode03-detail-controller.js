/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode03DetailController
	 * @description
	 * Controller for the detail view of project sortcodes01
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode03DetailController', ProjecStructuresSortcode03DetailController);

	ProjecStructuresSortcode03DetailController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode03DetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '67f570d0ac7c4ee7b0049f7bd2069eaa', 'projectMainTranslationService');
	}
})(angular);