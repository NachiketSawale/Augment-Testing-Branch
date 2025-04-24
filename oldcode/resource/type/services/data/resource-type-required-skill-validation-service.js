/**
 * Created by baf on 03.12.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.type';

	/**
	 * @ngdoc service
	 * @name resourceTypeRequiredSkillValidationService
	 * @description provides validation methods for resource type requiredSkill entities
	 */
	angular.module(moduleName).service('resourceTypeRequiredSkillValidationService', ResourceTypeRequiredSkillValidationService);

	ResourceTypeRequiredSkillValidationService.$inject = ['platformValidationServiceFactory', 'resourceTypeConstantValues', 'resourceTypeRequiredSkillDataService', 'platformDataValidationService'];

	function ResourceTypeRequiredSkillValidationService(platformValidationServiceFactory, resourceTypeConstantValues, resourceTypeRequiredSkillDataService, platformDataValidationService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceTypeConstantValues.schemes.requiredSkill, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceTypeConstantValues.schemes.requiredSkill)
			},
			self,
			resourceTypeRequiredSkillDataService);

		self.validateSkillFk = function validateSkillFk(entity, value, model) {
			var items = resourceTypeRequiredSkillDataService.getList();
			return platformDataValidationService.validateIsUnique(entity, value, model, items, this, resourceTypeRequiredSkillDataService);
		};
	}
})(angular);
