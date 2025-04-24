/**
 * Created by Sudarshan on 30.03.2023
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeCertificationValidationService
	 * @description provides validation methods for timekeeping certificate report entity
	 */
	let moduleName = 'timekeeping.employee';
	angular.module(moduleName).service('timekeepingEmployeeCertificationValidationService', TimekeepingEmployeeCertificationValidationService);

	TimekeepingEmployeeCertificationValidationService.$inject = ['_', '$q', '$http','timekeepingEmployeeConstantValues','platformValidationServiceFactory','timekeepingEmployeeCertificationDataService'];

	function TimekeepingEmployeeCertificationValidationService(_, $q, $http,timekeepingEmployeeConstantValues,platformValidationServiceFactory,timekeepingEmployeeCertificationDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingEmployeeConstantValues.schemes.certification, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingEmployeeConstantValues.schemes.certification),
			periods: [ { from: 'ValidFrom', to: 'ValidTo'} ]
		},
		self,
		timekeepingEmployeeCertificationDataService);

		self.createTimekeepingReportValidationService = function createTimekeepingReportValidationService(validationService, dataService) {

			validationService.asyncValidateEmpCertificateFk = function asyncValidateEmpCertificateFk(entity, value, model) {
				return self.asyncValidateEmpCertificateFk(entity, value, model, validationService, dataService);
			};
		};

		self.asyncValidateEmpCertificateFk=function asyncValidateEmpCertificateFk(entity, value){
			let postData ={PKey1:value};
			return $http.post(globals.webApiBaseUrl + 'timekeeping/certificate/getcertificatelist',postData).then(function (result) {
				if (result.data) {
					entity.EmpCertificateTypeFk = result.data[0].EmpCertificateTypeFk;
					entity.EmpValidFrom = result.data[0].ValidFrom;
					entity.EmpValidTo = result.data[0].ValidTo;
				}
			});
		};

	}
})(angular);
