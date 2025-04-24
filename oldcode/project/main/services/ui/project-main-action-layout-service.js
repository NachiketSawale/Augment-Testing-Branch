/**
 * Created by cakiral on 04.11.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainActionLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  project main action entity.
	 **/
	angular.module(moduleName).service('projectMainActionLayoutService', ProjectMainActionLayoutService);

	ProjectMainActionLayoutService.$inject = ['platformUIConfigInitService', 'projectMainContainerInformationService', 'projectMainConstantValues', 'projectMainTranslationService'];

	function ProjectMainActionLayoutService(platformUIConfigInitService, projectMainContainerInformationService, projectMainConstantValues, projectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectMainContainerInformationService.getActionLayout(),
			dtoSchemeId: projectMainConstantValues.schemes.action,
			translator: projectMainTranslationService
		});
	}
})(angular);