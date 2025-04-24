/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainRoundingConfigDetailDataService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Rounding Detail Data Service for dialog.
	 */
	angular.module(moduleName).factory('estimateMainRoundingConfigDetailDataService',
		['$q', '$http', '$translate', 'PlatformMessenger', 'platformDataServiceFactory',
			function ($q, $http, $translate, PlatformMessenger, platformDataServiceFactory) {

				let service = {},
					data = [],
					editType = null,
					itemsToSave = [],
					itemsToDelete = [];

				angular.extend(service, {
					getList: getList,
					clear : clear,
					setEditType: setEditType,
					getEditType: getEditType,
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
					onUpdateList: new PlatformMessenger(),
					hasEstStructureErr: new PlatformMessenger()
				});

				let serviceOption = {
					module: angular.module(moduleName),
					entitySelection: {},
					modification: {multi: {}},
					translation: {
						uid: 'estimateMainRoundingConfigDetailDataService',
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

				function setEditType(itemEditType){
					editType =  itemEditType;
				}

				function getEditType(){
					return editType;
				}

				function getList() {
					return data;
				}

				function setDataList(items) {
					if (Array.isArray(items)) {
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
					data = [];
				}

			}]);
})(angular);
