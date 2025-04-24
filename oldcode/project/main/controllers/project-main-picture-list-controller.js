(function () {

	/*global angular*/
	'use strict';
	const moduleName = 'project.main';

	/* jshint -W072*/ //many parameters because of dependency injection
	angular.module(moduleName).controller('projectMainPictureListController', ProjectMainPictureListController);

	ProjectMainPictureListController.$inject = ['$scope', 'platformContainerControllerService',
		'basicsCommonDragAndDropFromExplorerControllerService', 'projectMainPictureDataService'];

	function ProjectMainPictureListController($scope, platformContainerControllerService,
		basicsCommonDragAndDropFromExplorerControllerService, projectMainPictureDataService) {

		const dataService = projectMainPictureDataService;
		platformContainerControllerService.initController($scope, moduleName, 'd233150e79da4216b311676ef48051df');

		basicsCommonDragAndDropFromExplorerControllerService.initDragAndDropService($scope, dataService);
	}
})();