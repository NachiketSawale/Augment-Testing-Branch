(function () {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name ProjectMainForChangeDetailController
	 * @function
	 * @description
	 * Controller for the detail view of any kind of entity belonging to an asset
	 **/
	angular.module(moduleName).controller('projectMainForChangeDetailController', ProjectMainForChangeDetailController);

	ProjectMainForChangeDetailController.$inject = ['$scope', 'platformContainerControllerService','projectMainContainerInformationService', 'projectMainForProjectChangeContainerService'];

	function ProjectMainForChangeDetailController($scope, platformContainerControllerService, projectMainContainerInformationService, projectMainForProjectChangeContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!projectMainContainerInformationService.hasDynamic(containerUid)) {
			projectMainForProjectChangeContainerService.prepareDetailConfig(containerUid, $scope, projectMainContainerInformationService);
		}
		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();