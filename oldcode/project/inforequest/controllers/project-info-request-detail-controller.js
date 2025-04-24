(function (angular) {
	'use strict';

	var moduleName = 'project.inforequest';

	angular.module(moduleName).controller('projectInfoRequestDetailController', ProjectInfoRequestDetailController);

	ProjectInfoRequestDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'modelViewerStandardFilterService', 'projectInfoRequestDataService'];

	function ProjectInfoRequestDetailController($scope, platformContainerControllerService,
	                                            modelViewerStandardFilterService, projectInfoRequestDataService) {
		platformContainerControllerService.initController($scope, 'Project.InfoRequest', '8b9c47c94f0b4077beaaab998c399048', 'projectInfoRequestTranslationService');

		modelViewerStandardFilterService.attachMainEntityFilter($scope, projectInfoRequestDataService.getServiceName());
	}
})(angular);