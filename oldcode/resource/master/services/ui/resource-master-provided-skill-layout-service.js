/**
 * Created by baf on 04.10.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc controller
	 * @name resourceMasterProvidedSkillLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource master provided skill entity.
	 **/
	angular.module(moduleName).service('resourceMasterProvidedSkillLayoutService', ResourceMasterProvidedSkillLayoutService);

	ResourceMasterProvidedSkillLayoutService.$inject = ['platformUIConfigInitService', 'resourceMasterContainerInformationService',
		'resourceMasterTranslationService', 'resourceMasterConstantValues'];

	function ResourceMasterProvidedSkillLayoutService(platformUIConfigInitService, resourceMasterContainerInformationService,
	  resourceMasterTranslationService, values) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceMasterContainerInformationService.getProvidedSkillLayout(),
			dtoSchemeId: values.schemes.providedSkill,
			translator: resourceMasterTranslationService
		});
	}
})(angular);