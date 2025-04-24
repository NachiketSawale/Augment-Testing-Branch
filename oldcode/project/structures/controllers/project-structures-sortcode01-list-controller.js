/**
 * Created by joshi on 25.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode01ListController
	 * @description
	 * Controller for the list view of project sortcodes01
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode01ListController', ProjecStructuresSortcode01ListController);

	ProjecStructuresSortcode01ListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode01ListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9ae8c2111f354edea6c775fb64469de3');
	}
})(angular);