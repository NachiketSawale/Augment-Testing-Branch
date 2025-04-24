/**
 * Created by shen on 1/18/2024
 */

(function (angular) {
	'use strict';
	let moduleName = 'resource.type';

	/**
	 * @ngdoc controller
	 * @name resourceTypeRequestedTypeLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource type requested type entity.
	 **/
	angular.module(moduleName).service('resourceTypeRequestedTypeLayoutService', ResourceTypeRequestedTypeLayoutService);

	ResourceTypeRequestedTypeLayoutService.$inject = ['platformUIConfigInitService', 'resourceTypeContainerInformationService', 'resourceTypeConstantValues', 'resourceTypeTranslationService'];

	function ResourceTypeRequestedTypeLayoutService(platformUIConfigInitService, resourceTypeContainerInformationService, resourceTypeConstantValues, resourceTypeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceTypeContainerInformationService.getRequestedTypeLayout(),
			dtoSchemeId: resourceTypeConstantValues.schemes.requestedType,
			translator: resourceTypeTranslationService
		});
	}
})(angular);