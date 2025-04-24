/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (angular) {
	/* global _, globals  */

	'use strict';
	const moduleName = 'awp.main';
	const module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name awpPackageStructureLineItemService
	 * @function
	 *
	 * @description
	 * awpPackageStructureLineItemService is the data service for package structure lineItem grouping related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	module.factory('awpPackageStructureLineItemService', [
		'$injector',
		'platformDataServiceFactory',
		'platformGridAPI',
		'cloudDesktopSidebarService',
		'awpPackageStructureLineItemUIService',
		'awpProjectMainListDataService',
		'awpPackageStructureLineItemInfo',
		function (
			$injector,
			platformDataServiceFactory,
			platformGridAPI,
			cloudDesktopSidebarService,
			uiService,
			awpProjectMainListDataService,
			dataInfo) {

			let _needToReload = false;
			let _needToLoad = false;
			let _groupingState = [];
			let _projectSelected = null;

			const option = {
				hierarchicalNodeItem: {
					module: module,
					serviceName: 'awpPackageStructureLineItemService',
					httpRead: {
						route: globals.webApiBaseUrl + 'awp/main/',
						endRead: 'hierarchy',
						initReadData: function initReadData(readData) {
							let projectSelected = service.getProjectInfo();
							if (!_projectSelected || _projectSelected.Id !== projectSelected.Id) {
								_projectSelected = projectSelected;
							}
							_needToReload = false;
							_needToLoad = false;
							let request = generateRequest(_groupingState);
							if (request && _.size(request.groupingColumns) > 0) {
								service.forceReloadAfterFirstInit = null;
							}
							angular.extend(readData, request);
							return readData;
						},
						usePostForRead: true
					},
					entitySelection: {
						supportsMultiSelection: false
					},
					setCellFocus: true,
					presenter: {
						tree: {
							parentProp: 'ParentId',
							childProp: 'Children',
							incorporateDataRead: function incorporateDataRead(readData, data) {
								data.handleReadSucceeded(readData, data);
							}
						}
					},
					actions: {},
					entityRole: {
						node: {
							codeField: 'Code',
							itemName: 'GroupingItem',
							moduleName: moduleName,
							parentService: awpProjectMainListDataService
						}
					}
				}
			};

			const container = platformDataServiceFactory.createNewComplete(option);
			const service = container.service;
			let data = container.data;

			let _containerItems = [];
			let _selectedItems = [];

			function getProjectInfo() {
				return dataInfo.getProjectSelected();
			}

			function getEstHeaderId(){
				return dataInfo.getEstHeaderSelected() ? dataInfo.getEstHeaderSelected().Id : null;
			}

			function renderFilterOptions(item) {
				if (!item || !_groupingState || _groupingState.length < 1) {
					return;
				}

				let colorOptions = _groupingState[item.StructureLevel - 1] ? _groupingState[item.StructureLevel - 1].colorOptions : null;
				if (colorOptions && colorOptions.enabled) {
					item.$$indColor = colorOptions.color;
				} else {
					item.$$indColor = null;
				}
			}

			function getOutputColumns(){
				return [
					{
						aggregateFunction: 'SUM',
						outputColumnName: 'Quantity',
						sortingBy: 0
					},
					{
						aggregateFunction: 'SUM',
						outputColumnName: 'WqQuantityTarget',
						sortingBy: 0
					},
					{
						aggregateFunction: 'SUM',
						outputColumnName: 'QuantityTotal',
						sortingBy: 0
					},
					{
						aggregateFunction: 'MAX',
						outputColumnName: 'BasUomFk',
						sortingBy: 0
					},
					{
						aggregateFunction: 'SUM',
						outputColumnName: 'GrandCostUnitTarget',
						sortingBy: 0
					},
					{
						aggregateFunction: 'SUM',
						outputColumnName: 'GrandTotal',
						sortingBy: 0
					},
					{
						aggregateFunction: 'MAX',
						outputColumnName: 'PrcStructureFk',
						sortingBy: 0
					}
				];
			}

			function generateRequest(state) {
				const groupingColumns = $injector.get('awpGroupingItemStructureService').getGroupingColumns(state);
				const projectSelected = getProjectInfo();

				return  {
					module: 'estimate.main',
					projectId: projectSelected ? projectSelected.Id : null,
					estHeaderId: getEstHeaderId(),
					groupingColumns: groupingColumns,
					outputColumns: getOutputColumns(),
					filterRequest: cloudDesktopSidebarService.getFilterRequestParams() // added Filter from Sidebar as well
				};
			}

			function reload() {
				service.load();
			}

			function getGroupItems() {
				return _containerItems;
			}

			function setGroupItems(items) {
				if (_.isArray(items)) {
					_containerItems = items;
				}
			}

			function selectedItems(items) {
				if (items) {
					_selectedItems = items;
				} else {
					return _selectedItems;
				}
			}

			function clearSelectedItems() {
				_selectedItems = [];
			}

			function removeMarkers() {
				const list = _.filter(_containerItems, {'IsMarked': true});
				list.forEach(function (item) {
					_.set(item, 'IsMarked', false);
				});
			}

			function getGroupingState() {
				return _groupingState;
			}

			function cleanGroupingState() {
				_groupingState = [];
			}

			function addGroupingItem(cid, column) {
				let index = _.findIndex(_groupingState, {id: cid});
				if (index < 0) {
					_groupingState.push({
						id: cid,
						levels: 0,
						depth: column && column.grouping && column.grouping.maxLevels || 1,
						grouping: column.metadata.groupId,
						metadata: column.metadata
					});
				}
			}

			function removeGroupingItem(cid) {
				let index = _.findIndex(_groupingState, {id: cid});

				if (index >= 0) {
					_groupingState.splice(index, 1);
				}
			}

			function getGroupingColumns() {
				return $injector.get('awpGroupingItemStructureService').getGroupingColumns(_groupingState);
			}

			function getAllGroupingColumns() {
				let groupingColumns = $injector.get('awpGroupingItemStructureService').getGroupingColumns(_groupingState);
				groupingColumns = $injector.get('awpGroupingItemStructureService').getMergedAllGroupingColumns(groupingColumns);
				return groupingColumns;
			}

			let gridId = '';

			function setGridId(value) {
				gridId = value;
			}

			function existGrid() {
				if (!gridId) {
					return false;
				}

				return platformGridAPI.grids.exist(gridId);
			}

			function forceReloadAfterFirstInit() {
				if (_projectSelected) {
					reload();
				}
			}

			function forceLoadService() {
				if (_needToLoad || _needToReload) {
					if (_needToLoad) {
						service.load();
					} else if (_needToReload) {
						reload();
					}
				}
			}

			angular.extend(service, {
				getGroupItems: getGroupItems,
				setGroupItems: setGroupItems,
				selectedItems: selectedItems,
				clearSelectedItems: clearSelectedItems,
				removeMarkers: removeMarkers,
				getGroupingstate: getGroupingState,
				addGroupingItem: addGroupingItem,
				removeGroupingItem: removeGroupingItem,
				reload: reload,
				getProjectInfo: getProjectInfo,
				getGroupingColumns: getGroupingColumns,
				cleanGroupingstate: cleanGroupingState,
				existGrid: existGrid,
				setGridId: setGridId,
				getAllGroupingColumns: getAllGroupingColumns,
				forceReloadAfterFirstInit: forceReloadAfterFirstInit,
				forceLoadService: forceLoadService
			});

			angular.extend(data, {
				renderFilterOptions: renderFilterOptions
			});

			return service;
		}]);
})(angular);
