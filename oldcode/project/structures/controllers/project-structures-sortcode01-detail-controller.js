/**
 * Created by joshi on 25.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode01DetailController
	 * @description
	 * Controller for the detail view of project sortcodes01
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode01DetailController', ProjecStructuresSortcode01DetailController);

	ProjecStructuresSortcode01DetailController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode01DetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b5b27ff9adae4de09deb1e765b53bff9', 'projectMainTranslationService');
	}
})(angular);