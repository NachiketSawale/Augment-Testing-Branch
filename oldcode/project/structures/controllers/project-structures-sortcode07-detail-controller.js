/**
 * Created by joshi on 27.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';

	/**
	 * @ngdoc controller
	 * @name projecStructuresSortcode07DetailController
	 * @description
	 * Controller for the detail view of project sortcodes07
	 **/
	angular.module(moduleName).controller('projecStructuresSortcode07DetailController', ProjecStructuresSortcode07DetailController);

	ProjecStructuresSortcode07DetailController.$inject = ['$scope','platformContainerControllerService'];
	function ProjecStructuresSortcode07DetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b788d63109d040ceb43615efaaf050a7', 'projectMainTranslationService');
	}
})(angular);