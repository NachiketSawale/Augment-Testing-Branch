/**
 * Created by cakiral on 01.08.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectRequisitionsLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource project requisitions entity.
	 **/
	angular.module(moduleName).service('resourceProjectRequisitionsLayoutService', ResourceProjectRequisitionsLayoutService);

	ResourceProjectRequisitionsLayoutService.$inject = ['platformUIConfigInitService', 'resourceProjectContainerInformationService', 'resourceProjectConstantValues', 'resourceProjectTranslationService'];

	function ResourceProjectRequisitionsLayoutService(platformUIConfigInitService, resourceProjectContainerInformationService, resourceProjectConstantValues, resourceProjectTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceProjectContainerInformationService.getResourceProjectRequisitionsLayout(),
			dtoSchemeId: resourceProjectConstantValues.schemes.requisitions,
			translator: resourceProjectTranslationService,
		});
	}
})(angular);