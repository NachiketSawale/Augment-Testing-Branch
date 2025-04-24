/**
 * Created by shen on 1/4/2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name salesTaxMatrixLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  project main salesTaxMatrix entity.
	 **/
	angular.module(moduleName).service('salesTaxMatrixLayoutService', SalesTaxMatrixLayoutService);

	SalesTaxMatrixLayoutService.$inject = ['platformUIConfigInitService', 'projectMainContainerInformationService', 'projectMainConstantValues', 'projectMainTranslationService'];

	function SalesTaxMatrixLayoutService(platformUIConfigInitService, projectMainContainerInformationService, projectMainConstantValues, projectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectMainContainerInformationService.getSalesTaxMatrixLayout(),
			dtoSchemeId: projectMainConstantValues.schemes.salesTaxMatrix,
			translator: projectMainTranslationService
		});
	}
})(angular);
