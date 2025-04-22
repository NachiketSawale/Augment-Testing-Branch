/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {


	'use strict';
	var moduleName = 'sales.common';
	var salesCommonModule = angular.module(moduleName);
	var salesCommonGeneralsServiceName = 'salesCommonGeneralsService';

	salesCommonModule.factory(salesCommonGeneralsServiceName,
		['globals', 'platformDataServiceFactory', 'PlatformMessenger', 'SalesCommonGeneralsProcessor',
			function (globals, platformDataServiceFactory, PlatformMessenger, SalesCommonGeneralsProcessor) {

				var service = {};

				var onGeneralsValueUpdate = new PlatformMessenger();
				var onGeneralsTypeUpdate = new PlatformMessenger();
				var onGeneralsDelete = new PlatformMessenger();
				var onControllingUnitOrTaxCodeChange = new PlatformMessenger();

				service.getService = function getService(parentService, crudApiUrl) {
					var salesCommonGeneralsServiceOption = {
						flatLeafItem: {
							module: salesCommonModule,
							serviceName: salesCommonGeneralsServiceName,
							httpCRUD: {
								route: globals.webApiBaseUrl + crudApiUrl,
								endRead: 'listByParent',
								usePostForRead: true,
								initReadData: function(readData) {
									var sel = parentService.getSelected();
									readData.PKey1 = sel.Id;
								}
							},
							presenter: {
								list: {
									initCreationData: function initCreationData(creationData) {
										var sel = parentService.getSelected();
										creationData.PKey1 = sel.Id;
									}
								}
							},
							entityRole: {
								leaf: {
									itemName: 'Generals',
									parentService: parentService
								}
							},
							dataProcessor: [SalesCommonGeneralsProcessor]
						}
					};

					var serviceContainer = platformDataServiceFactory.createNewComplete(salesCommonGeneralsServiceOption);

					var oldDeleteDone = serviceContainer.data.onDeleteDone;
					serviceContainer.data.onDeleteDone = onDeleteDoneInList;

					function onDeleteDoneInList(deleteParams, data, response) {
						onGeneralsDelete.fire(null, angular.copy(deleteParams.entities));
						oldDeleteDone(deleteParams, data, response);
					}

					return serviceContainer.service;
				};

				service.registerGeneralValueUpdate = function registerGeneralValueUpdate(func) {
					onGeneralsValueUpdate.register(func);
				};

				service.unregisterGeneralValueUpdate = function unregisterGeneralValueUpdate(func) {
					onGeneralsValueUpdate.unregister(func);
				};

				service.fireGeneralValueUpdate = function(item){
					onGeneralsValueUpdate.fire(null, item);
				};

				service.registerGeneralsTypeUpdate = function registerGeneralsTypeUpdate(func) {
					onGeneralsTypeUpdate.register(func);
				};

				service.unregisterGeneralsTypeUpdate = function unregisterGeneralsTypeUpdate(func) {
					onGeneralsTypeUpdate.unregister(func);
				};

				service.fireGeneralsTypeUpdate = function(item, oldValue, newValue){
					onGeneralsTypeUpdate.fire(null, {
						general: item,
						generalTypeFkOld: oldValue,
						generalTypeFkNew: newValue
					});
				};

				service.registerGeneralDelete = function registerGeneralDelete(func){
					onGeneralsDelete.register(func);
				};

				service.unregisterGeneralDelete = function unregisterGeneralDelete(func){
					onGeneralsDelete.unregister(func);
				};

				service.registerControllingUnitOrTaxCodeChange = function registerControllingUnitOrTaxCodeChange(func) {
					onControllingUnitOrTaxCodeChange.register(func);
				};

				service.unregisterControllingUnitOrTaxCodeChange = function unregisterControllingUnitOrTaxCodeChange(func) {
					onControllingUnitOrTaxCodeChange.unregister(func);
				};

				service.fireControllingUnitOrTaxCodeChange = function fireControllingUnitOrTaxCodeChange(result) {
					onControllingUnitOrTaxCodeChange.fire(null, result);
				};

				return service;
			}]);

})(angular);
