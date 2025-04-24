/**
 * Created by Sudarshan on 16.03.2023
 */
(function () {
	'use strict';
	let moduleName = 'timekeeping.certificate';

	/**
	 * @ngdoc service
	 * @name timekeepingCertificateLayoutService
	 * @function
	 * @requires platformUIConfigInitService, timekeepingCertificateContainerInformationService
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).service('timekeepingCertificateLayoutService', TimekeepingCertificateLayoutService);

	TimekeepingCertificateLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingCertificateContainerInformationService',
		'timekeepingCertificateConstantValues', 'timekeepingCertificateTranslationService'];

	function TimekeepingCertificateLayoutService(platformUIConfigInitService, timekeepingCertificateContainerInformationService,
		timekeepingCertificateConstantValues, timekeepingCertificateTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingCertificateContainerInformationService.getCertificateLayout(),
			dtoSchemeId: timekeepingCertificateConstantValues.schemes.certificate,
			translator: timekeepingCertificateTranslationService
		});
	}
})(angular);
