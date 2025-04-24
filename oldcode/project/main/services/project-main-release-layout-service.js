/**
 * Created by baf on 20.12.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainReleaseLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  project main release entity.
	 **/
	angular.module(moduleName).service('projectMainReleaseLayoutService', ProjectMainReleaseLayoutService);

	ProjectMainReleaseLayoutService.$inject = ['platformUIConfigInitService', 'projectMainContainerInformationService', 'projectMainConstantValues', 'projectMainTranslationService'];

	function ProjectMainReleaseLayoutService(platformUIConfigInitService, projectMainContainerInformationService, projectMainConstantValues, projectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectMainContainerInformationService.getReleaseLayout(),
			dtoSchemeId: projectMainConstantValues.schemes.release,
			translator: projectMainTranslationService
		});
	}
})(angular);