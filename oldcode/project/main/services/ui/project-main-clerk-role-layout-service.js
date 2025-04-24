/**
 * Created by baf on 14.09.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainClerkRoleLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  project main clerkRole entity.
	 **/
	angular.module(moduleName).service('projectMainClerkRoleLayoutService', ProjectMainClerkRoleLayoutService);

	ProjectMainClerkRoleLayoutService.$inject = ['platformUIConfigInitService', 'projectMainContainerInformationService', 'projectMainConstantValues', 'projectMainTranslationService'];

	function ProjectMainClerkRoleLayoutService(platformUIConfigInitService, projectMainContainerInformationService, projectMainConstantValues, projectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectMainContainerInformationService.getProjectMainClerkRoleLayout(),
			dtoSchemeId: projectMainConstantValues.schemes.clerkRole,
			translator: projectMainTranslationService
		});
	}
})(angular);