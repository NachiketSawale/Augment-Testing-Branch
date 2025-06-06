(function ($) {
	'use strict';

	$.extend(true, window, {
		Slick: {
			Data: {
				GroupItemMetadataProvider: GroupItemMetadataProvider
			}
		}
	});

	/***
	 * Provides item metadata for group (Slick.Group) and totals (Slick.Totals) rows produced by the DataView.
	 * This metadata overrides the default behavior and formatting of those rows so that they appear and function
	 * correctly when processed by the grid.
	 *
	 * This class also acts as a grid plugin providing event handlers to expand & collapse groups.
	 * If "grid.registerPlugin(...)" is not called, expand & collapse will not work.
	 *
	 * @class GroupItemMetadataProvider
	 * @module Data
	 * @namespace Slick.Data
	 * @constructor
	 * @param options
	 */
	function GroupItemMetadataProvider(options) {
		var _grid;
		var _defaults = {
			groupCssClass: 'slick-group',
			groupTitleCssClass: 'slick-group-title',
			totalsCssClass: 'slick-group-totals',
			groupFocusable: true,
			totalsFocusable: false,
			toggleCssClass: 'slick-group-toggle',
			toggleExpandedCssClass: 'control-icons ico-tree-expand',//"expanded",
			toggleCollapsedCssClass: 'control-icons ico-tree-collapse',//"collapsed",
			enableExpandCollapse: true
		};

		options = $.extend(true, {}, _defaults, options);

		function defaultGroupCellFormatter(row, cell, value, columnDef, item) {
			if (!options.enableExpandCollapse) {
				return item.title;
			}

			var indentation = item.level * 15 + 'px';

			return '<span class="' + options.toggleCssClass + ' ' +
				(item.collapsed ? options.toggleCollapsedCssClass : options.toggleExpandedCssClass) +
				'" style="margin-left:' + indentation + '">' +
				'</span>' +
				'<span class="' + options.groupTitleCssClass + '" level="' + item.level + '">' +
				item.title +
				'</span>';
		}

		function defaultTotalsCellFormatter(row, cell, value, columnDef, item) {
			return (columnDef.groupTotalsFormatter && columnDef.groupTotalsFormatter(item, columnDef)) || '';
		}

		function init(grid) {
			_grid = grid;
			_grid.onClick.subscribe(handleGridClick);
			_grid.onKeyDown.subscribe(handleGridKeyDown);

		}

		function destroy() {
			if (_grid) {
				_grid.onClick.unsubscribe(handleGridClick);
				_grid.onKeyDown.unsubscribe(handleGridKeyDown);
			}
		}

		function handleGridClick(e, args) {
			//var $target = $(e.target);
			var item = this.getDataItem(args.row);

			if (item && item instanceof Slick.Group) {
				this.invalidateRow(args.row);
				var range = _grid.getRenderedRange();
				this.getData().setRefreshHints({
					ignoreDiffsBefore: range.top,
					ignoreDiffsAfter: range.bottom + 1
				});

				if (Slick.GlobalEditorLock.isActive() && args.grid === Slick.GlobalEditorLock.usedBy) {
					Slick.GlobalEditorLock.commitCurrentEdit();
				}

				if (item.collapsed === 1) {
					this.getData().expandGroup(item, true);
				} else {
					this.getData().collapseGroup(item, true);
				}

				e.stopImmediatePropagation();
				e.preventDefault();
			}
		}

		// TODO:  add -/+ handling
		function handleGridKeyDown(e, args) {
			if (options.enableExpandCollapse && (e.which === $.ui.keyCode.SPACE)) {
				var activeCell = this.getActiveCell();
				if (activeCell) {
					var item = this.getDataItem(activeCell.row);
					if (item && item instanceof Slick.Group) {
						var range = _grid.getRenderedRange();
						this.getData().setRefreshHints({
							ignoreDiffsBefore: range.top,
							ignoreDiffsAfter: range.bottom + 1
						});
						if (item.collapsed) {
							this.getData().expandGroup(item);
						} else {
							this.getData().collapseGroup(item);
						}

						e.stopImmediatePropagation();
						e.preventDefault();
					}
				}
			}
		}

		function getGroupRowMetadata(item) {
			var groupLevel = item && item.level;
			return {
				//     selectable: false,
				//     focusable: options.groupFocusable,
				//     cssClasses: options.groupCssClass + ' slick-group-level-' + groupLevel,
				//     formatter: options.includeHeaderTotals && options.totalsFormatter,
				//     columns: {
				//         1: {
				//             colspan: options.includeHeaderTotals?'1':'*',
				//             formatter: defaultGroupCellFormatter,
				//             editor: null
				//         }
				//     }
				selectable: true,
				focusable: options.groupFocusable,
				cssClasses: options.groupCssClass + ' slick-group-level-' + groupLevel,
				formatter: options.includeHeaderTotals && options.totalsFormatter,
				columns: {
					0: {
						colspan: 1,
						formatter: null,
						editor: null
					},
					1: {
						colspan: options.includeHeaderTotals ? '1' : '*',
						formatter: defaultGroupCellFormatter,
						editor: null
					}
				}
			};
		}

		function getTotalsRowMetadata(item) {
			var groupLevel = item && item.group && item.group.level;
			// return {
			//     selectable: false,
			//     focusable: options.totalsFocusable,
			//     cssClasses: options.totalsCssClass + ' slick-group-level-' + groupLevel,
			//     formatter: defaultTotalsCellFormatter,
			//     editor: null
			// };
			return {
				selectable: false,
				focusable: options.totalsFocusable,
				cssClasses: options.totalsCssClass + ' slick-group-level-' + groupLevel,
				formatter: defaultTotalsCellFormatter,
				editor: null
			};
		}

		function getRowMetadata(item) {
			if (options.getRowMetadata) {
				return options.getRowMetadata(item);
			}

			return null;
		}

		return {
			'init': init,
			'destroy': destroy,
			'getGroupRowMetadata': getGroupRowMetadata,
			'getTotalsRowMetadata': getTotalsRowMetadata,
			'getRowMetadata': getRowMetadata
		};
	}
})(jQuery);
