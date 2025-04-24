/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (angular) {
	'use strict';

	let moduleName = 'controlling.projectcontrols';
	angular.module(moduleName).factory('controllingProjectcontrolsDashboardControllerExtendService', [
		'$rootScope',
		'_',
		'platformGridAPI',
		function($rootScope, _, platformGridAPI){

			let columnRenames = {
				'sv': 'SV',
				'cv': 'CV',
				'spi': 'SPI',
				'cpi': 'CPI'
			};

		function extendForGenericStructure(scope, dataService, structureService) {
			/******************************************************************************************
			 *  Lifecycle Hooks for generic structure container.
			 ******************************************************************************************/
			// Options for the generic structure container.
			scope.options = {
				columns: scope.config.columns,
				marker: {
					multiSelect: structureService.getMarkerState()
				},
				isGenericGroup: structureService.isGenericGroup,
				isAutoRefresh: structureService.isAutoRefresh()
			};

			// Array containing the displayed items in the generic structure container.
			scope.containerItems = dataService.getGroupItems();

			scope.toggleFilter = function (active) {
				platformGridAPI.filters.showSearch(scope.gridId, active);
			};

			scope.onFilterChanged = function (filterItems) {
				if (filterItems.length) {
					// FilterItems set in service.
					structureService.filteredItems(filterItems);
					structureService.enableFilter(true);
					$rootScope.$emit('filterIsActive', true);
					if (filterItems.length > 1) {
						_.find($scope.tools.items, {id: 't12'}).value = true;
					}
				} else {
					$rootScope.$emit('filterIsActive', false);
					structureService.enableFilter(false);
				}

				scope.tools.update();
			};

			scope.onSelectionChanged = function (/* evt, args */) {
				// Handle selection changes in grid here.
				let selected = _.filter(platformGridAPI.rows.getRows(scope.gridData.state), {'IsMarked': true});

				if (selected) {
					dataService.selectedItems(selected);
				}
			};

			scope.onItemsProcessed = function (data) {
				if (data && data.length) {
					dataService.setGroupItems(data);
					structureService.processItems(dataService, data, dataService.getGroupingstate());
					structureService.postProcessColumns(scope.getContainerUUID(), 'visible');
					platformGridAPI.grids.refresh(scope.getContainerUUID());
					platformGridAPI.grids.invalidate(scope.getContainerUUID());

					if (structureService.filteredItems().length > 0) {
						structureService.enableFilter(structureService.isFilterEnabled());
						$rootScope.$emit('filterIsActive', structureService.isFilterEnabled());
					} else {
						structureService.enableFilter(false);
						$rootScope.$emit('filterIsActive', false);
					}
				}
			};

			scope.onGroupStateChanged = function (cid, state) {
				// Add logic to be executed when the group state changes. In this case level to be displayed.
				let item = _.find(dataService.getGroupingstate(), {id: cid});
				item.sortDesc = 0;
				item.selectToday = 0;
				item.strictTillLevel = 0;
				if(item && item.id === 'Package' && item.metadata){
					item.metadata.showBP = 0;
					item.metadata.showPackageDesc = 0;
				}

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
												case'day': {
													let dayOption = 'Day';
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
								case 'showBP':
									if(item && item.metadata){
										item.metadata.showBP = 2;
									}
									break;
								case 'showPackageDesc':
									if(item && item.metadata){
										item.metadata.showPackageDesc = 1;
									}
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

			scope.onGroupingChanged = function (cid, type) {
				switch (type) {
					case 'ADDED': {
						let column = _.find(scope.groupingColumns, {id: cid});
						if (column) {
							dataService.addGroupingItem(cid, column);
						}
						break;
					}
					case 'REMOVED': {
						dataService.removeGroupingItem(cid);

						if (!dataService.getGroupingstate().length) {
							scope.containerItems = [];
							// platformGenericStructureService.clearFilteredItems(); // rei@4.10.18, make sure filter items are cleared...
						}
						break;
					}
				}

				structureService.clearFilteredItems();
				dataService.clearSelectedItems();
				scope.tools.update();
			};
		}

		function renameColumns(columns){
			if (_.isArray(columns) && columns.length > 0) {
				_.forEach(columns, function (column) {
					column.name$tr$ = null;
					column.name = columnRenames[column.id] || column.name;
				});
			}
		}

		return {
			extendForGenericStructure: extendForGenericStructure,
			renameColumns: renameColumns
		};
	}]);
})(angular);