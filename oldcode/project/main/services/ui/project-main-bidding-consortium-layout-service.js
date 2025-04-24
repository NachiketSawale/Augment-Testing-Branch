/**
 * Created by baf on 29.06.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainBiddingConsortiumLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  project main biddingConsortium entity.
	 **/
	angular.module(moduleName).service('projectMainBiddingConsortiumLayoutService', ProjectMainBiddingConsortiumLayoutService);

	ProjectMainBiddingConsortiumLayoutService.$inject = ['platformUIConfigInitService', 'projectMainContainerInformationService', 'projectMainConstantValues', 'projectMainTranslationService'];

	function ProjectMainBiddingConsortiumLayoutService(platformUIConfigInitService, projectMainContainerInformationService, projectMainConstantValues, projectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectMainContainerInformationService.getProjectMainBiddingConsortiumLayout(),
			dtoSchemeId: projectMainConstantValues.schemes.biddingConsortium,
			translator: projectMainTranslationService
		});
	}
})(angular);