/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

((angular) => {
	'use strict';

	angular.module('platform').controller('platformGenericStructureController', structureController);

	structureController.$inject = ['$rootScope', '$scope', '$timeout', '_', 'platformGridAPI', 'reportingPrintService', 'platformGenericStructureService', 'cloudDesktopSidebarService'];

	function structureController($rootScope, $scope, $timeout, _, platformGridAPI, reportingPrintService, platformGenericStructureService, cloudDesktopSidebarService) {
		$scope.config = platformGenericStructureService.configService.getStandardConfigForListView();
		$scope.scheme = platformGenericStructureService.configService.getDtoScheme();

		// Options for the generic structure container.
		$scope.options = {
			columns: $scope.config.columns,
			gridData: {
				state: $scope.getContainerUUID()
			},
			marker: {
				multiSelect: platformGenericStructureService.getMarkerState()
			},
			isGenericGroup: platformGenericStructureService.isGenericGroup,
			isAutoRefresh: false
		};

		// Array containing the displayed items in the generic structure container.
		$scope.containerItems = platformGenericStructureService.getGroupItems();

		// state of grouping configuration
		$scope.state = [];

		// toolbar definition
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			version: 0,
			items: [
				{
					id: 't111',
					sort: 112,
					caption: 'cloud.common.gridlayout',
					iconClass: 'tlb-icons ico-settings',
					type: 'item',
					fn: function () {
						platformGridAPI.configuration.openConfigDialog($scope.getContainerUUID());
					},
					disabled: function () {
						return $scope.showInfoOverlay;
					}
				},
				{
					id: 't1',
					sort: 110,
					caption: 'cloud.common.taskBarSearch',
					type: 'check',
					value: false,
					iconClass: 'tlb-icons ico-search',
					fn: function () {
						platformGridAPI.filters.showSearch($scope.getContainerUUID(), this.value);
					},
					disabled: function () {
						return $scope.showInfoOverlay;
					}
				},
				{
					id: 't109',
					sort: 111,
					caption: 'cloud.common.print',
					iconClass: 'tlb-icons ico-print-preview',
					type: 'item',
					fn: function () {
						reportingPrintService.printGrid($scope.getContainerUUID());
					},
					disabled: function () {
						return $scope.showInfoOverlay;
					}
				},
				{
					id: 'd1',
					sort: 55,
					type: 'divider'
				},
				{
					id: 't7',
					sort: 60,
					caption: 'cloud.common.toolbarCollapse',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-collapse',
					fn: function collapseSelected() {
						platformGridAPI.rows.collapseNextNode($scope.getContainerUUID());
					}
				},
				{
					id: 't8',
					sort: 70,
					caption: 'cloud.common.toolbarExpand',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-expand',
					fn: function expandSelected() {
						platformGridAPI.rows.expandNextNode($scope.getContainerUUID());
					}
				},
				{
					id: 't9',
					sort: 80,
					caption: 'cloud.common.toolbarCollapseAll',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-collapse-all',
					fn: function collapseAll() {
						platformGridAPI.rows.collapseAllSubNodes($scope.getContainerUUID());
					}
				},
				{
					id: 't10',
					sort: 90,
					caption: 'cloud.common.toolbarExpandAll',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-expand-all',
					fn: function expandAll() {
						platformGridAPI.rows.expandAllSubNodes($scope.getContainerUUID());
					}
				},
				{
					id: 'd2',
					sort: 100,
					type: 'divider'
				},
				{
					id: 't11',
					sort: 200,
					caption: 'cloud.common.toolbarRefresh',
					type: 'item',
					iconClass: 'tlb-icons ico-refresh',
					disabled: function () {
						return !$scope.state.length;
					},
					fn: function refresh() {
						platformGenericStructureService.dataService.refresh();
						platformGenericStructureService.executeRequest($scope.state, $scope.getContainerUUID())
							.then(function (data) {
								$scope.containerItems = data;
							});
					}
				},
				{
					id: 't14',
					sort: 220,
					caption: 'cloud.common.autoRefresh',
					type: 'check',
					value: $scope.options.isAutoRefresh,
					iconClass: 'tlb-icons ico-auto-refresh',
					fn: function toogleSelectionMode() {
						if (platformGridAPI.grids.exist($scope.getContainerUUID())) {
							$scope.options.isAutoRefresh = !$scope.options.isAutoRefresh;
							platformGridAPI.autoRefresh.updateAutoRefreshStatus($scope.getContainerUUID(), $scope.options.isAutoRefresh);
							$scope.tools.update();
						}
					}
				},
				{
					id: 't15',
					sort: 110,
					caption: 'cloud.common.toolbarFilter',
					type: 'item',
					iconClass: 'tlb-icons ico-filter-off',
					disabled: () => !platformGenericStructureService.isFilterEnabled(),
					fn: function filterOff() {
						platformGenericStructureService.removeMarkers();
						platformGridAPI.grids.refresh($scope.getContainerUUID());
						platformGenericStructureService.clearFilteredItems();
						platformGenericStructureService.enableFilter(false);
						$rootScope.$emit('filterIsActive', false);
						$scope.tools.update();
						platformGenericStructureService.dataService.refresh(); // ALM # 93005 force refresh after filter is switch off rei@4.10.19
					}
				},
				{
					id: 'd3',
					sort: 100,
					type: 'divider'
				},
				{
					id: 't12',
					sort: 120,
					caption: 'cloud.common.toolbarSelectionMode',
					type: 'check',
					value: $scope.options.marker.multiSelect,
					iconClass: 'tlb-icons ico-selection-multi',
					fn: function toogleSelectionMode() {
						if (platformGridAPI.grids.exist($scope.getContainerUUID())) {
							// get marker/filter column def ...
							var cols = platformGridAPI.columns.configuration($scope.getContainerUUID());
							var filterCol = _.find(cols.current, {id: 'marker'});
							if (filterCol && filterCol.editorOptions) {
								// ... switch multiselect and save
								filterCol.editorOptions.multiSelect = !filterCol.editorOptions.multiSelect;
								$scope.options.marker.multiSelect = !$scope.options.marker.multiSelect;
								platformGenericStructureService.postProcessColumns($scope.getContainerUUID(), 'current');
								platformGridAPI.columns.configuration($scope.getContainerUUID(), cols.current);
								platformGenericStructureService.removeMarkers();
								platformGridAPI.grids.refresh($scope.getContainerUUID());
								platformGenericStructureService.clearFilteredItems();
								$rootScope.$emit('filterIsActive', false);
								platformGenericStructureService.enableFilter(false);
								$scope.tools.update();
							}
						}
					}
				}
			],
			update: function () {
				++$scope.tools.version;
			}
		});

		$scope.toggleFilter = function (active) {
			platformGridAPI.filters.showSearch($scope.gridId, active);
		};

		/******************************************************************************************
		 *  Lifecycle Hooks for generic structure container.
		 ******************************************************************************************/

		$scope.onFilterChanged = function (filterItems) {
			if (filterItems.length) {
				// Filteritems set in service.
				platformGenericStructureService.filteredItems(filterItems);
				platformGenericStructureService.enableFilter(true);
				$rootScope.$emit('filterIsActive', true);
				if (filterItems.length > 1) {
					_.find($scope.tools.items, {id: 't12'}).value = true;
				}
			} else {
				$rootScope.$emit('filterIsActive', false);
				platformGenericStructureService.enableFilter(false);
			}

			platformGenericStructureService.dataService.refresh();
			$scope.tools.update();
		};

		$scope.onSelectionChanged = function (/* evt, args */) {
			// Handle selection changes in grid here.
			var selected = _.filter(platformGridAPI.rows.getRows($scope.options.gridData.state), {'IsMarked': true});

			if (selected) {
				platformGenericStructureService.selectedItems(selected);
			}
		};

		$scope.onItemsProcessed = function (data) {
			if (data && data.length) {
				platformGenericStructureService.processItems(data, $scope.state);
				platformGenericStructureService.postProcessColumns($scope.getContainerUUID(), 'visible');
				platformGridAPI.grids.refresh($scope.getContainerUUID());
				platformGridAPI.grids.invalidate($scope.getContainerUUID());

				if (platformGenericStructureService.filteredItems().length > 0) {
					platformGenericStructureService.enableFilter(platformGenericStructureService.isFilterEnabled());
					$rootScope.$emit('filterIsActive', platformGenericStructureService.isFilterEnabled());
				} else {
					platformGenericStructureService.enableFilter(false);
					$rootScope.$emit('filterIsActive', false);
				}
			}
		};

		$scope.onGroupStateChanged = function (cid, state) {
			// Add logic to be executed when the group state changes. In this case level to be displayed.
			var item = _.find($scope.state, {id: cid});
			item.sortDesc = 0;
			item.selectToday = 0;
			item.strictTillLevel = 0;

			if (item) {
				_.forOwn(state, function (value, key) {
					if (value.state === 'checked') {
						switch (key) {
							case 'allLvls':
								item.levels = 0;
								item.depth = item.metadata && item.metadata.maxLevels || 1;
								break;

							case 'till_1':
								item.levels = item.depth = 1;
								break;

							case 'till_2':
								item.levels = item.depth = 2;
								break;

							case 'till_3':
								item.levels = item.depth = 3;
								break;

							case 'till_4':
								item.levels = item.depth = 4;
								break;

							case 'till_5':
								item.levels = item.depth = 5;
								break;

							case 'till_6':
								item.levels = item.depth = 6;
								break;

							case 'till_7':
								item.levels = item.depth = 7;
								break;

							case 'till_8':
								item.levels = item.depth = 8;
								break;

							case 'date':
								item.dateoption = 'Date';
								break;

							case 'brkdwn':
								item.dateoption = [];
								_.forOwn(value, function (val, key) {
									if (val.state === 'checked') {
										switch (key) {
											case 'year':
												item.dateoption.push('Year');
												break;
											case 'month':
												item.dateoption.push('Month');
												break;
											case 'calwk':
												item.dateoption.push('CalenderWeek');
												break;
											case 'wkday':
												item.dateoption.push('WeekDay');
												break;
											case'day':
												var dayOption = 'Day';
												switch (val.selected) {
													case 'dayYear':
														dayOption = 'DayYear';
														break;
													default:
														dayOption = 'Day';
														break;
												}
												item.dateoption.push(dayOption);
												break;
										}
									}
								});
								break;

							case 'sortDesc':
								item.sortDesc = 1;
								break;

							case 'selectToday':
								item.selectToday = 1;
								break;

							case 'strictTillLevel':
								item.strictTillLevel = 1;
								break;
						}
					}
				});

				if (state && state.grpColor) {
					item.colorOptions = {color: state.grpColor.color, enabled: state.grpColor.state === 'checked'};
				}

				if (item.metadata && item.metadata.maxLevels < item.depth) {
					item.depth = item.metadata.maxLevels;
				}
			}
		};

		$scope.onGroupingChanged = function (cid, type) {
			// Todo: Add logic to be executed when grouping columns change: This is called when groups are added and removed.
			switch (type) {
				case 'ADDED':
					var column = _.find($scope.config.columns, {id: cid});
					var grouping;// = $scope.scheme[column.$field || column.field] ? $scope.scheme[column.$field || column.fieldgetMetadataByColumn.grouping : column.$field || column.field;
					if (column.formatter === 'history') {
						var fieldstr = column.field.split('.');
						var field = fieldstr[fieldstr.length - 1].charAt(0).toUpperCase() + fieldstr[fieldstr.length - 1].slice(1);
						grouping = $scope.scheme[field].grouping || field;
					} else {
						// grouping = $scope.scheme[column.$field || column.field].grouping || column.$field || column.field;
						// rei@24.9.18
						var groupings = $scope.scheme[column.$field || column.field].groupings;
						if (groupings) { // new logic with multiple grouping items mapping, check
							// no search for grouping info for finding correct mapping, grouping is an array of {groupcolid: string, mappinghint: string}
							var _groupInfo = _.find(groupings, {mappinghint: _.lowerCase(column.id)});
							grouping = (_groupInfo || groupings[0] || {}).groupcolid;
						}
						if (!grouping) {
							grouping = $scope.scheme[column.$field || column.field].grouping || column.$field || column.field;
						}
						// grouping = grouping || column.$field || column.field;
					}

					var groupingColumnId = grouping.split(':')[0];
					var metadata = _.find(platformGenericStructureService.getMetadata(), {groupColumnId: groupingColumnId});

					$scope.state.push({
						id: cid,
						levels: 0,
						depth: metadata && metadata.maxLevels || 1,
						grouping: grouping,
						metadata: metadata
					});
					break;

				case 'REMOVED':
					var index = _.findIndex($scope.state, {id: cid});

					if (index >= 0) {
						$scope.state.splice(index, 1);
					}
					if (!$scope.state.length) {
						$scope.containerItems = [];
						// platformGenericStructureService.clearFilteredItems(); // rei@4.10.18, make sure filter items are cleared...
					}
					break;
			}

			platformGenericStructureService.clearFilteredItems();
			platformGenericStructureService.clearSelectedItems();

			$scope.tools.update();
		};

		$rootScope.$on('gridConfigurationAutoRefreshApplied', function (event, data) {
			if (data.gridId === $scope.getContainerUUID()) {
				// Apply the restored auto-refresh state
				$scope.options.isAutoRefresh = data.config.isAutoRefreshEnabled || false;
				const autoRefreshButton = _.find($scope.tools.items, item => item.iconClass && item.iconClass.includes('ico-auto-refresh'));
				if (autoRefreshButton) {
					autoRefreshButton.value = $scope.options.isAutoRefresh;
				}
				$scope.tools.update();
			}
		});

		let pendingRequest = false;
		let refreshRequested = false;

		function refreshContainer(){
			if($scope.state.length) {
				if(pendingRequest) {
					// avoid multiple refresh if multiple callbacks are triggered
					refreshRequested = true;
					return;
				}

				pendingRequest = true;

				platformGenericStructureService.executeRequest($scope.state, $scope.getContainerUUID())
					.then(function (data) {
						$scope.containerItems = data;
						$timeout(() => {
							pendingRequest = false;

							if(refreshRequested) {
								refreshRequested = false;
								refreshContainer();
							}
						}, 1000, true);
					});
			}
		}

		platformGenericStructureService.dataService.registerListLoaded(refreshContainerListLoaded);

		if($scope.options.isAutoRefresh) {
			refreshContainer();
		}

		const unregisterUpdateDone = $rootScope.$on('updateDone', refreshContainerUpdateDone);

		$scope.$on('$destroy', () => {
			platformGenericStructureService.dataService.unregisterListLoaded(refreshContainerListLoaded);
			unregisterUpdateDone();
		});

		function refreshContainerListLoaded() {
			if(!pendingRequest && $scope.options.isAutoRefresh) {
				refreshContainer();
			}
		}

		function refreshContainerUpdateDone() {
			if(!pendingRequest && $scope.options.isAutoRefresh) {
				refreshContainer();
			}
		}
	}
})(angular);
