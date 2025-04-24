/**
 * Created by nitsche on 27.01.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'project.droppoints';

	/**
	 * @ngdoc controller
	 * @name projectDropPointsAreaListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of droppointheader entities.
	 **/

	angular.module(moduleName).controller('projectDropPointsAreaListController', ProjectDropPointsAreaListController);

	ProjectDropPointsAreaListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectDropPointsAreaListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3a0dc5aa130e4d95af119b5c76ef47f8');
	}
})(angular);