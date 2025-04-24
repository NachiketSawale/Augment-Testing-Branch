/**
 * Created by Sudarshan on 13.03.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeDocumentValidationService
	 * @description provides validation methods for timekeeping employee document entities
	 */
	angular.module(moduleName).service('timekeepingEmployeeDocumentValidationService', TimekeepingEmployeeDocumentValidationService);

	TimekeepingEmployeeDocumentValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeDocumentDataService'];

	function TimekeepingEmployeeDocumentValidationService(platformValidationServiceFactory, timekeepingEmployeeConstantValues, timekeepingEmployeeDocumentDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingEmployeeConstantValues.schemes.employeeDoc, {
			// mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceCertificateConstantValues.schemes.certificateDoc)
		},
		self,
		timekeepingEmployeeDocumentDataService);
	}
})(angular);
