/**
 * Created by nitsche on 19.02.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let module = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainActivityLayoutService
	 * @description This service provides standard layout for grid / form of  resource equipment Activity entity.
	 */
	module.service('projectMainActivityLayoutService', ProjectMainActivityLayoutService);

	ProjectMainActivityLayoutService.$inject = ['projectMainConstantValues', 'projectMainTranslationService', 'platformUIConfigInitService', 'projectMainContainerInformationService'];

	function ProjectMainActivityLayoutService(projectMainConstantValues, projectMainTranslationService, platformUIConfigInitService, projectMainContainerInformationService) {
		let self = this;
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectMainContainerInformationService.getActivityLayout(),
			dtoSchemeId: projectMainConstantValues.schemes.activity,
			translator: projectMainTranslationService
		});
	}
})(angular);