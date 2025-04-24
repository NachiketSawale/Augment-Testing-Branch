/**
 * Created by baf on 30.10.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.requisition';

	/**
	 * @ngdoc controller
	 * @name resourceRequisitionRequiredSkillLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource requisition requiredSkill entity.
	 **/
	angular.module(moduleName).service('resourceRequisitionRequiredSkillLayoutService', ResourceRequisitionRequiredSkillLayoutService);

	ResourceRequisitionRequiredSkillLayoutService.$inject = ['platformUIConfigInitService', 'resourceRequisitionContainerInformationService',
		'resourceRequisitionConstantValues', 'resourceRequisitionTranslationService'];

	function ResourceRequisitionRequiredSkillLayoutService(platformUIConfigInitService, resourceRequisitionContainerInformationService,
	  resourceRequisitionConstantValues, resourceRequisitionTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceRequisitionContainerInformationService.getResourceRequiredSkillLayout(),
			dtoSchemeId: resourceRequisitionConstantValues.schemes.requiredSkill,
			translator: resourceRequisitionTranslationService
		});
	}
})(angular);