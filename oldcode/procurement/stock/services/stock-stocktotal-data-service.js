(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.stock';
	// jshint -W072
	angular.module(moduleName).factory('procurementStockStockTotalDataService',
		['$injector', 'platformDataServiceFactory', 'procurementStockHeaderDataService', 'basicsLookupdataLookupDescriptorService', 'createOrderProposalActionProcessor',
			'procurementContractHeaderFilterService', 'PlatformMessenger',
			'cloudDesktopSidebarService','platformContextService','platformGridAPI',
			function ($injector, dataServiceFactory, parentService, lookupDescriptorService, createOrderProposalActionProcessor,
				filterService, PlatformMessenger,
				cloudDesktopSidebarService,platformContextService, platformGridAPI) {
				var selectItem, service = {}, data, serviceContainer;
				// eslint-disable-next-line no-unused-vars
				var isUpdate = false;
				let isFromApi = false;
				let prjStockId;
				let pattern;

				var sidebarSearchOptions = {
					moduleName: moduleName,  // required for filter initialization
					enhancedSearchEnabled: true,
					pattern: '',
					pageSize: 100,
					useCurrentClient: false,
					includeNonActiveItems: false,
					showOptions: true,
					showProjectContext: false,
					withExecutionHints: false
				};

				let startUpFilter = platformContextService.getApplicationValue('cloud.desktop.StartupParameter');
				if (startUpFilter && startUpFilter.furtherFilter && startUpFilter.furtherFilter.navInfo  && startUpFilter.furtherFilter.navInfo.search
					&& startUpFilter.furtherFilter.navInfo.extparams) {
					prjStockId = parseInt(startUpFilter.furtherFilter.navInfo.extparams);
					pattern=startUpFilter.furtherFilter.navInfo.search;
					isFromApi = true;
				}


				var serviceOptions = {
					flatRootItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementStockStockTotalDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/stock/stocktotal/',
							endRead: 'list',
							initReadData: function initReadData(readData) {
								if (service.isSearchFromCatalog) {
									readData.PrjStockIds = (service.prjStockIds && service.prjStockIds.length) ? service.prjStockIds : [-1];
								} else {
									if (_.isEmpty(parentService.getList())) {
										readData.PrjStockIds = [-1];
									} else {
										readData.PrjStockIds = (service.prjStockIds && service.prjStockIds.length) ? service.prjStockIds : [];
									}
								}
								if (isFromApi) {
									readData.PrjStockIds = [prjStockId];
									readData.Pattern = pattern;
								}
								var params = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(data.searchFilter);
								angular.extend(readData, params);
							},
							usePostForRead: true
						},
						dataProcessor: [createOrderProposalActionProcessor],
						actions: {delete: false, create: false, bulk: false},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									var num = 1;
									var obj = {};
									if (readData.Main) {
										for (var i = 0; i < readData.Main.length; i++) {
											readData.Main[i].Id = num;
											num++;
											obj = {};
											obj.actionList = [];
											readData.Main[i].OrderProposalStatuses = obj;
										}
									}
									var items = {
										FilterResult: readData.FilterResult,
										dtos: readData.Main || []
									};
									if (!service.isSearchFromCatalog && (!service.prjStockIds || !service.prjStockIds.length)) {
										service.setParentItemsChecked(items.dtos);
									}
									var itemList = data.handleReadSucceeded(items, data);
									data.clearSidebarFilter(items, data); // Manually call this method to update sidebar result, see ALM #130665
									if (selectItem !== null && selectItem !== undefined) {
										var item = _.find(itemList, {
											PrjStockFk: selectItem.PrjStockFk,
											MdcMaterialFk: selectItem.MdcMaterialFk
										});
										if (item) {
											var ser = $injector.get('procurementStockTransactionDataService');
											ser.isUpdate = true;
											service.setSelected(item);
											isUpdate = false;
										}
									}
									service.isSearchFromCatalog = false;
									ignoreDisplaySkeletonLoading();
									return itemList;
								}
							}
						},
						entityRole: {
							root: {
								itemName: 'StockTotalV',
								moduleName: 'cloud.desktop.moduleDisplayNameStock',
								addToLastObject: true,
								lastObjectModuleName: 'procurement.stock'
							}
						},
						sidebarSearch: {options: sidebarSearchOptions},
						sidebarWatchList: {active: true}
					}
				};
				serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
				service = serviceContainer.service;
				data = serviceContainer.data;

				service.isSearchFromCatalog = false;
				service.prjStockIds = [];
				var onFilterLoaded = new PlatformMessenger();
				var onFilterUnLoaded = new PlatformMessenger();

				function assertSelectedEntityEntryById(modStorage, itemId, service, data) {
					var toInsert = null;
					if (itemId) {
						service.assertTypeEntries(modStorage);
						toInsert = {MainItemId: itemId};
						var entry = _.find(modStorage[data.itemName + 'ToSave'], toInsert);
						if (!entry) {
							modStorage[data.itemName + 'ToSave'].push(toInsert);
						} else {
							toInsert = entry;
						}
					}

					return toInsert;
				}

				/**
				 * When the module has multiple roots and a search is performed via the sidebar,
				 * the skeleton loading will be displayed for all grids, even those belonging to other root headers.
				 * This solution prevents the skeleton loading from always being displayed.
				 */
				function ignoreDisplaySkeletonLoading() {
					const gridIdsToIgnore = [
						'10119ef5d56d4591ba1f44a8b3c279b4', '06eaf2abd89c474b9309c355710b29a8',
						'115362380bc84b4b91f3678efe6866e4', '0780abf4d0174c8cb9827ebd6907ac83',
						'ca2124f6e99e494591df3b5892a0a30a', 'dad7237be98841deb372c1572a39188f',
						'6c64f212eaa54bd6b7738ccb80094cdb'
					];

					gridIdsToIgnore.forEach(gridId => {
						platformGridAPI.grids.skeletonLoading(gridId, false);
					});
				}


				service.parentService = function () {
					return parentService;
				};
				service.assertTypeEntries = function doAssertTypeEntries(modStorage) {
					if (!modStorage[data.itemName + 'ToSave']) {
						modStorage[data.itemName + 'ToSave'] = [];
					}
				};
				service.assertSelectedEntityEntry = function (modStorage) {
					var toInsert = null;
					if (data.selectedItem && data.selectedItem.Id) {
						toInsert = assertSelectedEntityEntryById(modStorage, data.selectedItem.Id, service, data);
					} else if (data.forceNodeItemCreation) {
						toInsert = assertSelectedEntityEntryById(modStorage, -1, service, data);
					}
					return toInsert;
				};

				service.tryGetTypeEntries = function doTryGetTypeEntries(modStorage) {
					return modStorage[data.itemName + 'ToSave'];
				};

				service.tryGetSelectedEntry = function doTryGetSelectedLeafEntry(elemStates) {
					var sel = service.getSelected();
					var res = null;
					if (sel && sel.Id) {
						res = _.find(elemStates, {MainItemId: sel.Id});
					}
					return res;
				};

				service.IsUpdate = function () {
					isUpdate = true;

				};
				service.getParentData = function () {
					return parentService.getSelected();
				};
				service.stockTotalMarkSelected = function () {
					selectItem = service.getSelected();
				};
				service.loadData = function () {
					selectItem = service.getSelected();
					service.load().then(function () {
						service.setSelected(selectItem);
					});

				};
				var onSelectionChanged = function onSelectionChanged() {
					parentService.update();
				};
				service.registerSelectionChanged(onSelectionChanged);
				// user for reloading items after required  clearprojectstock wizard runed.
				service.callRefresh = service.refresh || serviceContainer.data.onRefreshRequested;

				// filters register and un-register, it will call by the contract-module.js
				service.registerFilters = function () {
					filterService.registerFilters();
					onFilterLoaded.fire(moduleName);
				};

				// unload filters
				service.unRegisterFilters = function () {
					filterService.unRegisterFilters();
					onFilterUnLoaded.fire(moduleName);
				};

				service.setParentItemsChecked = function setParentItemsChecked(itemList) {
					service.prjStockIds = [];
					var prcStockIds = [];
					angular.forEach(itemList, function (item) {
						if (prcStockIds.indexOf(item.PrjStockFk) === -1) {
							prcStockIds.push(item.PrjStockFk);
						}
					});
					service.prjStockIds = prcStockIds;
					parentService.setItemsChecked(prcStockIds);
				};

				var onStockIdsCheckChanged = function (prjStockIds) {
					service.isSearchFromCatalog = true;
					if (prjStockIds.length === 0) {
						service.prjStockIds = [];
					} else {
						service.prjStockIds = prjStockIds;
					}
					cloudDesktopSidebarService.filterStartSearch();
				};
				parentService.stockIdsCheckChanged.register(onStockIdsCheckChanged);

				return service;
			}]);
})(angular);