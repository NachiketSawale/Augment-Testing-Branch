/**
 * Created by chlai on 2025/01/24
 */

(function (angular) {
	'use strict';
	let moduleName = 'resource.type';

	/**
	 * @ngdoc controller
	 * @name resourceTypeAlternativeResTypeLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  alternative resource type entity.
	 **/
	angular.module(moduleName).service('resourceTypeAlternativeResTypeLayoutService', ResourceTypeAlternativeResTypeLayoutService);

	ResourceTypeAlternativeResTypeLayoutService.$inject = ['platformUIConfigInitService', 'resourceTypeContainerInformationService', 'resourceTypeConstantValues', 'resourceTypeTranslationService'];

	function ResourceTypeAlternativeResTypeLayoutService(platformUIConfigInitService, resourceTypeContainerInformationService, resourceTypeConstantValues, resourceTypeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceTypeContainerInformationService.getAlternativeResTypeLayout(),
			dtoSchemeId: resourceTypeConstantValues.schemes.alternativeResType,
			translator: resourceTypeTranslationService
		});
	}
})(angular);