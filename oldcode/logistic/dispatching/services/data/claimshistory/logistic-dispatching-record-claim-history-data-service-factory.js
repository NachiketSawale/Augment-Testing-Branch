/**
 * Created by shen on 9/17/2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRecordClaimHistoryDataServiceFactory
	 * @description
	 */
	angular.module(moduleName).service('logisticDispatchingRecordClaimHistoryDataServiceFactory', LogisticDispatchingRecordClaimHistoryDataServiceFactory);

	LogisticDispatchingRecordClaimHistoryDataServiceFactory.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'logisticDispatchingRecordDataService', 'platformDataServiceDataProcessorExtension', 'platformRuntimeDataService'];

	function LogisticDispatchingRecordClaimHistoryDataServiceFactory(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, logisticDispatchingRecordDataService, platformDataServiceDataProcessorExtension, platformRuntimeDataService) {
		let instances = {};
		let self = this;

		this.createDataService = function createDataService() {
			const dsName = self.getDataServiceName();

			let srv = instances[dsName];
			if(_.isNil(srv)) {
				srv = self.doCreateDataService(dsName);
				instances[dsName] = srv;
			}

			return srv;
		};

		this.getNameInfix = function getNameInfix(templInfo) {
			return templInfo.dto;
		};


		this.getDataServiceName = function getDataServiceName() {
			return 'logisticDispRecordClaimHistoryDataService';
		};

		this.doCreateDataService = function doCreateDataService(dsName){
			let logisticDispRecordClaimHistoryServiceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: dsName,
					entityNameTranslationID: 'logistic.settlement.settlementclaim',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'logistic/settlement/settlementclaim/',
						endRead: 'listfromdisprecord',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let selected = logisticDispatchingRecordDataService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: {delete: false, create: false},
					presenter: {},
					entityRole: {
						leaf: {itemName: 'SettlementClaim', parentService: logisticDispatchingRecordDataService}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'SettlementClaimDto',
						moduleSubModule: 'Logistic.Settlement'
					}), {processItem: (item) => { platformRuntimeDataService.readonly(item, true); }}],
				}
			};
			let serviceContainer = platformDataServiceFactory.createService(logisticDispRecordClaimHistoryServiceOption, self);
			serviceContainer.data.Initialised = true;

			return serviceContainer.service;
		};
	}
})(angular);
