/**
 * Created by baf on 07.06.2019
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeDefaultValidationService
	 * @description provides validation methods for timekeeping employee default entities
	 */
	angular.module(moduleName).service('timekeepingEmployeeDefaultValidationService', TimekeepingEmployeeDefaultValidationService);

	TimekeepingEmployeeDefaultValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeDefaultDataService'];

	function TimekeepingEmployeeDefaultValidationService(platformValidationServiceFactory, timekeepingEmployeeConstantValues, timekeepingEmployeeDefaultDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingEmployeeConstantValues.schemes.employeeDefault, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingEmployeeConstantValues.schemes.employeeDefault)
		},
		self,
		timekeepingEmployeeDefaultDataService);
	}
})(angular);
