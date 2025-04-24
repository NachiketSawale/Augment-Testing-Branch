/**
 * Created by baf on 04.07.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainCostGroupCatalogLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  project main costGroupCatalog entity.
	 **/
	angular.module(moduleName).service('projectMainCostGroupCatalogLayoutService', ProjectMainCostGroupCatalogLayoutService);

	ProjectMainCostGroupCatalogLayoutService.$inject = ['platformUIConfigInitService', 'projectMainContainerInformationService', 'projectMainConstantValues', 'projectMainTranslationService'];

	function ProjectMainCostGroupCatalogLayoutService(platformUIConfigInitService, projectMainContainerInformationService, projectMainConstantValues, projectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectMainContainerInformationService.getCostGroupCatalogLayout(),
			dtoSchemeId: projectMainConstantValues.schemes.costGroupCatalog,
			translator: projectMainTranslationService
		});
	}
})(angular);