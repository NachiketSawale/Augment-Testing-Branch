/**
 * Created by baf on 28.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.certificate';

	/**
	 * @ngdoc controller
	 * @name resourceCertificateDocumentLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource certificate document entity.
	 **/
	angular.module(moduleName).service('resourceCertificateDocumentLayoutService', ResourceCertificateDocumentLayoutService);

	ResourceCertificateDocumentLayoutService.$inject = ['platformUIConfigInitService', 'resourceCertificateContainerInformationService', 'resourceCertificateConstantValues', 'resourceCertificateTranslationService'];

	function ResourceCertificateDocumentLayoutService(platformUIConfigInitService, resourceCertificateContainerInformationService, resourceCertificateConstantValues, resourceCertificateTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceCertificateContainerInformationService.getCertificateDocumentLayout(),
			dtoSchemeId: resourceCertificateConstantValues.schemes.certificateDoc,
			translator: resourceCertificateTranslationService
		});
	}
})(angular);