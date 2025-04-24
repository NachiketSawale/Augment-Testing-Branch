/**
 * Created by baf on 20.09.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainBusinessPartnerSiteLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  project main businessPartnerSite entity.
	 **/
	angular.module(moduleName).service('projectMainBusinessPartnerSiteLayoutService', ProjectMainBusinessPartnerSiteLayoutService);

	ProjectMainBusinessPartnerSiteLayoutService.$inject = ['platformUIConfigInitService', 'projectMainContainerInformationService', 'projectMainConstantValues', 'projectMainTranslationService'];

	function ProjectMainBusinessPartnerSiteLayoutService(platformUIConfigInitService, projectMainContainerInformationService, projectMainConstantValues, projectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectMainContainerInformationService.getProjectMainBusinessPartnerSiteLayout(),
			dtoSchemeId: projectMainConstantValues.schemes.bizPartnerSite,
			translator: projectMainTranslationService
		});
	}
})(angular);