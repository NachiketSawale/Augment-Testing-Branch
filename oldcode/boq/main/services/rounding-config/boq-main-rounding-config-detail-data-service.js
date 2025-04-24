/**
 * $Id: boq-main-rounding-config-detail-data-service.js 46191 2022-07-14 17:40:38Z joshi $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'boq.main';
	/**
	 * @ngdoc service
	 * @name boqMainRoundingConfigDetailDataService
	 * @function
	 *
	 * @description
	 * This service provides Boq Rounding Detail Data Service for dialog.
	 */
	angular.module(moduleName).factory('boqMainRoundingConfigDetailDataService',
		['$q', '$http', '$translate', 'PlatformMessenger', 'platformDataServiceFactory', 'boqMainRoundingConfigDetailProcessService',
			function ($q, $http, $translate, PlatformMessenger, platformDataServiceFactory, boqMainRoundingConfigDetailProcessService) {

				let service = {},
					data = [],
					itemsToSave = [],
					itemsToDelete = [];

				angular.extend(service, {
					getList: getList,
					clear : clear,
					setDataList: setDataList,
					refreshGrid: refreshGrid,
					gridRefresh: gridRefresh,
					// createItem : createItem,
					// deleteItem:deleteItem,
					setItemToSave: setItemToSave,
					getItemsToSave : getItemsToSave,
					getItemsToDelete : getItemsToDelete,
					registerListLoaded: registerListLoaded,
					unregisterListLoaded: unregisterListLoaded,
					registerSelectionChanged: registerSelectionChanged,
					unregisterSelectionChanged: unregisterSelectionChanged,
					// setCodeColReadOnly: setCodeColReadOnly,

					listLoaded: new PlatformMessenger(),
					selectionChanged : new PlatformMessenger(),
					onUpdateList: new PlatformMessenger()
				});

				let serviceOption = {
					module: angular.module(moduleName),
					entitySelection: {},
					modification: {multi: {}}
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
						boqMainRoundingConfigDetailProcessService.processItems(items);
						data = items;
					} else {
						data = [];
					}
					return items;
				}

				function refreshGrid() {
					service.listLoaded.fire();
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
