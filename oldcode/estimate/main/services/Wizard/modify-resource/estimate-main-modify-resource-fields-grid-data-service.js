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
	 * @name estimateMainModifyResourceFieldsGridDataService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Modify Resource Fields Configuration Grid Data Service for dialog.
	 */
	angular.module(moduleName).factory('estimateMainModifyResourceFieldsGridDataService',
		['$q', '$http', '$translate', 'PlatformMessenger', 'platformGridAPI', 'platformDataServiceFactory',
			function ($q, $http, $translate, PlatformMessenger, platformGridAPI, platformDataServiceFactory) {

				let service = {},
					data = [];

				angular.extend(service, {
					setDataList: setDataList,
					getList: getList,
					updateValue: updateValue,
					clear: clear,
					listLoaded: new PlatformMessenger(),
					refreshGrid: refreshGrid
				});

				let serviceOption = {
					module: angular.module(moduleName),
					httpCRUD: {
						route: globals.webApiBaseUrl + 'estimate/main/modify/',
						endRead: 'getfilterfields'
					},
					presenter: {list: {isInitialSorted:true, sortOptions: {initialSortColumn: {field: 'Sorting'}, isAsc: true}}},
					entitySelection: {},
					modification: {multi: {}},
					translation: {
						uid: 'estimateMainModifyResourceFieldsGridDataService',
						title: 'Title',
						columns: [
							{
								header: 'cloud.common.entityDescription',
								field: 'DescriptionInfo'
							}]
					}
				};

				let container = platformDataServiceFactory.createNewComplete(serviceOption);
				angular.extend(service, container.service);

				return service;

				function getList() {
					return data;
				}

				function updateValue(id,isFilter) {
					let datalist = container.data.getList();
					let fieldsItemInGrid = _.find(datalist, {Id: id});
					if(fieldsItemInGrid) {
						fieldsItemInGrid.isFilter = isFilter;
						fieldsItemInGrid.IsChange = false;
						refreshGrid();
						container.service.gridRefresh();
					}
				}

				function clear() {
					// selectedItem = null;
				}

				function setDataList(items) {
					if (Array.isArray(items)) {
						data = items;
					} else {
						data = [];
					}
				}

				function refreshGrid() {
					service.listLoaded.fire();
				}

			}]);
})(angular);
