(function (angular) {
	'use strict';

	var moduleName = 'project.inforequest';

	angular.module(moduleName).controller('projectInfoRequestContributionListController', ProjectInfoRequestContributionListController);

	ProjectInfoRequestContributionListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectInfoRequestContributionListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, 'Project.InfoRequest', '65becece765a419099b148c803a116f5');
	}
})(angular);