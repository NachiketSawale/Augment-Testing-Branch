/**
 * Created by baf on 2016.06.17.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	angular.module(moduleName).controller('projectMainProjectRemarkController', ProjectMainProjectRemarkController);

	ProjectMainProjectRemarkController.$inject = ['$scope', 'platformSingleRemarkControllerService', 'projectMainService', 'projectMainProjectValidationService', 'projectMainProjectRemarksContainerConfigurationService'];

	function ProjectMainProjectRemarkController($scope, platformSingleRemarkControllerService, projectMainService, projectMainProjectValidationService, projectMainProjectRemarksContainerConfigurationService) {
		platformSingleRemarkControllerService.initController($scope, projectMainService, projectMainProjectValidationService, projectMainProjectRemarksContainerConfigurationService.getContainerLayoutByGUID('fd77a1ee53124d0ebbc1715996942dcc'));
	}
})(angular);