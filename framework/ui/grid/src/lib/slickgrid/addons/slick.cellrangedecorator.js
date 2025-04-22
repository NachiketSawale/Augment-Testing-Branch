(function ($) {
	// register namespace
	$.extend(true, window, {
		'Slick': {
			'CellRangeDecorator': CellRangeDecorator
		}
	});

	/***
	 * Displays an overlay on top of a given cell range.
	 *
	 * TODO:
	 * Currently, it blocks mouse events to DOM nodes behind it.
	 * Use FF and WebKit-specific "pointer-events" CSS style, or some kind of event forwarding.
	 * Could also construct the borders separately using 4 individual DIVs.
	 *
	 * @param {Grid} grid
	 * @param {Object} options
	 */
	function CellRangeDecorator(grid, options) {
		var _elem;
		var _defaults = {
			selectionCssClass: 'slick-range-decorator',
			selectionCss: {
				'zIndex': '9999',
				'border': '2px dashed red'
			}
		};

		options = $.extend(true, {}, _defaults, options);

		function show(range, isBatchCopy) {
			if (!_elem) {
				_elem = $('<div></div>', {css: options.selectionCss})
					.addClass(options.selectionCssClass)
					.css('position', 'absolute')
					.appendTo(grid.getContainerForCopy());
				// .appendTo(isBatchCopy ? grid.getActiveCanvasNode() : grid.getContainerForCopy());
			}

			if(isBatchCopy) {
				let _FromRow = range.fromRow;
				let _FromCell = range.fromCell;
				let _ToCell = range.toCell;

				if(grid.getActiveCell()) {
					_FromCell = _ToCell = grid.getActiveCell().cell;
				}

				var from = grid.getCellNodeBoxForCopy(_FromRow, _FromCell);
				var to = grid.getCellNodeBoxForCopy(range.toRow, _FromCell);

				_elem.css({
					top: from.top + 1,
					left: from.left,
					height: to.bottom - from.top - 3,
					width: to.right - from.left - 4
				});
			}
			else {
				let from = grid.getCellNodeBoxForCopy(range.fromRow, range.fromCell);
				let to = grid.getCellNodeBoxForCopy(range.toRow, range.toCell);

				_elem.css({
					top: from.top,
					left: from.left,
					height: to.bottom - from.top - 1,
					width: to.right - from.left - 2
				});
			}

			return _elem;
		}

		function hide() {
			if (_elem) {
				_elem.remove();
				_elem = null;
			}
		}

		function isDecoratorShown() {
			if (_elem) {
				return true;
			} else {
				return false;
			}
		}

		$.extend(this, {
			'show': show,
			'hide': hide,
			'isDecoratorShown': isDecoratorShown
		});
	}
})(jQuery);