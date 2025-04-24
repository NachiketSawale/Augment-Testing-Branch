/**
 * Created by nitsche on 19.02.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainActivityDetailController
	 * @function
	 * 
	 * @description
	 * Controller for the detail view of activity entities.
	 **/

	angular.module(moduleName).controller('projectMainActivityDetailController', ProjectMainActivityDetailController);

	ProjectMainActivityDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainActivityDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '69980c941e9d4295b41c586c74919b1f');
	}
})(angular);