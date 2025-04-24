(function ($) {
	'use strict';

	$.extend(true, window, {
		Slick: {
			ColumnGroup: ColumnGroup
		}
	});

	function ColumnGroup() {
		var grid;
		var $container;
		var $groupHeaderColumns;
		var self = this;
		var isColumnGroupEnabled = false;
		var handler = new Slick.EventHandler();

		function init(_grid) {
			grid = _grid;
			$container = $(grid.getContainerNode());
			handler.subscribe(grid.onColumnsResized, onColumnsResized);
			handler.subscribe(grid.onColumnsReordered, onColumnsReordered);
		}

		function isColumnGroupingEnabled() {
			return isColumnGroupEnabled;
		}

		function enableColumnGrouping() {
			if (isColumnGroupEnabled) {
				return;
			}
			isColumnGroupEnabled = true;
			setGroupedColumns();
		}

		function removeColumnGrouping() {
			if (!isColumnGroupEnabled) {
				return;
			}
			isColumnGroupEnabled = false;
			$groupHeaderColumns[0].remove();
			$groupHeaderColumns[1].remove();
			grid.resizeCanvas();
		}

		function setGroupedColumns() {
			$groupHeaderColumns = [
				$('<div class="slick-group-header-columns slick-group-header-columns-left ui-state-default slick-header-columns"></div>'),
				$('<div class="slick-group-header-columns slick-group-header-columns-right ui-state-default slick-header-columns"></div>')
			];

			var headerColumns = $container.find('.slick-header-columns-left');

			$groupHeaderColumns[0].css({
				width: headerColumns.width() + 'px',
				left: headerColumns.position().left + 'px'
			});

			headerColumns = $container.find('.slick-header-columns-right');

			$groupHeaderColumns[1].css({
				width: headerColumns.width() + 'px',
				left: headerColumns.position().left + headerColumns.parent().get(0).scrollLeft + 'px'
			});

			var columns = grid.getColumns();
			var columnGroups = getGroupedColumns(columns);

			setGroupIndex(columns);
			setColumnIndex(columns);

			$groupHeaderColumns[0].append(getGroupedColumnsTemplate(columnGroups, true));
			$container.find('.slick-header-left').prepend($groupHeaderColumns[0]);

			$groupHeaderColumns[1].append(getGroupedColumnsTemplate(columnGroups, false));
			$container.find('.slick-header-right').prepend($groupHeaderColumns[1]);

			var options = grid.getOptions();
			if(options && options.enableColumnReorder){
				setupGroupColumnReorder();
			}

			columns.sort(groupCompare);
			grid.setColumns(columns);
			grid.resizeCanvas();
		}

		function getGroupedColumnsTemplate(columnGroups, left) {
			var slickColumns = '';
			var borderWidth = 2;

			$.each(columnGroups, function (name, group) {
				if (left && name.startsWith('+') || !left && name.startsWith('-')) {
					var width = group.reduce(function (width, column) {
						return width + column.width;
					}, 0);
					var displayName = /^.-$/.test(name) ? ' ' : name.substring(1);
					var viewportCss = 'slick-header-column-' + (left ? 'left' : 'right');

					slickColumns += '<div class="ui-state-default slick-header-column ' + viewportCss + '" data-group-name="' + name + '"style="width:' + (width - borderWidth) + 'px"> <span class="slick-column-name">' + displayName + '</span></div>';
					borderWidth = 1;
				}
			});
			return slickColumns;
		}

		function setColumnIndex(columns) {
			columns.forEach(function (column, index) {
				column._index = index;
			});
		}

		function setGroupIndex(columns) {
			var groupNames = Object.keys(getGroupedColumns(columns));

			columns.forEach(function (column) {
				column._groupIndex = groupNames.indexOf(column.groupName);
				column._groupIndex = column._groupIndex === -1 ? groupNames.length : column._groupIndex;
			});
		}

		function setupGroupColumnReorder(left) {
			$groupHeaderColumns[left ? 0 : 1].sortable({
				containment: 'parent',
				distance: 3,
				axis: 'x',
				cursor: 'default',
				tolerance: 'intersection',
				helper: 'clone',
				update: onColumnsReordered
			});
		}

		function onColumnsResized() {
			var columns = grid.getColumns();
			var borderWidth = 2;

			if (!isColumnGroupEnabled) {
				self.onColumnsResized.notify(columns);
				return;
			}

			$.each(getGroupedColumns(columns), function (name, group) {
				var width = group.reduce(function (width, column) {
					return width + column.width;
				}, 0);
				$groupHeaderColumns[name[0] === '+' ? 0 : 1].find('[data-group-name="' + name + '"]').css('width', width - borderWidth);
				borderWidth = 1;
			});

			self.onColumnsResized.notify(columns);
		}

		function onColumnsReordered() {
			var columns = grid.getColumns();
			setColumnIndex(columns);

			if (!isColumnGroupEnabled) {
				self.onColumnsReordered.notify(columns);
				return;
			}

			var $columns = $('.slick-group-header-columns .slick-header-column');
			var columnGroups = getGroupedColumns(columns);
			$columns.each(function (index, column) {
				var groupedColumns = columnGroups[$(column).data('group-name')];
				groupedColumns.forEach(function (groupedColumn) {
					groupedColumn._groupIndex = index;
				});
			});
			columns.sort(groupCompare);
			grid.setColumns(columns);
			setColumnIndex(columns);
			self.onColumnsReordered.notify(columns);
		}

		function groupCompare(c1, c2) {
			return (c1._groupIndex - c2._groupIndex) || (c1._index - c2._index);
		}

		function getGroupedColumns(columns) {
			var groupedColumns = {};

			columns.forEach(function (column) {
				var groupName = (column.pinned ? '+' : '-') + (column.groupName || '-');

				groupedColumns[groupName] = groupedColumns[groupName] || [];
				groupedColumns[groupName].push(column);
			});

			return groupedColumns;
		}

		function destroy() {
			handler.unsubscribeAll();
		}

		this.onColumnsReordered = new Slick.Event();
		this.onColumnsResized = new Slick.Event();

		return {
			name: 'ColumnGroup',
			init: init,
			destroy: destroy,
			onColumnsReordered: this.onColumnsReordered,
			onColumnsResized: this.onColumnsResized,
			enableColumnGrouping: enableColumnGrouping,
			removeColumnGrouping: removeColumnGrouping,
			isColumnGroupingEnabled: isColumnGroupingEnabled
		};
	}
}(jQuery));