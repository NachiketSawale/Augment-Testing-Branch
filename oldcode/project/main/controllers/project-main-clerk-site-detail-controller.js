/**
 * Created by baf on 20.09.2022
 */

(function (angular) {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainClerkSiteDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of project main clerkSite entities.
	 **/
	angular.module(moduleName).controller('projectMainClerkSiteDetailController', ProjectMainClerkSiteDetailController);

	ProjectMainClerkSiteDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainClerkSiteDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '635efc6ae0534575b2a93847cef76139');
	}

})(angular);