/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainLineItem2MdlObjectService
	 * @function
	 * @description
	 * estimateMainLineItem2MdlObjectService is the data service for estimate line item model object related functionality.
	 */
	estimateMainModule.factory('estimateMainLineItem2MdlObjectService',
		['$injector','$http', 'platformRuntimeDataService', 'platformDataServiceFactory', 'modelViewerModelSelectionService', 'estimateMainService',
			'modelViewerObjectTreeService', 'modelViewerModelIdSetService', 'modelViewerStandardFilterService', '$q', 'platformObservableService',
			'modelViewerModelSelectionService', 'estimateMainObjectSelectorService',
			function ($injector,$http, platformRuntimeDataService, platformDataServiceFactory, modelViewerModelSelectionService, estimateMainService,
				modelViewerObjectTreeService, modelViewerModelIdSetService, modelViewerStandardFilterService, $q, platformObservableService,
				modelSelectionService, estimateMainObjectSelectorService) {

				let service;
				let serviceContainer;

				let estimateMainLineItem2MdlObjectOption = {
					flatLeafItem: {
						module: estimateMainModule,
						serviceName: 'estimateMainLineItem2MdlObjectService',
						httpCreate: { route: globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/', endCreate: 'createlineitemobject' },
						httpUpdate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endUpdate: 'update'},
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/',
							endRead: 'listbyselection',
							initReadData: function initReadData(readData) {
								let selectedItem = estimateMainService.getSelected() || {};
								let selectedItems = estimateMainService.getSelectedEntities();
								readData.EstHeaderFk = selectedItem.EstHeaderFk;
								readData.EstLineItemFk = selectedItem.Id;
								readData.Data = [];
								_.forEach(selectedItems, function (item) {
									if(item){
										readData.Data.push({EstHeaderFk: item.EstHeaderFk , EstLineItemFk : item.Id});
									}
								});
							},
							usePostForRead: true
						},
						actions: {delete: true,
							canDeleteCallBackFunc: function () { return true;},
							create : 'flat',
							canCreateCallBackFunc:  function () { return !!modelViewerModelSelectionService.getSelectedModelId();}},
						entitySelection: {},
						presenter: { list: {
							incorporateDataRead: function (readData, data){
								let dataRead = serviceContainer.data.handleReadSucceeded(readData, data);

								let selectedItem = estimateMainService.getSelected();
								service.setQuantityReadOnly(selectedItem);
								$injector.get('modelViewerCompositeModelObjectSelectionService').setSelectedObjectIds();

								return dataRead;
							},
							initCreationData: function initCreationData(creationData) {
								let selectedItem = estimateMainService.getSelected();
								if (selectedItem && selectedItem.Id > 0) {
									creationData.EstHeaderFk = selectedItem.EstHeaderFk;
									creationData.EstLineItemFk = selectedItem.Id;
								}
								let selectedModel = modelViewerModelSelectionService.getSelectedModel();
								if(selectedModel && selectedModel.modelId){
									creationData.MdlModelFk = selectedModel.modelId;
								}
							}
						} },
						entityRole: { leaf: { itemName: 'EstLineItem2MdlObject', moduleName: 'Estimate Main',  parentService: estimateMainService }}
					}
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainLineItem2MdlObjectOption);
				serviceContainer.data.loadOnSelectedEntitiesChanged = true;

				let onEntityDeleted = function onEntityDeleted() {
					let objectList = serviceContainer.service.getList();
					let hasSplit = true;
					if (objectList && objectList.length > 0) {
						let isAnyQtyExist = _.find(objectList, function (item) {
							return (item.Quantity !== null || item.QuantityTarget !== null);
						});
						hasSplit = !!isAnyQtyExist;
					}
					else{
						hasSplit = false;
					}
					if (!hasSplit) {
						let parentLineItem = estimateMainService.getSelected();

						// set this lineitem quantity-item and quantity-item-detail readonly
						let fields = [];
						fields.push({field: 'QuantityTarget', readonly: false});
						fields.push({field: 'QuantityTargetDetail', readonly: false});
						platformRuntimeDataService.readonly(parentLineItem, fields);
						parentLineItem.HasSplitQuantities = false;
					}
				};

				serviceContainer.service.registerEntityDeleted(onEntityDeleted);

				service = serviceContainer.service;
				estimateMainService.setTriggerLoadOnSelectedEntitiesChanged(true);

				service.showModelViewer = function showModelViewer(){
					modelViewerStandardFilterService.updateMainEntityFilter();
				};

				service.activateViewerControlling = function activateViewerControlling() {
					estimateMainService.registerSelectedEntitiesChanged(service.showModelViewer);
				};

				service.deActivateViewerControlling = function deActivateViewerControlling() {
					estimateMainService.unregisterSelectedEntitiesChanged(service.showModelViewer);
				};

				service.addList = function addList(data) {
					let list = serviceContainer.data.itemList;
					if (data && data.length) {
						angular.forEach(data, function (d) {
							let item = _.find(list, {Id: d.Id});
							if (item) {
								angular.extend(list[list.indexOf(item)], d);
							} else {
								serviceContainer.data.itemList.push(d);
							}
						});
					}
					serviceContainer.data.listLoaded.fire();
				};

				service.getObjectIdsForLineItems = function (lineItemIds) {
					let selModelId = modelViewerModelSelectionService.getSelectedModelId();
					if (selModelId) {
						let modelData = {
							EstLineItemFks: _.filter(_.map(lineItemIds, function (li) {
								return {
									PKey1: li.EstHeaderFk,
									Id: li.EstLineItemFk
								};
							}), li => _.isInteger(li.PKey1) && _.isInteger(li.Id)),
							MdlModelFk: selModelId
						};
						return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/allobjectids', [modelData]).then(function (response) {
							return response.data;
						});
					} else {
						return $q.when('');
					}
				};

				service.setQuantityReadOnly = function (lineitem){
					let columns = [];
					let readonly = lineitem ? lineitem.IsLumpsum: false;

					columns.push({field: 'Quantity', readonly: readonly},
						{field: 'QuantityDetail', readonly: readonly},
						{field: 'QuantityTarget', readonly: readonly},
						{field: 'QuantityTargetDetail', readonly: readonly},
						{field: 'WqQuantityTarget', readonly: readonly},
						{field: 'WqQuantityTargetDetail', readonly: readonly});

					let list = serviceContainer.data.itemList;

					_.forEach(list, function(item){
						platformRuntimeDataService.readonly(item, columns);
					});
				};

				service.updateModelSelection = platformObservableService.createObservableBoolean({
					initialValue: true
				});

				service.updateModelSelection.uiHints = {
					id: 'toggleObjectSelection',
					caption$tr$: 'estimate.main.selectLineItemObjects',
					iconClass: 'tlb-icons ico-view-select'
				};

				function updateModelSelectionIfRequired() {
					if (service.updateModelSelection.getValue()) {
						let selModelId = modelSelectionService.getSelectedModelId();
						if (selModelId) {
							let selItems = service.getSelectedEntities();
							if (selItems.length > 0) {
								estimateMainObjectSelectorService.selectAssignedObject(selItems);
							}
						}
					}
				}

				service.updateModelSelection.registerValueChanged(updateModelSelectionIfRequired);
				service.registerSelectedEntitiesChanged(updateModelSelectionIfRequired);
				service.callRefresh = service.refresh || serviceContainer.data.onRefreshRequested;
				return service;
			}]);
})(angular);
