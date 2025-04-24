(function ($) {
	// register namespace
	$.extend(true, window, {
		'Slick': {
			'CellRangeSelector': CellRangeSelector
		}
	});

	function CellRangeSelector(options) {
		var _grid;
		var _currentlySelectedRange;
		var _canvas;
		var _gridOptions;
		var _$activeCanvas;
		var _dragging;
		var _decorator;
		var _self = this;
		var _handler = new Slick.EventHandler();
		var _defaults = {
			selectionCss: {
				'border': '2px dashed blue'
			},
			hideDecoratorAfterDragging: true,
			dragWithinColumn: false
		};

		// Frozen row & column variables
		var _rowOffset;
		var _columnOffset;
		var _isRightCanvas;
		var _isBottomCanvas;

		var _startCell;

		// Scrollings
		var _scrollTop = 0;
		var _scrollLeft = 0;

		function init(grid) {
			options = $.extend(true, {}, _defaults, options);
			_decorator = new Slick.CellRangeDecorator(grid, options);
			_grid = grid;
			_canvas = _grid.getCanvasNode();
			_gridOptions = _grid.getOptions();
		}

		function setDragWithinColumn(isDragWithinColumn) {
			options.dragWithinColumn = isDragWithinColumn;
		}

		function initHandler() {
			_handler
				.subscribe(_grid.onScroll, handleScroll)
				.subscribe(_grid.onDragInit, handleDragInit)
				.subscribe(_grid.onDragStart, handleDragStart)
				.subscribe(_grid.onDrag, handleDrag)
				.subscribe(_grid.onDragEnd, handleDragEnd)
				.subscribe(_grid.onClick, handleClick);
		}

		function destroy() {
			_handler.unsubscribeAll();
			_decorator.hide();
		}

		function getCellDecorator() {
			return _decorator;
		}

		function handleScroll(e, args) {
			_scrollTop = args.scrollTop;
			_scrollLeft = args.scrollLeft;
		}

		function handleClick() {
			_decorator.hide();
			_self.onCellRangeSelected.notify({
				range: null
			});
		}

		function getValuesForCalculation(e) {
			_$activeCanvas = $(_grid.getActiveCanvasNode(e));

			_rowOffset = 0;
			_columnOffset = 0;
			_isBottomCanvas = _$activeCanvas.hasClass('grid-canvas-bottom');

			if (_gridOptions.frozenRow > -1 && _isBottomCanvas) {
				_rowOffset = (_gridOptions.frozenBottom) ? $('.grid-canvas-bottom').height() : $('.grid-canvas-top').height();
			}

			_isRightCanvas = _$activeCanvas.hasClass('grid-canvas-right');

			if (_gridOptions.frozenColumn > -1 && _isRightCanvas) {
				_columnOffset = $('.grid-canvas-left').width();
			}
		}


		function handleDragInit(e, dd) {
			// Set the active canvas node because the decorator needs to append its
			// box to the correct canvas
			_$activeCanvas = $(_grid.getActiveCanvasNode(e));

			_rowOffset = 0;
			_columnOffset = 0;
			_isBottomCanvas = _$activeCanvas.hasClass('grid-canvas-bottom');

			if (_gridOptions.frozenRow > -1 && _isBottomCanvas) {
				_rowOffset = (_gridOptions.frozenBottom) ? $('.grid-canvas-bottom').height() : $('.grid-canvas-top').height();
			}

			_isRightCanvas = _$activeCanvas.hasClass('grid-canvas-right');

			if (_gridOptions.frozenColumn > -1 && _isRightCanvas) {
				_columnOffset = $('.grid-canvas-left').width();
			}

			// prevent the grid from cancelling drag'n'drop by default
			e.stopImmediatePropagation();
		}

		function handleDragStart(e, dd) {
			var cell = _grid.getCellFromEvent(e);
			if (_self.onBeforeCellRangeSelected.notify(cell) !== false) {
				if (_grid.canCellBeSelected(cell.row, cell.cell)) {
					_dragging = true;
					e.stopImmediatePropagation();
				}
			}
			if (!_dragging) {
				return;
			}

			_grid.focus();

			var startX = dd.startX - $(_canvas).offset().left;
			if (_gridOptions.frozenColumn >= 0 && _isRightCanvas) {
				let scrollLeftPosition = $('.grid-scroll').scrollLeft();
				startX += scrollLeftPosition > 20 ? scrollLeftPosition - 20 : scrollLeftPosition;
			}

			var startY = dd.startY - $(_canvas).offset().top;
			if (_gridOptions.frozenRow >= 0 && _isBottomCanvas) {
				startY += _scrollTop;
			}

			var start = _grid.getCellFromPoint(startX, startY);
			_startCell = start.cell;

			dd.range = {start: start, end: {}};
			_currentlySelectedRange = dd.range;



			return _decorator.show(new Slick.Range(start.row, start.cell), options.isBatchCopy);
		}

		function handleDrag(e, dd) {
			if (!_dragging) {
				return;
			}
			e.stopImmediatePropagation();

			/* _$activeCanvas --> element('.grid-canvas') --> parent of cells */
			if(!_$activeCanvas || (_$activeCanvas && _$activeCanvas.length < 1)) {
				//For Rel 6.1 --> replace this function in handleDragInit()
				getValuesForCalculation(e);
				if(_$activeCanvas.length < 1 && $(e.currentTarget).hasClass('grid-canvas')) {
					_$activeCanvas = $(e.currentTarget);
				}
			}

			var end = _grid.getCellFromPoint(
				e.pageX - _$activeCanvas.offset().left + _columnOffset,
				e.pageY - _$activeCanvas.offset().top + _rowOffset
			);

			// if (options.dragWithinColumn && (end.cell !== _startCell)) {
			// 	console.log('return: ');
			// 	return;
			// }

			var rows = _grid.getData().getRows();
			if (end.row >= rows.length) {
				end.row = rows.length - 1;
			}
			_grid.scrollCellIntoView(end.row, end.cell);

			// ... frozen column(s),
			if (_gridOptions.frozenColumn >= 0 && (!_isRightCanvas && (end.cell > _gridOptions.frozenColumn)) || (_isRightCanvas && (end.cell <= _gridOptions.frozenColumn))) {
				//return;
			}

			// ... or frozen row(s)
			if (_gridOptions.frozenRow >= 0 && (!_isBottomCanvas && (end.row >= _gridOptions.frozenRow)) || (_isBottomCanvas && (end.row < _gridOptions.frozenRow))) {
				//return;
			}

			// ... or regular grid (without any frozen options)
			if (!_grid.canCellBeSelected(end.row, end.cell)) {
				//return;
			}

			dd.range.end = end;

			if(dd.range.start.row < 0 || dd.range.start.cell < 0 || end.row < 0 || end.cell < 0) {
				return;
			}

			_decorator.show(new Slick.Range(dd.range.start.row, dd.range.start.cell, end.row, end.cell), options.isBatchCopy);
		}

		function handleDragEnd(e, dd) {
			if (!_dragging) {
				return;
			}

			_dragging = false;
			e.stopImmediatePropagation();

			if (options.hideDecoratorAfterDragging) {
				_decorator.hide();
			}

			_self.onCellRangeSelected.notify({
				range: new Slick.Range(
					dd.range.start.row,
					dd.range.start.cell,
					dd.range.end.row,
					dd.range.end.cell
				)
			});
		}

		function getCurrentRange() {
			return _currentlySelectedRange;
		}

		$.extend(this, {
			'init': init,
			'initHandler': initHandler,
			'destroy': destroy,
			'setDragWithinColumn': setDragWithinColumn,

			'pluginName': 'CellRangeSelector',

			'getCellDecorator': getCellDecorator,
			'getCurrentRange': getCurrentRange,

			'onBeforeCellRangeSelected': new Slick.Event(),
			'onCellRangeSelected': new Slick.Event()
		});
	}
})(jQuery);