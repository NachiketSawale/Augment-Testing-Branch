/**
 * Created by baf on 30.10.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.requisition';

	/**
	 * @ngdoc service
	 * @name resourceRequisitionRequiredSkillValidationService
	 * @description provides validation methods for resource requisition requiredSkill entities
	 */
	angular.module(moduleName).service('resourceRequisitionRequiredSkillValidationService', ResourceRequisitionRequiredSkillValidationService);

	ResourceRequisitionRequiredSkillValidationService.$inject = ['platformValidationServiceFactory', 'resourceRequisitionConstantValues', 'resourceRequisitionRequiredSkillDataService'];

	function ResourceRequisitionRequiredSkillValidationService(platformValidationServiceFactory, resourceRequisitionConstantValues, resourceRequisitionRequiredSkillDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceRequisitionConstantValues.schemes.requiredSkill, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceRequisitionConstantValues.schemes.requiredSkill)
			},
			self,
			resourceRequisitionRequiredSkillDataService);
	}
})(angular);
