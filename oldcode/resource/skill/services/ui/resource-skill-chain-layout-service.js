/**
 * Created by baf on 29.10.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.skill';

	/**
	 * @ngdoc controller
	 * @name resourceSkillSkillChainLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource skill skillChain entity.
	 **/
	angular.module(moduleName).service('resourceSkillChainLayoutService', ResourceSkillChainLayoutService);

	ResourceSkillChainLayoutService.$inject = ['platformUIConfigInitService', 'resourceSkillContainerInformationService', 'resourceSkillConstantValues', 'resourceSkillTranslationService'];

	function ResourceSkillChainLayoutService(platformUIConfigInitService, resourceSkillContainerInformationService, resourceSkillConstantValues, resourceSkillTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceSkillContainerInformationService.getResourceSkillChainLayout(),
			dtoSchemeId: resourceSkillConstantValues.schemes.skillChain,
			translator: resourceSkillTranslationService
		});
	}
})(angular);