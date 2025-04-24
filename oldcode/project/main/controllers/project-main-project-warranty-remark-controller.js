/**
 * Created by baf on 2016.06.17.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	angular.module(moduleName).controller('projectMainProjectWarrentyRemarkController', ProjectMainProjectWarrentyRemarkController);

	ProjectMainProjectWarrentyRemarkController.$inject = ['$scope', 'platformSingleRemarkControllerService', 'projectMainService', 'projectMainProjectValidationService', 'projectMainProjectRemarksContainerConfigurationService'];

	function ProjectMainProjectWarrentyRemarkController($scope, platformSingleRemarkControllerService, projectMainService, projectMainProjectValidationService, projectMainProjectRemarksContainerConfigurationService) {
		platformSingleRemarkControllerService.initController($scope, projectMainService, projectMainProjectValidationService, projectMainProjectRemarksContainerConfigurationService.getContainerLayoutByGUID('7e2299e11b01408290b7b3f49548a4a8'));
	}
})(angular);