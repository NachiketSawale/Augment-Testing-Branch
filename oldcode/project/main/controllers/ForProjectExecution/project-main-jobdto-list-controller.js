(function () {
	/* global globals */
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainForProjectExecutionListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in a project
	 **/
	angular.module(moduleName).controller('projectMainJobDtoListController', ProjectMainForProjectExecutionListController);

	ProjectMainForProjectExecutionListController.$inject = ['$scope', 'platformContainerControllerService','projectMainContainerInformationService', 'projectMainForProjectExecutionContainerService'];

	function ProjectMainForProjectExecutionListController($scope, platformContainerControllerService, projectMainContainerInformationService, projectMainForProjectExecutionContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		//if(true || !projectMainContainerInformationService.hasDynamic(containerUid)) {
		projectMainForProjectExecutionContainerService.prepareGridConfig(containerUid, $scope, projectMainContainerInformationService);
		//}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();
