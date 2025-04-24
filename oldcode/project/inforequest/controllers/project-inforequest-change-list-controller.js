(function (angular) {
	'use strict';
	var moduleName = 'project.inforequest';

	/**
	 * @ngdoc controller
	 * @name ProjectInfoRequestChangeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project inforequest change entities.
	 **/

	angular.module(moduleName).controller('projectInfoRequestChangeListController', ProjectInfoRequestChangeListController);

	ProjectInfoRequestChangeListController.$inject = ['$injector','$scope', '$translate', 'platformContainerControllerService', 'projectInfoRequestWizardService','platformModalService'];

	function ProjectInfoRequestChangeListController($injector, $scope, $translate, platformContainerControllerService, projectInfoRequestWizardService, platformModalService) {
		platformContainerControllerService.initController($scope, 'Project.InfoRequest', 'e4d3d8b0003644d49277d2283714b396');

		var origDrop = $scope.ddTarget.drop;
		$scope.ddTarget.drop = function (info) {
			projectInfoRequestWizardService.createChangeRFI();
		};
	}
})(angular);