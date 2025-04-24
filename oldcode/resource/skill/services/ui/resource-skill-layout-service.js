/*
 * $Id: resource-skill-layout-service.js 518834 2018-10-29 07:59:07Z baf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.skill';

	/**
	 * @ngdoc service
	 * @name resourceSkillLayoutService
	 * @function
	 *
	 * @description
	 * The service provides the layout configuration for resource skill entity
	 */
	angular.module(moduleName).service('resourceSkillLayoutService', ResourceSkillLayoutService);

	ResourceSkillLayoutService.$inject = ['platformUIConfigInitService', 'resourceSkillContainerInformationService',
		'resourceSkillConstantValues', 'resourceSkillTranslationService'];

	function ResourceSkillLayoutService(platformUIConfigInitService, resourceSkillContainerInformationService,
		resourceSkillConstantValues, resourceSkillTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceSkillContainerInformationService.getResourceSkillLayout(),
			dtoSchemeId: resourceSkillConstantValues.schemes.skill,
			translator: resourceSkillTranslationService
		});
	}
})(angular);
