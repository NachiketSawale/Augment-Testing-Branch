/**
 * Created by wui on 5/11/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.certificate';

	angular.module(moduleName).factory('businesspartnerCertificateCertificateUIStandardService', ['platformUIStandardConfigService',
		'platformSchemaService', 'businesspartnerCertificateCertificateLayout', 'businesspartnerCertificateTranslationService', 'platformUIStandardExtentService',
		function (UIStandardConfigService, platformSchemaService, certificateLayout, certificateTranslationService, platformUIStandardExtentService) {

			var domains = platformSchemaService.getSchemaFromCache({
				typeName: 'CertificateDto',
				moduleSubModule: 'BusinessPartner.Certificate'
			}).properties;

			var service = new UIStandardConfigService(certificateLayout, domains, certificateTranslationService);

			platformUIStandardExtentService.extend(service, certificateLayout.addition, domains);

			return service;
		}

	]);

})(angular);