/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainStructureConfigDetailDataService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Structure Detail Data Service for dialog.
	 */
	angular.module(moduleName).factory('estimateMainStructureConfigDetailDataService',
		['$q', '$http', '$translate', 'PlatformMessenger', 'platformDataServiceFactory','platformDataValidationService','platformRuntimeDataService', 'basicsLookupdataLookupFilterService',
			function ($q, $http, $translate, PlatformMessenger, platformDataServiceFactory,platformDataValidationService,platformRuntimeDataService, basicsLookupdataLookupFilterService) {

				let service = {},
					data = [],
					itemsToSave = [],
					itemsToDelete = [];

				let lookupFilter = [
					{
						key: 'estimate-main-structure-detail-est-quantity-relation',
						serverSide: false,
						fn: function (item) {
							return item.IsLive;
						}
					}
				];

				angular.extend(service, {
					getList: getList,
					clear : clear,
					setDataList: setDataList,
					refreshGrid: refreshGrid,
					gridRefresh: gridRefresh,
					createItem : createItem,
					deleteItem:deleteItem,
					setItemToSave: setItemToSave,
					getItemsToSave : getItemsToSave,
					getItemsToDelete : getItemsToDelete,
					registerListLoaded: registerListLoaded,
					unregisterListLoaded: unregisterListLoaded,
					registerSelectionChanged: registerSelectionChanged,
					unregisterSelectionChanged: unregisterSelectionChanged,
					setCodeColReadOnly: setCodeColReadOnly,
					selectedCostGroup : selectedCostGroup,
					isSelectedProjectCg: isSelectedProjectCg,

					registerLookupFilter: registerLookupFilter,
					unregisterLookupFilter: unregisterLookupFilter,

					listLoaded: new PlatformMessenger(),
					selectionChanged : new PlatformMessenger(),
					onUpdateList: new PlatformMessenger(),
					hasEstStructureErr: new PlatformMessenger()
				});

				let serviceOption = {
					module: angular.module(moduleName),
					entitySelection: {},
					modification: {multi: {}},
					translation: {
						uid: 'estimateMainStructureConfigDetailDataService',
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

				function setDataList(items) {
					if (Array.isArray(items)) {
						// setCodeColReadOnly(items);
						data = items;
					} else {
						data = [];
					}
					return items;
				}

				function addItem(item) {
					setCodeColReadOnly(item);
					data = data ? data : [];
					data.push(item);
					setItemToSave(item);
					service.refreshGrid();
				}

				function setCodeColReadOnly(items, isConfigReadonly) {
					if(!items){return;}

					items = angular.isArray(items) ? items : [items];
					angular.forEach(items, function (item) {
						platformRuntimeDataService.readonly(item, [{field: 'Code', readonly: isConfigReadonly || (item.EstStructureFk !== 17 && item.EstStructureFk !== 18)}]);
					});
				}

				function selectedCostGroup() {
					let selected = service.getSelected();
					if(selected){
						return selected.EstStructureFk === 17 || selected.EstStructureFk === 18;
					}
					return false;
				}

				function isSelectedProjectCg() {
					let selected = service.getSelected();
					if(selected){
						return selected.EstStructureFk === 17 ? false : selected.EstStructureFk === 18 ? true : false;
					}

					return false;
				}

				function registerLookupFilter() {
					basicsLookupdataLookupFilterService.registerFilter(lookupFilter);
				}

				function unregisterLookupFilter() {
					basicsLookupdataLookupFilterService.unregisterFilter(lookupFilter);
				}

				/* function getSelected() {
					return selectedItem;
				} */

				/* function setSelected(item) {
					let qDefer = $q.defer();
					selectedItem = item;
					qDefer.resolve(selectedItem);
					return qDefer.promise;
				} */

				/* function hasSelection(){
					return selectedItem ? true:false;
				} */

				/* function setSelectedEntities(data) {
					//
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
					let modified = _.find(itemsToSave, {Id : item.Id});
					if(!modified){
						itemsToSave.push(item);
					}
				}

				function gridRefresh() {
					refreshGrid();
				}

				function createItem(structConfigFk) {
					// server create
					let httpRoute = globals.webApiBaseUrl + 'estimate/main/structuredetail/create',
						postData = {
							EstStructureConfigFk : structConfigFk
						};

					return $http.post(httpRoute, postData).then(function(response){
						let item = response.data;
						if(item && item.Id){
							item.Sorting = data.length+1;
							addItem(item);
							service.setSelected(item);
							updateSelection();
							service.onUpdateList.fire(data);
							service.hasEstStructureErr.fire(false);

							platformRuntimeDataService.applyValidationResult({
								valid: false,
								error: '...',
								error$tr$: 'estimate.main.estStructureFkEmptyErrMsg'
							}, item, 'EstStructureFk');

							refreshGrid();

						}
						return item;
					});
				}

				function deleteItem(selectedItem){
					// let selectedItem = service.getSelected();
					if(selectedItem === null){
						return;
					}

					if(selectedItem && selectedItem.Version > 0){
						itemsToDelete.push(selectedItem);
					}

					data = _.filter(data, function(d){
						return d.Id !== selectedItem.Id;
					});

					itemsToSave = _.filter(itemsToSave, function(d){
						return d.Id !== selectedItem.Id;
					});

					let configDetailList = service.getList();
					let fromStructureList = [],
						fromStructureErrList = [],
						structureErrList = [];
					_.filter(configDetailList, function (item) {
						if (item.EstQuantityRelFk === 1){
							fromStructureList.push(item);
							if(platformRuntimeDataService.hasError(item, 'Sorting')){
								fromStructureErrList.push(item);
							}
							if(platformRuntimeDataService.hasError(item, 'EstStructureFk')){
								structureErrList.push(item);
							}
						}
					});

					angular.forEach(structureErrList, function (subItem) {
						let resSubItemUnique = platformDataValidationService.isUnique(configDetailList, 'EstStructureFk', subItem.EstStructureFk, subItem.Id,false);
						let resSubItemFinish = platformDataValidationService.finishValidation(resSubItemUnique, subItem, subItem.EstStructureFk, 'EstStructureFk', service, service);
						if(resSubItemFinish.valid === false){
							if (subItem.EstStructureFk === 0){
								resSubItemFinish.error = $translate.instant('estimate.main.estStructureFkEmptyErrMsg');
								resSubItemFinish.error$tr$ = 'estimate.main.estStructureFkEmptyErrMsg';
							}
							else{
								resSubItemFinish.error$tr$param$ = { object: 'Structure'};
							}
						}
						platformRuntimeDataService.applyValidationResult(resSubItemFinish, subItem, 'EstStructureFk');
					});

					angular.forEach(fromStructureErrList, function (subItem) {
						let resSubItemUnique = platformDataValidationService.isValueUnique(fromStructureList, 'Sorting', subItem.Sorting, subItem.Id);
						let resSubItemFinish = platformDataValidationService.finishValidation(resSubItemUnique, subItem, subItem.Sorting, 'Sorting', service, service);
						platformDataValidationService.finishValidation(resSubItemUnique, subItem, subItem.EstQuantityRelFk, 'EstQuantityRelFk', service, service);
						if(resSubItemFinish.valid === false){
							resSubItemFinish.error$tr$ = 'estimate.main.estStructureErrMsg';
						}

						platformRuntimeDataService.applyValidationResult(resSubItemFinish, subItem, 'Sorting');
						platformRuntimeDataService.applyValidationResult(resSubItemFinish, subItem, 'EstQuantityRelFk');
					});

					refreshGrid();
					// service.setSelected(item);
					updateSelection();

					service.onUpdateList.fire(data);
				}

				function getItemsToSave(){
					return itemsToSave.length ? itemsToSave : null;
				}

				function getItemsToDelete(){
					return itemsToDelete.length ? itemsToDelete : null;
				}

				function clear(){
					itemsToSave = [];
					itemsToDelete = [];
				}

			}]);
})(angular);
