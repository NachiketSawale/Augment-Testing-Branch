/**
 * Created by baf on 20.09.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainClerkSiteLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  project main clerkSite entity.
	 **/
	angular.module(moduleName).service('projectMainClerkSiteLayoutService', ProjectMainClerkSiteLayoutService);

	ProjectMainClerkSiteLayoutService.$inject = ['platformUIConfigInitService', 'projectMainContainerInformationService', 'projectMainConstantValues', 'projectMainTranslationService'];

	function ProjectMainClerkSiteLayoutService(platformUIConfigInitService, projectMainContainerInformationService, projectMainConstantValues, projectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectMainContainerInformationService.getProjectMainClerkSiteLayout(),
			dtoSchemeId: projectMainConstantValues.schemes.clerkSite,
			translator: projectMainTranslationService
		});
	}
})(angular);