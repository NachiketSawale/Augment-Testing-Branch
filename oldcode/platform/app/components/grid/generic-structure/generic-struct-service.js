/**
 * Created by ford on 4/18/2017.
 */
((angular) => {
	'use strict';

	angular.module('platform').service('platformGenericStructureService', platformGenericStructureService);

	platformGenericStructureService.$inject = ['$http', '$q', '$injector', 'moment', 'cloudDesktopSidebarService', 'platformGridAPI', 'platformDomainService', 'globals', '_', 'mainViewService'];

	function platformGenericStructureService($http, $q, $injector, moment, cloudDesktopSidebarService, platformGridAPI, platformDomainService, globals, _, mainViewService) {
		const self = this; // jshint ignore:line
		let moduleName = '';
		let groupingColumns = [];
		let _containerItems = [],
			_groupingMetadata,
			_filteredItems = [],
			_selectedItems = [],
			markerState = false,
			renderedState = false,
			gId;
		self.autoRefresh = false;

		function loadMetadata() {
			return $http.get(globals.webApiBaseUrl + 'basics/common/grouping/groupingmetadata')
				.then(function (response) {
					_groupingMetadata = response.data;

					return _groupingMetadata;
				});
		}

		function recoverParent(item, items) {
			return _.find(items, function (parent) {
				return parent.id === item.parentId;
			});
		}

		function recoverParents(item, items) {
			let parent, arr = [item], prev = item;
			while ((parent = recoverParent(prev, items))) {
				arr.unshift(parent);
				prev = parent;
			}
			return arr;
		}

		function processItems(items, state) {
			renderedState = (state) ? state : false;
			renderFilterOptions(items, state);
			if (state && state[0].selectToday === 1) {
				// select today
				handleDateTypes(state[0].dateoption, items, 0);
			} else {
				if (selectedItems() && selectedItems().length > 0) {
					_.forEach(selectedItems(), function (selectedItem) {
						_.forEach(items, function (item) {
							if (item.id === selectedItem.id) {
								item.IsMarked = true;
								return false; // break current iteration
							}
						});
					});
				} else {
					selectedItems(_.filter(items, {'IsMarked': true}));
				}

				if (filteredItems().length <= 0 && selectedItems() && selectedItems().length > 0) {
					const recoveredFilteredItems = [];
					_.forEach(selectedItems(), function (item) {
						recoveredFilteredItems.push(recoverParents(item, items));
					});

					filteredItems(recoveredFilteredItems);
				}
			}

			_containerItems = items;

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

		function removeMarkers() {
			const list = _.filter(_containerItems, {'IsMarked': true});
			list.forEach(function (item) {
				_.set(item, 'IsMarked', false);
			});
		}

		/**
		 * Handling of all dateoptions from generic struct filter
		 * @param option - dateoptions array
		 * @param items - all possible today items of the current node
		 * @param idx - current index for dateoptions array
		 */
		function handleDateTypes(option, items, idx) {
			_.forEach(items, function (item) {
				const d = new Date();
				const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dez'];
				const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

				if (_.isArray(option) && option.length > 0) {
					switch (option[idx]) {
						case 'Year':
							if (parseInt(item.description) === d.getFullYear()) {
								selectOrRepeat(option, item, idx);
							}
							break;
						case 'Month':
							if (item.description === months[d.getMonth()]) {
								selectOrRepeat(option, item, idx);
							}
							break;
						case 'CalenderWeek':
							if (parseInt(item.description) === moment().week()) {
								selectOrRepeat(option, item, idx);
							}
							break;
						case 'WeekDay':
							if (item.description === days[d.getDay()]) {
								selectOrRepeat(option, item, idx);
							}
							break;
						case 'Day':
							if (parseInt(item.description) === d.getDate()) {
								selectOrRepeat(option, item, idx);
							}
							break;
						case 'DayYear':
							if (parseInt(item.description) === moment().dayOfYear()) {
								selectOrRepeat(option, item, idx);
							}
							break;
					}
				} else if (option === 'Date' || (_.isArray(option) && option.length === 0)) {
					d.setHours(0, 0, 0, 0);
					if (item.entityId && new Date(item.entityId).getTime() === d.getTime()) {
						if (!item.IsMarked) {
							selectCell(item);
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
		function selectOrRepeat(option, item, idx) {
			if (_.findIndex(option[idx + 1]) > -1) {
				handleDateTypes(option, item.children, idx + 1);
			} else {
				selectCell(item);
			}
		}

		/**
		 * Select today
		 * @param item - leaf item to select
		 */
		function selectCell(item) {
			gId = platformGridAPI.configuration.getGID();
			platformGridAPI.grids.commitEdit(gId);
			item.IsMarked = true;
		}

		function selectRows(items) {
			gId = platformGridAPI.configuration.getGID();
			platformGridAPI.grids.commitEdit(gId);
			_.forEach(items, function (item) {
				item.IsMarked = true;
			});

			if (items.length > 0) {
				platformGridAPI.rows.scrollIntoViewByItem(gId, items[0]);
			}
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
					aggregates[i].field = 'outputColumns[' + i + ']';
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
					let split = group.grouping.split('.');

					if (split.length === 1 || split.length === 3 && group.metadata) {
						if (_.isArray(group.dateoption) && !_.isEmpty(group.dateoption)) {
							_.forEach(group.dateoption, function (option) {
								groupingColumns.push({
									groupColumnId: group.grouping,
									groupType: group.metadata && group.metadata.groupType || 1,
									depth: group.depth,
									dateOption: option,
									sortingBy: group.sortDesc
								});
							});
						} else {
							groupingColumns.push({
								groupColumnId: group.grouping,
								groupType: group.metadata && group.metadata.groupType || 1,
								depth: group.depth,
								dateOption: _.isString(group.dateoption) ? group.dateoption : null,
								sortingBy: group.sortDesc
							});
						}
					}
				});
			}

			return groupingColumns;
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

		let groupColumns = {};
		let canceller = null;

		function executeRequest(state, uuid) {
			const request = {
				module: moduleName,
				groupingColumns: getGroupingColumns(state),
				outputColumns: [],
				filterRequest: cloudDesktopSidebarService.getFilterRequestParams() // added Filter from Sidebar as well
			};

			groupColumns = getGroupingColumns(state);

			// check if furtherFilters are set and extend filterRequest
			// rei@25.1.19 added on demand of Dominik. support further filters for generic structure.
			if (typeof self.dataService.getLastFilter === 'function' &&
				self.dataService.getLastFilter() !== null &&
				self.dataService.getLastFilter().furtherFilters !== null) {
				request.filterRequest.furtherFilters = self.dataService.getLastFilter().furtherFilters;
			}

			const aggregates = [];

			_.forEach(platformGridAPI.columns.configuration(uuid).visible, function (column) {
				if (column.aggregates) {
					aggregates.push(column);
					request.outputColumns.push({
						outputColumnName: column.$field || column.field,
						aggregateFunction: column.aggregates,
						sortingBy: 0
					});
				}
			});

			if(canceller) {
				canceller.resolve();
			}

			canceller = $q.defer();

			return $http.post(globals.webApiBaseUrl + 'basics/common/grouping/hierarchy', JSON.stringify(request), { timeout: canceller })
				.then((response) => {
					canceller = null;

					for (let i = 0; i < aggregates.length; ++i) {
						if (!aggregates[i].$field) {
							aggregates[i].$field = aggregates[i].field;
							aggregates[i].field = 'outputColumns[' + i + ']';
						}
					}

					_containerItems = findStrictLevel(groupColumns, response.data);

					return _containerItems;
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

		function retrieveServices(module, containers) {
			moduleName = module;

			var container = _.find(containers, function (container) {
				return container.id === 'platform.generic.structure' && container.mainService && container.configurationService;
			});

			if (container) {
				_containerItems = [];
				markerState = false;

				self.dataService = $injector.get(container.mainService);
				self.configService = $injector.get(container.configurationService);
				self.scheme = self.configService.getDtoScheme();

				return loadMetadata();
			}
		}

		function getGroupItems() {
			return _containerItems;
		}

		function getMetadata(groupId) {
			if (groupId) {
				var groupingColumnId = groupId.split(':')[0];
				return _.find(_groupingMetadata, {groupColumnId: groupingColumnId});
			} else {
				return _groupingMetadata;
			}
		}

		function getMetadataByColumn(column) {
			var grouping;
			if (column.formatter === 'history') {
				var fieldstr = column.field.split('.');
				var field = fieldstr[fieldstr.length - 1].charAt(0).toUpperCase() + fieldstr[fieldstr.length - 1].slice(1);
				grouping = self.scheme[field].grouping || field;
			} else {
				// grouping = self.scheme[column.$field || column.field].grouping || column.$field || column.field;
				// rei@24.9.18
				var groupings = self.scheme[column.$field || column.field].groupings;
				if (groupings) { // new logic with multiple grouping items mapping, check
					// no search for grouping info for finding correct mapping, grouping is an array of {groupcolid: string, mappinghint: string}
					var _groupInfo = _.find(groupings, {mappinghint: _.lowerCase(column.id)});
					grouping = (_groupInfo || groupings[0] || {}).groupcolid;
				}
				if (!grouping) {
					grouping = self.scheme[column.$field || column.field].grouping || column.$field || column.field;
				}
				// grouping = grouping || column.$field || column.field;
			}
			return getMetadata(grouping);
		}

		function isGenericGroup(column) {
			var def = getMetadataByColumn(column);
			return (angular.isDefined(def) && angular.isDefined(def.groupType) && def.groupType === 3);
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
				console.error('No longer use this called with items=false, please use clearFilteredItems() instead.');
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

		function getGroupingFilterRequest() {
			var groupingFilter = {
				module: moduleName,
				groupingCols: getGroupingColumns(),
				filterRows: []
			};

			if (isFilterEnabled(mainViewService.getCurrentView().Id) && filteredItems().length) {
				_.forEach(filteredItems(), function (filter) {
					var rowFilter = [];

					for (var i = 1; i < filter.length; ++i) {
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

		const stateCache = {};

		function cachedState(id) {
			return stateCache[id] = _.get(stateCache, id, {});
		}

		function setAutoRefresh(isAutoRefresh){
			self.autoRefresh = isAutoRefresh;
		}

		function isAutoRefresh(){
			return self.autoRefresh;
		}

		angular.extend(self, {
			loadMetadata: loadMetadata,
			getMetadata: getMetadata,
			getMetadataByColumn: getMetadataByColumn,
			isGenericGroup: isGenericGroup,
			executeRequest: executeRequest,
			getGroupItems: getGroupItems,
			processItems: processItems,
			filteredItems: filteredItems,
			clearFilteredItems: clearFilteredItems,
			selectedItems: selectedItems,
			postProcessColumns: postProcessColumns,
			removeMarkers: removeMarkers,
			retrieveServices: retrieveServices,
			enableFilter: enableFilter,
			isFilterEnabled: isFilterEnabled,
			getMarkerState: getMarkerState,
			getGroupingFilterRequest: getGroupingFilterRequest,
			clearSelectedItems: clearSelectedItems,
			getGroupingColumns: getGroupingColumns,
			cachedState: cachedState,
			setAutoRefresh: setAutoRefresh,
			isAutoRefresh: isAutoRefresh
		});
	}
})(angular);
