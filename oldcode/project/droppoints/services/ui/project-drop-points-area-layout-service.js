/**
 * Created by nitsche on 21.01.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let module = angular.module('project.droppoints');

	/**
	 * @ngdoc service
	 * @name projectDropPointsAreaLayoutService
	 * @description This service provides standard layout for grid / form of  resource equipment DropPointHeader entity.
	 */
	module.service('projectDropPointsAreaLayoutService', ProjectDropPointsAreaLayoutService);

	ProjectDropPointsAreaLayoutService.$inject = ['projectDropPointsConstantValues', 'projectDropPointsTranslationService', 'platformUIConfigInitService', 'projectDroppointsContainerInformationService'];

	function ProjectDropPointsAreaLayoutService(projectDropPointsConstantValues, projectDropPointsTranslationService, platformUIConfigInitService, projectDroppointsContainerInformationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectDroppointsContainerInformationService.getDropPointAreaLayout(),
			dtoSchemeId: projectDropPointsConstantValues.schemes.project,
			translator: projectDropPointsTranslationService
		});
	}
})(angular);