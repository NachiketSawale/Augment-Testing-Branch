/**
 * Created by leo on 09.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc service
	 * @name timekeepingPlannedAbsenceValidationService
	 * @description provides validation methods for timekeeping planned absence entities
	 */
	angular.module(moduleName).service('timekeepingPlannedAbsenceValidationService', TimekeepingPlannedAbsenceValidationService);

	TimekeepingPlannedAbsenceValidationService.$inject = ['_', 'platformDataValidationService', 'timekeepingPlannedAbsenceDataService', 'timekeepingEmployeeConstantValues',
		'platformValidationServiceFactory', 'timekeepingPlannedAbsenceValidationServiceFactory'];

	function TimekeepingPlannedAbsenceValidationService(_, platformDataValidationService, timekeepingPlannedAbsenceDataService, timekeepingEmployeeConstantValues,
		platformValidationServiceFactory, timekeepingPlannedAbsenceValidationServiceFactory) {
		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface(timekeepingEmployeeConstantValues.schemes.plannedAbsence, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingEmployeeConstantValues.schemes.plannedAbsence)
		}, self, timekeepingPlannedAbsenceDataService);

		timekeepingPlannedAbsenceValidationServiceFactory.createTimekeepingPlannedAbsenceValidationService(this, timekeepingPlannedAbsenceDataService);

	}

})(angular);
