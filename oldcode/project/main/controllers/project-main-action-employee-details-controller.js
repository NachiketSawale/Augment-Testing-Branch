/**
 * Created by baf on 23.10.2021
 */

(function (angular) {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainActionEmployeeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of project main actionEmployee entities.
	 **/
	angular.module(moduleName).controller('projectMainActionEmployeeDetailController', ProjectMainActionEmployeeDetailController);

	ProjectMainActionEmployeeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainActionEmployeeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '8e59e6b041084802a12a64d7e52a2b43');
	}

})(angular);