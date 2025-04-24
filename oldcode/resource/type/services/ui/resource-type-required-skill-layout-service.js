/**
 * Created by baf on 03.12.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.type';

	/**
	 * @ngdoc controller
	 * @name resourceTypeRequiredSkillLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource type requiredSkill entity.
	 **/
	angular.module(moduleName).service('resourceTypeRequiredSkillLayoutService', ResourceTypeRequiredSkillLayoutService);

	ResourceTypeRequiredSkillLayoutService.$inject = ['platformUIConfigInitService', 'resourceTypeContainerInformationService', 'resourceTypeConstantValues', 'resourceTypeTranslationService'];

	function ResourceTypeRequiredSkillLayoutService(platformUIConfigInitService, resourceTypeContainerInformationService, resourceTypeConstantValues, resourceTypeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceTypeContainerInformationService.getRequiredSkillLayout(),
			dtoSchemeId: resourceTypeConstantValues.schemes.requiredSkill,
			translator: resourceTypeTranslationService
		});
	}
})(angular);