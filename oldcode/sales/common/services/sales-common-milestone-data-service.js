/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';

	var moduleName = 'sales.common';
	angular.module(moduleName).factory('salesCommonMilestoneDataService', [
		'platformDataServiceFactory',
		'salesCommonServiceCache',
		'ServiceDataProcessDatesExtension',
		'platformRuntimeDataService',
		function (
			platformDataServiceFactory,
			salesCommonServiceCache,
			ServiceDataProcessDatesExtension,
			platformRuntimeDataService
		) {
			function constructorFn(parentService, url, itemName) {
				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'salesCommonMilestoneDataService',
						httpCRUD: {
							route: url,
							endRead: 'listByParent',
							usePostForRead: true,
							initReadData: initReadData
						},
						dataProcessor: [
							{processItem: readonlyProcessItem},
							new ServiceDataProcessDatesExtension([
								'MilestoneDate',
								'MilestoneDateOrg'
							])
						],
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead,
								initCreationData: function initCreationData(creationData) {
									creationData.PKey1 = parentService.getSelected().Id;
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: itemName,
								parentService: parentService
							}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;
				var canDelete = service.canDelete;
				var canCreate = service.canCreate;

				function setReadonlyor() {
					var getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
					if (getModuleStatusFn) {
						var status = getModuleStatusFn();
						return !(status.IsReadOnly || status.IsReadonly);
					}
					return false;
				}

				function initReadData(readData) {
					var sel = parentService.getSelected();
					readData.PKey1 = sel.Id;
				}

				function incorporateDataRead(readData, data){
					var Isreadonly = !setReadonlyor();
					var itemList = data.handleReadSucceeded(readData.Main, data);
					if (Isreadonly) {
						service.setReadOnlyRow(readData);
					}
					return itemList;
				}

				function readonlyProcessItem(item) {
					var Isreadonly = !setReadonlyor();

					platformRuntimeDataService.readonly(item, Isreadonly);
				}

				service.canCreate = function () {
					return canCreate() && setReadonlyor();
				};

				service.canDelete = function () {
					return canDelete() && setReadonlyor();
				};

				return service;
			}

			return salesCommonServiceCache.registerService(constructorFn, 'salesCommonMilestoneDataService');
		}
	]);
})();