/**
 * Created by nitsche on 21.01.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let module = angular.module('project.droppoints');

	/**
	 * @ngdoc service
	 * @name projectDropPointsDropPointLayoutService
	 * @description This service provides standard layout for grid / form of  resource equipment DropPoint entity.
	 */
	module.service('projectDropPointsDropPointLayoutService', ProjectDropPointsDropPointLayoutService);

	ProjectDropPointsDropPointLayoutService.$inject = ['projectDropPointsConstantValues', 'projectDropPointsTranslationService', 'platformUIConfigInitService', 'projectDroppointsContainerInformationService'];

	function ProjectDropPointsDropPointLayoutService(projectDropPointsConstantValues, projectDropPointsTranslationService, platformUIConfigInitService, projectDroppointsContainerInformationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectDroppointsContainerInformationService.getDropPointLayout(),
			dtoSchemeId: projectDropPointsConstantValues.schemes.dropPoint,
			translator: projectDropPointsTranslationService
		});
	}
})(angular);