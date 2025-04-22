/*
* clv
* */
(function (angular) {
	'use strict';
	var moduleName = 'sales.contract';
	var salesContractModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesContractCertificateDataService
	 * @function
	 *
	 * @description
	 */
	salesContractModule.factory('salesContractCertificateDataService', salesContractCertificateDataService);
	salesContractCertificateDataService.$inject = ['_', '$q', 'globals', '$injector', '$http', 'platformDataServiceFactory', 'platformRuntimeDataService', 'platformDataServiceProcessDatesBySchemeExtension', 'salesContractService'];
	function salesContractCertificateDataService(_, $q, globals, $injector, $http, platformDataServiceFactory, platformRuntimeDataService, platformDataServiceProcessDatesBySchemeExtension, salesContractService) {

		var serviceOptions = {
			flatLeafItem: {
				module: salesContractModule,
				serviceName: 'salesContractCertificateDataService',
				entityNameTranslationID: 'sales.contract.ordCertificate',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'sales/contract/certificate/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						readData.PKey1 = _.get(salesContractService.getSelected(), 'Id');
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'OrdCertificateDto',
					moduleSubModule: 'Sales.Contract'
				})],
				actions: {
					delete: true, create: 'flat',
					canCreateCallBackFunc: function () {
						return !service.isReadonly();
					},
					canDeleteCallBackFunc: function () {
						return !service.isReadonly();
					}
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							creationData.PKey1 = _.get(salesContractService.getSelected(), 'Id');
						},
						incorporateDataRead: function (readData, data) {
							_.each(readData, function (item) {
								platformRuntimeDataService.readonly(item, service.isReadonly());
							});
							return serviceContainer.data.handleReadSucceeded(readData, data);
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'OrdCertificate', parentService: salesContractService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;
		service.isReadonly = function isReadonly() { // needed for bulk editor (enabled/disabled)
			return _.get(salesContractService.getSelected(), 'IsReadonlyStatus');
		};
		return service;
	}
})(angular);