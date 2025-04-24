(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainTimekeepingClerkLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  project main timekeeping2clerk entity.
	 **/
	angular.module(moduleName).service('projectMainTimekeepingClerkLayoutService', ProjectMainTimekeepingClerkLayoutService);

	ProjectMainTimekeepingClerkLayoutService.$inject = ['platformUIConfigInitService', 'projectMainContainerInformationService', 'projectMainConstantValues', 'projectMainTranslationService'];

	function ProjectMainTimekeepingClerkLayoutService(platformUIConfigInitService, projectMainContainerInformationService, projectMainConstantValues, projectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectMainContainerInformationService.getProjectMainTimekeepingClerkLayoutService(),
			dtoSchemeId: projectMainConstantValues.schemes.timekeeping2Clerk,
			translator: projectMainTranslationService
		});
	}
})(angular);