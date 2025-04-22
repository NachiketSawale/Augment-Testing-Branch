/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';
	var moduleName = 'sales.contract';

	angular.module(moduleName).factory('salesContractChangeDataService',
		['globals', '$q', '$http', '$translate', '$injector', 'platformDataServiceFactory', 'salesContractService', 'basicsCommonContractChangeDataProcessor', 'ServiceDataProcessDatesExtension', 'SalesContractDocumentTypeProcessor',
			function (globals, $q, $http, $translate, $injector, platformDataServiceFactory, parentService, basicsCommonContractChangeDataProcessor, ServiceDataProcessDatesExtension, SalesContractDocumentTypeProcessor) {

				var serviceOption = {
					hierarchicalLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'salesContractChangeDataService',
						entityNameTranslationID: 'procurement.contract.changeOrderTitle',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'sales/contract/change/',
							endRead: 'tree',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								// readData.filter = '?mainItemId=' + parentService.getSelected().Id;
								readData.MainItemId = parentService.getSelected().Id;
							}
						},
						presenter: {
							tree: {
								parentProp: 'OrdHeaderFk',
								childProp: 'ChildItems',
								initialState: 'expanded',
								initCreationData: function initCreationData(creationData) {
									var parentHeader = parentService.getSelected();
									creationData.mainItemId = parentHeader.OrdHeaderFk;
									if(creationData.mainItemId === null){
										creationData.mainItemId = parentHeader.Id;
									}
								},
								incorporateDataRead: incorporateDataRead
							}
						},
						dataProcessor: [
							new ServiceDataProcessDatesExtension(['OrderDate', 'PlannedStart', 'PlannedEnd', 'WipFirst', 'WipFrom', 'WipUntil', 'DateEffective',
								'UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05']),
							SalesContractDocumentTypeProcessor
						],
						entityRole: {
							leaf: {
								itemName: 'Change',
								parentService: parentService,
								doesRequireLoadAlways: false
							}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;

				function incorporateDataRead(readData, data){
					return basicsCommonContractChangeDataProcessor.doReadData(service, parentService, readData, data);
				}

				var canCreate = serviceContainer.service.canCreate;
				service.canCreate = function () {
					return canCreate();
				};

				var canDelete = serviceContainer.service.canDelete;
				service.canDelete = function () {
					return canDelete();
				};

				var createItem = serviceContainer.service.createItem;
				var createChildItem = serviceContainer.service.createChildItem;
				service.createItem = function(){
					return basicsCommonContractChangeDataProcessor.doCreateItem(service, parentService, 'sales/contract/change/getchangeid?mainItemId=', createItem, createChildItem);
				};
				var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
				serviceContainer.data.onCreateSucceeded = function (created, data, creationData) {
					return basicsCommonContractChangeDataProcessor.doOnCreateSucceeded(service, parentService, created, data, creationData, onCreateSucceeded, serviceContainer.data);
				};

				service.deleteEntities = function () {
					basicsCommonContractChangeDataProcessor.doDeleteItem(service, parentService, 'sales/contract/change/delete', serviceContainer.data);
				};

				return service;
			}]);
})(angular);
