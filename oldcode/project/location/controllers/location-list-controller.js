(function (angular) {
	'use strict';

	var moduleName = 'project.location';

	/**
	 * @ngdoc controller
	 * @name projectMainProjectListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of locations
	 **/
	angular.module(moduleName).controller('projectLocationListController', ProjectLocationListController);

	ProjectLocationListController.$inject = ['$scope','platformContainerControllerService','projectLocationMainService'];
	function ProjectLocationListController($scope, platformContainerControllerService, projectLocationMainService) {

		// var PARENT_PROP = myGridConfig.parentProp;// todo from location main service
		// var CHILD_PROP = myGridConfig.childProp;

		platformContainerControllerService.initController($scope, moduleName, '42FF27D7F0EA40EABA389D669BE3A1DF');

		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				{
					id: 't12',
					caption: 'project.location.downgradeLocation',
					type: 'item',
					iconClass: 'tlb-icons ico-demote',
					fn: projectLocationMainService.downgradeLocation
				},
				{
					id: 't13',
					caption: 'project.location.upgradeLocation',
					type: 'item',
					iconClass: 'tlb-icons ico-promote',
					fn: projectLocationMainService.upgradeLocation
				}
			]
		});
	}
})(angular);
