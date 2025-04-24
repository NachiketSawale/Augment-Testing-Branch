/**
 * Created by nitsche on 27.01.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'project.droppoints';

	/**
	 * @ngdoc controller
	 * @name projectDropPointsDropPointDetailController
	 * @function
	 * 
	 * @description
	 * Controller for the detail view of droppoint entities.
	 **/

	angular.module(moduleName).controller('projectDropPointsDropPointDetailController', ProjectDropPointsDropPointDetailController);

	ProjectDropPointsDropPointDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectDropPointsDropPointDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b485c4cb24344d54aef27530cc7d7563');
	}
})(angular);