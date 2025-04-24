/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode10DetailController
	 * @description
	 * Controller for the detail view of project sortcodes10
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode10DetailController', ProjecStructuresSortcode10DetailController);

	ProjecStructuresSortcode10DetailController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode10DetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9e2d856e32cf4e4aa36a79f29b1ce59f', 'projectMainTranslationService');
	}
})(angular);