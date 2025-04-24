// eslint-disable-next-line no-redeclare
/* global angular */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.stock';
	/* global globals, _ */
	/**
     * @ngdoc service
     * @name procurementStockHeaderDataService
     * @function
     * @requireds procurementStockHeaderDataService
     *
     * @description Provide stock header data service
     */

	angular.module(moduleName).factory('procurementStockHeaderDataService',
		['$translate','platformDataServiceFactory','$injector', 'platformContextService', 'PlatformMessenger', 'basicsLookupdataLookupDataService',
			'basicsLookupdataLookupDescriptorService', 'procurementContextService',
			'platformDataServiceProcessDatesBySchemeExtension', 'basicsLookupdataLookupOptionService',
			'platformModalService', 'basicsCommonMandatoryProcessor', 'cloudDesktopSidebarService','cloudDesktopInfoService','platformObjectHelper',
			function ($translate,dataServiceFactory,$injector, platformContextService, PlatformMessenger, lookupDataService,
				lookupDescriptorService, moduleContext, platformDataServiceProcessDatesBySchemeExtension, lookupOptionService,
				platformModalService, basicsCommonMandatoryProcessor, cloudDesktopSidebarService,cloudDesktopInfoService,platformObjectHelper) {

				var service = {},serviceContainer = null;

				var onReadSucceeded = function onReadSucceeded(readData, data) {
					lookupDescriptorService.attachData(readData);
					if (readData.Main && readData.Main.length) {
						setIsCheckedAfterLoad(readData.Main);
					}
					var dataItems = serviceContainer.data.handleReadSucceeded(readData.Main, data);
					service.stockIdsCheckChanged.fire(service.checkedPrjStockFks);
					return dataItems;
				};

				// var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
				//     {
				//         typeName: 'StockHeaderVDto',
				//         moduleSubModule: 'Procurement.Stock'
				//     }
				// );
				var serviceOptions = {
					flatRootItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementStockHeaderDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/stock/header/',
							endRead: 'allitems'
						},
						actions: {
							actions: { delete: true, create: true, bulk: false },
							canDeleteCallBackFunc: function () {
								return !moduleContext.isReadOnly;
							}
						},
						entityRole: {
							root: {
								itemName: 'StockHeader',
								moduleName: 'cloud.desktop.moduleDisplayNameStock',
								addToLastObject: true,
								lastObjectModuleName: moduleName,
								responseDataEntitiesPropertyName: 'Main',
								handleUpdateDone: function (updateData, response) {
									if (response.CalculateErrorMesssage) {
										// noinspection JSValidateTypes
										if(response.CalculateErrorMesssage===4)
										{
											var ser=$injector.get('procurementStockStockTotalDataService');
											ser.loadData();
											ser.IsUpdate();
										}
										var message=null;
										// noinspection JSValidateTypes
										if (response.CalculateErrorMesssage === '1') {
											message = $translate.instant('procurement.stock.header.stockquantityzero');
										}
										// noinspection JSValidateTypes
										if (response.CalculateErrorMesssage === '2') {
											message = $translate.instant('procurement.stock.header.transactionquantitymorethanstocktotal');
										}
										// noinspection JSValidateTypes
										if (response.CalculateErrorMesssage === '3') {
											message = $translate.instant('procurement.stock.header.modifyquantity');
										}
										// noinspection JSValidateTypes
										if (response.CalculateErrorMesssage === '4') {
											message = $translate.instant('procurement.stock.header.modifymakewrongresult');
											platformModalService.showMsgBox(message, '', 'warning');
											return;
										}

										platformModalService.showMsgBox(message, '', 'error');

									}
									else
									{
										var ser1=$injector.get('procurementStockStockTotalDataService');
										ser1.stockTotalMarkSelected();
										service.stockIdsCheckChanged.fire(service.checkedPrjStockFks);
										ser1.IsUpdate();
									}
								},

								showProjectHeader: {
									getProject: function (entity) {
										if(!entity||!entity.ProjectFk){return null;}
										return lookupDescriptorService.getLookupItem('Project', entity.ProjectFk);
									}
								}
							}
						},
						presenter: {
							list: {
								incorporateDataRead: onReadSucceeded
							}
						},
						modification: {simple: false},
						sidebarWatchList: {active: true},  // @11.12.2015 enable watchlist support for this module
						entitySelection: {},
						dataProcessor: [{processItem: addIsCheckedField}]
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);

				service = serviceContainer.service;

				service.registerSidebarFilter = function () {
					var stockTotalService = $injector.get('procurementStockStockTotalDataService');
					stockTotalService.registerSidebarFilter();
				};
				service.executeSearchFilter = function (e, filter) {
					var stockTotalService = $injector.get('procurementStockStockTotalDataService');
					stockTotalService.executeSearchFilter(e, filter);
				};
				service.clearSidebarFilter = function (result, data) {
					var stockTotalService = $injector.get('procurementStockStockTotalDataService');
					stockTotalService.clearSidebarFilter(result, data);
				};

				service.stockIdsCheckChanged = new PlatformMessenger();

				service.setShowHeaderAfterSelectionChanged(function(){
					let item =service.getSelected();
					if (item === undefined || item === null) {
						return;
					}
					let project = lookupDescriptorService.getLookupItem('Project', item.ProjectFk);
					let entityHeaderObject = {};
					if (project !== null && project !== undefined) {
						entityHeaderObject.project = {
							id: project.Id,
							description: project.ProjectNo + ' - ' + project.ProjectName
						}

						let projectStock=lookupDescriptorService.getLookupItem('ProjectStock', item.PrjStockFk);
						if (!_.isNil(projectStock)) {
							entityHeaderObject.module = {
								id: projectStock.Id,
								description: projectStock.Code + ' - ' + projectStock.Description,
								moduleName: moduleName
							}
						}
						cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNameStock', entityHeaderObject);
					}
				});
				// user for reloading items after required  clearprojectstock wizard runed.
				service.callRefresh = service.refresh || serviceContainer.data.onRefreshRequested;

				service.navigateTo = function navigateTo(item, triggerfield) {
					var stockId = null;
					if (item && (platformObjectHelper.getValue(item, triggerfield) || item.StockFk)) {
						stockId = platformObjectHelper.getValue(item, triggerfield) || item.StockFk;
					}

					cloudDesktopSidebarService.filterSearchFromPKeys([stockId]);
				};

				service.checkedPrjStockFks = [];
				service.checkedStockHeaderIds = [];
				var stockIdsCheckChangedclearTimeout = null;
				function setIsCheckedAfterLoad(list) {
					if (service.checkedStockHeaderIds && service.checkedStockHeaderIds.length) {
						_.forEach(service.checkedStockHeaderIds, function (i) {
							var stockHeader = _.find(list, {Id: i});
							if (stockHeader) {
								stockHeader.IsChecked = true;
							}
						});
					}
				}
				function init() {
					service.checkedPrjStockFks = [];
					service.checkedStockHeaderIds = [];
				}
				service.checkAllStockItems = function checkAllStockItems(checked) {
					var prjStockFks = [];
					var stockHeaderIds = [];
					angular.forEach(service.getList(), function (item) {
						item.IsChecked = !!checked;
						prjStockFks.push(item.PrjStockFk);
						stockHeaderIds.push(item.Id);
					});
					if (checked) {
						service.checkedPrjStockFks = prjStockFks;
						service.checkedStockHeaderIds = stockHeaderIds;
					}
					else {
						init();
					}
					service.stockIdsCheckChanged.fire(service.checkedPrjStockFks);
					service.gridRefresh();
				};
				service.isCheckedValueChange = function (entity, isChecked) {
					entity.IsChecked = !!isChecked;
					if (entity.PrjStockFk) {
						if (isChecked) {
							service.checkedPrjStockFks.push(entity.PrjStockFk);
							service.checkedStockHeaderIds.push(entity.Id);
						}
						else {
							service.checkedPrjStockFks = _.filter(service.checkedPrjStockFks,(i) => {return i !== entity.PrjStockFk;});
							service.checkedStockHeaderIds = _.filter(service.checkedPrjStockFks,(i) => {return i !== entity.Id;});
						}
					}
					clearTimeout(stockIdsCheckChangedclearTimeout);
					stockIdsCheckChangedclearTimeout = setTimeout(() => {
						service.stockIdsCheckChanged.fire(service.checkedPrjStockFks);
						stockIdsCheckChangedclearTimeout = null;
					}, 500);
					return true;
				};

				service.setItemsChecked = function (prcStockIds) {
					service.checkedPrjStockFks = [];
					service.checkedStockHeaderIds = [];
					var list = service.getList();
					_.forEach(list, function (item) {
						item.IsChecked = false;
						var prcStockId = _.find(prcStockIds, function (id) {
							return id === item.PrjStockFk;
						});
						if (prcStockId) {
							item.IsChecked = true;
							service.checkedPrjStockFks.push(item.PrjStockFk);
							service.checkedStockHeaderIds.push(item.Id);
						}
					});
					if (list.length === prcStockIds.length && _.isFunction(service.checkHeaderCheckBox)) {
						service.checkHeaderCheckBox(list);
					}
					service.gridRefresh();
				};

				function addIsCheckedField(item) {
					item.IsChecked = !!item.IsChecked;
				}
				return service;
			}]);
})(angular);