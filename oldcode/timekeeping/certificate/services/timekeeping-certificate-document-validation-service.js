/**
 * Created by Sudarshan on 27.03.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.certificate';

	/**
	 * @ngdoc service
	 * @name timekeepingCertificateDocumentValidationService
	 * @description provides validation methods for timekeeping certificate document entities
	 */
	angular.module(moduleName).service('timekeepingCertificateDocumentValidationService', TimekeepingCertificateDocumentValidationService);

	TimekeepingCertificateDocumentValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingCertificateConstantValues', 'timekeepingCertificateDocumentDataService'];

	function TimekeepingCertificateDocumentValidationService(platformValidationServiceFactory, timekeepingCertificateConstantValues, timekeepingCertificateDocumentDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingCertificateConstantValues.schemes.certificateDoc, {

		},
		self,
		timekeepingCertificateDocumentDataService);
	}
})(angular);
