/**
 * Created by nitsche on 27.01.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'project.droppoints';

	/**
	 * @ngdoc controller
	 * @name projectDropPointsDropPointListController
	 * @function
	 * 
	 * @description
	 * Controller for the list view of droppoint entities.
	 **/

	angular.module(moduleName).controller('projectDropPointsDropPointListController', ProjectDropPointsDropPointListController);

	ProjectDropPointsDropPointListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectDropPointsDropPointListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '21b52f02742f4796a8e165d8ead4f9d5');
	}
})(angular);