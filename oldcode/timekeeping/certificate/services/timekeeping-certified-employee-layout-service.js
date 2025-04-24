/**
 * Created by Sudarshan on 16.03.2023
 */
(function () {
	'use strict';
	let moduleName = 'timekeeping.certificate';

	/**
	 * @ngdoc service
	 * @name timekeepingCertifiedEmployeeLayoutService
	 * @function
	 * @requires platformUIConfigInitService, timekeepingCertificateContainerInformationService
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).service('timekeepingCertifiedEmployeeLayoutService', TimekeepingCertifiedEmployeeLayoutService);

	TimekeepingCertifiedEmployeeLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingCertificateContainerInformationService',
		'timekeepingCertificateConstantValues', 'timekeepingCertificateTranslationService'];

	function TimekeepingCertifiedEmployeeLayoutService(platformUIConfigInitService, timekeepingCertificateContainerInformationService,
		timekeepingCertificateConstantValues, timekeepingCertificateTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingCertificateContainerInformationService.getCertifiedEmployeeLayout(),
			dtoSchemeId: timekeepingCertificateConstantValues.schemes.certifiedEmployee,
			translator: timekeepingCertificateTranslationService
		});
	}
})(angular);
