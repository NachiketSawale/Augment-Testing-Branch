/**
 * Created by wui on 11/23/2016.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonCashFlowDataServiceFactory', [
		'platformDataServiceFactory', 'cashFlowProjectionReadonlyProcessor', 'PlatformMessenger', 'globals',
		function (platformDataServiceFactory, readonlyProcessor, PlatformMessenger, globals) {
			const dataServiceCache = {};

			return {
				get: getDataService,
				create: createDataService
			};

			function createDataService(parentService) {
				const serviceOptions = {
					flatLeafItem: {
						entityRole: {
							leaf: {
								itemName: 'CashFlow',
								parentService: parentService
							}
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'basics/common/cashdetail/',
							endRead: 'list',
							initReadData: function (readData) {
								readData.filter = '?cashProjectionId=' + getSelectedCashProjectionId();
							}
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'basics/common/cashdetail/',
							endCreate: 'create'
						},
						presenter: {
							list: {
								initCreationData: function (creationData) {
									creationData.CashProjectionId = getSelectedCashProjectionId();
								},
								incorporateDataRead: function (readData, data) {
									container.service.prevPeriod = readData.prevPeriod;
									return data.handleReadSucceeded(readData.dtos, data);
								}
							}
						},
						dataProcessor: [readonlyProcessor],
						actions: {delete: true, canDeleteCallBackFunc: canDeleteCallBackFunc}
					}
				};

				const container = platformDataServiceFactory.createNewComplete(serviceOptions);

				function getSelectedCashProjectionId() {
					const parentItem = parentService.getSelected();
					const cashProjectionFk = parentItem ? parentItem.CashProjectionFk : null;
					return cashProjectionFk === null ? -1 : cashProjectionFk;
				}

				container.service.canCreate = function () {
					return getSelectedCashProjectionId();
				};

				container.service.onDataRefresh = new PlatformMessenger();

				return container.service;
			}

			function canDeleteCallBackFunc(selectItem) {
				const result = selectItem.ActPeriodCost > 0 || selectItem.ActPeriodCash > 0;
				return !result;
			}

			function getDataService(id, parentService) {
				if (!dataServiceCache[id]) {
					dataServiceCache[id] = createDataService(parentService);
				}
				return dataServiceCache[id];
			}
		}
	]);

})(angular);
