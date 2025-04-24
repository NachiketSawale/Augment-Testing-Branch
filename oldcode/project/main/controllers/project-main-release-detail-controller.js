/**
 * Created by baf on 20.12.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainReleaseDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of project main release entities.
	 **/
	angular.module(moduleName).controller('projectMainReleaseDetailController', ProjectMainReleaseDetailController);

	ProjectMainReleaseDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainReleaseDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3447b10db17548e496012f8871b7fdea');
	}

})(angular);