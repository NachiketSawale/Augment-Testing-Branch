/**
 * Created by baf on 28.05.2019
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeSkillValidationService
	 * @description provides validation methods for timekeeping employee skill entities
	 */
	angular.module(moduleName).service('timekeepingEmployeeSkillValidationService', TimekeepingEmployeeSkillValidationService);

	TimekeepingEmployeeSkillValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeSkillDataService'];

	function TimekeepingEmployeeSkillValidationService(platformValidationServiceFactory, timekeepingEmployeeConstantValues, timekeepingEmployeeSkillDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingEmployeeConstantValues.schemes.skill, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingEmployeeConstantValues.schemes.skill)
		},
		self,
		timekeepingEmployeeSkillDataService);
	}
})(angular);
