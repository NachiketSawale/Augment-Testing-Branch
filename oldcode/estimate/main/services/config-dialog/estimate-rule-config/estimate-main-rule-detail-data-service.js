/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, _ */
(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainRuleConfigDetailDataService
	 * @function
	 *
	 * @description
	 * This service provides estimateMainRuleConfig Detail Data Service for dialog.
	 */
	angular.module(moduleName).factory('estimateMainRuleConfigDetailDataService',
		['$q', '$http', '$translate', '$injector', 'PlatformMessenger', 'platformDataServiceFactory', 'basicsLookupdataLookupFilterService',
			function ($q, $http, $translate, $injector, PlatformMessenger, platformDataServiceFactory, basicsLookupdataLookupFilterService) {

				let service = {},
					data = [],
					assignData = [],
					itemsToSave = [],
					itemsToDelete = [];

				let lookupFilter = [
					{
						key: 'estimate-main-est-rule-detail-rule-filter',
						serverSide: false,
						fn: function (entity) {
							return entity.IsForEstimate === true && entity.IsLive === true;
						}
					}
				];

				angular.extend(service, {
					getList: getList,
					clear : clear,
					addItems:addItems,
					setDataList: setDataList,
					setDataAssign: setDataAssign,
					addDataAssign: addDataAssign,
					getDataAssign: getDataAssign,
					removeDataAssign: removeDataAssign,
					// getSelected: getSelected,
					// setSelected: setSelected,
					// setSelectedEntities: setSelectedEntities,
					selectChange: selectChange,
					refreshGrid: refreshGrid,
					gridRefresh: gridRefresh,
					createItem : createItem,
					deleteItem:deleteItem,
					// markItemAsModified: markItemAsModified,
					setItemToSave: setItemToSave,
					getItemsToSave : getItemsToSave,
					getItemsToDelete : getItemsToDelete,
					registerListLoaded: registerListLoaded,
					unregisterListLoaded: unregisterListLoaded,
					registerSelectionChanged: registerSelectionChanged,
					unregisterSelectionChanged: unregisterSelectionChanged,

					listLoaded: new PlatformMessenger(),
					selectionChanged : new PlatformMessenger(),
					onUpdateList: new PlatformMessenger(),
					selectToLoad: new PlatformMessenger(),
					onRootAssignDetailStatusChange: new PlatformMessenger(),
					// hasSelection:hasSelection
					getContainerData: getContainerData,
					registerLookupFilter: registerLookupFilter,
					unregisterLookupFilter: unregisterLookupFilter,
				});

				let serviceOption = {
					module: angular.module(moduleName),
					entitySelection: {},
					modification: {multi: {}},
					translation: {
						uid: 'estimateMainRootDetailDataService',
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

				function addItems(items) {
					data = data ? data : [];
					angular.forEach(items, function(item){
						data.push(item);
						setItemToSave(item);
					});
					// service.refreshGrid();
				}

				function setDataList(items) {
					if (Array.isArray(items)) {
						data = items;
					} else {
						data = [];
					}
					// return items;
					service.selectToLoad.fire();
				}

				function setDataAssign(data) {
					assignData = data;
				}

				function addDataAssign(item){
					assignData.push(item);
				}

				function  getDataAssign( ){
					return assignData;
				}

				function removeDataAssign(removeItem){
					if(removeItem) {
						_.remove(assignData, {Id: removeItem.Id});
					}
				}

				function addItem(item) {
					data = data ? data : [];
					data.push(item);
					setItemToSave(item);
					service.refreshGrid();
				}

				function selectChange(){
					// let selectedItem = service.getSelected();
					// if(selectedItem){
					service.selectToLoad.fire(assignData);
					// }
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
					let modified = _.find(itemsToSave, {Id : item.Id});
					if(!modified){
						itemsToSave.push(item);
					}
				}

				function gridRefresh() {
					refreshGrid();
				}

				function createItem(rootAssignmentTypeFk) {
					// server create
					let httpRoute = globals.webApiBaseUrl + 'estimate/main/rootassignmentdetail/create',
						postData = {
							EstRootAssignmentTypeFk : rootAssignmentTypeFk
						};

					return $http.post(httpRoute, postData).then(function(response){
						let item = response.data;
						if(item && item.Id){
							item.EstRootAssignmentLevelFk = $injector.get('estimateMainEstRuleLevelService').getDefaultId();
							item.EstRootAssignmentTypeFk = rootAssignmentTypeFk;

							item.Sorting = data.length+1;
							addItem(item);
							service.setSelected(item);
							updateSelection();
							service.onUpdateList.fire(data);

							refreshGrid();
						}
						return item;
					});
				}

				function deleteItem(selectedItem) {
					if (selectedItem && selectedItem.Version > 0) {
						itemsToDelete.push(selectedItem);
					}

					data = _.filter(data, function (d) {
						return d.Id !== selectedItem.Id;
					});

					itemsToSave = _.filter(itemsToSave, function (d) {
						return d.Id !== selectedItem.Id;
					});

					itemsToDelete.push(selectedItem);

					refreshGrid();
					service.onUpdateList.fire(data);
				}

				function getItemsToSave(){
					return itemsToSave.length ? _.filter(itemsToSave, function(itemToSave){ return itemToSave.EstRuleFk > 0;}) : null;
				}

				function getItemsToDelete(){
					return itemsToDelete.length ? itemsToDelete : null;
				}

				function clear(){
					itemsToSave = [];
					itemsToDelete = [];
					assignData = [];
					data = [];
				}

				function getContainerData(){
					return container.data;
				}

				function registerLookupFilter() {
					basicsLookupdataLookupFilterService.registerFilter(lookupFilter);
				}

				function unregisterLookupFilter() {
					basicsLookupdataLookupFilterService.unregisterFilter(lookupFilter);
				}

			}]);
})(angular);
