/**
 * Created by Sudarshan on 16.03.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.certificate';

	/**
	 * @ngdoc service
	 * @name timekeepingCertificateValidationService
	 * @description provides validation methods for timekeeping employee certificate entities
	 */
	angular.module(moduleName).service('timekeepingCertificateValidationService', TimekeepingCertificateValidationService);

	TimekeepingCertificateValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingCertificateConstantValues', 'timekeepingCertificateDataService'];

	function TimekeepingCertificateValidationService(platformValidationServiceFactory, timekeepingCertificateConstantValues, timekeepingCertificateDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingCertificateConstantValues.schemes.certificate, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingCertificateConstantValues.schemes.certificate)
		},
		self,
		timekeepingCertificateDataService);
	}
})(angular);
