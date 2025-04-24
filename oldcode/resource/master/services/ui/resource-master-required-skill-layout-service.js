/**
 * Created by baf on 04.10.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc controller
	 * @name resourceMasterRequiredSkillLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource master required skill entity.
	 **/
	angular.module(moduleName).service('resourceMasterRequiredSkillLayoutService', ResourceMasterRequiredSkillLayoutService);

	ResourceMasterRequiredSkillLayoutService.$inject = ['platformUIConfigInitService', 'resourceMasterContainerInformationService',
		'resourceMasterTranslationService', 'resourceMasterConstantValues'];

	function ResourceMasterRequiredSkillLayoutService(platformUIConfigInitService, resourceMasterContainerInformationService,
	  resourceMasterTranslationService, values) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceMasterContainerInformationService.getRequiredSkillLayout(),
			dtoSchemeId: values.schemes.requiredSkill,
			translator: resourceMasterTranslationService
		});
	}
})(angular);