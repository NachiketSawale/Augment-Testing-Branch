/**
 * Created by Sudarshan on 16.03.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.certificate';

	/**
	 * @ngdoc service
	 * @name timekeepingCertifiedEmployeeValidationService
	 * @description provides validation methods for timekeeping certified employee entities
	 */
	angular.module(moduleName).service('timekeepingCertifiedEmployeeValidationService', TimekeepingCertifiedEmployeeValidationService);

	TimekeepingCertifiedEmployeeValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingCertificateConstantValues', 'timekeepingCertifiedEmployeeDataService'];

	function TimekeepingCertifiedEmployeeValidationService(platformValidationServiceFactory, timekeepingCertificateConstantValues, timekeepingCertifiedEmployeeDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingCertificateConstantValues.schemes.certifiedEmployee, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingCertificateConstantValues.schemes.certifiedEmployee),
			periods: [ { from: 'ValidFrom', to: 'ValidTo'} ]
		},
		self,
		timekeepingCertifiedEmployeeDataService);
	}
})(angular);
