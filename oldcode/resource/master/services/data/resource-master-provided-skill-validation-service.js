/**
 * Created by baf on 04.10.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc service
	 * @name resourceMasterProvidedSkillValidationService
	 * @description provides validation methods for resource master provided skill entities
	 */
	angular.module(moduleName).service('resourceMasterProvidedSkillValidationService', ResourceMasterProvidedSkillValidationService);

	ResourceMasterProvidedSkillValidationService.$inject = ['platformValidationServiceFactory', 'resourceMasterProvidedSkillDataService', 'resourceMasterConstantValues'];

	function ResourceMasterProvidedSkillValidationService(platformValidationServiceFactory, resourceMasterProvidedSkillDataService, values) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(values.schemes.providedSkill, {
				mandatory: ['SkillFk']
			},
			self,
			resourceMasterProvidedSkillDataService);
	}

})(angular);
