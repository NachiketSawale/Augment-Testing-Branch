(function (angular) {
	'use strict';

	var moduleName = 'project.inforequest';

	angular.module(moduleName).controller('projectInfoRequestRelevantToDetailController', ProjectInfoRequestRelevantToDetailController);

	ProjectInfoRequestRelevantToDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectInfoRequestRelevantToDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, 'Project.InfoRequest', 'a5779e8fa1d543febfdf92832d44a9e8', 'projectInfoRequestTranslationService');
	}
})(angular);