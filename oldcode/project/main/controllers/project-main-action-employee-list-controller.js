/**
 * Created by baf on 23.10.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainActionEmployeeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project main actionEmployee entities.
	 **/

	angular.module(moduleName).controller('projectMainActionEmployeeListController', ProjectMainActionEmployeeListController);

	ProjectMainActionEmployeeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainActionEmployeeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a10753eb750d4f208863daef08e31f0d');
	}
})(angular);