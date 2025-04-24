/*
 * $Id: resource-certificate-layout-service.js 549242 2019-06-27 16:19:34Z baf $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'resource.certificate';

	/**
	 * @ngdoc service
	 * @name resourceCertificateLayoutService
	 * @function
	 * @requires platformUIConfigInitService, resourceCertificateContainerInformationService, resourceCertificateConstantValues, resourceCertificateTranslationService
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).service('resourceCertificateLayoutService', ResourceCertificateLayoutService);

	ResourceCertificateLayoutService.$inject = ['platformUIConfigInitService', 'resourceCertificateContainerInformationService',
		'resourceCertificateConstantValues', 'resourceCertificateTranslationService'];

	function ResourceCertificateLayoutService(platformUIConfigInitService, resourceCertificateContainerInformationService,
		resourceCertificateConstantValues, resourceCertificateTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceCertificateContainerInformationService.getCertificateLayout(),
			dtoSchemeId: resourceCertificateConstantValues.schemes.certificate,
			translator: resourceCertificateTranslationService
		});
	}
})(angular);
