/**
 * Created by Mohit on 29.08.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeVacationAccountValidationService
	 * @description provides validation methods for timekeeping employee document entities
	 */
	angular.module(moduleName).service('timekeepingEmployeeVacationAccountValidationService', TimekeepingEmployeeVacationAccountValidationService);

	TimekeepingEmployeeVacationAccountValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeVacationAccountDataService'];

	function TimekeepingEmployeeVacationAccountValidationService(platformValidationServiceFactory, timekeepingEmployeeConstantValues, timekeepingEmployeeVacationAccountDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingEmployeeConstantValues.schemes.vacationAccount, {
				// mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceCertificateConstantValues.schemes.certificateDoc)
			},
			self,
			timekeepingEmployeeVacationAccountDataService);
	}
})(angular);