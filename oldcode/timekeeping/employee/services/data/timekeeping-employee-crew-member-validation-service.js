/**
 * Created by baf on 20.08.2019
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeCrewMemberValidationService
	 * @description provides validation methods for timekeeping employee crewMember entities
	 */
	angular.module(moduleName).service('timekeepingEmployeeCrewMemberValidationService', TimekeepingEmployeeCrewMemberValidationService);

	TimekeepingEmployeeCrewMemberValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeCrewMemberDataService'];

	function TimekeepingEmployeeCrewMemberValidationService(platformValidationServiceFactory, timekeepingEmployeeConstantValues, timekeepingEmployeeCrewMemberDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingEmployeeConstantValues.schemes.crewMember, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingEmployeeConstantValues.schemes.crewMember)
		},
		self,
		timekeepingEmployeeCrewMemberDataService);
	}
})(angular);
