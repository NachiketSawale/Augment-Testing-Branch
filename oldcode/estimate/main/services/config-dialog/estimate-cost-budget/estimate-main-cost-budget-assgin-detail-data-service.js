/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _, globals */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainCostBudgetAssignDetailDataService
	 * @function
	 *
	 * @description
	 * This service provides Estimate cost code assignment Detail for dialog
	 */
	angular.module(moduleName).factory('estimateMainCostBudgetAssignDetailDataService', [
		'$q', '$http', '$injector', 'platformGridAPI', 'PlatformMessenger', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
		function ($q, $http, $injector, platformGridAPI, PlatformMessenger, platformDataServiceFactory, basicsLookupdataLookupDescriptorService) {

			let service = {},
				data = [],
				allData = [],
				itemsToSave = [],
				itemsToDelete = [];

			angular.extend(service, {
				getList: getList,
				getAllList: getAllList,
				clear: clear,
				setDataList: setDataList,
				// getSelected: getSelected,
				// setSelected: setSelected,
				// setSelectedEntities: setSelectedEntities,
				refreshGrid: refreshGrid,
				// gridRefresh: gridRefresh,
				createItem: createItem,
				createItems: createItems,
				deleteItem: deleteItem,
				// markItemAsModified: markItemAsModified,
				setItemToSave: setItemToSave,
				getItemsToSave: getItemsToSave,
				getItemsToDelete: getItemsToDelete,
				registerListLoaded: registerListLoaded,
				unregisterListLoaded: unregisterListLoaded,
				registerSelectionChanged: registerSelectionChanged,
				unregisterSelectionChanged: unregisterSelectionChanged,
				listLoaded: new PlatformMessenger(),
				selectionChanged: new PlatformMessenger(),
				onUpdateList: new PlatformMessenger(),
				// hasSelection: hasSelection,
				synchroCostcodeData: synchroCostcodeData
			});

			// Move implementation of setSelected and remove this serviceOption configuration
			let serviceOption = {
				module: angular.module(moduleName),
				entitySelection: {},
				modification: {multi: {}},
				translation: {
					uid: 'estimateMainEstCostcodeAssignDetailDataService',
					title: 'Title',
					columns: [
						{
							header: 'cloud.common.entityDescription',
							field: 'DescriptionInfo'
						}]
				}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOption);
			container.data.itemList = [];
			angular.extend(service, container.service);
			return service;

			function getList() {
				return data;
			}

			function getAllList() {
				let dataToSave = itemsToSave;
				if (itemsToDelete && itemsToDelete.length > 0) {
					angular.forEach(itemsToDelete, function (item) {
						dataToSave = _.filter(dataToSave, function (d) {
							return d.Id !== item.Id;
						});
					});
				}
				return dataToSave;
			}

			function setDataList(items) {
				let costcodeItemList = basicsLookupdataLookupDescriptorService.getData('estconfigcostcode');
				let costBudgetConfigItem =$injector.get('estimateMainCostBudgetDataService').getCostBudgetConfig();
				let curList = [];
				// if item is not in allData,push in allData
				if (Array.isArray(items)) {
					angular.forEach(items, function (item) {
						let exist = _.find(allData, item);
						if (!exist) {
							allData.push(item);
						}
					});
				}

				if (Array.isArray(allData)) {
					angular.forEach(allData, function (dataItem) {
						if (costBudgetConfigItem && costBudgetConfigItem.Id === dataItem.EstCostBudgetConfigFk) {
							let costcodeItem = _.find(costcodeItemList, {Id: dataItem.MdcCostCodeFk});
							if (costcodeItem) {
								dataItem.BasUomFk = costcodeItem.UomFk;
								dataItem.CurrencyFk = costcodeItem.CurrencyFk;
								dataItem.CostcodeTypeFk = costcodeItem.CostCodeTypeFk;
								dataItem.Description = costcodeItem.DescriptionInfo.Description;
							}
							curList.push(dataItem);
						}
					});
					data = curList;
				}
				else {
					data = [];
				}
			}

			function addItem(item) {
				data = data ? data : [];
				data.push(item);
				allData.push(item);
				setItemToSave(item);
				service.refreshGrid();
			}
			function addItems(items) {
				angular.forEach(items, function(item){
					addItem(item);
				});
			}

			/* function getSelected() {
				return selectedItem;
			} */

			/* function setSelected(item) {
				container.service.setSelected(item);

				let qDefer = $q.defer();
				selectedItem = item;

				qDefer.resolve(selectedItem);
				return qDefer.promise;
			} */

			/* function setSelectedEntities(data) {
				return container.service.setSelectedEntities(data);
			} */

			/* function hasSelection() {
				return selectedItem ? true : false;
			} */

			function refreshGrid() {
				service.listLoaded.fire();
			}

			function updateSelection() {
				service.selectionChanged.fire();
			}

			function registerListLoaded(callBackFn) {
				service.listLoaded.register(callBackFn);
			}

			function unregisterListLoaded(callBackFn) {
				service.listLoaded.unregister(callBackFn);
			}

			function registerSelectionChanged(callBackFn) {
				service.selectionChanged.register(callBackFn);
			}

			function unregisterSelectionChanged(callBackFn) {
				service.selectionChanged.unregister(callBackFn);
			}

			function setItemToSave(item) {
				let modified = _.find(itemsToSave, {Id: item.Id});
				if (!modified) {
					itemsToSave.push(item);
				}
			}

			function createItem(costBudgetConfigFk) {
				// server create
				let httpRoute = globals.webApiBaseUrl + 'estimate/main/costbudgetassign/create',
					postData = {
						EstCostBudgetConfigFk: costBudgetConfigFk
					};

				return $http.post(httpRoute, postData).then(function (response) {
					let item = response.data;
					if (item && item.Id) {
						// synchroCostcodeData(item);
						addItem(item);
						service.setSelected(item);
						updateSelection();
						service.onUpdateList.fire(data);
					}
					return item;
				});
			}

			function createItems(items) {
				let assignDetailItem = service.getSelected();
				let costBudgetConfigFk = assignDetailItem ? assignDetailItem.EstCostBudgetConfigFk : 0;

				function createCBAssignDetail(items) {
					let costCodeIds = _.map(items, 'Id');
					let httpRoute = globals.webApiBaseUrl + 'estimate/main/costbudgetassign/createitems',
						postData = {
							EstCostBudgetConfigFk: costBudgetConfigFk,
							CostCodeFks: costCodeIds
						};
					return $http.post(httpRoute, postData).then(function (response) {
						let assignDetails = response.data;
						addItems(assignDetails);
						service.setSelected(assignDetailItem);
						updateSelection();
						service.onUpdateList.fire(assignDetails);
						angular.forEach(assignDetails, function (dt) {
							if (dt && dt.Id) {
								let item = _.head(items);
								if (item) {
									// set other fields values
									setCBAssignDetail(item, dt);
									removeItemRefreshCBAssignDetail(items);
								}
							}
						});

						return assignDetails;
					});
				}

				function removeItemRefreshCBAssignDetail(items) {
					items.shift();
					if (_.isEmpty(items)) {
						// Lastly calculate/refresh...
						service.refreshGrid();
					}
				}

				function setCBAssignDetail(item, ccAssignDetail) {
					ccAssignDetail.MdcCostCodeFk = item.Id;
					ccAssignDetail.BasUomFk = item.UomFk;
					ccAssignDetail.CurrencyFk = item.CurrencyFk;
					ccAssignDetail.CostcodeTypeFk = item.CostCodeTypeFk;
					ccAssignDetail.Description = item.DescriptionInfo.Description;

					setItemToSave(ccAssignDetail);
				}

				setCBAssignDetail(_.head(items), assignDetailItem);
				removeItemRefreshCBAssignDetail(items);
				createCBAssignDetail(items);
			}

			function deleteItem(selectedItem) {
				// let selectedItem = service.getSelected();
				if (selectedItem && selectedItem.Version > 0) {
					itemsToDelete.push(selectedItem);
				}
				data = _.filter(data, function (d) {
					return d.Id !== selectedItem.Id;
				});

				itemsToSave = _.filter(itemsToSave, function (d) {
					return d.Id !== selectedItem.Id;
				});

				allData = _.filter(allData, function (d) {
					return d.Id !== selectedItem.Id;
				});

				refreshGrid();
			}

			function getItemsToSave() {
				return itemsToSave.length ? itemsToSave : null;
			}

			function getItemsToDelete() {
				return itemsToDelete.length ? itemsToDelete : null;
			}

			function clear() {
				itemsToSave = [];
				itemsToDelete = [];
				allData = [];
			}

			function synchroCostcodeData(item) {
				let costcodeItemList = basicsLookupdataLookupDescriptorService.getData('estcostcodeslist');
				let costcodeItem = _.find(costcodeItemList, {Id: item.MdcCostCodeFk});
				if (costcodeItem) {
					item.BasUomFk = costcodeItem.UomFk;
					item.CurrencyFk = costcodeItem.CurrencyFk;
					item.CostcodeTypeFk = costcodeItem.CostCodeTypeFk;
					item.Description = costcodeItem.DescriptionInfo.Description;
				}
			}
		}]);
})(angular);
