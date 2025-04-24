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
	 * @name estimateMainCostCodeAssignmentDetailDataService
	 * @function
	 *
	 * @description
	 * This service provides Estimate cost code assignment Detail for dialog
	 */
	angular.module(moduleName).factory('estimateMainCostCodeAssignmentDetailDataService', [
		'$q', '$http', '$injector', 'platformGridAPI', 'PlatformMessenger', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'estimateMainEstTotalsConfigDetailDataService',
		function ($q, $http, $injector, platformGridAPI, PlatformMessenger, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, estTotalsConfigDetailDataService) {

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

				refreshGrid: refreshGrid,

				createItem: createItem,
				createItems: createItems,
				deleteItem: deleteItem,

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
				readOnlyCostCodeAssignment: new PlatformMessenger(),
				synchroCostcodeData: synchroCostcodeData,
				updateColumn: updateColumn,

				getCostCodeLookupSelectedItems: getCostCodeLookupSelectedItems
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
				let dataToSave = estTotalsConfigDetailDataService.getDataAssign();
				let totalsToDelete = estTotalsConfigDetailDataService.getItemsToDelete();
				let dataTemp = [];
				if (totalsToDelete && totalsToDelete.length > 0) {
					angular.forEach(totalsToDelete, function (item) {
						dataTemp = _.filter(dataToSave, function (d) {
							return d.EstTotalsconfigdetailFk === item.Id;
						});
						if (dataTemp && dataTemp.length > 0) {
							angular.forEach(dataTemp, function (item) {
								let exist = _.find(itemsToDelete, item);
								if (!exist) {
									itemsToDelete.push(item);
								}
							});
						}

						dataToSave = _.filter(dataToSave, function (d) {
							return d.EstTotalsconfigdetailFk !== item.Id;
						});
					});
				}
				return dataToSave;
			}

			function setDataList(items) {
				data = [];

				if (_.isEmpty(items)){
					return [];
				}

				let curTotalsConfigItem = estTotalsConfigDetailDataService.getSelected();
				if (curTotalsConfigItem){
					data = _.filter(items, { EstTotalsconfigdetailFk: curTotalsConfigItem.Id });
				}

				let setAdditionalFields = function setAdditionalFields(entity, costCode){
					if(costCode){
						entity.BasUomFk = costCode.UomFk;
						entity.CurrencyFk = costCode.CurrencyFk;
						entity.CostcodeTypeFk = costCode.CostCodeTypeFk;
					}
				};

				// handle additional costCode fields
				$q.all(_.map(data, function(entity){
					let lookupType= 'costcode', costCodeId = entity.MdcCostCodeFk;
					return basicsLookupdataLookupDescriptorService.hasLookupItem(lookupType, costCodeId) ?
						$q.when(basicsLookupdataLookupDescriptorService.getLookupItem(lookupType, costCodeId)): basicsLookupdataLookupDescriptorService.getItemByKey(lookupType, costCodeId, { version: 3});
				})).then(function(costCode){
					for (let x = 0; x<data.length; x++){
						setAdditionalFields(data[x], costCode[x]);
					}
					service.refreshGrid();
				});
			}

			function addItem(item) {
				data = data ? data : [];
				data.push(item);
				allData.push(item);
				setItemToSave(item);
				service.refreshGrid();
			}

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

			function createItem(totalsAssignDetailFk) {
				// server create
				let httpRoute = globals.webApiBaseUrl + 'estimate/main/costcodeassigndetail/create',
					postData = {
						EstTotalsConfigDetailFk: totalsAssignDetailFk
					};

				return $http.post(httpRoute, postData).then(function (response) {
					let item = response.data;
					if (item && item.Id) {
						item.IsDirectRulesCost = 1;
						item.IsDirectEnteredCost = 1;
						item.IsIndirectCost = 1;
						item.IsCostRisk = 1;
						item.IsNonCostRisk =1;
						item.Addorsubtract = 1;
						addItem(item);
						service.setSelected(item);
						updateSelection();
						estTotalsConfigDetailDataService.addDataAssign(item);
						service.onUpdateList.fire(data);
					}
					return item;
				});
			}

			function createItems(items){
				let tolCofDetailItem = service.getSelected();
				let totalsConfigDetailFk = tolCofDetailItem ? tolCofDetailItem.EstTotalsconfigdetailFk : 0;

				function createTCDetail(items){
					let item = _.head(items);
					if (item){
						createItem(totalsConfigDetailFk).then(function(costCodeDetail){
							// set other fields values
							setTCDetail(item, costCodeDetail);
							removeItemRefreshTCDetail(items);
							createTCDetail(items);
						});
					}
				}

				function removeItemRefreshTCDetail(items){
					items.shift();

					if (_.isEmpty(items)){
						// Lastly calculate/refresh...
						service.refreshGrid();
					}
				}

				function setTCDetail(item, costCodeDetail){
					costCodeDetail.IsCustomProjectCostCode = item.IsCustomProjectCostCode;
					costCodeDetail.MdcCostCodeFk = item.Id;
					costCodeDetail.BasUomFk = item.UomFk;
					costCodeDetail.CurrencyFk = item.CurrencyFk;
					costCodeDetail.CostcodeTypeFk = item.CostCodeTypeFk;
					costCodeDetail.Description = item.DescriptionInfo.Description;

					setItemToSave(costCodeDetail);
				}

				if (estTotalsConfigDetailDataService.getSelected() && service.getSelected()){
					setTCDetail(_.head(items), tolCofDetailItem);
					removeItemRefreshTCDetail(items);
					createTCDetail(items);
				}
			}

			function deleteItem(selectedItem) {
				// let selectedItem = service.getSelected();
				let removeItem = selectedItem;

				let itemsToDeleteIds = _.map(itemsToDelete,'Id');

				if (selectedItem && selectedItem.Version > 0 && itemsToDeleteIds.indexOf(selectedItem.Id)<0) {
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

				estTotalsConfigDetailDataService.removeDataAssign(removeItem);

				service.onUpdateList.fire(data);
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

			function updateColumn(readOnly, newItem) {
				if (!readOnly) {
					let cols = platformGridAPI.columns.configuration(service.gridId);
					if (cols) {
						_.map(cols.visible || [], function (col) {
							if (col.domain === 'boolean') {
								col.headerChkbox = !readOnly;
							}
						});

						platformGridAPI.columns.configuration(service.gridId, angular.copy(cols.visible));

						setCheckHandler(newItem);
					}
				}
			}

			function checkIndeterminateness(grid, columnDef, newItem) {
				let headers = grid.getColumnHeaders();
				let ele = headers.find('#chkbox_' + grid.getUID() + '_' + columnDef.id);

				if(ele.length) {
					let data = grid.getData().getItems();
					let hasTrueValue = false;
					let hasFalseValue = false;
					let disabled = !data.length;

					if(newItem && data.length){
						disabled = false;
						hasTrueValue = true;
						hasFalseValue = _.findIndex(data, _.set({}, columnDef.field, false)) !== -1 || _.findIndex(data, _.set({}, columnDef.field, 0)) !== -1;
					}
					else if(data.length) {
						hasTrueValue = _.findIndex(data, _.set({}, columnDef.field, true)) !== -1 || _.findIndex(data, _.set({}, columnDef.field, 1)) !== -1;
						hasFalseValue = _.findIndex(data, _.set({}, columnDef.field, false)) !== -1 || _.findIndex(data, _.set({}, columnDef.field, 0)) !== -1;
					}
					else if(newItem){
						disabled = false;
						hasTrueValue = true;
						hasFalseValue = false;
					}

					ele.prop('disabled', disabled);
					ele.prop('indeterminate', hasTrueValue && hasFalseValue);
					ele.prop('checked', hasTrueValue && !hasFalseValue);
				}
			}

			// reset headercheck
			function setCheckHandler(newItem) {
				let grid = platformGridAPI.grids.element('id', service.gridId).instance;
				let columns = grid.getColumns();
				if (columns) {
					for (let i = 0; i < columns.length; i++) {
						checkIndeterminateness(grid, columns[i], newItem);
					}
				}
			}

			function getCostCodeLookupSelectedItems(entity, costCodeSelectedItems){
				if (!_.isEmpty(costCodeSelectedItems) && _.size(costCodeSelectedItems) > 1){
					service.createItems(costCodeSelectedItems);
				}
			}

		}]);
})(angular);
