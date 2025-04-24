(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.quote';
	var callOffAgreementModule = angular.module(moduleName);
	callOffAgreementModule.factory('procurementQuoteCallOffAgreementDataService', ['globals', 'procurementQuoteHeaderDataService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension','procurementQuoteCallOffAgreementValidationProcessor',

		function (globals, procurementQuoteHeaderDataService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, procurementQuoteCallOffAgreementValidationProcessor ) {

			var factoryOptions = {
				flatLeafItem: {
					module: callOffAgreementModule,
					serviceName: 'procurementQuoteCallOffAgreementDataService',
					entityNameTranslationID: 'procurement.common.entityCallOffAgreement',
					httpCreate: { route: globals.webApiBaseUrl + 'procurement/common/prccalloffagreement/' },
					httpRead: { route: globals.webApiBaseUrl + 'procurement/common/prccalloffagreement/',
						endRead: 'list',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = procurementQuoteHeaderDataService.getSelected();
							readData.PKey1 = selected.Id;
							readData.PKey2 = null;
						}},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						leaf: {itemName: 'CallOffAgreement', parentService: procurementQuoteHeaderDataService}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = procurementQuoteHeaderDataService.getSelected();
								creationData.PKey1 = selected.Id;
								creationData.PKey2 = null;
							}
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({ typeName: 'PrcCallOffAgreementDto', moduleSubModule: 'Procurement.Common'})]
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = procurementQuoteCallOffAgreementValidationProcessor;
			return serviceContainer.service;

		}]);
})(angular);
