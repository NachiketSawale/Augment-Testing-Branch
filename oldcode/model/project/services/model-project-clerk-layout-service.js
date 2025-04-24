/**
 * $Id:
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.project';

	/**
	 * @ngdoc controller
	 * @name modelProjectClerkLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  model Project clerk entity.
	 **/
	angular.module(moduleName).service('modelProjectClerkLayoutService', modelProjectClerkLayoutService);

	modelProjectClerkLayoutService.$inject = ['platformUIConfigInitService', 'modelProjectContainerInformationService', 'modelProjectMainTranslationService'];

	function modelProjectClerkLayoutService(platformUIConfigInitService, modelProjectContainerInformationService, modelProjectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: modelProjectContainerInformationService.getModelProjectClerkLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Model.Project',
				typeName: 'ModelClerkRoleDto'
			},
			translator: modelProjectMainTranslationService
		});
	}
})(angular);