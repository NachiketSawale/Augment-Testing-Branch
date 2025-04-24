(function (angular) {
	'use strict';
	var moduleName = 'project.inforequest';

	/**
	 * @ngdoc controller
	 * @name ProjectInfoRequestDefectListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project inforequest defect entities.
	 **/

	angular.module(moduleName).controller('projectInfoRequestDefectListController', ProjectInfoRequestDefectListController);

	ProjectInfoRequestDefectListController.$inject = ['$injector','$scope', '$translate', 'platformContainerControllerService', 'projectInfoRequestWizardService'];

	function ProjectInfoRequestDefectListController($injector, $scope, $translate, platformContainerControllerService, projectInfoRequestWizardService) {
		platformContainerControllerService.initController($scope, 'Project.InfoRequest', '535602d9d4ac4955b280670b0414406e');

		var origDrop = $scope.ddTarget.drop;
		$scope.ddTarget.drop = function (info) {
			projectInfoRequestWizardService.createDefectRFI();
		};
	}
})(angular);