
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals, _ */

	'use strict';

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainLineItemQuantityService
	 * @function
	 * @description
	 * this is the data service for estimate line item quantity related functionality.
	 */
	estimateMainModule.factory('estimateMainLineItemQuantityService',
		['$translate','$http', '$q', '$injector', 'estimateMainService', 'platformDataServiceFactory', 'estimateMainLineItemQuantityProcessor','ServiceDataProcessDatesExtension','basicsLookupdataLookupFilterService','platformGridAPI',
			function ($translate,$http, $q, $injector, estimateMainService, platformDataServiceFactory, estimateMainLineItemQuantityProcessor,ServiceDataProcessDatesExtension,basicsLookupdataLookupFilterService,platformGridAPI) {

				let quantityTypes = {
					FQ : 6
				};

				// The instance of the main service - to be filled with functionality below
				let estimateMainResourceServiceOption = {
					flatLeafItem: {
						module: estimateMainModule,
						serviceName: 'estimateMainLineItemQuantityService',
						httpCreate: { route: globals.webApiBaseUrl + 'estimate/main/lineitemquantity/', endCreate: 'create' },
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/main/lineitemquantity/',
							endRead: 'filteredlist',
							initReadData: function initReadData(readData) {
								let selectedItem = estimateMainService.getSelected();
								if(estimateMainService.getIfSelectedIdElse(null)){
									readData.estHeaderFk = selectedItem.EstHeaderFk;
									readData.estLineItemFk = selectedItem.Id;
								}
							},
							usePostForRead: true
						},
						httpUpdate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endUpdate: 'update'},
						actions: {delete : {}, create : 'flat' },
						entitySelection: {supportsMultiSelection: true},
						presenter: { list: {
							initCreationData: function initCreationData(creationData) {
								let parentItem = estimateMainService.getSelected();
								if (parentItem && parentItem.Id > 0) {
									creationData.estHeaderFk = parentItem.EstHeaderFk;
									creationData.estLineItemFk = parentItem.Id;
								}
							},
							handleCreateSucceeded: function (item) {
								item.Iseditable = true;
							}
						} },
						dataProcessor: [estimateMainLineItemQuantityProcessor, new ServiceDataProcessDatesExtension(['Date'])],
						entityRole: { leaf: { itemName: 'EstLineItemQuantity', moduleName: 'Estimate Main',  parentService: estimateMainService}}
					}
				};

				let filters = [
					{
						key: 'est-line-item-quantity-filter',
						serverSide: false,
						fn: function (dataItem) {
							return dataItem.Id !== quantityTypes.FQ;
						}
					}
				];
				basicsLookupdataLookupFilterService.registerFilter(filters);

				let serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainResourceServiceOption);
				let service = serviceContainer.service;

				service.generateQuantityItem = function generateQuantityItem(col, lineItem){
					if(!col || !lineItem){
						return;
					}
					let qtyTypeServ = $injector.get('basicsCustomizeQuantityTypeLookupDataService');
					return qtyTypeServ.getLookupData({disableDataCaching : false, lookupType : 'basicsCustomizeQuantityTypeLookupDataService'})
						.then(function(list){

							let typeItem = _.find(list, {Code : col});

							if(!typeItem){
								return $q.when([]);
							}
							let data = {
								EstHeaderFk : lineItem.EstHeaderFk,
								EstLineItemFk : lineItem.Id,
								QuantityTypeFk : typeItem.Id,
								QuantityValue : lineItem[col]
							};
							return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitemquantity/generateitem', data)
								.then(function(response){
									service.setList(response.data);
									service.gridRefresh();
									return response;
								});
						});
				};

				service.addList = function addList(data) {
					let list = serviceContainer.data.itemList;
					serviceContainer.data.itemList = !list || !list.length ? [] : list;

					if (data && data.length) {
						angular.forEach(data, function (d) {
							let item = _.find(list, {Id: d.Id, EstHeaderFk: d.EstHeaderFk});
							if (item) {
								angular.extend(list[list.indexOf(item)], d);
							} else {
								serviceContainer.data.itemList.push(d);
							}
						});
					}
				};

				service.addUndeletedItems = function addUndeletedItems(data) {
					if(data.Item1 && data.Item1.length >=1 ){
						_.forEach(data.Item1,function (item){
							estimateMainLineItemQuantityProcessor.processItem(item);
						});

						let serviceDataProcessDatesExtension = new ServiceDataProcessDatesExtension(['Date']);
						_.forEach(data.Item1,function (item){
							serviceDataProcessDatesExtension.processItem(item);
						});

						service.addList(data.Item1);

						serviceContainer.data.listLoaded.fire();
						service.gridRefresh();

						let infoMessage = '';
						if(data.Item2){
							infoMessage = data.Item2;
							infoMessage= infoMessage.replace(new RegExp("\\[,","g"), "[");
							infoMessage= infoMessage.replace(new RegExp("\\, ]","g"), "]");

							const bracketPattern = /\[/g;
							const matches = infoMessage.match(bracketPattern);

							infoMessage = matches && matches.length > 1 ? infoMessage  +']' : infoMessage;

							$injector.get('platformModalService').showMsgBox($translate.instant('estimate.main.infoLiQuantityDelete', {'message': infoMessage }), 'cloud.common.informationDialogHeader', 'ico-info');
						}
					}
				};

				let baseOnCreateItem = service.createItem;
				service.createItem = function () {
					const estimateMainService = $injector.get('estimateMainService');
					const lineItem = estimateMainService.getSelected();
					if (lineItem && !estimateMainService.isLineItemStatusReadonly(lineItem.Id, lineItem.EstHeaderFk)) {
						baseOnCreateItem(null,serviceContainer.data);
					}	
				};

				let baseDeleteSelection = service.deleteSelection;
				service.deleteSelection = function deleteSelection() {
					const lineItem = estimateMainService.getSelected();
					if (lineItem && estimateMainService.isLineItemStatusReadonly(lineItem.Id, lineItem.EstHeaderFk)) {
						return $injector.get('platformDialogService').showDialog({iconClass: 'info', headerText$tr$: 'cloud.common.infoBoxHeader', bodyText$tr$: 'estimate.main.readOnlyLiQuantityDeleteText', showOkButton: true});
					}
										
					baseDeleteSelection();
				};
				
				service.callRefresh = service.refresh || serviceContainer.data.onRefreshRequested;

				return service;
			}]);
})(angular);
