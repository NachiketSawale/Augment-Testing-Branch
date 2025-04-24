/**
 * Created by baf on 20.12.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainReleaseListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project main release entities.
	 **/

	angular.module(moduleName).controller('projectMainReleaseListController', ProjectMainReleaseListController);

	ProjectMainReleaseListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainReleaseListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'fa709a78d4f94faaaf224d31ec05093f');
	}
})(angular);