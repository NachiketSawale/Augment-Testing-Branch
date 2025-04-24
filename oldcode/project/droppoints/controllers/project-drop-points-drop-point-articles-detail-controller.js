/**
 * Created by nitsche on 27.01.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'project.droppoints';

	/**
	 * @ngdoc controller
	 * @name projectDropPointsDropPointArticlesDetailController
	 * @function
	 * 
	 * @description
	 * Controller for the detail view of droppointarticles entities.
	 **/

	angular.module(moduleName).controller('projectDropPointsDropPointArticlesDetailController', ProjectDropPointsDropPointArticlesDetailController);

	ProjectDropPointsDropPointArticlesDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectDropPointsDropPointArticlesDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'eea4f9c32c8b4560b09f926350aa28c8');
	}
})(angular);