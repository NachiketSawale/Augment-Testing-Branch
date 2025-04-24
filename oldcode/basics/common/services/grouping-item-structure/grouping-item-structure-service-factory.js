/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (ng) {
	'use strict';

	ng.module('platform').factory('groupingItemStructureServiceFactory', groupingItemStructureServiceFactory);

	groupingItemStructureServiceFactory.$inject = ['moment',
		'platformGridAPI', 'platformDomainService', '_', 'mainViewService'];

	function groupingItemStructureServiceFactory(moment, platformGridAPI,
		platformDomainService, _, mainViewService) {

		function StructureService(dataService, moduleName, groupingTypes){
			const self = this;
			const groupingTypesInternal = angular.copy(groupingTypes);
			const stateCache = {};
			this.gId = null;
			let groupingColumns = [];
			let _filteredItems = [],
				markerState = false,
				renderedState = false;
			self.autoRefresh = false;

			function processItems(dataService, items, state) {
				renderedState = (state) ? state : false;
				renderFilterOptions(items, state);
				if (state && state[0].selectToday === 1) {
					// select today
					self.handleDateTypes(state[0].dateoption, items, 0);
				} else {
					if (dataService.selectedItems() && dataService.selectedItems().length > 0) {
						_.forEach(dataService.selectedItems(), function (selectedItem) {
							_.forEach(items, function (item) {
								if (item.id === selectedItem.id) {
									item.IsMarked = true;
									return false; // break current iteration
								}
							});
						});
					} else {
						dataService.selectedItems(_.filter(items, {'IsMarked': true}));
					}

					if (filteredItems().length <= 0 && dataService.selectedItems() && dataService.selectedItems().length > 0) {
						const recoveredFilteredItems = [];
						_.forEach(dataService.selectedItems(), function (item) {
							recoveredFilteredItems.push(self.recoverParents(item, items));
						});

						filteredItems(recoveredFilteredItems);
					}
				}

				_.forEach(items, function (item) {
					if (item.level) {
						if (_.isNull(item.entityId)) {
							item.image = 'control-icons ico-folder-overlay1';
						} else {
							const groupColumnIdParts = item.groupColumnId.split('.');
							const groupColumnId = groupColumnIdParts[groupColumnIdParts.length - 1];
							const domain = platformDomainService.loadDomain((self.scheme[groupColumnId] || {}).domain);

							if (domain) {
								item.image = domain.image;
							}
						}
					}
				});
			}

			function postProcessColumns(uuid, type) {
				const aggregates = [];
				const columns = platformGridAPI.columns.configuration(uuid);

				_.forEach(columns[type], function (column) {
					if (column.aggregates) {
						aggregates.push(column);
					}
				});
				for (let i = 0; i < aggregates.length; ++i) {
					if (!aggregates[i].$field) {
						aggregates[i].$field = aggregates[i].field;
					}
				}
			}

			function getGroupingColumns(state) {
				if (!state && renderedState) {
					state = renderedState;
				}
				if (state) {
					groupingColumns = [];

					_.forEach(state, function (group) {

						if (group.metadata) {
							if (_.isArray(group.dateoption) && !_.isEmpty(group.dateoption)) {
								_.forEach(group.dateoption, function (option) {
									groupingColumns.push({
										id: group.metadata.groupId,
										groupColumnId: group.metadata.groupColumnName,
										groupType: group.metadata && group.metadata.groupType || 1,
										depth: group.depth,
										dateOption: option,
										sortingBy: group.sortDesc,
										showBP: group.metadata.showBP,
										showPackageDesc: group.metadata.showPackageDesc
									});
								});
							} else {
								groupingColumns.push({
									id: group.metadata.groupId,
									groupColumnId: group.metadata.groupColumnName,
									groupType: group.metadata && group.metadata.groupType || 1,
									depth: group.depth,
									dateOption: _.isString(group.dateoption) ? group.dateoption : null,
									sortingBy: group.sortDesc,
									showBP: group.metadata.showBP,
									showPackageDesc: group.metadata.showPackageDesc
								});
							}
						}
					});
				}

				return groupingColumns;
			}

			function getAllGroupingColumns(){
				let allGroupingColumns = [];

				_.forEach(groupingTypesInternal, function (group) {

					if (group.metadata) {
						if (_.isArray(group.dateoption) && !_.isEmpty(group.dateoption)) {
							_.forEach(group.dateoption, function (option) {
								allGroupingColumns.push({
									id: group.metadata.groupId,
									groupColumnId: group.metadata.groupColumnName,
									groupType: group.metadata && group.metadata.groupType || 1,
									depth: group.depth,
									dateOption: option,
									sortingBy: group.sortDesc
								});
							});
						} else {
							allGroupingColumns.push({
								id: group.metadata.groupId,
								groupColumnId: group.metadata.groupColumnName,
								groupType: group.metadata && group.metadata.groupType || 1,
								depth: group.depth,
								dateOption: _.isString(group.dateoption) ? group.dateoption : null,
								sortingBy: group.sortDesc
							});
						}
					}
				});

				return allGroupingColumns;
			}

			function getMergedAllGroupingColumns(target){
				let source = getAllGroupingColumns();
				if(!_.isArray(target) || !_.isArray(target) || target.length < 1 || source.length < 1){
					return [];
				}

				_.forEach(source, function(s){
					if(!_.find(target, {id: s.id})){
						target.push(s);
					}
				});

				return target;
			}

			function renderFilterOptions(items, gc) {
				renderedState = (gc) ? gc : false;

				_.each(items, function (item) {
					_.each(gc, function (g) {
						// set grouping color option
						if (item.groupColumnId === g.grouping) {
							if (g.colorOptions && g.colorOptions.enabled) {
								item.$$indColor = g.colorOptions.color;
							} else {
								item.$$indColor = null;
							}
						}
					});

					if (item.children && item.children.length) {
						renderFilterOptions(item.children, gc);
					}
				});
			}

			function findStrictLevel(groupColumns, items) {
				var i = 0, found, result = [];

				_.forEach(groupColumns, function (groupColumn) {
					if (groupColumn.strictTillLevel === 1 && groupColumn.depth <= 5) {
						for (; i < items.length; i++) {
							if (items[i].level === groupColumn.depth && items[i].groupColumnId === groupColumn.groupColumnId || items[i].entityId === null) {
								result.push(items[i]);
							} else if (_.isArray(items[i].children)) {
								found = findStrictLevel(groupColumns, items[i].children);
								if (found.length) {
									result = result.concat(found);
								}
							}
						}
					} else {
						result = items;
					}
				});

				return result;
			}

			function getMetadataByColumn(column) {
				return column.metadata;
			}

			function isGenericGroup(column) {
				let def = getMetadataByColumn(column);
				return (ng.isDefined(def) && ng.isDefined(def.groupType) && def.groupType === 3);
			}

			function enableFilter(enable) {
				self.cachedState(mainViewService.getCurrentView().Id).filterEnabled = enable;
			}

			function isFilterEnabled() {
				return _.get(self.cachedState(mainViewService.getCurrentView().Id), 'filterEnabled', false);
			}

			/*
				clear filter items.
				this function should replace strange function filteredItems(false)
			 */
			function clearFilteredItems() {
				_filteredItems.length = 0;
			}

			function filteredItems(items) {
				if (items === false) {
					console.error('No longer use this called with items=false, plaese use clearFilteredItems() instead.');
					_filteredItems.length = 0;
					return;
				}
				if (items) {
					_filteredItems = items;
				} else {
					return _filteredItems;
				}
			}

			function getMarkerState() {
				return markerState;
			}

			function getGroupingFilterRequest() {
				let groupingFilter = {
					module: moduleName,
					groupingCols: getGroupingColumns(),
					filterRows: []
				};

				if (isFilterEnabled(mainViewService.getCurrentView().Id) && filteredItems().length) {
					_.forEach(filteredItems(), function (filter) {
						let rowFilter = [];

						for (let i = 1; i < filter.length; ++i) {
							rowFilter.push({
								groupColumnId: filter[i].groupColumnId,
								level: filter[i].level,
								value: filter[i].entityId
							});
						}

						if (rowFilter.length) {
							groupingFilter.filterRows.push({
								rowInfo: rowFilter
							});
						}
					});
				}

				return groupingFilter.filterRows.length ? groupingFilter : null;
			}

			function cachedState(id) {
				return stateCache[id] = _.get(stateCache, id, {});
			}

			function setAutoRefresh(isAutoRefresh) {
				self.autoRefresh = isAutoRefresh;
			}

			function isAutoRefresh() {
				return self.autoRefresh;
			}

			return angular.extend(self, {
				getMetadataByColumn: getMetadataByColumn,
				isGenericGroup: isGenericGroup,
				findStrictLevel: findStrictLevel,
				processItems: processItems,
				filteredItems: filteredItems,
				clearFilteredItems: clearFilteredItems,
				postProcessColumns: postProcessColumns,
				enableFilter: enableFilter,
				isFilterEnabled: isFilterEnabled,
				getMarkerState: getMarkerState,
				getGroupingFilterRequest: getGroupingFilterRequest,
				getGroupingColumns: getGroupingColumns,
				getMergedAllGroupingColumns: getMergedAllGroupingColumns,
				cachedState: cachedState,
				setAutoRefresh: setAutoRefresh,
				isAutoRefresh: isAutoRefresh
			});
		}

		/**
		 * Handling of all dateoptions from generic struct filter
		 * @param option - dateoptions array
		 * @param items - all possible today items of the current node
		 * @param idx - current index for dateoptions array
		 */
		StructureService.prototype.handleDateTypes = function(option, items, idx) {
			const self = this;
			_.forEach(items, function (item) {
				const d = new Date();
				const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dez'];
				const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

				if (_.isArray(option) && option.length > 0) {
					switch (option[idx]) {
						case 'Year':
							if (parseInt(item.description) === d.getFullYear()) {
								self.selectOrRepeat(option, item, idx);
							}
							break;
						case 'Month':
							if (item.description === months[d.getMonth()]) {
								self.selectOrRepeat(option, item, idx);
							}
							break;
						case 'CalenderWeek':
							if (parseInt(item.description) === moment().week()) {
								self.selectOrRepeat(option, item, idx);
							}
							break;
						case 'WeekDay':
							if (item.description === days[d.getDay()]) {
								self.selectOrRepeat(option, item, idx);
							}
							break;
						case 'Day':
							if (parseInt(item.description) === d.getDate()) {
								self.selectOrRepeat(option, item, idx);
							}
							break;
						case 'DayYear':
							if (parseInt(item.description) === moment().dayOfYear()) {
								self.selectOrRepeat(option, item, idx);
							}
							break;
					}
				} else if (option === 'Date' || (_.isArray(option) && option.length === 0)) {
					d.setHours(0, 0, 0, 0);
					if (item.entityId && new Date(item.entityId).getTime() === d.getTime()) {
						if (!item.IsMarked) {
							self.selectCell(item);
						}
					}
				}
			});
		}

		/**
		 * Select element if there aren't any further dateoptions
		 * @param option - dateoptions array
		 * @param item - found possible today item
		 * @param idx - current dateoption index
		 */
		StructureService.prototype.selectOrRepeat = function(option, item, idx) {
			if (_.findIndex(option[idx + 1]) > -1) {
				this.handleDateTypes(option, item.children, idx + 1);
			} else {
				this.selectCell(item);
			}
		}

		/**
		 * Select today
		 * @param item - leaf item to select
		 */
		StructureService.prototype.selectCell = function(item) {
			this.gId = platformGridAPI.configuration.getGID();
			platformGridAPI.grids.commitEdit(this.gId);
			item.IsMarked = true;
		}

		StructureService.prototype.recoverParent = function(item, items) {
			return _.find(items, function (parent) {
				return parent.id === item.parentId;
			});
		}

		StructureService.prototype.recoverParents = function(item, items) {
			let parent, arr = [item], prev = item;
			while ((parent = this.recoverParent(prev, items))) {
				arr.unshift(parent);
				prev = parent;
			}
			return arr;
		}

		return {
			createStructureService : function(dataService, moduleName, groupingTypes){
				return new StructureService(dataService, moduleName, groupingTypes);
			}
		}
	}
})(angular);
