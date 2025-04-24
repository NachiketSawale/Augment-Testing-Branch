/**
 * Created by chd on 26.03.2025
 */

(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeLicenseCheckValidationService
	 * @description provides validation methods for timekeeping employee license check entities
	 */
	angular.module(moduleName).service('timekeepingEmployeeLicenseCheckValidationService', TimekeepingEmployeeLicenseCheckValidationService);

	TimekeepingEmployeeLicenseCheckValidationService.$inject = ['timekeepingEmployeeLicenseCheckDataService', 'platformDataValidationService', '$http'];

	function TimekeepingEmployeeLicenseCheckValidationService(dataService, platformDataValidationService, $http) {
		let self = this;

		function checkIsDuplicate(licenseCheckId, employeeDocumentFk, dateChecked) {
			return dataService.getList()
				.some(licenseCheck =>
					licenseCheck.Id !== licenseCheckId &&
					licenseCheck.EmployeeDocumentFk !== null &&
					licenseCheck.EmployeeDocumentFk === employeeDocumentFk &&
					licenseCheck.DateChecked.isSame(dateChecked, 'day')
				);
		}

		self.validateEmployeeDocumentFk = function (entity, value, field) {
			if (entity.Version === 0 && value === 0) {
				value = null;
			}

			let result = platformDataValidationService.validateMandatory(entity, value, field, self, dataService);
			if (result && result.valid) {
				$http.get(globals.webApiBaseUrl + 'timekeeping/employees/document/getitembyid?id=' + value).then(function (result) {
					if (result && result.data) {
						entity.IsHiddenInPublicApi = result.data.IsHiddenInPublicApi;
						dataService.gridRefresh();
					}
				});

				const isDuplicate = checkIsDuplicate(entity.Id, value, entity.DateChecked);
				if (isDuplicate) {
					result = platformDataValidationService.createErrorObject('timekeeping.employee.duplicatedCheck', {object: field.toLowerCase()});
				}
			}

			platformDataValidationService.ensureNoRelatedError(entity, field, ['DateChecked'], self, dataService);
			platformDataValidationService.finishValidation(result, entity, value, field, self, dataService);
			return result;
		};

		self.validateDateChecked = function (entity, value, field) {
			if (entity.Version === 0 && value === 0) {
				value = null;
			}
			let result = platformDataValidationService.validateMandatory(entity, value, field, self, dataService);
			if (result && result.valid) {
				const isDuplicate = checkIsDuplicate(entity.Id, entity.EmployeeDocumentFk, value);
				if (isDuplicate) {
					result = platformDataValidationService.createErrorObject('timekeeping.employee.duplicatedCheck', {object: field.toLowerCase()});
				}

				if (entity.EmployeeDocumentFk !== null && entity.EmployeeDocumentFk !== 0) {
					platformDataValidationService.ensureNoRelatedError(entity, field, ['EmployeeDocumentFk'], self, dataService);
				}
			}
			platformDataValidationService.finishValidation(result, entity, value, field, self, dataService);
			return result;
		};
	}
})(angular);
