/**
 * Created by nitsche on 27.01.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'project.droppoints';

	/**
	 * @ngdoc controller
	 * @name projectDropPointsAreaDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of droppointheader entities.
	 **/

	angular.module(moduleName).controller('projectDropPointsAreaDetailController', ProjectDropPointsAreaDetailController);

	ProjectDropPointsAreaDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectDropPointsAreaDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '44050882a8e14d9386fe79f4fadd0192');
	}
})(angular);