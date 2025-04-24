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
	 * @name estimateMainEstColumnConfigDetailDataService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Column Configuration Detail for dialog
	 */
	angular.module(moduleName).factory('estimateMainEstColumnConfigDetailDataService', [
		'$q', '$http', 'PlatformMessenger', 'platformDataServiceFactory', 'estimateMainEstColumnConfigDetailProcessService', 'platformGridAPI', 'mainViewService','platformGridConfigService','estimateMainCommonService',
		function ($q, $http, PlatformMessenger, platformDataServiceFactory, estimateMainEstColumnConfigDetailProcessService, platformGridAPI, mainViewService,platformGridConfigService,estimateMainCommonService) {

			let service = {},
				data = [],
				itemsToSave = [],
				itemsToDelete = [],
				columnConfigId = 0;

			let editType=null;

			angular.extend(service, {
				getList: getList,
				clear: clear,
				setDataList: setDataList,
				// getSelected: getSelected,
				// setSelected: setSelected,
				// setSelectedEntities: setSelectedEntities,
				refreshGrid: refreshGrid,
				// gridRefresh: gridRefresh,
				createItem: createItem,
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

				verifyColumnConfigListStatus: verifyColumnConfigListStatus,
				refreshOnColumnConfigIdChanged: refreshOnColumnConfigIdChanged,
				setColumnConfigId: setColumnConfigId,
				getColumnConfigId: getColumnConfigId,

				getContainerData: getContainerData,

				handleOnUpdateSucceeded: handleOnUpdateSucceeded,
				onColumnConfigStatusChange: new PlatformMessenger(),

				moveUp: moveUp,
				moveDown: moveDown,
				// deselect: deselect,

				setEditType: setEditType,
				getEditType: getEditType,
				getModule: getModule,

				setColumnConfigDetailsToViewConfig: setColumnConfigDetailsToViewConfig
			});

			// TODO:   Move implementation of setSelected and remove this serviceOption configuration
			let serviceOption = {
				module: angular.module(moduleName),
				entitySelection: {},
				modification: {multi: {}},
				translation: {
					uid: 'estimateMainEstColumnConfigDetailDataService',
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
				// process before saving

				return data;
			}

			function setDataList(items) {
				data = items || [];
			}

			function addItem(item) {
				data = data ? data : [];
				data.push(item);
				setItemToSave(item);
				service.refreshGrid();
			}

			/* function getSelected() {
				return selectedItem;
			} */

			/* function setSelected(item) {
				container.service.setSelected(item);

				 let qDefer = $q.defer();
				 selectedItem = item;

				 //checkTranslationForChanges(data);

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

			/* function gridRefresh() {
				refreshGrid();
			} */

			function createItem(columnConfigFk) {
				// server create
				let httpRoute = globals.webApiBaseUrl + 'estimate/main/columnconfigdetail/create',
					postData = {
						EstColumnConfigFk: columnConfigFk
					};

				return $http.post(httpRoute, postData).then(function (response) {
					let item = response.data;
					if (item && item.Id) {
						item.Sorting = data.length + 1;
						estimateMainEstColumnConfigDetailProcessService.processItem(item);
						addItem(item);
						service.setSelected(item);
						updateSelection();
						service.onUpdateList.fire(data);
					}
					return item;
				});
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

				refreshGrid();

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
			}

			function verifyColumnConfigListStatus(isConflict) {
				let itemsList = service.getList();
				let isValid = true;
				if(!isConflict) {
					angular.forEach(itemsList, function (item) {
						if (!isValid) {
							return;
						}
						let status = false;
						if (item.ColumnId && item.LineType && item.DescriptionInfo && item.DescriptionInfo.Description) {
							if (item.LineType === 1) {
								if (item.MdcCostCodeFk !== null) {
									status = true;
								}
							} else if (item.LineType === 2) {
								if (item.MaterialLineId > 0) {
									status = true;
								}
							}
						}
						isValid = status;
					});
				}else {
					isValid = false;
				}
				service.onColumnConfigStatusChange.fire(isValid);
				return isValid;
			}

			function getColumnConfigId() {
				return columnConfigId;
			}

			function setColumnConfigId(id) {
				columnConfigId = id;
				return columnConfigId;
			}

			function refreshOnColumnConfigIdChanged(columnConfigId){
				setColumnConfigId(columnConfigId);
				// refresh the grid
				service.load();
			}

			function getContainerData(){
				return container.data;
			}

			function handleOnUpdateSucceeded(){

			}

			function moveUp(type,grid) {
				estimateMainCommonService.moveSelectedItemTo(type,grid);
			}

			function moveDown(type,grid) {
				estimateMainCommonService.moveSelectedItemTo(type,grid);
			}

			function setEditType(itemEditType){
				editType =  itemEditType;
			}

			function getEditType(){
				return editType;
			}

			function getModule(){
				return 'estimate.main';
			}

			function setColumnConfigDetailsToViewConfig(uid, estColumnConfigDetailsToSave){
				if(estColumnConfigDetailsToSave === null ||
					estColumnConfigDetailsToSave === undefined ||
					!angular.isArray(estColumnConfigDetailsToSave) ||
					estColumnConfigDetailsToSave.length === 0){
					return;
				}

				let viewConfig = mainViewService.getViewConfig(uid);
				let Propertyconfig = angular.isString(viewConfig.Propertyconfig) ? JSON.parse(viewConfig.Propertyconfig) : angular.isArray(viewConfig.Propertyconfig) ? viewConfig.Propertyconfig : [];
				if(!angular.isArray(Propertyconfig) || Propertyconfig.length === 0){
					return;
				}

				estColumnConfigDetailsToSave.forEach(function (estColumnConfigDetail) {
					let PropertyconfigId = 'ConfDetail' + estColumnConfigDetail.Id.toString();
					for(let i = 0; i < Propertyconfig.length; ++i){
						if(PropertyconfigId === Propertyconfig[i].id){
							Propertyconfig[i].name = estColumnConfigDetail.DescriptionInfo.Description;
							break;
						}
					}
				});

				mainViewService.setViewConfig(uid, Propertyconfig , null, true);
			}

		}]);
})(angular);
