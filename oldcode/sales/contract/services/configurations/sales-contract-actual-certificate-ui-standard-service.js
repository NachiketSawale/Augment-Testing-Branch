(function (angular) {
	'use strict';
	var moduleName = 'sales.contract';
	// business partner actual certificate ui standard service
	angular.module(moduleName).factory('salesContractCertificateActualUIStandardService',
		['platformSchemaService', 'platformUIStandardConfigService',
			'salesContractTranslationService', 'businesspartnerCertificateToContractLayout',
			function (platformSchemaService, UIStandardConfigService, translationService, certificateToContractLayout) {

				// certificate ui standard service
				var domains = platformSchemaService.getSchemaFromCache({
					typeName: 'CertificateDto',
					moduleSubModule: 'BusinessPartner.Certificate'
				}).properties;

				return new UIStandardConfigService(certificateToContractLayout, domains, translationService);
			}]);
}) (angular);