/**
 * Created by baf on 14.09.2022
 */

(function (angular) {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainClerkRoleDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of project main clerkRole entities.
	 **/
	angular.module(moduleName).controller('projectMainClerkRoleDetailController', ProjectMainClerkRoleDetailController);

	ProjectMainClerkRoleDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainClerkRoleDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '400358467500411da957e0ea5e805ca1');
	}

})(angular);