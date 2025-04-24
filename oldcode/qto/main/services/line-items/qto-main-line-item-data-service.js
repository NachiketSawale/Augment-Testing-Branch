/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	let myModule = angular.module('qto.main');

	myModule.factory('qtoMainLineItemDataService', ['$injector', 'platformDataServiceFactory', 'platformDataServiceDataProcessorExtension', 'qtoMainHeaderDataService', 'qtoBoqStructureService',
		'qtoMainBoqFilterService', 'qtoMainDetailService', 'qtoMainLineItemHelperService',
		function ($injector, platformDataServiceFactory, dataServiceDataProcessor, headerDataService, parentService,
		          qtoMainBoqFilterService, qtoMainDetailService, qtoMainLineItemHelperService) {

			let service = {};

			let lineItemServiceOption = {
				flatLeafItem: {
					module: myModule,
					serviceName: 'qtoMainLineItemDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/lineitem/',
						endRead: 'filterlineitems4sales',
						usePostForRead: true,
						initReadData: initReadData
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								if (readData && readData.EstimateLineItems) {
									processResponseData(readData);
									return serviceContainer.data.handleReadSucceeded(readData.EstimateLineItems, data);
								}
							}
						}
					},
					toolBar: {
						id: 'filterLineItems',
						costgroupName: 'EstLineItemFk',
						iconClass: 'tlb-icons ico-filter-boq'
					},
					entityRole: {
						leaf: {itemName: 'EstLineItem', parentService: parentService}
					},
					entitySelection: {supportsMultiSelection: true}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(lineItemServiceOption);
			serviceContainer.data.usesCache = false;
			service = serviceContainer.service;

			qtoMainBoqFilterService.addMarkersChanged(service, lineItemServiceOption.flatLeafItem.presenter.list, lineItemServiceOption.flatLeafItem.toolBar, 'setFilterLineItems');

			service.filterLineItems = function filterLineItems(options, entity){

				entity.isFilter = !entity.isFilter;
				let items = service.getList();

				serviceContainer.data.disableWatchSelected(serviceContainer.data);
				dataServiceDataProcessor.doProcessItem(entity, serviceContainer.data);

				service.gridRefresh();
				serviceContainer.data.enableWatchSelected(entity, serviceContainer.data);

				let filterKeys = _.filter(items, {isFilter: true}).map(function (item) {
					return item.Id;
				});
				// set filter keys and call update.
				qtoMainDetailService.setFilterLineItems(filterKeys);
				let promise = headerDataService.update();
				if (promise) {
					promise.then(function () {
						qtoMainDetailService.load();// reload items in qto detail
					});
				} else {
					qtoMainDetailService.load();// reload items in qto detail
				}
			};

			function processResponseData(readData) {
				if (readData?.EstimateLineItems) {
					const extendTransientLineItemEntities = readData.ExtendTransientLineItemEntities || [];

					readData.EstimateLineItems.forEach(lineItem => {
						const extendTransientLineItemEntity = extendTransientLineItemEntities.find(entity => entity.Id === lineItem.Id && entity.EstHeaderFk === lineItem.EstHeaderFk);

						lineItem.IqPreviousQuantity = extendTransientLineItemEntity?.IqPreviousQuantity || 0;
						lineItem.IqQuantity = extendTransientLineItemEntity?.IqQuantity || 0;

						lineItem.BqPreviousQuantity = extendTransientLineItemEntity?.BqPreviousQuantity || 0;
						lineItem.BqQuantity = extendTransientLineItemEntity?.BqQuantity || 0;

						service.calculateLineItemQuantites(lineItem);
					});
				}
				return readData;
			}

			service.calculateLineItemQuantites = function(lineItem) {
				// iq
				qtoMainLineItemHelperService.calcTotalQuantity(lineItem, true);
				qtoMainLineItemHelperService.calcPercentageQuantity(lineItem, true);
				qtoMainLineItemHelperService.calcCumulativePercentage(lineItem, true);

				// bq
				qtoMainLineItemHelperService.calcTotalQuantity(lineItem, false);
				qtoMainLineItemHelperService.calcPercentageQuantity(lineItem, false);
				qtoMainLineItemHelperService.calcCumulativePercentage(lineItem, false);
			};

			function initReadData(readData) {
				let selectHeader = headerDataService.getSelected();
				let qtoBoqItem = parentService.getSelected();
				let boqInformationList = [];

				if (selectHeader){
					readData.projectFk = selectHeader.ProjectFk;
					readData.HeaderFk = selectHeader.Id;
					readData.Module = 'qto.main';
					readData.isGeneral = false;
					readData.prjBoqHeaderFk = selectHeader.BoqHeaderFk;
					readData.boqHeaderFk = selectHeader.BoqHeaderFk;
				}

				if (qtoBoqItem) {
					readData.prjBoqId = qtoBoqItem.Id || 0;
					readData.boqItemFk = qtoBoqItem.Id || 0;
					readData.date = qtoBoqItem.PerformedTo;

					if (qtoBoqItem) {
						let boqItemList = [];
						$injector.get('cloudCommonGridService').flatten([qtoBoqItem], boqItemList, 'BoqItems');

						if (boqItemList.length > 0) {
							boqItemList.forEach(function (item) {
								let boqInformationObject = {
									boqItemPrjBoqFk: item.BoqHeaderFk,
									boqItemPrjItemFk: item.Id,
									boqHeaderFk: item.BoqHeaderFk,
									boqItemFk: item.Id
								};
								boqInformationList.push(boqInformationObject);
							});
							readData.boqInformationList = boqInformationList;
						} else {
							readData.boqInformationList = null;
						}
					}

					if (!readData.date) {
						readData.date = new Date();
					}
				}

				return readData;
			}

			return service;
		}]);
})(angular);
