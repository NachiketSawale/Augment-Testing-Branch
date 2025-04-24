/**
 * Created by nitsche on 21.10.2022
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'project.group';

	/**
	 * @ngdoc controller
	 * @name projectGroupProjectGroupDetailController
	 * @function
	 * 
	 * @description
	 * Controller for the list view of Project Group ProjectGroup entities.
	 **/

	angular.module(moduleName).controller('projectGroupProjectGroupDetailController', ProjectGroupProjectGroupDetailController);

	ProjectGroupProjectGroupDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectGroupProjectGroupDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c1592f6e58514d3e904e9e5a4a046e35');
	}
})(angular);