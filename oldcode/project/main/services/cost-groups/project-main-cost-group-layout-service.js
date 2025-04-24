/**
 * Created by baf on 04.07.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainCostGroupLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  project main costGroup entity.
	 **/
	angular.module(moduleName).service('projectMainCostGroupLayoutService', ProjectMainCostGroupLayoutService);

	ProjectMainCostGroupLayoutService.$inject = ['platformUIConfigInitService', 'projectMainContainerInformationService', 'projectMainConstantValues', 'projectMainTranslationService'];

	function ProjectMainCostGroupLayoutService(platformUIConfigInitService, projectMainContainerInformationService, projectMainConstantValues, projectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectMainContainerInformationService.getCostGroupLayout(),
			dtoSchemeId: projectMainConstantValues.schemes.costGroup,
			translator: projectMainTranslationService
		});
	}
})(angular);