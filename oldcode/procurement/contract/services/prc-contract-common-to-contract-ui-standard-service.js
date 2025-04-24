(function (angular) {

	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	// businesspartnerCertificateActualCertificateListController
	angular.module(moduleName).factory('procurementContractCertificateActualUIStandardService',
		['businesspartnerCertificateCertificateContainerServiceFactory', 'platformSchemaService', 'platformUIStandardConfigService', 'procurementContractHeaderDataService',
			'procurementContractTranslationService', 'businesspartnerCertificateToContractLayout',
			function (serviceFactory, platformSchemaService, UIStandardConfigService, parentService, translationService, certificateToContractLayout) {

				// certificate ui standard service
				var domains = platformSchemaService.getSchemaFromCache({
					typeName: 'CertificateDto',
					moduleSubModule: 'BusinessPartner.Certificate'
				}).properties;

				return new UIStandardConfigService(certificateToContractLayout, domains, translationService);
			}]);

	// procurementCommonPrcBoqMainUIStandardService.getStandardConfigForListView(moduleName);
	// prcBoqMainNodeController
	angular.module(moduleName).factory('procurementContractPrcBoqMainUIStandardService',
		['procurementCommonPrcBoqMainUIStandardService', 'procurementContractHeaderDataService',
			'procurementContextService',
			function (procurementCommonPrcBoqMainUIStandardService, parentService, moduleContext) {
				moduleContext.setMainService(parentService);
				return procurementCommonPrcBoqMainUIStandardService;
			}]);

	// basicsCharacteristicDataController
	angular.module(moduleName).factory('procurementContractCharacteristicUIStandardService',
		['basicsCharacteristicDataUIServiceFactory',
			function (basicsCharacteristicDataUIServiceFactory) {
				var sectionId = 8;
				return basicsCharacteristicDataUIServiceFactory.getService(sectionId);
			}]);

})(angular);