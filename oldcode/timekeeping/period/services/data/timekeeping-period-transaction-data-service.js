/**
 * Created by leo on 25.02.2021
 */

(function (angular) {
	/* global globals */
	'use strict';
	const myModule = angular.module('timekeeping.period');

	/**
	 * @ngdoc service
	 * @name timekeepingPeriodTransactionDataService
	 * @description pprovides methods to access, create and update timekeeping transaction  entities
	 */
	myModule.service('timekeepingPeriodTransactionDataService', TimekeepingTransactionDataService);

	TimekeepingTransactionDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'timekeepingPeriodDataService',
		'timekeepingPeriodConstantValues', 'platformRuntimeDataService','platformDataServiceDataProcessorExtension'];

	function TimekeepingTransactionDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, timekeepingPeriodDataService, timekeepingPeriodConstantValues, platformRuntimeDataService,platformDataServiceDataProcessorExtension) {
		let self = this;
		let timekeepingTransactionServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingPeriodTransactionDataService',
				entityNameTranslationID: 'timekeeping.period.timekeepingTransactionEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/period/transaction/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingPeriodDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(timekeepingPeriodConstantValues.schemes.transaction),
					{ processItem: function process(item){
						platformRuntimeDataService.readonly(item, true);
					}}],
				actions: {delete: false, create: false},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingPeriodDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Transactions', parentService: timekeepingPeriodDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingTransactionServiceOption, self);
		serviceContainer.service.takeOverTransactions = function takeOverTransactions(transaction) {
			serviceContainer.data.itemList.push(transaction);
			platformDataServiceDataProcessorExtension.doProcessData(serviceContainer.data.itemList, serviceContainer.data);
			serviceContainer.data.listLoaded.fire(serviceContainer.data.itemList);
		};

		serviceContainer.data.Initialised = true;
	}
})(angular);
