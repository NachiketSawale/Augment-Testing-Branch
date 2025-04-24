/**
 * Created by baf on 23.10.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainActionEmployeeLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  project main actionEmployee entity.
	 **/
	angular.module(moduleName).service('projectMainActionEmployeeLayoutService', ProjectMainActionEmployeeLayoutService);

	ProjectMainActionEmployeeLayoutService.$inject = ['platformUIConfigInitService', 'projectMainContainerInformationService', 'projectMainConstantValues', 'projectMainTranslationService'];

	function ProjectMainActionEmployeeLayoutService(platformUIConfigInitService, projectMainContainerInformationService, projectMainConstantValues, projectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectMainContainerInformationService.getActionEmployeeLayout(),
			dtoSchemeId: projectMainConstantValues.schemes.actionEmployee,
			translator: projectMainTranslationService
		});
	}
})(angular);