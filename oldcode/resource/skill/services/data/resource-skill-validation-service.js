/**
 * Created by baf on 03.10.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.skill';

	/**
	 * @ngdoc service
	 * @name resourceSkillValidationService
	 * @description provides validation methods for resource skill  entities
	 */
	angular.module(moduleName).service('resourceSkillValidationService', ResourceSkillValidationService);

	ResourceSkillValidationService.$inject = ['platformValidationServiceFactory', 'resourceSkillConstantValues', 'resourceSkillDataService'];

	function ResourceSkillValidationService(platformValidationServiceFactory, resourceSkillConstantValues, resourceSkillDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceSkillConstantValues.schemes.skill, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceSkillConstantValues.schemes.skill)
		},
		self,
		resourceSkillDataService);
	}
})(angular);
