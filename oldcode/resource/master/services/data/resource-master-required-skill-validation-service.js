/**
 * Created by baf on 04.10.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc service
	 * @name resourceMasterValidationService
	 * @description provides validation methods for resource master  entities
	 */
	angular.module(moduleName).service('resourceMasterRequiredSkillValidationService', ResourceMasterRequiredSkillValidationService);

	ResourceMasterRequiredSkillValidationService.$inject = ['platformValidationServiceFactory', 'resourceMasterRequiredSkillDataService', 'resourceMasterConstantValues'];

	function ResourceMasterRequiredSkillValidationService(platformValidationServiceFactory, resourceMasterRequiredSkillDataService, values) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(values.schemes.requiredSkill, {
				mandatory: ['SkillFk']
			},
			self,
			resourceMasterRequiredSkillDataService);
	}

})(angular);
