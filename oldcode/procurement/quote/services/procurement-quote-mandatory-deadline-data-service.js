(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.quote';
	var mandatoryDeadlineModule = angular.module(moduleName);
	mandatoryDeadlineModule.factory('procurementQuoteMandatoryDeadlineDataService', ['globals', 'procurementQuoteHeaderDataService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension','procurementQuoteMandatoryDeadlineValidationProcessor',

		function (globals, procurementQuoteHeaderDataService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, procurementQuoteMandatoryDeadlineValidationProcessor ) {

			var factoryOptions = {
				flatLeafItem: {
					module: mandatoryDeadlineModule,
					serviceName: 'procurementQuoteMandatoryDeadlineDataService',
					entityNameTranslationID: 'procurement.common.entityMandatoryDeadline',
					httpCreate: { route: globals.webApiBaseUrl + 'procurement/common/prcmandatorydeadline/' },
					httpRead: { route: globals.webApiBaseUrl + 'procurement/common/prcmandatorydeadline/',
						endRead: 'list',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = procurementQuoteHeaderDataService.getSelected();
							readData.PKey1 = selected.Id;
							readData.PKey2 = null;
						}},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						leaf: {itemName: 'MandatoryDeadline', parentService: procurementQuoteHeaderDataService}
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
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({ typeName: 'PrcMandatoryDeadlineDto', moduleSubModule: 'Procurement.Common'})]
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = procurementQuoteMandatoryDeadlineValidationProcessor;
			return serviceContainer.service;

		}]);
})(angular);
