/**
 * Created by baf on 15.05.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainBillToLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  project main billTo entity.
	 **/
	angular.module(moduleName).service('projectMainBillToLayoutService', ProjectMainBillToLayoutService);

	ProjectMainBillToLayoutService.$inject = ['platformUIConfigInitService', 'projectMainContainerInformationService', 'projectMainConstantValues', 'projectMainTranslationService'];

	function ProjectMainBillToLayoutService(platformUIConfigInitService, projectMainContainerInformationService, projectMainConstantValues, projectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectMainContainerInformationService.getBillToLayout(),
			dtoSchemeId: projectMainConstantValues.schemes.billTo,
			translator: projectMainTranslationService
		});
	}
})(angular);