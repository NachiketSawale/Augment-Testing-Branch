/*
* clv
* */
(function (angular) {
	'use strict';
	var moduleName = 'sales.bid';
	var salesContractModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBidCertificateDataService
	 * @function
	 *
	 * @description
	 */
	salesContractModule.factory('salesBidCertificateDataService', salesBidCertificateDataService);
	salesBidCertificateDataService.$inject = ['_', '$q', 'globals', '$injector', '$http', 'platformDataServiceFactory', 'platformRuntimeDataService', 'platformDataServiceProcessDatesBySchemeExtension', 'salesBidService'];
	function salesBidCertificateDataService(_, $q, globals, $injector, $http, platformDataServiceFactory, platformRuntimeDataService, platformDataServiceProcessDatesBySchemeExtension, salesBidService) {

		var serviceOptions = {
			flatLeafItem: {
				module: salesContractModule,
				serviceName: 'salesBidCertificateDataService',
				entityNameTranslationID: 'sales.bid.bidCertificate',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'sales/bid/certificate/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						readData.PKey1 = _.get(salesBidService.getSelected(), 'Id');
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'BidCertificateDto',
					moduleSubModule: 'Sales.Bid'
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
							creationData.PKey1 = _.get(salesBidService.getSelected(), 'Id');
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
					leaf: {itemName: 'BidCertificate', parentService: salesBidService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;
		service.isReadonly = function isReadonly() { // needed for bulk editor (enabled/disabled)
			return _.get(salesBidService.getSelected(), 'IsReadonlyStatus');
		};
		return service;
	}
})(angular);