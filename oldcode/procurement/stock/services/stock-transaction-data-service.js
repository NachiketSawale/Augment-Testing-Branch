// eslint-disable-next-line no-redeclare
/* global angular,jQuery */

(function (angular) {
	'use strict';
	/* global globals */
	/** @namespace parentSelected.IsCurrentCompany */
	/** @namespace parentSelected.InDownTime */
	/** @namespace parentService.parentService().getSelected() */

	var moduleName = 'procurement.stock';
	// jshint -W072
	angular.module(moduleName).factory('procurementStockTransactionDataService',
		['_', '$q', '$http', 'platformDataServiceFactory', 'procurementStockStockTotalDataService', 'basicsLookupdataLookupDescriptorService', 'procurementContextService',
			'platformDataServiceProcessDatesBySchemeExtension', 'procurementStockTransactionReadOnlyProcessor', 'basicsLookupdataLookupFilterService',
			'basicsCommonMandatoryProcessor', 'basicCustomizeSystemoptionLookupDataService',
			function (_, $q, $http, dataServiceFactory, parentService, lookupDescriptorService, moduleContext, platformDataServiceProcessDatesBySchemeExtension,
				readOnlyProcessor, basicsLookupdataLookupFilterService, basicsCommonMandatoryProcessor, basicCustomizeSystemoptionLookupDataService) {
				var serviceContainer, service = {};
				var onReadSucceeded = function onReadSucceeded(readData, data) {
					if (readData.Main === undefined) {
						if (service.isUpdate) {
							var parentSelectedId = parentService.getSelected();
							var id = 'list?mainItemId=' + parentSelectedId.PrjStockFk + '&mdcMaterialFk=' + parentSelectedId.MdcMaterialFk + '&productFk=' + (parentSelectedId.ProductFk !== null ? parentSelectedId.ProductFk : -1);
							$http.get(globals.webApiBaseUrl + 'procurement/stock/transaction/' + id).then(function (res) {
								return serviceContainer.data.handleReadSucceeded(res.data.Main, data, true);
							});
							service.isUpdate = false;
							service.clearCache();
						} else {
							return serviceContainer.data.handleReadSucceeded(readData, data, true);
						}

					}

					lookupDescriptorService.attachData(readData);
					return serviceContainer.data.handleReadSucceeded(readData.Main, data, true);
				};
				var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					{
						typeName: 'StockTransactionDto',
						moduleSubModule: 'Procurement.Stock'
					}
				);
				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						// httpCreate: {route: globals.webApiBaseUrl + 'procurement/stock/transaction/'},
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/stock/transaction/',
							endRead: 'list',
							initReadData: function initReadData(readData) {
								var parentSelectedId = parentService.getSelected();
								if (parentSelectedId === null || parentSelectedId === undefined) {
									return;
								}
								readData.filter = '?mainItemId=' + parentSelectedId.PrjStockFk + '&mdcMaterialFk=' + parentSelectedId.MdcMaterialFk + '&productFk=' + (parentSelectedId.ProductFk !== null ? parentSelectedId.ProductFk : -1);
							}
						},
						dataProcessor: [readOnlyProcessor, dateProcessor],
						actions: {
							delete: true, create: 'flat'
						},
						serviceName: 'procurementStockTransactionDataService',
						presenter: {
							list: {
								incorporateDataRead: onReadSucceeded,
								initCreationData: function initCreationData(creationData) {
									var selectedItem = parentService.getSelected();
									creationData.prjStockFk = selectedItem.PrjStockFk;
									creationData.mdcMaterialFk = selectedItem.MdcMaterialFk;
									creationData.productFk = selectedItem.ProductFk;

								},
								handleCreateSucceeded: function () {

								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'Transaction',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'StockTransactionDto',
					moduleSubModule: 'Procurement.Stock',
					validationService: 'procurementStockTransactionValidationService',
					mustValidateFields: ['PrjStocklocationFk', 'Lotno', 'PrcStocktransactiontypeFk', 'PrjStockFk', 'MdcMaterialFk', 'ProvisionTotal', 'ExpirationDate']
				});
				service = serviceContainer.service;
				service.isUpdate = false;

				var baseCanCreate = service.canCreate;
				service.canCreate = function () {
					if (readOnlyProcessor.isStockTransactionToReadOnly()) {
						return false;
					}
					let parentSelected = getParentSelected();
					if (parentSelected && parentSelected.IsCurrentCompany) {
						if (parentSelected.InDownTime) {
							return false;
						}
						return baseCanCreate();
					}
					return false;
				};

				service.canDelete = function () {
					if (readOnlyProcessor.isStockTransactionToReadOnly()) {
						return false;
					}
					let parentSelected = getParentSelected();
					if (parentSelected && !parentSelected.IsCurrentCompany) {
						return false;
					}

					if (parentSelected && parentSelected.InDownTime) {
						return false;
					}

					let item = service.getSelected();
					if (!_.isNil(item)) {
						if (item.Version < 1) {
							return true;
						} else {
							var transactionType = lookupDescriptorService.getData('StockTransactionType');
							var type = _.find(transactionType, {Id: item.PrcStocktransactiontypeFk});
							/** @namespace type.IsAllowedManual */
							if (!_.isNil(type) && type.IsAllowedManual) {
								return true;
							}
						}
					}
					return false;
				};

				service.canRecalculate = function () {
					if (readOnlyProcessor.isStockTransactionToReadOnly()) {
						return false;
					}
					let parentSelected = getParentSelected();
					if (parentSelected && !parentSelected.IsCurrentCompany) {
						return false;
					}
					return !(parentSelected && parentSelected.InDownTime);
				};

				function getParentSelected() {
					return parentService.getSelected() || (parentService.getSelectedEntities() ? parentService.getSelectedEntities()[0] : {});
				}

				service.loadData = function () {
					let parentSelected = getParentSelected();
					service.load(parentSelected);
				};

				var filters = [
					{
						key: 'prc-stock-transaction-transactiontype-filter',
						serverSide: true,
						fn: function () {
							return 'IsAllowedManual=' + true + ' and Sorting<>0 and IsLive=' + true;
						}
					},
					{
						key: 'prc-stock-location-filter',
						serverSide: true,
						fn: function () {
							var currentItem = service.getSelected();
							if (currentItem) {
								// return { StockFk: currentItem.PrjStockFk };
								return 'StockFk=' + currentItem.PrjStockFk;
							}
						}
					},
					{
						key: 'prc-stock-controlling-unit-filter',
						serverKey: 'basics.masterdata.controllingunit.filterkey',
						serverSide: true,
						fn: function () {
							// 88452 Stock management: Controlling Unit code should have the look up to all the projects
							// var currentItem = service.getSelected();
							// if(currentItem) {
							//     return { ProjectFk: currentItem.ProjectFk };
							// }
							// var item=parentService.getParentData();
							// if(item) {
							//     return { ProjectFk: item.ProjectFk };
							// }
						}
					},
					{
						key: 'prc-transactions-transaction-filter',
						serverSide: true,
						fn: function () {
							var currentItem = service.getSelected();
							if (currentItem) {
								return {
									PrjStockFk: currentItem.PrjStockFk,
									MdcMaterialFk: currentItem.MdcMaterialFk,
									ProductFk: currentItem.PpsProductFk
								};
							}
						}

					}

				];
				basicsLookupdataLookupFilterService.registerFilter(filters);

				service.callRefresh = service.refresh || serviceContainer.data.onRefreshRequested;
				return service;
			}]);
})(angular, jQuery);
