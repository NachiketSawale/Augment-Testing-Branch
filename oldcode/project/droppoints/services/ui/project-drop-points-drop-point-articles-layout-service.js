/**
 * Created by nitsche on 21.01.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let module = angular.module('project.droppoints');

	/**
	 * @ngdoc service
	 * @name projectDropPointsDropPointArticlesLayoutService
	 * @description This service provides standard layout for grid / form of  resource equipment DropPointArticles entity.
	 */
	module.service('projectDropPointsDropPointArticlesLayoutService', ProjectDropPointsDropPointArticlesLayoutService);

	ProjectDropPointsDropPointArticlesLayoutService.$inject = ['projectDropPointsConstantValues', 'projectDropPointsTranslationService', 'platformUIConfigInitService', 'projectDroppointsContainerInformationService'];

	function ProjectDropPointsDropPointArticlesLayoutService(projectDropPointsConstantValues, projectDropPointsTranslationService, platformUIConfigInitService, projectDroppointsContainerInformationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectDroppointsContainerInformationService.getDropPointArticlesLayout(),
			dtoSchemeId: projectDropPointsConstantValues.schemes.dropPointArticles,
			translator: projectDropPointsTranslationService
		});
	}
})(angular);