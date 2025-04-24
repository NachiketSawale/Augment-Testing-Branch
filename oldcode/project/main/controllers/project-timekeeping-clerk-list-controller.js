(function () {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainTimekeepingClerkListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the timekeeping2clerk
	 **/
	angular.module(moduleName).controller('projectMainTimekeepingClerkListController', ProjectMainTimekeepingClerkListController);

	ProjectMainTimekeepingClerkListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjectMainTimekeepingClerkListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f15717298ad24cf0a7891b3a4a6900ba');
	}
})();