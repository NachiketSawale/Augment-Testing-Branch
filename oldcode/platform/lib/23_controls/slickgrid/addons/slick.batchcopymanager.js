(function ($) {
	'use strict';

	// register namespace
	$.extend(true, window, {
		'Slick': {
			'BatchCopyManager': BatchCopyManager
		}
	});

	function BatchCopyManager(options) {

		var _grid;
		var _options = options || {};
		var _selector;

		function init(grid) {
			_grid = grid;

			// we need a cell selection model
			var selectionModel = grid.getSelectionModel();
			if (!selectionModel) {
				throw new Error('Selection model is mandatory for this plugin.');
			}

			_selector = _grid.selector = new Slick.CellRangeSelector({
				'selectionCss': {
					'border': '2px solid #0067b1',
					'zIndex': '9999',
				},
				hideDecoratorAfterDragging: true,
				dragWithinColumn: true,
				isBatchCopy: true
			});
			grid.registerPlugin(_selector);
			_selector.onCellRangeSelected.subscribe(handleCellRangeSelected);
		}

		function destroy() {
			_selector.onCellRangeSelected.unsubscribe(handleCellRangeSelected);
			_grid.unregisterPlugin(_selector);
			_grid.selector.destroy();
		}

		function handleCellRangeSelected(e, args) {
			_grid.selectedRange = args.range;
			_grid.onBatchCopyComplete.notify({grid: _grid});
		}

		function enableSelection(grid) {
			_grid = grid;
			_grid.selector.initHandler();
		}

		function disableSelection(grid) {
			_grid = grid;
			if(_selector) {
				_grid.unregisterPlugin(_selector);
				_grid.selector.destroy();
			}
		}

		$.extend(this, {
			'init': init,
			'destroy': destroy,
			'pluginName': 'BatchCopyManager',

			'enableSelection': enableSelection,
			'disableSelection': disableSelection,

			'onCellRangeChanged': new Slick.Event()
		});
	}
})(jQuery);
