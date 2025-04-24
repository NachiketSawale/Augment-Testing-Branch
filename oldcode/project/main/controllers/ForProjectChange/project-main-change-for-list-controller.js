(function () {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name ProjectMainForChangeListController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of any kind of entity belonging to an asset
	 **/
	angular.module(moduleName).controller('projectMainForChangeListController', ProjectMainForChangeListController);

	ProjectMainForChangeListController.$inject = ['$scope', 'platformContainerControllerService','projectMainContainerInformationService', 'projectMainForProjectChangeContainerService'];

	function ProjectMainForChangeListController($scope, platformContainerControllerService, projectMainContainerInformationService, projectMainForProjectChangeContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!projectMainContainerInformationService.hasDynamic(containerUid)) {
			projectMainForProjectChangeContainerService.prepareGridConfig(containerUid, $scope, projectMainContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();