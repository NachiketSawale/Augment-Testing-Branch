(function ($) {
	// register namespace
	$.extend(true, window, {
		'Slick': {
			'RowSelectionModel': RowSelectionModel
		}
	});

	function RowSelectionModel(options) {
		var _grid;
		var _ranges = [];
		var _self = this;
		var _handler = new Slick.EventHandler();
		var _inHandler;
		var _options;
		var _defaults = {
			selectActiveRow: true
		};

		function init(grid) {
			_options = $.extend(true, {}, _defaults, options);
			_grid = grid;
			_handler.subscribe(_grid.onActiveCellChanged,
				wrapHandler(handleActiveCellChange));
			_handler.subscribe(_grid.onKeyDown,
				wrapHandler(handleKeyDown));
			_handler.subscribe(_grid.onClick,
				wrapHandler(handleClick));
		}

		function destroy() {
			_handler.unsubscribeAll();
		}

		function wrapHandler(handler) {
			return function () {
				if (!_inHandler) {
					_inHandler = true;
					handler.apply(this, arguments);
					_inHandler = false;
				}
			};
		}

		function rangesToRows(ranges) {
			var rows = [];
			for (var i = 0; i < ranges.length; i++) {
				for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
					rows.push(j);
				}
			}
			return rows;
		}

		function rowsToRanges(rows) {
			var ranges = [];
			var lastCell = _grid.getColumns().length - 1;
			for (var i = 0; i < rows.length; i++) {
				ranges.push(new Slick.Range(rows[i], 0, rows[i], lastCell));
			}
			return ranges;
		}

		function getRowsRange(from, to) {
			var i, rows = [];
			for (i = from; i <= to; i++) {
				rows.push(i);
			}
			for (i = to; i < from; i++) {
				rows.push(i);
			}
			return rows;
		}

		function getSelectedRows() {
			return rangesToRows(_ranges);
		}

		function setSelectedRows(rows, surpressNotification) {
			setSelectedRanges(rowsToRanges(rows), surpressNotification);
		}

		function setSelectedRanges(ranges, surpressNotification) {
			_ranges = ranges;
			var args = {
				surpressNotification: surpressNotification,
				ranges: _ranges
			}
			_self.onSelectedRangesChanged.notify(args);
		}

		function getSelectedRanges() {
			return _ranges;
		}

		function handleActiveCellChange(e, data) {
			if (_options.selectActiveRow && data.row != null) {
				setSelectedRanges([new Slick.Range(data.row, 0, data.row, _grid.getColumns().length - 1)]);
			}
			var args = {
				row: data.row,
				cell: data.cell
			}
			_self.onActiveCellChanged.notify(args);
		}

		function handleKeyDown(e) {
			var activeRow = _grid.getActiveCell();
			if (activeRow && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && (e.which === 38 || e.which === 40)) {
				var selectedRows = getSelectedRows();
				selectedRows.sort(function (x, y) {
					return x - y;
				});

				if (!selectedRows.length) {
					selectedRows = [activeRow.row];
				}

				var top = selectedRows[0];
				var bottom = selectedRows[selectedRows.length - 1];
				var active;

				if (e.which === 40) {
					active = activeRow.row < bottom || top === bottom ? ++bottom : ++top;
				} else {
					active = activeRow.row < bottom ? --bottom : --top;
				}

				if (active >= 0 && active < _grid.getDataLength()) {
					_grid.scrollRowIntoView(active);
					_ranges = rowsToRanges(getRowsRange(top, bottom));
					setSelectedRanges(_ranges);
				}

				e.preventDefault();
				e.stopPropagation();
			}
		}

		function handleClick(e) {
			var cell = _grid.getCellFromEvent(e);
			if (!cell || !_grid.canCellBeActive(cell.row, cell.cell)) {
				return false;
			}

			if (!_grid.getOptions().multiSelect || e.target.type === 'radio' || (
				!e.ctrlKey && !e.shiftKey && !e.metaKey)) {
				return false;
			}

			var selection = rangesToRows(_ranges);
			var idx = $.inArray(cell.row, selection);

			if (idx === -1 && (e.ctrlKey || e.metaKey)) {
				selection.push(cell.row);
				_grid.setActiveCell(cell.row, cell.cell);
			} else if (idx !== -1 && (e.ctrlKey || e.metaKey)) {
				selection = $.grep(selection, function (o, i) {
					return (o !== cell.row);
				});
				if(selection.includes(cell.row)) {
					_grid.setActiveCell(cell.row, cell.cell);
				}
				else {
					_grid.resetActiveCell();
					if(selection.length > 0) {
						let lastSelected = selection[selection.length - 1];
						_grid.setActiveCell(lastSelected, 1);
					}

				}

			} else if (selection.length && e.shiftKey) {
				var from = selection[0];
				var to = Math.min(cell.row, from);
				if (from === to) {
					to = Math.max(cell.row, from);
				}
				selection = [];
				if (from > to) {
					for (var i = from; i >= to; i--) {
						selection.push(i);
					}
				} else {
					for (var i = from; i <= to; i++) {
						selection.push(i);
					}
				}
				_grid.setActiveCell(cell.row, cell.cell);
			}

			_ranges = rowsToRanges(selection);
			setSelectedRanges(_ranges);
			e.stopImmediatePropagation();

			return true;
		}

		$.extend(this, {
			'getSelectedRows': getSelectedRows,
			'setSelectedRows': setSelectedRows,

			'getSelectedRanges': getSelectedRanges,
			'setSelectedRanges': setSelectedRanges,

			'init': init,
			'destroy': destroy,

			'onActiveCellChanged': new Slick.Event(),
			'onSelectedRangesChanged': new Slick.Event()
		});
	}
})(jQuery);