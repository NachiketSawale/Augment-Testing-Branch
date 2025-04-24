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
	 * @name estimateMainEstRuleAssignmentParamDataService
	 * @function
	 *
	 * @description
	 * This service provides Estimate root assignment Detail for dialog
	 */
	angular.module(moduleName).factory('estimateMainEstRuleAssignmentParamDataService', [
		'$q', '$http', 'platformGridAPI', 'PlatformMessenger', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'estimateMainRuleConfigDetailDataService',
		function ($q, $http, platformGridAPI, PlatformMessenger, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, estimateMainRuleConfigDetailDataService) {

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

				getParamsByRuleFk: getParamsByRuleFk
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
				let dataToSave = estimateMainRuleConfigDetailDataService.getDataAssign();
				let totalsToDelete = estimateMainRuleConfigDetailDataService.getItemsToDelete();
				let dataTemp = [];
				if (totalsToDelete && totalsToDelete.length > 0) {
					angular.forEach(totalsToDelete, function (item) {
						dataTemp = _.filter(dataToSave, function (d) {
							return d.EstRootAssignmentDetailFk === item.Id;
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
							return d.EstRootAssignmentDetailFk !== item.Id;
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

				let curTotalsConfigItem = estimateMainRuleConfigDetailDataService.getSelected();
				if (curTotalsConfigItem){
					data = _.filter(items, { EstRootAssignmentDetailFk: curTotalsConfigItem.Id });
				}
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

			function createItem(totalsAssignDetailFk, itemToCopy) {
				// server create
				let httpRoute = globals.webApiBaseUrl + 'estimate/main/rootassignmentparam/create',
					postData = {
						EstRootAssignmentDetailFk: totalsAssignDetailFk
					};

				return $http.post(httpRoute, postData).then(function (response) {
					let item = response.data;
					if (item && item.Id) {
						item.EstRootAssignmentDetailFk = totalsAssignDetailFk;

						if (itemToCopy){
							item.EstParameterGroupFk = itemToCopy.EstParameterGroupFk;
							item.Code = itemToCopy.Code;
							item.DescriptionInfo = itemToCopy.DescriptionInfo;
							item.Sorting = itemToCopy.Sorting;
							item.ValueDetail = itemToCopy.ValueDetail;
							item.ParameterValue = itemToCopy.ParameterValue;
							item.UomFk = itemToCopy.UomFk;
							item.DefaultValue = itemToCopy.DefaultValue;
							item.ValueType = itemToCopy.ValueType;
							item.IsLookup = itemToCopy.IsLookup;
							item.EstRuleParamValueFk = itemToCopy.EstRuleParamValueFk;
							item.ValueText = itemToCopy.ValueText;
							item.ParameterText = itemToCopy.ParameterText;
						}

						addItem(item);

						// service.setSelected(item);

						updateSelection();
						estimateMainRuleConfigDetailDataService.addDataAssign(item);
						service.onUpdateList.fire(data);
					}
					return item;
				});
			}

			function createItems(items){
				let estMainRootAssignDetail = estimateMainRuleConfigDetailDataService.getSelected();

				_.forEach(items, function(item){
					createItem(estMainRootAssignDetail.Id, item);
				});
			}

			function deleteItem(selectedItem) {
				let removeItem = selectedItem;
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

				estimateMainRuleConfigDetailDataService.removeDataAssign(removeItem);

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

			function getParamsByRuleFk(ruleFk) {
				return $http.get(globals.webApiBaseUrl + 'estimate/rule/parameter/list?mainItemId=' + ruleFk);
			}

		}]);
})(angular);
