/**
 * Created by lcn on 02/24/2022.
 */
(function () {
	'use strict';
	let moduleName = 'procurement.common';

	angular.module(moduleName).factory('procurementCommonSalesTaxDataService',
		['_', 'globals', 'platformDataServiceFactory', '$q', '$http', 'basicsLookupdataLookupDescriptorService','platformGridAPI','$timeout','procurementContextService',
			function (_, globals, platformDataServiceFactory, $q, $http, basicsLookupdataLookupDescriptorService,platformGridAPI,$timeout, procurementContextService) {
				// create a new data service object
				function constructor(parentService, modName) {

					let route, itemName;
					switch (modName) {
						case 'procurement.invoice':
							route = 'procurement/invoice/salestax/';
							itemName = 'InvSalesTax';
							break;
					}
					var showAll = true;
					let serviceContainer, serviceOption = {
						hierarchicalNodeItem: {
							module: angular.module(moduleName),
							serviceName: 'procurementCommonSalesTaxDataService',
							entityNameTranslationID: 'procurement.common.SalesTaxGridTitle',
							dataProcessor: [{processItem: processItem}],
							httpRead: {
								route: globals.webApiBaseUrl + route,
								endRead: 'tree',
								initReadData: function initReadData(readData) {
									readData.filter = '?mainItemId=' + parentService.getSelected().Id +  '&showAll=' + showAll;
								}
							},
							presenter: {
								tree: {
									parentProp: 'PrcStructureFk',
									childProp: 'SalesTaxItems',
									incorporateDataRead: function (readData, data) {
										basicsLookupdataLookupDescriptorService.attachData(readData);
										if (data.usingContainer && data.usingContainer[0]) {
											let existedGrid = platformGridAPI.grids.exist(data.usingContainer[0]);
											if (existedGrid) {
												$timeout(function () {
													platformGridAPI.rows.expandAllNodes(data.usingContainer[0]);
												});
											}
										}
										return serviceContainer.data.handleReadSucceeded(readData.Main, data, true);
									}
								}
							},
							entityRole: {
								node: {
									itemName: itemName,
									parentService: parentService,
									doesRequireLoadAlways: true
								}
							},
							modification: {
								multi: {}
							},
							actions: {
								delete: false,
								create: false
							}
						}
					};

					serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
					const service = serviceContainer.service;
					// eslint-disable-next-line no-unused-vars
					const data = serviceContainer.data;

					// eslint-disable-next-line no-unused-vars
					function processItem(item) {
					}

					service.getParentService = function getParentService() {
						return parentService;
					};

					service.recalculate = function recalculate(isRest) {
						var reset = isRest || false;
						const defer = $q.defer();
						// eslint-disable-next-line no-unused-vars
						$http.get(globals.webApiBaseUrl + route + 'recalculate?mainItemId=' + parentService.getSelected().Id + '&isRest=' + reset).then(function (response) {
							service.load();
							service.gridRefresh();
							defer.resolve(true);
						}, function (error) {
							defer.reject(error);
						});
						return defer.promise;
					};

					service.disabled = function recalculate() {
						var parent = parentService.getSelected();
						return _.isEmpty(parent) || parent.SalesTaxMethodFk === 1;
					};

					service.refreshTotal = function refreshTotal() {
						showAll = !showAll;
						parentService.updateAndExecute(service.loadSubItemList);
					};

					service.itemService = [];
					service.registerChildService = function (itemService) {
						service.itemService.push(itemService);
					};

					function updateGridAfterParentUpdat() {
						service.load();
					}

					if (parentService.onUpdateSucceeded) {
						parentService.onUpdateSucceeded.register(updateGridAfterParentUpdat);
					}

					return service;
				}

				const serviceCache = {};
				const getService = function getService(parentService, serviceName, moduleName) {
					if (!_.has(serviceCache, serviceName)) {
						serviceCache[serviceName] = constructor.apply(this, [parentService, moduleName]);
					}
					return serviceCache[serviceName];
				};

				return {
					createService: getService
				};
			}]);
})();

