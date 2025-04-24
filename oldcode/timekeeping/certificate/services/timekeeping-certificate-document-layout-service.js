/**
 * Created by Sudarshan on 27.03.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.certificate';

	/**
	 * @ngdoc controller
	 * @name timekeepingCertificateDocumentLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping certificate document entity.
	 **/
	angular.module(moduleName).service('timekeepingCertificateDocumentLayoutService', TimekeepingCertificateDocumentLayoutService);

	TimekeepingCertificateDocumentLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingCertificateContainerInformationService', 'timekeepingCertificateConstantValues', 'timekeepingCertificateTranslationService'];

	function TimekeepingCertificateDocumentLayoutService(platformUIConfigInitService, timekeepingCertificateContainerInformationService, timekeepingCertificateConstantValues, timekeepingCertificateTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingCertificateContainerInformationService.getCertificateDocumentLayout(),
			dtoSchemeId: timekeepingCertificateConstantValues.schemes.certificateDoc,
			translator: timekeepingCertificateTranslationService
		});
	}
})(angular);