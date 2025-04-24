/**
 * Created by baf on 14.09.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainClerkRoleListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project main clerkRole entities.
	 **/

	angular.module(moduleName).controller('projectMainClerkRoleListController', ProjectMainClerkRoleListController);

	ProjectMainClerkRoleListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainClerkRoleListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'dc92d091a0d044639d43778058510e8c');
	}
})(angular);