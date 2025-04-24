/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode05ListController
	 * @description
	 * Controller for the list view of project sortcodes05
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode05ListController', ProjecStructuresSortcode05ListController);

	ProjecStructuresSortcode05ListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode05ListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5d796e309aeb45318236d806a34f0028');
	}
})(angular);