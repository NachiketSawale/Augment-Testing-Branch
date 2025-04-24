/**
 * Created by baf on 2016.06.17.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	angular.module(moduleName).controller('projectMainProjectTenderRemarkController', ProjectMainProjectTenderRemarkController);

	ProjectMainProjectTenderRemarkController.$inject = ['$scope', 'platformSingleRemarkControllerService', 'projectMainService', 'projectMainProjectValidationService', 'projectMainProjectRemarksContainerConfigurationService'];

	function ProjectMainProjectTenderRemarkController($scope, platformSingleRemarkControllerService, projectMainService, projectMainProjectValidationService, projectMainProjectRemarksContainerConfigurationService) {
		platformSingleRemarkControllerService.initController($scope, projectMainService, projectMainProjectValidationService, projectMainProjectRemarksContainerConfigurationService.getContainerLayoutByGUID('078ea761dbf74be19f8b29cb28705e5a'));
	}
})(angular);