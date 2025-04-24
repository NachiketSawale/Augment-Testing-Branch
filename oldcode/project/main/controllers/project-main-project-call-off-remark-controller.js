/**
 * Created by baf on 2016.06.17.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	angular.module(moduleName).controller('projectMainProjectCallOffRemarkController', ProjectMainProjectCallOffRemarkController);

	ProjectMainProjectCallOffRemarkController.$inject = ['$scope', 'platformSingleRemarkControllerService', 'projectMainService', 'projectMainProjectValidationService', 'projectMainProjectRemarksContainerConfigurationService'];

	function ProjectMainProjectCallOffRemarkController($scope, platformSingleRemarkControllerService, projectMainService, projectMainProjectValidationService, projectMainProjectRemarksContainerConfigurationService) {
		platformSingleRemarkControllerService.initController($scope, projectMainService, projectMainProjectValidationService, projectMainProjectRemarksContainerConfigurationService.getContainerLayoutByGUID('8f8e4f4d4d3f4ccb9a4fb173f849d18d'));
	}
})(angular);