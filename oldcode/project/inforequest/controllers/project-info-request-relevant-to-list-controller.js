(function (angular) {
	'use strict';

	var moduleName = 'project.inforequest';

	angular.module(moduleName).controller('projectInfoRequestRelevantToListController', ProjectInfoRequestRelevantToListController);

	ProjectInfoRequestRelevantToListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectInfoRequestRelevantToListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, 'Project.InfoRequest', '55f24a16454c4b8ab9fbf2e4fe2e90e6');
	}
})(angular);