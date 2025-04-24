(function ($) {
	'use strict';

	// noinspection FunctionTooLongJS
	/***
	 * A sample Model implementation.
	 * Provides a filtered view of the underlying data.
	 *
	 * Relies on the data item having an "id" property uniquely identifying it.
	 */
	function DataView(options) { // jshint ignore:line
		var self = this;
		var defaults = {
			groupItemMetadataProvider: null,
			droppableGroupBy: false,
			inlineFilters: false,
			enableDraggableGroupBy: false
		};

		// private
		var idProperty = options.idProperty || 'Id'; // property holding a unique row id
		var items = []; // data by index
		var dItems = []; // Items displayed in tree grid.
		var rows = []; // data by row
		var idxById = {}; // indexes by id
		var rowsById = null; // rows by id; lazy-calculated
		var customFilter = null;
		var filter = null; // filter function
		var columnFilter = null; // column filter function
		var updated = null; // updated item ids
		var suspend = false; // suspends the recalculation
		var sortAsc = true;
		var fastSortField;
		var sortComparer;
		var refreshHints = {};
		var prevRefreshHints = {};
		var filterArgs;
		var filteredItems = [];
		var compiledFilter;
		var compiledFilterWithCaching;
		var filterCache = [];
		var lookupCache = [];

		// grouping
		var groupingInfoDefaults = {
			getter: null,
			formatter: null,
			comparer: function (a, b) {
				return a.value - b.value;
			},
			predefinedValues: [],
			aggregators: [],
			aggregateEmpty: false,
			aggregateCollapsed: false,
			aggregateChildGroups: false,
			collapsed: false,
			displayTotalsRow: true,
			lazyTotalsCalculation: false
		};
		var groupingInfos = [];
		var groups = [];
		var toggledGroupsByLevel = [];

		var pagesize = 0;
		var pagenum = 0;
		var totalRows = 0;

		// events
		var onRowCountChanged = new Slick.Event();
		var onRowsChanged = new Slick.Event();
		var onPagingInfoChanged = new Slick.Event();

		// RIB Extensions
		var slickGrid;
		var headerElements;
		var columns;
		var dropbox;
		var dropboxPlaceholder;
		var _filterHistory = {};
		var _previousString = '';
		var _groupingStateChanged = false;
		var maxLevel = 0;

		options = $.extend(true, {}, defaults, options);

		function setGrid(grid) {
			slickGrid = grid;

			if (grid.getOptions().enableDraggableGroupBy) {
				headerElements = grid.getHeaderElements();

				if (headerElements[0]) {
					dropbox = headerElements[0];
					dropboxPlaceholder = dropbox.find('.slick-placeholder');

					setupColumnDropbox();
				}
			}
		}

		function setColumns(col) {
			columns = col;
		}

		var emptyDropbox;

		function setupColumnDropbox() {
			// dropboxPlaceholder.hide();
			dropbox.droppable({
				activeClass: 'ui-state-default',
				hoverClass: 'ui-state-hover',
				accept: ':not(.ui-sortable-helper)',
				deactivate: function () {
					dropbox.removeClass('slick-header-column-denied');
				},
				drop: function (event, ui) {
					handleGroupByDrop(this, ui.draggable);
				},
				over: function (event, ui) {
					var id = (ui.draggable).attr('id').replace(slickGrid.getUID(), '');

					columns.forEach(function (e) {
						if (e.id === id) {
							if (e.grouping == null) {
								dropbox.addClass('slick-header-column-denied');
							}
						}
					});
				}
			});

			emptyDropbox = dropbox.html();
		}

		function getFilteredItems() {
			return {
				totalRows: filteredItems.length,
				rows: filteredItems
			};
		}

		var columnsGroupBy = [];

		function handleGroupByDrop(container, column, intialSettings) {
			var columnid;

			if (column.attr('id')) {
				columnid = column.attr('id').replace(slickGrid.getUID(), '');
			}
			var columnAllowed = true;

			columnsGroupBy.forEach(function (e) {
				if (e.id === columnid) {
					columnAllowed = false;
				}
			});

			if (columnAllowed) {
				columns.forEach(function (e) {
					if (e.id === columnid) {
						if(e.grouping)  {
							var entry = $('<li class="slick-grouped" id="' + slickGrid.getUID() + e.id + '_entry">');
							var span = $('<span></span>').text(column.text() + ' ');
							var imgSort = $('<span class="group-sort control-icons"></span>');
							// var hideColumn = $('<span>test</span>');
							var img = $('<span class="group-close control-icons ico-close"></span>');

							e.grouping.ascending = (!_.isNil(intialSettings) && !_.isNil(intialSettings.ascending)) ? intialSettings.ascending : true;
							$(container).find('.slick-placeholder').hide();

							span.appendTo(entry);
							imgSort.appendTo(entry);
							imgSort.addClass(e.grouping.ascending ? 'slick-sort-indicator-asc' : 'slick-sort-indicator-desc');
							// hideColumn.appendTo(entry);
							img.appendTo(entry);
							$('</li>').appendTo(entry);
							entry.appendTo(container);

							e.grouping.title = column.text();

							addColumnGroupBy(e, column, container, entry);
							addSortGroupingClickHandler(e.id, entry);
							addGroupByRemoveClickHandler(e.id, container, column, entry, img);
							// addGroupHideColumnClickHandler(e.id, container, column, entry, hideColumn);
						}
					}
				});
			}
		}

		function removeGroup(arr, group) {
			var len = arr.length;
			while (len > 0) {
				if (arr[--len].id === group.id) {
					arr.splice(len, 1);
				}
			}
			return arr;
		}

		function removeGroupBy(id, column, entry) {
			entry.remove();
			removeGroup(columnsGroupBy, _.find(columns, {id: id}));
			updateGroupBy();
		}

		function updateGroupBy() {
			var groupingArray = [];

			if (columnsGroupBy.length === 0) {
				setGrouping([]);
				return;
			}

			columnsGroupBy.forEach(function (element) {
				var grouping = _.clone(element.grouping);
				grouping.columnId = element.id;
				groupingArray.push(grouping);
			});

			setGrouping(groupingArray);
			collapseAllGroups();
		}

		function beginUpdate() {
			suspend = true;
		}

		function endUpdate() {
			suspend = false;
			refresh();
		}

		function setRefreshHints(hints) {
			refreshHints = hints;
		}

		function setFilterArgs(args) {
			if (!args || !args.searchString || args.searchString.length === 0) {
				_filterHistory = {};
				filteredItems = [];
			}
			args.customFilter = customFilter;
			filterArgs = $.extend({}, filterArgs, args);
		}

		function updateIdxByIdHierarchical(startingIndex, row, itemArray) {
			if (!itemArray) {
				return row;
			}
			startingIndex = startingIndex || 0;
			var id;
			var item;
			for (var i = startingIndex, l = itemArray.length; i < l; i++) {
				item = itemArray[i];
				id = item[idProperty];
				if (id === undefined) {
					throw 'Each data element must implement a unique Id property';
				}
				idxById[id] = row;
				row++;
				if (item.nodeInfo && !item.nodeInfo.collapsed && !item.nodeInfo.lastElement) {
					row = updateIdxByIdHierarchical(0, row, item[options.childProp]);
				}
			}
			return row;
		}

		function updateIdxById(startingIndex) {
			startingIndex = startingIndex || 0;
			if (options.tree) {
				updateIdxByIdHierarchical(0, startingIndex, items);
			} else {
				var id;

				for (var i = startingIndex, l = items.length; i < l; i++) {
					id = items[i][idProperty];
					if (id === undefined) {
						throw 'Each data element must implement a unique Id property';
					}
					idxById[id] = i;
				}
			}
		}

		function ensureIdUniqueness() {
			var index = 0;
			if (options.tree) {
				ensureIdUniquenessHierarchical(index, items);
			} else {
				var id;
				for (var i = 0, l = items.length; i < l; i++) {
					id = items[i][idProperty];
					if (id === undefined) {
						throw 'Each data element must implement a unique Id property';
					} else if (idxById[id] !== i) {
						throw 'Each data element must implement a unique Id :<' + idProperty.toString() + '> property';
					}
				}
			}
		}

		function ensureIdUniquenessHierarchical(index, itemArray) {
			if (!itemArray) {
				return index;
			}
			var id;
			var item;
			for (var i = 0, l = itemArray.length; i < l; i++) {
				id = itemArray[i][idProperty];
				item = itemArray[i];
				if (id === undefined) {
					throw 'Each data element must implement a unique Id property';
				} else if (idxById[id] !== index) {
					throw 'Each data element must implement a unique Id :<' + idProperty.toString() + '> property';
				}
				index++;
				if (item.nodeInfo && !item.nodeInfo.collapsed) {
					index = ensureIdUniquenessHierarchical(index, item[options.childProp]);
				}
			}
			return index;
		}

		function getRows() {
			return rows;
		}

		function getItems(displayed) {
			return displayed ? dItems : items;
		}

		function setItems(data, objectIdProperty) {
			if (objectIdProperty !== undefined) {
				idProperty = objectIdProperty;
			}
			items = filteredItems = data;
			if (options.tree) {
				maxLevel = 0;
				prepareItems(items);
			}
			lookupCache = [];
			idxById = {};
			_filterHistory = {};
			updateIdxById();
			ensureIdUniqueness();
			refresh();
		}

		function setPagingOptions(args) {
			if (args.pageSize !== undefined) {
				pagesize = args.pageSize;
				pagenum = pagesize ? Math.min(pagenum, Math.max(0, Math.ceil(totalRows / pagesize) - 1)) : 0;
			}

			if (args.pageNum !== undefined) {
				pagenum = Math.min(args.pageNum, Math.max(0, Math.ceil(totalRows / pagesize) - 1));
			}

			onPagingInfoChanged.notify(getPagingInfo(), null, self);

			refresh();
		}

		function getPagingInfo() {
			var totalPages = pagesize ? Math.max(1, Math.ceil(totalRows / pagesize)) : 1;
			return {
				pageSize: pagesize,
				pageNum: pagenum,
				totalRows: totalRows,
				totalPages: totalPages
			};
		}

		function sort(comparer, options) {

			if(items && items.length === 0) {
				return ;
			}

			// For sort to work when general search is in use, we have to clear the filterhistory enty for the current search string
			// Fix for Defect #117397
			if(filterArgs.searchString && filterArgs.searchString.length > 0)
			{
				delete _filterHistory[filterArgs.searchString];
			}

			sortAsc = options.ascending;
			sortComparer = comparer;
			fastSortField = null;

			let promises = [];
			if (options.domain === 'lookup') {

				_.forEach(items, function (c) {
					let val = options.formatter(0, 0, _.get(c, options.field), options, c, true, null, {
						promise: true,
						grouping: true
					});

					if (val && typeof val === 'object' && val.$$state) {
						promises.push(val);
					}
				});
			}


			// promise returned -> start again
			if (promises.length) {
				Promise.all(promises)
					.then(function (result) {
						items.sort(comparer);
						if (options.ascending === false) {
							items.reverse();
						}
						idxById = {};
						updateIdxById();
						refresh();
					});
			}
			else {
				items.sort(comparer);
				if (options.ascending === false) {
					items.reverse();
				}
				idxById = {};
				updateIdxById();
				refresh();
			}
		}

		/***
		 * Provides a workaround for the extremely slow sorting in IE.
		 * Does a [lexicographic] sort on a give column by temporarily overriding Object.prototype.toString
		 * to return the value of that field and then doing a native Array.sort().
		 */
		function fastSort(field, ascending) {
			sortAsc = ascending;
			fastSortField = field;
			sortComparer = null;
			var oldToString = Object.prototype.toString;
			Object.prototype.toString = (typeof field === 'function') ? field : function () { // jshint ignore:line
				return this[field];
			};

			// an extra reversal for descending sort keeps the sort stable
			// (assuming a stable native sort implementation, which isn't true in some cases)
			if (ascending === false) {
				items.reverse();
			}
			items.sort();
			Object.prototype.toString = oldToString; // jshint ignore:line
			if (ascending === false) {
				items.reverse();
			}
			idxById = {};
			updateIdxById();
			refresh();
		}

		function reSort() {
			if (sortComparer) {
				sort(sortComparer, slickGrid.sortColumn);
			} else if (fastSortField) {
				fastSort(fastSortField, slickGrid.sortColumn);
			}
		}

		function setColumnFilter(filterFn) {
			columnFilter = filterFn;
		}

		function setFilter(filterFn) {
			filter = filterFn;
			if (options.inlineFilters) {
				compiledFilter = compileFilter();
				compiledFilterWithCaching = compileFilterWithCaching();
			}
			refresh();
		}

		function setFilterExtension(filterFn) {
			customFilter = filterFn;
			filterArgs.customFilter = customFilter;
			refresh();
		}

		function getGrouping() {
			return groupingInfos;
		}

		var initialGrouping;

		function setInitialGrouping(groupingInfo, columnWidth) {
			initialGrouping = true;
			if (groupingInfo && Array.isArray(groupingInfo) && groupingInfo.length) {
				for (var i = 0; i < groupingInfo.length; i++) {
					if (groupingInfo[i].getter) {
						var column = _.find(slickGrid.getColumns(), {id: groupingInfo[i].columnId});
						if (column) {
							var ele = slickGrid.getHeaderRowColumn(column.id);
							handleGroupByDrop(dropbox, $(ele), groupingInfo[i]);
						}
					}
				}

				for (var n = groupingInfo.length - 1; n >= 0; n--) {
					if(groupingInfo[n].expandedGroups && groupingInfo[n].expandedGroups.length > 0){
						for (var grpIndex = 0; grpIndex < groupingInfo[n].expandedGroups.length; grpIndex++){
							expandCollapseGroup(n, groupingInfo[n].expandedGroups[grpIndex], false);
						}
					}
					else if(!groupingInfo[n].collapsed) {
						expandCollapseAllGroups(null, false);
					}
				}
			} else {
				setGrouping([], columnWidth);
			}
			initialGrouping = false;
		}

		function setGrouping(groupingInfo, columnWidth) {

			let args = {columnWidth: null};
			if (!columnWidth) {
				columnWidth = 250;
			}
			trigger(self.onBeforeGroupingChanged, args);

			columnWidth = args.columnWidth ? args.columnWidth : columnWidth;

			if (!options.groupItemMetadataProvider) {
				options.groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
			}

			if (groupingInfo.length === 0) {
				columnsGroupBy.forEach(function (e) {
					var entry = $('#' + slickGrid.getUID() + e.id + '_entry');
					entry.unbind('click');
					entry.remove();
				});
				columnsGroupBy = [];
			}
			groups = [];
			toggledGroupsByLevel = [];
			groupingInfo = groupingInfo || [];
			groupingInfos = (groupingInfo instanceof Array) ? groupingInfo : [groupingInfo];

			for (var i = 0; i < groupingInfos.length; i++) {
				var gi = groupingInfos[i] = $.extend(true, {}, groupingInfoDefaults, groupingInfos[i]);
				gi.getterIsAFn = typeof gi.getter === 'function';

				// pre-compile accumulator loops
				gi.compiledAccumulators = [];
				var idx = gi.aggregators.length;
				while (idx--) {
					gi.compiledAccumulators[idx] = compileAccumulatorLoop(gi.aggregators[idx]);
				}
				toggledGroupsByLevel[i] = {};
			}

			setTimeout(function () {
				slickGrid.toggleGroupIndicator(groupingInfos, columnWidth);
				refresh();
				let selectedItems = slickGrid.getSelectedRows();
				slickGrid.setSelectedRows(selectedItems);
			}, 0);

			if (!initialGrouping) {
				trigger(self.onGroupingChanged);
			}
		}

		/**
		 * @deprecated Please use {@link setGrouping}.
		 */
		function groupBy(valueGetter, valueFormatter, sortComparer) {
			if (valueGetter === null) {
				setGrouping([]);
				return;
			}
			setGrouping({
				getter: valueGetter,
				formatter: valueFormatter,
				comparer: sortComparer
			});
		}

		/**
		 * @deprecated Please use {@link setGrouping}.
		 */
		function setAggregators(groupAggregators, includeCollapsed) {
			if (!groupingInfos.length) {
				throw new Error('At least one grouping must be specified before calling setAggregators().');
			}
			groupingInfos[0].aggregators = groupAggregators;
			groupingInfos[0].aggregateCollapsed = includeCollapsed;
			setGrouping(groupingInfos);
		}

		function getItemByIdx(i) {
			return items[i];
		}

		function getIdxById(id) {
			return idxById[id];
		}

		function ensureRowsByIdCache() {
			if (!rowsById) {
				rowsById = {};
				for (var i = 0, l = rows.length; i < l; i++) {
					rowsById[rows[i][idProperty]] = i;
				}
			}
		}

		function getRowById(id) {
			ensureRowsByIdCache();
			return rowsById[id];
		}

		function getItemById(id, displayed) {
			if (displayed) {
				return _.find(dItems, [idProperty, id]);
			}
			return items[idxById[id]];
		}

		function mapIdsToRows(idArray) {
			var rows = [];
			ensureRowsByIdCache();
			for (var i = 0; i < idArray.length; i++) {
				var row = rowsById[idArray[i]];
				if (row != null) {
					rows[rows.length] = row;
				}
			}
			return rows;
		}

		function mapRowsToIds(rowArray) {
			var ids = [];
			for (var i = 0; i < rowArray.length; i++) {
				if (rowArray[i] >= 0 && rowArray[i] < rows.length) {
					ids[ids.length] = rows[rowArray[i]][idProperty];
				}
			}
			return ids;
		}

		function updateItem(id, item) {
			if (idxById[id] === undefined || id !== item[idProperty]) {
				throw 'Invalid or non-matching id';
			}
			items[idxById[id]] = item;
			if (!updated) {
				updated = {};
			}
			updated[id] = true;
			refresh();
		}

		function insertItem(insertBefore, item) {
			items.splice(insertBefore, 0, item);
			updateIdxById(insertBefore);
			refresh();
		}

		function addItem(item) {
			var index = items.length - 1;
			if (options.tree) {
				if (!item[options.parentProp] && _.findIndex(items, {Id: item.Id}) === -1) {
					items.push(item);
				} else {
					var level = 0;
					var parentId = item[options.parentProp];
					var parentObj = null;
					index = _.findIndex(rows, {Id: parentId});

					while (index === -1 && parentId >= 0) {
						parentObj = getItem(idxById[parentId]);
						if (!parentObj) {
							break;
						}
						parentId = parentObj[options.parentProp];
						index = _.findIndex(rows, {Id: parentId});
						++level;
					}

					parentId = item[options.parentProp];
					parentObj = getItem(idxById[parentId]);
					if (parentObj) {
						if (parentObj.nodeInfo === undefined) {
							parentObj.nodeInfo = {
								level: level,
								collapsed: false,
								lastElement: false,
								children: true
							};
						} else {
							parentObj.nodeInfo.collapsed = false;
							parentObj.nodeInfo.lastElement = false;
							parentObj.nodeInfo.children = parentObj[options.childProp] && parentObj[options.childProp].length;
						}

					}
				}
			} else {
				if (_.findIndex(items, {Id: item.Id}) === -1) {
					items.push(item);
				}
			}
			if (index === -1) {
				index = 0;
			}
			updateIdxById(index);

			refresh();
		}

		function deleteItem(id) {
			var idx = idxById[id];
			if (idx === undefined) {
				throw 'Invalid id';
			}
			delete idxById[id];
			items.splice(idx, 1);
			updateIdxById(idx);
			refresh();
		}

		function getLength() {
			return rows.length;
		}

		function getTreeLength() {
			var totalItems = flattenNodes(items);
			return totalItems.length;
		}

		function getItem(i, displayed) {
			if (displayed) {
				return dItems[i];
			}
			return rows[i];
		}

		function getItemMetadata(i) {
			var item = rows[i];
			var returnObj = {};

			if (item === undefined) {
				return null;
			}

			if (item.__rt$data && item.__rt$data.grid && item.__rt$data.grid.mergedCells) {
				//Fix for DEV-2322
				let mergedCells = {};
				mergedCells.columns = {};
				for (const column in item.__rt$data.grid.mergedCells.columns) {
					let col = slickGrid.getColumns().find(c => c.id === column);
					if(col && !col.pinned) {
						mergedCells.columns[column] = item.__rt$data.grid.mergedCells.columns[column];
					}
				}
				returnObj.mergedCells = mergedCells;
				//returnObj.mergedCells = item.__rt$data.grid.mergedCells;
			}
			// overrides for grouping rows
			if (item.__group) {
				returnObj.group = options.groupItemMetadataProvider.getGroupRowMetadata(item);
			}
			// overrides for totals rows
			if (item.__groupTotals) {
				returnObj.groupTotals = options.groupItemMetadataProvider.getTotalsRowMetadata(item);
			}
			if (options.itemMetadataProvider) {
				returnObj.metadataProvider = options.itemMetadataProvider(item);
			}
			if (item.cssClass) {
				returnObj.cssClasses = item.cssClass;
			}
			if ($.isEmptyObject(returnObj)) {
				returnObj = null;
			}

			return returnObj;
		}

		function setItemMetaData(row, options) {
			var item;
			if (typeof row === 'object') {
				item = row;
			} else {
				item = getItem(row);
			}
			if (!item.__rt$data || !item.__rt$data.grid) {
				item.__rt$data = item.__rt$data || {};
				item.__rt$data.grid = {};
			}
			if (options.mergedCells) {
				item.__rt$data.grid.mergedCells = {'columns': {}};
				options.mergedCells.forEach(function (mergeCell) {
					var name = mergeCell.colid;
					item.__rt$data.grid.mergedCells.columns[name] = {'colspan': mergeCell.colspan};
				});
			}
			if (options.cssClass) {
				item.cssClass = options.cssClass;
			}
		}

		function expandCollapseAllGroups(level, collapse) {
			if (level == null) {
				for (var i = 0; i < groupingInfos.length; i++) {
					toggledGroupsByLevel[i] = {};
					groupingInfos[i].collapsed = collapse;
					groupingInfos[i].expandedGroups = [];
				}
			} else {
				toggledGroupsByLevel[level] = {};
				groupingInfos[level].collapsed = collapse;
				groupingInfos[level].expandedGroups = [];
			}

			if (getItems(false).length > 0) {
				trigger(self.onGroupingStateChanged, {groupkey: '', userTriggered: true });
			}
			refresh();

			function extractExpandedGroups(group, level) {
				if(group.collapsed === 0) {
					groupingInfos[level].expandedGroups.push(group.groupingKey);
				}
				/* if(group.groups && group.groups.length > 0) {
					extractExpandedGroups(group.groups, level ++);
				} */
			}

			groups.forEach(function(group) {
				extractExpandedGroups(group, 0);
			});
		}

		/**
		 * @param level {Number} Optional level to collapse.  If not specified, applies to all levels.
		 */
		function collapseAllGroups(level) {
			expandCollapseAllGroups(level, true);
		}

		/**
		 * @param level {Number} Optional level to expand.  If not specified, applies to all levels.
		 */
		function expandAllGroups(level) {
			expandCollapseAllGroups(level, false);
		}

		function expandCollapseGroup(level, groupingKey, collapse, userTriggered) {
			toggledGroupsByLevel[level][groupingKey] = groupingInfos[level].collapsed ^ collapse;
			if(groupingInfos[level].expandedGroups){
				var index = groupingInfos[level].expandedGroups.indexOf(groupingKey);
				if (index > -1 && collapse)
				{
					groupingInfos[level].expandedGroups.splice(index, 1);
				}
				else if(!collapse){
					groupingInfos[level].expandedGroups.push(groupingKey);
				}
			}
			else{
				groupingInfos[level].expandedGroups = [];
				groupingInfos[level].expandedGroups.push(groupingKey);
			}

			if (getItems(false).length > 0) {
				trigger(self.onGroupingStateChanged, {groupkey: groupingKey, collapse: collapse, userTriggered: userTriggered });
			}
			_groupingStateChanged = true;
			refresh();
		}

		/**
		 * @param argv Either a Slick.Group's "groupingKey" property, or a
		 *     variable argument list of grouping values denoting a unique path to the row.  For
		 *     example, calling collapseGroup('high', '10%') will collapse the '10%' subgroup of
		 *     the 'high' setGrouping.
		 */
		function collapseGroup(argv, userTriggered = false) { // jshint ignore:line
			var args = Array.prototype.slice.call(arguments);
			var arg0 = args[0];
			expandCollapseGroup(arg0.level, arg0.groupingKey, true, userTriggered);
		}

		/**
		 * @param argv Either a Slick.Group's "groupingKey" property, or a
		 *     variable argument list of grouping values denoting a unique path to the row.  For
		 *     example, calling expandGroup('high', '10%') will expand the '10%' subgroup of
		 *     the 'high' setGrouping.
		 */
		function expandGroup(argv, userTriggered = false) { // jshint ignore:line
			var args = Array.prototype.slice.call(arguments);
			var arg0 = args[0];
			expandCollapseGroup(arg0.level, arg0.groupingKey, false, userTriggered);
		}

		function getGroups() {
			return groups;
		}

		function flattenGroupedRows(groups, level) {
			level = level || 0;
			var gi = groupingInfos[level];
			var groupedRows = [], rows, gl = 0, g;
			for (var i = 0, l = groups.length; i < l; i++) {
				g = groups[i];
				groupedRows[gl++] = g;

				if (!g.collapsed) {
					rows = g.groups ? flattenGroupedRows(g.groups, level + 1) : g.rows;
					for (var j = 0, jj = rows.length; j < jj; j++) {
						groupedRows[gl++] = rows[j];
					}
				}

				if (g.totals && gi.displayTotalsRow && (!g.collapsed || gi.aggregateCollapsed)) {
					groupedRows[gl++] = g.totals;
				}
			}
			return groupedRows;
		}

		function getFunctionInfo(fn) {
			var fnStr = fn.toString();
			var usingEs5 = fnStr.indexOf('function') >= 0; // with ES6, the word function is not present
			var fnRegex = usingEs5 ? /^function[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/ : /^[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/;
			var matches = fn.toString().match(fnRegex);
			return {
				params: matches[1].split(','),
				body: matches[2]
			};
		}

		function compileAccumulatorLoop(aggregator) {
			if (aggregator.accumulate) {
				var accumulatorInfo = getFunctionInfo(aggregator.accumulate);
				var fn = new Function(
					'_items',
					'for (var ' + accumulatorInfo.params[0] + ', _i=0, _il=_items.length; _i<_il; _i++) {' +
					accumulatorInfo.params[0] + ' = _items[_i]; ' +
					accumulatorInfo.body +
					'}'
				);
				var fnName = 'compiledAccumulatorLoop';
				fn.displayName = fnName;
				fn.name = setFunctionName(fn, fnName);
				return fn;
			} else {
				return function noAccumulator() { };
			}
		}

		/**
		 * In ES5 we could set the function name on the fly but in ES6 this is forbidden and we need to set it through differently
		 * We can use Object.defineProperty and set it the property to writable, see MDN for reference
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
		 * @param {string} fn
		 * @param {string} fnName
		 */
		function setFunctionName(fn, fnName) {
			try {
				Object.defineProperty(fn, 'name', {
					writable: true,
					value: fnName
				});
			} catch (err) {
				fn.name = fnName;
			}
		}

		function compileFilter() {
			var filterInfo = getFunctionInfo(filter);

			var filterPath1 = '{ continue _coreloop; }$1';
			var filterPath2 = '{ _retval[_idx++] = $item$; continue _coreloop; }$1';
			// make some allowances for minification - there's only so far we can go with RegEx
			var filterBody = filterInfo.body
				.replace(/return false\s*([;}]|\}|$)/gi, filterPath1)
				.replace(/return!1([;}]|\}|$)/gi, filterPath1)
				.replace(/return true\s*([;}]|\}|$)/gi, filterPath2)
				.replace(/return!0([;}]|\}|$)/gi, filterPath2)
				.replace(/return ([^;}]+?)\s*([;}]|$)/gi,
					'{ if ($1) { _retval[_idx++] = $item$; }; continue _coreloop; }$2');

			// This preserves the function template code after JS compression,
			// so that replace() commands still work as expected.
			var tpl = [
				// "function(_items, _args) { ",
				'var _retval = [], _idx = 0; ',
				'var $item$, $args$ = _args; ',
				'_coreloop: ',
				'for (var _i = 0, _il = _items.length; _i < _il; _i++) { ',
				'$item$ = _items[_i]; ',
				'$filter$; ',
				'} ',
				'return _retval; '
				// "}"
			].join('');
			tpl = tpl.replace(/\$filter\$/gi, filterBody);
			tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]);
			tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);

			var fn = new Function('_items,_args', tpl);
			var fnName = 'compiledFilter';
			fn.displayName = fnName;
			fn.name = setFunctionName(fn, fnName);
			return fn;
		}

		function compileFilterWithCaching() {
			var filterInfo = getFunctionInfo(filter);

			var filterPath1 = '{ continue _coreloop; }$1';
			var filterPath2 = '{ _cache[_i] = true;_retval[_idx++] = $item$; continue _coreloop; }$1';
			// make some allowances for minification - there's only so far we can go with RegEx
			var filterBody = filterInfo.body
				.replace(/return false\s*([;}]|\}|$)/gi, filterPath1)
				.replace(/return!1([;}]|\}|$)/gi, filterPath1)
				.replace(/return true\s*([;}]|\}|$)/gi, filterPath2)
				.replace(/return!0([;}]|\}|$)/gi, filterPath2)
				.replace(/return ([^;}]+?)\s*([;}]|$)/gi,
					'{ if ((_cache[_i] = $1)) { _retval[_idx++] = $item$; }; continue _coreloop; }$2');

			// This preserves the function template code after JS compression,
			// so that replace() commands still work as expected.
			var tpl = [
				// "function(_items, _args, _cache) { ",
				'var _retval = [], _idx = 0; ',
				'var $item$, $args$ = _args; ',
				'_coreloop: ',
				'for (var _i = 0, _il = _items.length; _i < _il; _i++) { ',
				'$item$ = _items[_i]; ',
				'if (_cache[_i]) { ',
				'_retval[_idx++] = $item$; ',
				'continue _coreloop; ',
				'} ',
				'$filter$; ',
				'} ',
				'return _retval; '
				// "}"
			].join('');
			tpl = tpl.replace(/\$filter\$/gi, filterBody);
			tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]);
			tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);

			var fn = new Function('_items,_args,_cache', tpl);
			var fnName = 'compiledFilterWithCaching';
			fn.displayName = fnName;
			fn.name = setFunctionName(fn, fnName);
			return fn;
		}

		function recurring(list, item, origList, index) {
			if(!list.find(x => x.Id === item[options.parentProp])) {
				let parent = origList.find(x => x.Id === item[options.parentProp]);
				if (parent) {
					list.splice(index, 0, parent);
					return parent;
				}
			}
			return null;
		}

		function uncompiledFilter(items, args) {
			var retval = [],
				idx = 0;

			if (args.columnFilters) {
				args.columnFilters = _.reduce(args.columnFilters, function (result, value) {
					if (value.filterString.length) {
						result.push(value);
					}

					return result;
				}, []);
				args.promises = [];
			}

			for (var i = 0, ii = items.length; i < ii; i++) {
				if (filter(items[i], args, lookupCache)) {
					retval[idx++] = items[i];
				}
			}

			if(options.tree) {
				let item = null;
				let newRet = [];
				idx = 0;
				for (var count = 0; count < retval.length; count++ ) {
					item = retval[count];
					newRet[idx] = item;
					while (item && item[options.parentProp]) {
						item = recurring(newRet, item, items, idx);
					}
					idx = newRet.length;
				}
				retval = newRet;
			}

			if (args.promises && args.promises.length) {
				Promise.all(args.promises)
					.then(function (result) {
						result.filter((e, i) => result.findIndex(a => a.id === e.id) === i).forEach(function (item, index) {
							if(!lookupCache[item.columnid]){
								lookupCache[item.columnid] = [];
							}
							lookupCache[item.columnid].push(item);
						});
						refresh();
					});
			}
			return _.uniqBy(retval, function (e) {
				return e[idProperty];
			});
		}

		function uncompiledColumnFilter(items, args, lookupCache) {
			var retval = [],
				idx = 0;

			if (args.columnFilters) {
				args.columnFilters = _.reduce(args.columnFilters, function (result, value) {
					if (value.filterString.length) {
						result.push(value);
					}

					return result;
				}, []);
				args.promises = [];
			}

			for (var i = 0, ii = items.length; i < ii; i++) {
				if (columnFilter(items[i], args, lookupCache)) {
					retval[idx++] = items[i];
				}
			}

			if (args.promises && args.promises.length) {
				Promise.all(args.promises)
					.then(function (result) {
						result.filter((e, i) => result.findIndex(a => a.id === e.id) === i).forEach(function (item, index) {
							if(!lookupCache[item.columnid]){
								lookupCache[item.columnid] = [];
							}
							lookupCache[item.columnid].push(item);
						});
						refresh();
					});
			}
			return _.uniqBy(retval, function (e) {
				return e[idProperty];
			});
		}

		function getFilteredAndPagedItems(items, tree) {
			var batchFilter = null;

			if (filter && filterArgs.searchString && filterArgs.searchString.length) {
				batchFilter = options.inlineFilters ? compiledFilter : uncompiledFilter;

				if (_filterHistory[filterArgs.searchString] && !tree) {
					filteredItems = _filterHistory[filterArgs.searchString];
				} else if (filterArgs.searchString && !_filterHistory[filterArgs.searchString] && !tree) {
					if (_previousString.length < filterArgs.searchString.length && filteredItems.length) {
						filteredItems = batchFilter(filteredItems, filterArgs);
					} else {
						filteredItems = batchFilter(items, filterArgs);
					}
					_filterHistory[filterArgs.searchString] = filteredItems;
				} else {
					items = flattenNodes(items, 0, true);
					filteredItems = batchFilter(items, filterArgs);

					let collapsedArray = filteredItems.filter(function(x) {
						return x.nodeInfo.collapsed;
					}).map(function (x){
						return x[idProperty];
					});
					for (let i = 0; i < filteredItems.length; i++) {
						if (collapsedArray.includes(filteredItems[i][options.parentProp])) {
							collapsedArray.push(filteredItems[i][idProperty]);
							filteredItems.splice(i, 1);
							i--;
						}
					}
				}
			} else if ((columnFilter && filterArgs.columnFilters && filterArgs.columnFilters.length) || (filterArgs && filterArgs.customFilter)) {
				batchFilter = uncompiledColumnFilter;
				items = tree ? flattenNodes(items) : items;
				filteredItems = batchFilter(items, filterArgs, lookupCache);
			} else {
				// special case:  if not filtering and not paging, the resulting
				// rows collection needs to be a copy so that changes due to sort
				// can be caught
				items = tree ? flattenNodes(items) : items;
				filteredItems = pagesize ? items : items.concat();
			}

			// get the current page
			var paged;

			if (pagesize) {
				if (filteredItems.length < pagenum * pagesize) {
					pagenum = Math.floor(filteredItems.length / pagesize);
				}
				paged = filteredItems.slice(pagesize * pagenum, pagesize * pagenum + pagesize);
			} else {
				paged = filteredItems;
			}

			_previousString = filterArgs && filterArgs.searchString ? filterArgs.searchString : '';

			return {
				totalRows: filteredItems.length,
				rows: paged
			};
		}

		function getRowDiffs(rows, newRows) {
			var item, r, eitherIsNonData, diff = [];
			var from = 0, to = newRows.length - 1;
			var i, rl;

			if (options.tree) {
				for (i = 0; i < newRows.length; i++) {
					diff[i] = i;
				}
			} else {
				if (refreshHints && refreshHints.ignoreDiffsBefore) {
					from = Math.max(0,
						Math.min(newRows.length, refreshHints.ignoreDiffsBefore));
				}

				if (refreshHints && refreshHints.ignoreDiffsAfter) {
					to = Math.min(newRows.length - 1,
						Math.max(0, refreshHints.ignoreDiffsAfter));
				}

				for (i = from, rl = rows.length; i <= to; i++) {
					if (i >= rl) {
						diff[diff.length] = i;
					} else {
						item = newRows[i];
						r = rows[i];

						if ((groupingInfos.length && (eitherIsNonData = (item.__nonDataRow) || (r.__nonDataRow)) &&
								item.__group !== r.__group || item.__group && !item.equals(r)) ||
							(eitherIsNonData &&
								// no good way to compare totals since they are arbitrary DTOs
								// deep object comparison is pretty expensive
								// always considering them 'dirty' seems easier for the time being
								(item.__groupTotals || r.__groupTotals)) ||
							item[idProperty] !== r[idProperty] ||
							(updated && updated[item[idProperty]])) {
							diff[diff.length] = i;
						}
					}
				}
			}
			return diff;
		}

		function recalc(_items) {
			rowsById = null;

			if (refreshHints.isFilterNarrowing !== prevRefreshHints.isFilterNarrowing ||
				refreshHints.isFilterExpanding !== prevRefreshHints.isFilterExpanding) {
				filterCache = [];
			}
			let filteredItems = getFilteredAndPagedItems(_items, options.tree);
			totalRows = filteredItems.totalRows;
			let newRows = filteredItems.rows;

			if (groupingInfos.length) {
				if(!_groupingStateChanged) {
					groups = [];
				}

				_groupingStateChanged = false;
				if(!groups.length) {
					let selectedRowIndex = slickGrid.getSelectedRows();
					let selectedItems = [];
					_.forEach(selectedRowIndex, function(index) {
						if(index < _items.length) {
							let selectedItem = _items[index];
							selectedItems.push(selectedItem);
						}
					});
					groups = extractGroups(newRows, null, selectedItems);
					if(selectedItems.length > 0) {
						trigger(self.onGroupItemsChanged);
					}
				}
				else {
					groups = extractGroups(newRows, null, []);
				}

				if (groups.length) {
					// addTotals(groups);
					newRows = flattenGroupedRows(groups);
				}
			}

			var diff = getRowDiffs(rows, newRows);

			rows = newRows;

			return diff;
		}

		function refresh() {
			if (suspend) {
				return;
			}

			var countBefore = rows.length;
			var totalRowsBefore = totalRows;

			var diff = recalc(items); // pass as direct refs to avoid closure perf hit

			// if the current page is no longer valid, go to last page and recalc
			// we suffer a performance penalty here, but the main loop (recalc) remains highly optimized
			if (pagesize && totalRows < pagenum * pagesize) {
				pagenum = Math.max(0, Math.ceil(totalRows / pagesize) - 1);
				diff = recalc(items);
			}

			updated = null;
			prevRefreshHints = refreshHints;
			refreshHints = {};

			if (totalRowsBefore !== totalRows) {
				onPagingInfoChanged.notify(getPagingInfo(), null, self);
			}
			if (countBefore !== rows.length) {
				onRowCountChanged.notify({
					previous: countBefore,
					current: rows.length
				}, null, self);
			}
			if (diff.length > 0 || countBefore !== rows.length) {
				onRowsChanged.notify({
					rows: diff
				}, null, self);
				if(options.tree) {
					trigger(self.onTreeLevelChanged, {maxLevel: maxLevel});
				}
			}
		}

		function syncGridSelection(grid, preserveHidden) {
			var self = this; // jshint ignore:line
			var selectedRowIds = self.mapRowsToIds(grid.getSelectedRows());
			var inHandler;

			function update() {
				if (selectedRowIds.length > 0) {
					inHandler = true;
					var selectedRows = self.mapIdsToRows(selectedRowIds);
					if (!preserveHidden) {
						selectedRowIds = self.mapRowsToIds(selectedRows);
					}
					if(selectedRows.length > 0) {
						grid.setSelectedRows(selectedRows);
					}
					inHandler = false;
				}
			}

			grid.onSelectedRowsChanged.subscribe(function () {
				if (inHandler) {
					return;
				}

				selectedRowIds = self.mapRowsToIds(grid.getSelectedRows());
			});

			self.onRowsChanged.subscribe(update);
			self.onRowCountChanged.subscribe(update);
		}

		function syncGridCellCssStyles(grid, key) {
			var self = this; // jshint ignore:line
			var hashById;
			var inHandler;

			// since this method can be called after the cell styles have been set,
			// get the existing ones right away
			storeCellCssStyles(grid.getCellCssStyles(key));

			function storeCellCssStyles(hash) {
				hashById = {};
				_.forOwn(hash, function (row) {
					var id = rows[row][idProperty];
					hashById[id] = hash[row];
				});
			}

			function update() {
				if (hashById) {
					inHandler = true;
					ensureRowsByIdCache();
					var newHash = {};
					_.forOwn(hashById, function (id) {
						var row = rowsById[id];
						if (row !== undefined) {
							newHash[row] = hashById[id];
						}
					});
					grid.setCellCssStyles(key, newHash);
					inHandler = false;
				}
			}

			grid.onCellCssStylesChanged.subscribe(function (e, args) {
				if (inHandler) {
					return;
				}
				if (key !== args.key) {
					return;
				}
				if (args.hash) {
					storeCellCssStyles(args.hash);
				}
			});

			self.onRowsChanged.subscribe(update);
			self.onRowCountChanged.subscribe(update);
		}

		// ////////////////////////////////////////////////////////////////////////////////////////////
		// Tree Functions

		function prepareItems(nodes, parentNode) {
			var n;
			var level = 0;
			if (parentNode) {
				level = parentNode.nodeInfo ? parentNode.nodeInfo.level + 1 : 0;
				maxLevel = level > maxLevel ? level : maxLevel;
			}
			for (var i = 0; i < nodes.length; i++) {
				n = nodes[i];
				if (n.nodeInfo === undefined) {
					var nodeInfo = {
						level: level,
						collapsed: options.collapsed ? options.collapsed : false,
						lastElement: false,
						children: !_.isNil(n[options.childProp]) && n[options.childProp].length ? true : false
					};
					n.nodeInfo = nodeInfo;
				}
				if (!_.isNil(n[options.childProp]) && n[options.childProp].length > 0) {
					n.nodeInfo.lastElement = false;
					n.nodeInfo.children = true;
					prepareItems(n[options.childProp], n);
				} else {
					n.nodeInfo.lastElement = true;
					n.nodeInfo.children = false;

				}
			}
		}

		function flattenNodes(nodes, level, flattenAll = false) {
			level = level || 0;
			var vNodes = [], ncnt = 0, ns, n;
			for (var i = 0; i < nodes.length; i++) {
				n = nodes[i];
				if (!n) {
					console.error('An item in your data array is undefined or null, please check the data you pass to the grid.');
					console.warn(nodes);
					continue;
				}
				vNodes[ncnt++] = n;
				if (n.nodeInfo === undefined) {
					n.nodeInfo = {
						level: level,
						collapsed: false,
						lastElement: false,
						children: !_.isNil(n[options.childProp]) && n[options.childProp].length ? true : false
					};
				}

				if (!n.nodeInfo.collapsed || flattenAll) {
					maxLevel = level > maxLevel ? level : maxLevel;
					ns = !_.isNil(n[options.childProp]) ? flattenNodes(n[options.childProp], level + 1, flattenAll) : 0;
					for (var j = 0; j < ns.length; j++) {
						vNodes[ncnt++] = ns[j];
					}
				}
			}

			return vNodes;
		}

		function expandCollapseAllNodes(collapse, level) {
			for (var i = 0; i < items.length; i++) {
				expandCollapseAllSubNodes(items[i], collapse, level);
			}
			refresh();
			idxById = {};
			updateIdxById();
		}

		function expandAllNodes(level) {
			expandCollapseAllNodes(false, level);
		}

		function collapseAllNodes() {
			expandCollapseAllNodes(true);
		}

		function expandNextLevel(node) {
			var cnt = 0;
			if (node.nodeInfo.lastElement) {
				return false;
			}
			if (node.nodeInfo.collapsed) {
				return expandNode(node);
			}
			if (node.nodeInfo.children) {
				for (var i = 0; i < node[options.childProp].length; i++) {
					var child = node[options.childProp][i];
					if (expandNextLevel(child)) {
						cnt++;
					}
				}
				if (cnt === node[options.childProp].length) {
					return true;
				}
			}
		}

		var _level2Collapse = 0;

		function findLowestLevel(node) {
			if ((!node.nodeInfo.collapsed && !node.nodeInfo.lastElement) && (node.nodeInfo.level > _level2Collapse)) {
				_level2Collapse = node.nodeInfo.level;
			}
			if (!node[options.childProp]) {
				return;
			}
			for (var i = 0; i < node[options.childProp].length; i++) {
				var child = node[options.childProp][i];
				findLowestLevel(child);
			}
		}

		function collapseNextLevel(node, isStart) {
			var cnt = 0;
			if (node.nodeInfo.level === 0 || isStart) {
				_level2Collapse = 0;
				findLowestLevel(node);
			}
			if (node.nodeInfo.collapsed || node.nodeInfo.lastElement) {
				return false;
			}
			if (node.nodeInfo.children) {
				for (var i = 0; i < node[options.childProp].length; i++) {
					var child = node[options.childProp][i];
					if (!collapseNextLevel(child)) {
						cnt++;
					}
				}
				if (cnt === node[options.childProp].length && _level2Collapse === node.nodeInfo.level) {
					return collapseNode(node);
				}
			}
			return false;
		}

		function expandNode(node) {
			if (node.nodeInfo.collapsed) {
				toggleNode(node);
				return true;
			}
			return false;
		}

		function collapseNode(node) {
			if (!node.nodeInfo.collapsed) {
				toggleNode(node);
				return true;
			}
			return false;
		}

		function expandAllSubNodes(node) {
			if (node) {
				expandCollapseAllSubNodes(node, false);
				refresh();
				idxById = {};
				updateIdxById();
			}
		}

		function collapseAllSubNodes(node) {
			if (node) {
				expandCollapseAllSubNodes(node, true);
				refresh();
				idxById = {};
				updateIdxById();
			}
		}

		function toggleNode(node) {
			node.nodeInfo.collapsed = !node.nodeInfo.collapsed;
			refresh();
			idxById = {};
			updateIdxById();
		}

		function expandCollapseAllSubNodes(node, collapse, level) {
			if (level && node.nodeInfo.level >= level) {
				return false;
			}
			node.nodeInfo.collapsed = collapse;
			if (node[options.childProp]) {
				for (var i = 0; i < node[options.childProp].length; i++) {
					expandCollapseAllSubNodes(node[options.childProp][i], collapse, level);
				}
			}
		}

		function unique(array, propertyName) {
			return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
		}

		// noinspection FunctionWithMultipleReturnPointsJS FunctionWithMoreThanThreeNegationsJS FunctionWithMultipleLoopsJS FunctionTooLongJS OverlyComplexFunctionJS
		function extractGroups(rows, parentGroup, selectedItems) { // jshint ignore:line
			var group;
			var columns = slickGrid.getColumns();
			var val;
			var groups = [];
			var groupsByVal = {};
			var r;
			var level = parentGroup ? parentGroup.level + 1 : 0;
			var gi = groupingInfos[level];
			var c;
			var groupKey;
			var i, l;
			var promises = [];

			if (typeof val === 'object') {
				val = 0;
			}

			if (!rows || rows.length === 0) {
				return groups;
			}

			// collect promises first
			if (level === 0) {
				var groupColumns = _.map(groupingInfos, function (group) {
					return [group, _.find(columns, {id: group.columnId})];
				});

				promises = _.reduce(groupColumns, function (result, c) {
					let getter = c[0].getter ? c[0].getter : c[1].field;
					if(lookupCache && !lookupCache[c[0].columnId]) {
						let uniqueRows;
						if(!c[0].getterIsAFn) {
							uniqueRows = unique(rows, getter);
						}
						else {
							uniqueRows = rows;
						}

						return _.reduce(uniqueRows, function (result, r) {
							val = c[0].getterIsAFn ? c[0].getter(r) : c[1].formatter(i, 0, r[getter], c[1], r, true, null, {
								promise: true,
								grouping: true
							});

							if (val && typeof val === 'object' && val.$$state) {
								result.push(val);
							}

							return result;
						}, result);
					}
					return [];
				}, []);
			}

			// promise returned -> start again
			if (promises.length) {

				if (_.isUndefined(groupingInfos.refreshCount)) {
					groupingInfos.refreshCount = 0;
				}

				if (++groupingInfos.refreshCount <= 3) {
					Promise.all(promises)
						.then(function (result) {
							result.filter((e, i) => result.findIndex(a => a.id === e.id) === i).forEach(function (item, index) {
								if(!lookupCache[item.columnid]){
									lookupCache[item.columnid] = [];
								}
								lookupCache[item.columnid].push(item);
							});
							refresh();
						});
					return [];
				}
			}

			groupingInfos.refreshCount = 0;

			for (i = 0, l = gi.predefinedValues.length; i < l; i++) {
				val = gi.predefinedValues[i];
				if (!val) {
					val = '';
				} else {
					c = _.find(columns, {id: gi.columnId});
					val = c.formatter(i, 0, val, c, getItem(r));
				}

				groupKey = (parentGroup ? parentGroup.groupingKey + '.' : '') + c.formatter(i, 0, null, c, getItem(r), true, null, {grouping: true});
				group = groupsByVal[groupKey];

				if (group) {
					continue;
				}

				group = new Slick.Group();
				group.value = val;
				group.level = level;
				group.groupingKey = groupKey;
				group.title = gi.title;
				group.sumCellFormatter = options.groupItemMetadataProvider.sumCellFormatter;
				groups[groups.length] = group;
				groupsByVal[groupKey] = group;
			}

			for (i = 0, l = rows.length; i < l; i++) {
				r = rows[i];
				c = _.find(columns, {id: gi.columnId});
				let getter = gi.getter ? gi.getter : c.field;
				val = gi.getterIsAFn ? gi.getter(r) : c.formatter(i, 0, r[getter], c, r, true, null, { promise: true, grouping: true, groupKey: false });
				if(lookupCache && lookupCache[gi.columnId]){
					var cachedVal = _.find(lookupCache[gi.columnId], { 'id': r[getter]});
					if(cachedVal){
						val = cachedVal.val;
					}
				}

				let key = c.formatter(i, 0, r[getter], c, r, true, null, { grouping: true, groupKey: true });
				if(!key) {
					key = val;
				}
				groupKey = (parentGroup ? parentGroup.groupingKey + '.' : '') + key;

				if(!groupKey && val) {
					groupKey = val;
				}
				group = groupsByVal[groupKey];

				if (!group) {
					group = new Slick.Group();
					group.value = _.isNil(val) ? '' : val;
					group.level = level;
					group.groupingKey = groupKey;
					group.title = gi.title;
					group.sumCellFormatter = options.groupItemMetadataProvider.sumCellFormatter;
					groups[groups.length] = group;
					groupsByVal[groupKey] = group;
				}

				if(selectedItems.includes(r)) {
					group.selectedRows.push(r);
				}
				group.rows[group.count++] = r;
			}

			if (level < groupingInfos.length - 1) {
				for (i = 0; i < groups.length; i++) {
					group = groups[i];
					group.groups = extractGroups(group.rows, group, selectedItems);
				}
			}

			if (groups.length) {
				addTotals(groups, level);
			}

			groups.sort(function (a, b) {
				var lt = groupingInfos[level].ascending ? -1 : 1;
				var gt = groupingInfos[level].ascending ? 1 : -1;

				a = a.groupingKey.toUpperCase();
				b = b.groupingKey.toUpperCase();

				return (a < b) ? lt : (a > b) ? gt : 0;
			});

			return groups;
		}

		// noinspection FunctionWithMultipleLoopsJS
		function calculateTotals(totals) {
			var group = totals.group;
			var gi = groupingInfos[group.level];
			var isLeafLevel = (group.level === groupingInfos.length);
			var agg, idx = gi.aggregators.length;

			if (!isLeafLevel && gi.aggregateChildGroups) {
				// make sure all the subgroups are calculated
				var i = group.groups.length;
				while (i--) {
					if (!group.groups[i].initialized) {
						calculateTotals(group.groups[i]);
					}
				}
			}

			while (idx--) {
				agg = gi.aggregators[idx];
				agg.init();
				if (!isLeafLevel && gi.aggregateChildGroups) {
					gi.compiledAccumulators[idx].call(agg, group.groups);
				} else {
					gi.compiledAccumulators[idx].call(agg, group.rows);
				}
				agg.storeResult(totals);
			}
			totals.initialized = true;
		}

		function addGroupTotals(group) {
			var gi = groupingInfos[group.level];
			var totals = new Slick.GroupTotals();
			totals.group = group;
			group.totals = totals;
			if (!gi.lazyTotalsCalculation) {
				calculateTotals(totals);
			}
		}

		function addTotals(groups, level) {
			level = level || 0;
			var gi = groupingInfos[level];
			var groupCollapsed = gi.collapsed;
			var toggledGroups = toggledGroupsByLevel[level];
			var idx = groups.length, g;
			while (idx--) {
				g = groups[idx];
				if (g.collapsed && !gi.aggregateCollapsed) {
					continue;
				}
				// Do a depth-first aggregation so that parent group aggregators can access subgroup totals.
				if (g.groups) {
					addTotals(g.groups, level + 1);
				}

				if (gi.aggregators.length && (
					gi.aggregateEmpty || g.rows.length || (g.groups && g.groups.length))) {
					addGroupTotals(g);
				}

				g.collapsed = groupCollapsed ^ toggledGroups[g.groupingKey];
				g.printTitle = gi.title + ': ' + g.value + ' (' + g.count + ')';
				g.title = gi.formatter ? gi.formatter(g, gi) : g.value + ' (' + g.count + ')';
			}
		}

		// ////////////////////////////////////////////////////////////////////////////////////////////
		// Grouping Functions

		function addColumnGroupBy(column) {
			columnsGroupBy.push(Object.assign({}, column));
			updateGroupBy();
		}

		function addGroupByRemoveClickHandler(id, container, column, entry, bindEle) {
			var text = entry;
			/* $("#" + slickGrid.getUID() + id + "_entry") */
			bindEle.bind('click', function () {
				$(this).unbind('click');
				removeGroupBy(id, column, text);
				if (!columnsGroupBy.length) {
					$(container).find('.slick-placeholder').show();
				}
			});
		}

		function addGroupHideColumnClickHandler(id, container, column, entry, bindEle) {
			bindEle.bind('click', function (e) {
				e.stopImmediatePropagation();
				var groupedColumn = slickGrid.getColumns().find(function(col) {
					return col.id === column.id;
				});
			});
		}

		function addSortGroupingClickHandler(id, bindEle) {
			/* $("#" + slickGrid.getUID() + id + "_entry") */
			bindEle.bind('click', function () {
				var groupLevel = _.findIndex(groupingInfos, {columnId: id});
				groupingInfos[groupLevel].ascending = !groupingInfos[groupLevel].ascending;
				columnsGroupBy[groupLevel].grouping.ascending = !columnsGroupBy[groupLevel].grouping.ascending;
				$(bindEle).find('.group-sort').addClass(columnsGroupBy[groupLevel].grouping.ascending ? 'slick-sort-indicator-asc' : 'slick-sort-indicator-desc');
				$(bindEle).find('.group-sort').removeClass(columnsGroupBy[groupLevel].grouping.ascending ? 'slick-sort-indicator-desc' : 'slick-sort-indicator-asc');
				trigger(self.onGroupingStateChanged, {sortDirectionChange: true, userTriggered: true });
				refresh();
			});
		}

		function grouped() {
			return groupingInfos.length > 0;
		}

		function trigger(evt, args, e) {
			e = e || new Slick.EventData();
			args = args || {};
			args.grid = self;
			return evt.notify(args, e, self);
		}

		function sortRecursive(comparer, ascending, items, childProp) {
			if (ascending === false) {
				items.reverse();
			}
			items.sort(comparer);
			if (ascending === false) {
				items.reverse();
			}
			for (var i = 0; i < items.length; i++) {
				if (items[i][childProp] && items[i][childProp].length > 0) {
					sortRecursive(comparer, ascending, items[i][childProp], childProp);
				}
			}
		}

		function sortTree(comparer, ascending, childProp) {
			sortRecursive(comparer, ascending, items, childProp);
			idxById = {};
			updateIdxById();
			refresh();
		}

		// ////////////////////////////////////////////////////////////////////////////////////////////
		// Public API
		$.extend(this, {
			// methods
			beginUpdate: beginUpdate,
			endUpdate: endUpdate,
			setPagingOptions: setPagingOptions,
			getPagingInfo: getPagingInfo,
			getItems: getItems,
			getRows: getRows,
			setItems: setItems,
			setFilter: setFilter,
			setColumnFilter: setColumnFilter,
			setFilterExtension: setFilterExtension,
			sort: sort,
			fastSort: fastSort,
			reSort: reSort,
			setGrouping: setGrouping,
			getGrouping: getGrouping,
			groupBy: groupBy,
			setAggregators: setAggregators,
			collapseAllGroups: collapseAllGroups,
			expandAllGroups: expandAllGroups,
			collapseGroup: collapseGroup,
			expandGroup: expandGroup,
			getGroups: getGroups,
			getIdxById: getIdxById,
			getRowById: getRowById,
			getItemById: getItemById,
			getItemByIdx: getItemByIdx,
			mapRowsToIds: mapRowsToIds,
			mapIdsToRows: mapIdsToRows,
			setRefreshHints: setRefreshHints,
			setFilterArgs: setFilterArgs,
			refresh: refresh,
			updateItem: updateItem,
			insertItem: insertItem,
			addItem: addItem,
			deleteItem: deleteItem,
			syncGridSelection: syncGridSelection,
			syncGridCellCssStyles: syncGridCellCssStyles,
			getFilteredAndPagedItems: getFilteredAndPagedItems,

			// data provider methods
			getLength: getLength,
			getItem: getItem,
			getTreeLength: getTreeLength,
			getItemMetadata: getItemMetadata,
			setItemMetaData: setItemMetaData,

			// events
			onRowCountChanged: onRowCountChanged,
			onRowsChanged: onRowsChanged,
			onPagingInfoChanged: onPagingInfoChanged,
			onGroupingStateChanged: new Slick.Event(), // This event is triggered when group node is expanded or collapsed
			onBeforeGroupingChanged: new Slick.Event(),
			onGroupingChanged: new Slick.Event(),
			onGroupItemsChanged: new Slick.Event(),
			onFilterStart: new Slick.Event(),
			onFilterEnd: new Slick.Event(),
			onTreeLevelChanged: new Slick.Event(),

			// expand/collapse
			expandNode: expandNode,
			collapseNode: collapseNode,
			toggleNode: toggleNode,
			collapseAllNodes: collapseAllNodes,
			expandAllNodes: expandAllNodes,
			collapseAllSubNodes: collapseAllSubNodes,
			expandAllSubNodes: expandAllSubNodes,
			expandNextLevel: expandNextLevel,
			collapseNextLevel: collapseNextLevel,
			setGrid: setGrid,
			setColumns: setColumns,
			sortTree: sortTree,
			setInitialGrouping: setInitialGrouping,
			grouped: grouped,
			getFilteredItems: getFilteredItems
		});
	}

	function AvgAggregator(field) {
		this.field_ = field;

		this.init = function () {
			this.count_ = 0;
			this.nonNullCount_ = 0;
			this.sum_ = 0;
		};

		this.accumulate = function (item) {
			var val = item[this.field_];
			this.count_++;
			if (val != null && val !== '' && !isNaN(val)) {
				this.nonNullCount_++;
				this.sum_ += parseFloat(val);
			}
		};

		this.storeResult = function (groupTotals) {
			if (!groupTotals.avg) {
				groupTotals.avg = {};
			}
			if (this.nonNullCount_ !== 0) {
				groupTotals.avg[this.field_] = this.sum_ / this.nonNullCount_;
			}
		};

		this.getResult = function getResult() {
			return this.sum_ / this.nonNullCount_;
		};
	}

	function MinAggregator(field) {
		this.field_ = field;

		this.init = function () {
			this.min_ = 0;
		};

		this.accumulate = function (item) {
			var val = item[this.field_];
			if (val != null && val !== '' && !isNaN(val)) {
				if (this.min_ == null || val < this.min_) {
					this.min_ = val;
				}
			}
		};

		this.storeResult = function (groupTotals) {
			if (!groupTotals.min) {
				groupTotals.min = {};
			}
			groupTotals.min[this.field_] = this.min_;
		};

		this.getResult = function () {
			return this.min_;
		};
	}

	function MaxAggregator(field) {
		this.field_ = field;

		this.init = function () {
			this.max_ = 0;
		};

		this.accumulate = function (item) {
			var val = item[this.field_];
			if (val != null && val !== '' && !isNaN(val)) {
				if (this.max_ == null || val > this.max_) {
					this.max_ = val;
				}
			}
		};

		this.storeResult = function (groupTotals) {
			if (!groupTotals.max) {
				groupTotals.max = {};
			}
			groupTotals.max[this.field_] = this.max_;
		};

		this.getResult = function () {
			return this.max_;
		};
	}

	function SumAggregator(field, decimalPlaces) {
		this.field_ = field;
		this.reset = false;
		this.decimalPlaces = decimalPlaces ? decimalPlaces : 0;

		this.init = function () {
			this.sum_ = 0;
		};

		this.accumulate = function (item) {
			var val = item[this.field_];
			if (val !== null && val !== '' && !isNaN(val)) {
				this.sum_ += val;// parseFloat(val);
			}
		};

		this.storeResult = function storeResult(groupTotals) {
			if (!groupTotals.sum) {
				groupTotals.sum = {};
			}
			if (!groupTotals.precision) {
				groupTotals.precision = {};
			}
			groupTotals.sum[this.field_] = this.sum_;
			groupTotals.precision[this.field_] = this.decimalPlaces;
		};

		this.getResult = function () {
			return this.sum_;
		};
	}

	$.extend(true, window, {
		Slick: {
			Data: {
				DataView: DataView,
				Aggregators: {
					Avg: AvgAggregator,
					Min: MinAggregator,
					Max: MaxAggregator,
					Sum: SumAggregator
				}
			}
		}
	});
})(jQuery);
