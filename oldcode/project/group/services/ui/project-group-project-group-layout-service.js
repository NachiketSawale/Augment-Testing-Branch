/**
 * Created by nitsche on 21.10.2022
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('project.group');

	/**
	 * @ngdoc service
	 * @name projectGroupProjectGroupLayoutService
	 * @description This service provides standard layout for grid / form of  resource equipment ProjectGroup entity.
	 */
	myModule.service('projectGroupProjectGroupLayoutService', ProjectGroupProjectGroupLayoutService);

	ProjectGroupProjectGroupLayoutService.$inject = ['projectGroupConstantValues', 'projectGroupTranslationService', 'platformUIConfigInitService', 'projectGroupContainerInformationService'];

	function ProjectGroupProjectGroupLayoutService(projectGroupConstantValues, projectGroupTranslationService, platformUIConfigInitService, projectGroupContainerInformationService) {
		let self = this;
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectGroupContainerInformationService.getProjectGroupLayout(),
			dtoSchemeId: projectGroupConstantValues.schemes.projectGroup,
			translator: projectGroupTranslationService
		});
	}
})(angular);