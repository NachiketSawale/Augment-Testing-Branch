(function (angular) {
	'use strict';

	var moduleName = 'model.main';

	angular.module(moduleName).controller('modelMainInfoRequestContributionListController', ProjectInfoRequestContributionListController);

	ProjectInfoRequestContributionListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectInfoRequestContributionListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, 'Model.Main', '65becece765a419099b148c803a116f5');
	}
})(angular);