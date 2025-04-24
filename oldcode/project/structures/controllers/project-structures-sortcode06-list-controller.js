/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode06ListController
	 * @description
	 * Controller for the list view of project sortcodes06
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode06ListController', ProjecStructuresSortcode06ListController);

	ProjecStructuresSortcode06ListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode06ListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'bd4aebdaf1fe4a779bb2096946a918a5');
	}
})(angular);