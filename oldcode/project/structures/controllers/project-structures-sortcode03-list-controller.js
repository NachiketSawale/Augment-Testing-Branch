/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode03ListController
	 * @description
	 * Controller for the list view of project sortcodes03
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode03ListController', ProjecStructuresSortcode03ListController);

	ProjecStructuresSortcode03ListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode03ListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '8b8070460f8c477382a3f4ca0eccecf0');
	}
})(angular);