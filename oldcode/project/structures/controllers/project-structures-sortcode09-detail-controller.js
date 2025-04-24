/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode09DetailController
	 * @description
	 * Controller for the detail view of project sortcodes09
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode09DetailController', ProjecStructuresSortcode09DetailController);

	ProjecStructuresSortcode09DetailController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode09DetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f38d7efcb775488191ed248bf121f52d', 'projectMainTranslationService');
	}
})(angular);