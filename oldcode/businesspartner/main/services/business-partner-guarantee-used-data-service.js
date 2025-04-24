

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	let moduleName = 'businesspartner.main';
	angular.module(moduleName).factory('businessPartnerGuaranteeUsedDataService', ['_', 'platformDataServiceFactory', 'businessPartnerGuarantorDataService',
		function (_, platformDataServiceFactory, businessPartnerGuarantorDataService) {
			let container = {};
			let srvOption = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'businessPartnerGuarantorDataService',
					entityNameTranslationID: 'businesspartner.main.entityGuaranteeUsed',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
						endRead: 'listtoguaranteeused',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let selected = businessPartnerGuarantorDataService.getSelected();
							readData.CertificateTypeFk = selected.GuaranteeTypeFk;
							readData.BusinessPartnerIssuerFk = selected.BusinessPartnerFk;
							readData.CurrencyFk = selected.CurrencyFk;
						}
					},
					actions: {delete: false, create: false},
					entityRole: {
						leaf: {itemName: 'GuaranteeUsed', parentService: businessPartnerGuarantorDataService}
					}
				}
			};
			container = platformDataServiceFactory.createNewComplete(srvOption);
			//container.service.canCreate
			return container.service;
		}]);
})(angular);