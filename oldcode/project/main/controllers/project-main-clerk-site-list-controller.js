/**
 * Created by baf on 20.09.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainClerkSiteListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project main clerkSite entities.
	 **/

	angular.module(moduleName).controller('projectMainClerkSiteListController', ProjectMainClerkSiteListController);

	ProjectMainClerkSiteListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainClerkSiteListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'dd03663c3664443c9a25f2187bddba84');
	}
})(angular);