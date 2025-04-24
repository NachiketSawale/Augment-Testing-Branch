/**
 * Created by wuj on 11/13/2015.
 */
(function (angular) {
	'use strict';
	var module = angular.module('procurement.package');
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').factory('procurementPackageImportService',
		['platformDataServiceFactory', 'procurementPackageDataService', '$http', 'ImportStatusConstant', 'platformDataServiceSelectionExtension',
			'basicsLookupdataLookupDescriptorService', 'platformDataServiceDataProcessorExtension',
			function (dataServiceFactory, parentService, $http, ImportStatusConstant, platformDataServiceSelectionExtension,
				basicsLookupdataLookupDescriptorService, platformDataServiceDataProcessorExtension) {
				var serviceContainer;
				var service;
				var serviceOption = {
					flatLeafItem: {
						module: module,
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/package/import/'
							/* initReadData: function (readData) {
							 readData.filter = '';
							 } */
						},
						actions: {
							delete: true, create: 'flat',
							canCreateCallBackFunc: function () {
								var currentItem = service.getSelected();
								if (currentItem && currentItem.Id) {
									return currentItem.Status === ImportStatusConstant.Failed;
								}
								return false;
							},
							canDeleteCallBackFunc: function () {
								var currentItem = service.getSelected();
								if (currentItem && currentItem.Id) {
									return currentItem.Status === ImportStatusConstant.Failed;
								}
								return false;
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function incorporateDataRead(readData, data) {
									basicsLookupdataLookupDescriptorService.attachData(readData);

									if (_.isArray(readData)) {
										_.forEach(readData, function (item) {
											if (item.WarningMessages) {
												item.WarningMessage = item.WarningMessages[0];
											} else {
												item.WarningMessage = '';
											}
										});
									}
									return serviceContainer.data.handleReadSucceeded(readData, data, true);
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'PrcPackageImport',
								parentService: parentService
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				service = serviceContainer.service;
				var currentItem;

				serviceContainer.data.handleReadSucceeded = function (result, data) {
					data.itemList.length = 0;
					_.forEach(result, function (entity) {
						data.itemList.push(entity);
					});

					platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);

					data.listLoaded.fire(result);
				};

				service.createItem = function importAgain() {
					currentItem = service.getSelected();
					if (!currentItem && !currentItem.Id || currentItem.Status !== ImportStatusConstant.Failed) {
						return;
					}
					$http.get(globals.webApiBaseUrl + 'procurement/package/import/importagain', {
						params: {
							id: currentItem.Id
						}
					}).then(function (response) {
						if (response.data) {
							angular.extend(currentItem, response.data);
							service.fireItemModified(currentItem);
						}
					});
				};

				service.deleteItem = function cancel() {
					currentItem = service.getSelected();
					if (!currentItem && !currentItem.Id || currentItem.Status !== ImportStatusConstant.Failed) {
						return;
					}
					$http.get(globals.webApiBaseUrl + 'procurement/package/import/cancel', {
						params: {
							id: currentItem.Id
						}
					}).then(function (response) {
						if (response.data) {
							if (response.data.Status === ImportStatusConstant.Failed) {
								angular.extend(currentItem, response.data);
								service.fireItemModified(currentItem);
								return;
							}

							if (response.data.Status === ImportStatusConstant.Canceled) {
								var index = serviceContainer.data.itemList.indexOf(currentItem);
								serviceContainer.data.itemList = _.filter(serviceContainer.data.itemList, function (item) {
									return item.Id !== currentItem.Id;
								});
								serviceContainer.data.listLoaded.fire();
								platformDataServiceSelectionExtension.doSelectCloseTo(index, serviceContainer.data);
							}
						}
					});
				};

				/* service.getList= function getList() {
				 var list = serviceContainer.data.itemList;
				 if(list && list.length > 0)
				 {
				 var item = list[0];
				 if(item.ErrorMessage) {
				 return [item.ErrorMessage];
				 }
				 return item.WarningMessages || [];
				 }
				 return [];
				 }; */

				return service;
			}]);

	angular.module('procurement.package').factory('procurementPackageImportWaringService',
		['procurementPackageImportService', 'platformModalService', function (parentService, platformModalService) {

			var service = {};

			// service.refreshGrid = new PlatformMessenger();

			service.getList = function getList() {
				var parentItem = parentService.getSelected();
				if (!parentItem || !parentItem.Id || !parentItem.WarningMessages || parentItem.WarningMessages.length === 0) {
					return [];
				}

				var list = [], index = 0;
				parentItem.WarningMessages.forEach(function (item) {
					list.push({Id: index, WarningMessage: item});
					index++;
				});

				return list;
			};

			service.showWarningDialog = function showWarningDialog() {
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'procurement.package/partials/procurement-package-import-warning.html',
					backdrop: false,
					iconClass: 'warning'
				}).then(function () {
				});
			};
			/* function onParentItemChanged() {
			 service.refreshGrid.fire();
			 } */

			// parentService.registerSelectionChanged(onParentItemChanged);

			return service;
		}]);
})(angular);