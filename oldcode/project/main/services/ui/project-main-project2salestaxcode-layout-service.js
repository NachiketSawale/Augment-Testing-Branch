/**
 * Created by shen on 1/3/2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name project2SalesTaxCodeLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  project main project2salestaxcode entity.
	 **/
	angular.module(moduleName).service('project2SalesTaxCodeLayoutService', Project2SalesTaxCodeLayoutService);

	Project2SalesTaxCodeLayoutService.$inject = ['platformUIConfigInitService', 'projectMainContainerInformationService', 'projectMainConstantValues', 'projectMainTranslationService'];

	function Project2SalesTaxCodeLayoutService(platformUIConfigInitService, projectMainContainerInformationService, projectMainConstantValues, projectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectMainContainerInformationService.getProject2SalesTaxCodeLayout(),
			dtoSchemeId: projectMainConstantValues.schemes.project2SalesTaxCode,
			translator: projectMainTranslationService
		});
	}
})(angular);
