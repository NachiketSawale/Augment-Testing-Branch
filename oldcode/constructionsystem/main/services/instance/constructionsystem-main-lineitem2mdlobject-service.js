/**
 * Created by pja on 20.03.2018.
 */
(function (angular) {

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	'use strict';

	var moduleName = 'constructionsystem.main';
	var constructionsystemMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name constructionsystemMainLineitem2mdlobjectService
	 * @function
	 * @description
	 * estimateMainLineItem2MdlObjectService is the data service for estimate line item model object related functionality.
	 */
	constructionsystemMainModule.factory('constructionsystemMainLineitem2mdlobjectService',
		['$http', 'platformRuntimeDataService', 'platformDataServiceFactory', 'modelViewerModelSelectionService', 'constructionsystemMainLineItemService',
			'modelViewerObjectTreeService', 'modelViewerModelIdSetService', 'modelViewerStandardFilterService',
			function ($http, platformRuntimeDataService, platformDataServiceFactory, modelViewerModelSelectionService, constructionsystemMainLineItemService,
				modelViewerObjectTreeService, modelViewerModelIdSetService, modelViewerStandardFilterService) {

				var constructionsystemMainLineItem2MdlObjectOption = {
					flatLeafItem: {
						module: constructionsystemMainModule,
						serviceName: 'constructionsystemMainLineitem2mdlobjectService',
						httpCreate: { route: globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/', endCreate: 'createlineitemobject' },
						httpUpdate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endUpdate: 'update'},
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/',
							endRead: 'listbyselection',
							initReadData: function initReadData(readData) {
								var selectedItem = constructionsystemMainLineItemService.getSelected();
								var selectedItems = constructionsystemMainLineItemService.getSelectedEntities();
								readData.EstHeaderFk = selectedItem.EstHeaderFk;
								readData.EstLineItemFk = selectedItem.Id;
								readData.Data = [];
								_.forEach(selectedItems, function (item) {
									if(item){
										readData.Data.push({EstHeaderFk: readData.EstHeaderFk, EstLineItemFk :readData.EstLineItemFk});
									}
								});
							},
							usePostForRead: true
						},
						// actions: {delete: true,
						//    canDeleteCallBackFunc: function () { return true;},
						//    create : 'flat',
						//    anCreateCallBackFunc:  function () { return !!modelViewerModelSelectionService.getSelectedModelId();}},
						entitySelection: {},
						presenter: { list: {
							initCreationData: function initCreationData(creationData) {
								var selectedItem = constructionsystemMainLineItemService.getSelected();
								if (selectedItem && selectedItem.Id > 0) {
									creationData.EstHeaderFk = selectedItem.EstHeaderFk;
									creationData.EstLineItemFk = selectedItem.Id;
								}
								var selectedModel = modelViewerModelSelectionService.getSelectedModel();
								if(selectedModel && selectedModel.modelId){
									creationData.MdlModelFk = selectedModel.modelId;
								}
							}
						} },
						entityRole: { leaf: { itemName: 'EstLineItem2MdlObject', moduleName: 'Estimate Main',  parentService: constructionsystemMainLineItemService }}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(constructionsystemMainLineItem2MdlObjectOption);

				var onEntityDeleted = function onEntityDeleted() {
					var objectList = serviceContainer.service.getList();
					var hasSplit = true;
					if (objectList && objectList.length > 0) {
						var isAnyQtyExist = _.find(objectList, function (item) {
							return (item.Quantity !== null || item.QuantityTarget !== null);
						});
						hasSplit = !!isAnyQtyExist;
					}
					else{
						hasSplit = false;
					}
					if (!hasSplit) {
						var parentLineItem = constructionsystemMainLineItemService.getSelected();

						// set this lineitem quantity-item and quantity-item-detail readonly
						var fields = [];
						fields.push({field: 'QuantityTarget', readonly: false});
						fields.push({field: 'QuantityTargetDetail', readonly: false});
						platformRuntimeDataService.readonly(parentLineItem, fields);
						parentLineItem.HasSplitQuantities = false;
					}
				};

				serviceContainer.service.registerEntityDeleted(onEntityDeleted);

				var service = serviceContainer.service;

				service.showModelViewer = function showModelViewer(){
					modelViewerStandardFilterService.updateMainEntityFilter();
				};

				service.addList = function addList(data) {
					var list = serviceContainer.data.itemList;
					if (data && data.length) {
						angular.forEach(data, function (d) {
							var item = _.find(list, {Id: d.Id});
							if (item) {
								angular.extend(list[list.indexOf(item)], d);
							} else {
								serviceContainer.data.itemList.push(d);
							}
						});
					}
					serviceContainer.data.listLoaded.fire();
				};

				service.callRefresh = service.refresh || serviceContainer.data.onRefreshRequested;
				return service;
			}]);
})(angular);