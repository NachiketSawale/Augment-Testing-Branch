/**
 * Created by shen on 1/18/2024
 */

(function (angular) {
	'use strict';
	let moduleName = 'resource.type';

	/**
	 * @ngdoc controller
	 * @name resourceTypeRequestedSkillVLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource type requested skill view entity.
	 **/
	angular.module(moduleName).service('resourceTypeRequestedSkillVLayoutService', ResourceTypeRequestedSkillVLayoutService);

	ResourceTypeRequestedSkillVLayoutService.$inject = ['platformUIConfigInitService', 'resourceTypeContainerInformationService', 'resourceTypeConstantValues', 'resourceTypeTranslationService'];

	function ResourceTypeRequestedSkillVLayoutService(platformUIConfigInitService, resourceTypeContainerInformationService, resourceTypeConstantValues, resourceTypeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceTypeContainerInformationService.getRequestedSkillVLayout(),
			dtoSchemeId: resourceTypeConstantValues.schemes.requestedSkillV,
			translator: resourceTypeTranslationService
		});
	}
})(angular);