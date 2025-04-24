/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (angular) {
	/* global _, globals  */

	'use strict';
	let moduleName = 'controlling.projectcontrols';

	let module = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name controllingProjectcontrolsVersionComparisonService
	 * @function
	 *
	 * @description
	 * controllingProjectcontrolsVersionComparisonService is the data service for all version comparison related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	module.factory('controllingProjectcontrolsVersionComparisonService', ['platformDataServiceFactory',
		'ProjectcontrolsMessenger',
		'platformGridAPI',
		'cloudDesktopSidebarService',
		'controllingProjectcontrolsDashboardStructureService',
		'controllingProjectControlsVersionComparisonConfigService',
		'controllingProjectcontrolsProjectMainListDataService',
		'$timeout',
		'controllingProjectcontrolsCompareDataInfo',
		'controllingProjectcontrolsVersionComparisonProcessor',
		function (platformDataServiceFactory, ProjectcontrolsMessenger, platformGridAPI, cloudDesktopSidebarService, dashboardStructureService,
			controllingProjectControlsVersionComparisonConfigService, controllingProjectcontrolsProjectMainListDataService,
			$timeout, compareDataInfo, controllingProjectcontrolsVersionComparisonProcessor) {

			let service = {};

			let _stagingActualsValueList = [];
			let _needToReload = false;
			let _needToLoad = false;
			let _groupingstate = [];
			let _projectSelected = null;
			let _sacItemIdCount = 0;

			//initialize the compareDataInfo
			compareDataInfo.setProject(getProjectInfo());

			let onHistoryVersionChanged = new ProjectcontrolsMessenger();
			let onGroupingConfigChanged = new ProjectcontrolsMessenger();

			let dashboardOption = {
				hierarchicalNodeItem: {
					module: module,
					serviceName: 'controllingProjectcontrolsVersionComparisonService',
					httpRead: {
						route: globals.webApiBaseUrl + 'controlling/projectcontrols/versioncomparison/',
						endRead: 'analysis',
						initReadData: function initReadData(readData) {
							let projectSelected = service.getProjectInfo();
							if (!_projectSelected || _projectSelected.Id !== projectSelected.Id) {
								_projectSelected = projectSelected;
								compareDataInfo.clearHistoryVersionInfos();
							}
							_needToReload = false;
							_needToLoad = false;
							compareDataInfo.setProject(projectSelected);
							let request = generateRequest(_groupingstate, '1861db1513a2494f8af91b462e4c8847');
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
							parentProp: 'ParentFk',
							childProp: 'Children',
							incorporateDataRead: function incorporateDataRead(readData, data) {
								_stagingActualsValueList = angular.isArray(readData.stagingActualsValues) ? readData.stagingActualsValues : [];
								_sacItemIdCount = _.isArray(_stagingActualsValueList) && _stagingActualsValueList.length > 0 ? _.max(_.map(_stagingActualsValueList, 'Id')) : 0;
								if (readData.HistoryInfo) {
									compareDataInfo.initHistoryVersionInfos(readData.HistoryInfo);
									onHistoryVersionChanged.fire(compareDataInfo);
								}
								data.handleReadSucceeded(readData.CostAnalysis, data);

								$timeout(function () {
									if (angular.isArray(readData.CostAnalysis) && readData.CostAnalysis.length > 0) {
										// clean the selected entity info first, then reset the selected entity.
										data.selectedItem = null;
										data.getService().setSelected(readData.CostAnalysis[0]);
									}

									onGroupingConfigChanged.fire(readData.PrjClassifications || []);
								}, 100);
							}
						}
					},
					actions: {},
					dataProcessor: [controllingProjectcontrolsVersionComparisonProcessor],
					entityRole: {
						node: {
							codeField: 'Code',
							itemName: 'GroupingItem',
							moduleName: 'controlling.projectcontrols',
							parentService: controllingProjectcontrolsProjectMainListDataService
						}
					}
				}
			};

			let container = platformDataServiceFactory.createNewComplete(dashboardOption);
			service = container.service;
			let data = container.data;

			let _containerItems = [];
			let _selectedItems = [];

			function getProjectInfo() {
				return controllingProjectcontrolsProjectMainListDataService.getSelected();
			}

			function renderFilterOptions(item) {
				if (!item || !_groupingstate || _groupingstate.length < 1) {
					return;
				}

				let colorOptions = _groupingstate[item.StructureLevel - 1] ? _groupingstate[item.StructureLevel - 1].colorOptions : null;
				if (colorOptions && colorOptions.enabled) {
					item.$$indColor = colorOptions.color;
				} else {
					item.$$indColor = null;
				}
			}

			function loadPeriods(comparisonVersionType, callbackFunc) {
				const historyVersionInfo = compareDataInfo.getHistoryVersionInfoByType(comparisonVersionType);
				if(historyVersionInfo){
					historyVersionInfo.loadPeriods(callbackFunc, function(prjClassfications){
						onGroupingConfigChanged.fire(prjClassfications);
					});
				}
			}

			function generateRequest(state, uuid) {
				const groupingColumns = dashboardStructureService.getGroupingColumns(state);
				const packageGroupingColumn = _.find(groupingColumns, {groupColumnId: 'REL_PACKAGE'});

				const request = {
					module: moduleName,
					projectId: compareDataInfo.projectId,
					ProjectNo: compareDataInfo.projectCode,
					ProjectName: compareDataInfo.projectName,
					ribHistoryId: -1,
					period: '',
					HistoryVersionInfos : compareDataInfo.getHistoryVersionInfos(),
					showEmptyData: compareDataInfo.isShowEmptyData,
					PackageDescriptionType: !!packageGroupingColumn ? packageGroupingColumn.showBP + packageGroupingColumn.showPackageDesc : 1,
					groupingColumns: groupingColumns,
					outputColumns: [],
					reportPeriodColumns: [],
					filterRequest: cloudDesktopSidebarService.getFilterRequestParams() // added Filter from Sidebar as well
				};

				let ignoreColumns = ['indicator', 'tree', 'code', 'itemCount'];

				function createOutPutColumn(column, columnDef) {
					return {
						outputColumnName: column.$field || column.field,
						aggregateFunction: column.aggregates,
						sortingBy: 0,
						propDefInfo: columnDef && columnDef.propDefInfo ? {
							type: columnDef.propDefInfo.type,
							id: columnDef.propDefInfo.item.Id,
							code: columnDef.propDefInfo.item.Code,
							basContrColumnTypeFk: columnDef.propDefInfo.item.BasContrColumnTypeFk
						} : null
					}
				}

				let visibleColumns = [];
				let columnDefs = controllingProjectControlsVersionComparisonConfigService.getColumns();

				// main container
				if (platformGridAPI.columns.configuration(uuid)) {
					visibleColumns = visibleColumns.concat(platformGridAPI.columns.configuration(uuid).visible);
				}

				_.forEach(visibleColumns, function (column) {
					if (column && (ignoreColumns.indexOf(column.id) < 0)) {
						let columnDef = _.find(columnDefs, {id: column.$field || column.field});
						request.outputColumns.push(createOutPutColumn(column, columnDef));
					}
				});

				return request;
			}

			function reload() {
				compareDataInfo.clearHistoryVersionInfos();
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

			function getGroupingstate() {
				return _groupingstate;
			}

			function cleanGroupingstate() {
				_groupingstate = [];
			}

			function addGroupingItem(cid, column) {
				let index = _.findIndex(_groupingstate, {id: cid});
				if (index < 0) {
					_groupingstate.push({
						id: cid,
						levels: 0,
						depth: column && column.grouping && column.grouping.maxLevels || 1,
						grouping: column.metadata.groupId,
						metadata: column.metadata
					});
				}
			}

			function removeGroupingItem(cid) {
				let index = _.findIndex(_groupingstate, {id: cid});

				if (index >= 0) {
					_groupingstate.splice(index, 1);
				}
			}

			function registerHistoryVersionChanged(func) {
				onHistoryVersionChanged.register(func);
			}

			function unregisterHistoryVersionChanged(func) {
				onHistoryVersionChanged.unregister(func);
			}

			function registerGroupingConfigChanged(func) {
				onGroupingConfigChanged.register(func);
			}

			function unregisterGroupingConfigChanged(func) {
				onGroupingConfigChanged.unregister(func);
			}

			function getGroupingColumns() {
				return dashboardStructureService.getGroupingColumns(_groupingstate);
			}

			function getAllGroupingColumns() {
				let groupingColumns = dashboardStructureService.getGroupingColumns(_groupingstate);
				groupingColumns = dashboardStructureService.getMergedAllGroupingColumns(groupingColumns);
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

			function afterVersionDeleted(deletedVersion, isLastVersion) {
				if (!deletedVersion) {
					return false;
				}

				if (compareDataInfo.isSelected(deletedVersion.Id)) {
					_needToReload = isLastVersion;
					_needToLoad = !isLastVersion;

					if (!existGrid()) {
						return;
					}

					if (isLastVersion) {
						reload();
					} else {
						service.load();
					}
				} else {
					compareDataInfo.removeHistoryEntity(deletedVersion.Id);
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

			function getGroupColumnForExtendControlCostCode() {
				let groupingColumns = angular.copy(service.getGroupingColumns());
				groupingColumns.push({
					id: 4,
					groupColumnId: 'REL_COSTCODE_CO',
					groupType: 3,
					depth: 8,
					dateOption: null,
					sortingBy: 0
				});

				return groupingColumns;
			}

			function forceReloadAfterFirstInit() {
				if (_projectSelected) {
					reload();
				}
			}

			angular.extend(service, {
				loadPeriods: loadPeriods,
				getGroupItems: getGroupItems,
				setGroupItems: setGroupItems,
				selectedItems: selectedItems,
				clearSelectedItems: clearSelectedItems,
				removeMarkers: removeMarkers,
				getGroupingstate: getGroupingstate,
				addGroupingItem: addGroupingItem,
				removeGroupingItem: removeGroupingItem,
				reload: reload,
				registerHistoryVersionChanged: registerHistoryVersionChanged,
				unregisterHistoryVersionChanged: unregisterHistoryVersionChanged,
				registerGroupingConfigChanged: registerGroupingConfigChanged,
				unregisterGroupingConfigChanged: unregisterGroupingConfigChanged,
				getProjectInfo: getProjectInfo,
				getGroupingColumns: getGroupingColumns,
				cleanGroupingstate: cleanGroupingstate,
				existGrid: existGrid,
				setGridId: setGridId,
				afterVersionDeleted: afterVersionDeleted,
				forceLoadService: forceLoadService,
				getAllGroupingColumns: getAllGroupingColumns,
				getGroupColumnForExtendControlCostCode: getGroupColumnForExtendControlCostCode,
				forceReloadAfterFirstInit: forceReloadAfterFirstInit,
			});

			angular.extend(data, {
				renderFilterOptions: renderFilterOptions
			});

			return service;
		}]);
})(angular);
