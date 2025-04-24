(function ($) {
	'use strict';
	$.extend(true, window, {
		'Slick': {
			'AutoColumnSize': AutoColumnSize
		}
	});

	function AutoColumnSize(maxWidth) {

		let grid, $container, context,
			keyCodes = {
				'A': 65
			};
		const elementsToCheck = ['block-image', 'checkbox', 'radio'];

		function init(_grid) {
			grid = _grid;
			maxWidth = maxWidth || 200;

			$container = $(grid.getContainerNode());
			$container.on('dblclick.autosize', '.slick-resizable-handle', autosizeColumn);
			$container.keydown(handleControlKeys);

			context = document.createElement('canvas').getContext('2d');
		}

		function destroy() {
			$container.off();
		}

		function autosizeColumn(e) {
			let headerEl = $(e.currentTarget).closest('.slick-header-column');
			e.preventDefault();
			e.stopPropagation();

			if (grid.getSelectedRows().length === grid.getData().getRows().length) {
				resizeAllColumns();
			} else {
				resizeColumn(headerEl);
			}
		}

		function handleControlKeys(event) {
			if (event.ctrlKey && event.shiftKey && event.keyCode === keyCodes.A) {
				resizeAllColumns();
			}
		}

		function resizeAllColumns() {
			let elHeaders = $container.find('.slick-header-column');
			let allColumns = grid.getColumns();
			elHeaders.each(function (index, el) {
				let columnDef = $(el).data('column');
				if (columnDef && columnDef.resizable) {
					let colIndex = grid.getColumnIndex(columnDef.id);
					let column = allColumns[colIndex];

					let internColumnTextWidth = getMaxColumnTextWidth(columnDef, colIndex);
					if (internColumnTextWidth > 0) {
						column.width = Math.round(internColumnTextWidth);
					}
				}
			});
			grid.setColumns(allColumns);
			grid.onColumnsResized.notify({grid: grid});
		}

		function resizeColumnToHeader(headerEl) {
			if (!headerEl) {
				return;
			}

			let columnDef = headerEl.data('column');

			if (!columnDef || !columnDef.resizable) {
				return;
			}

			let length = getElementWidthUsingCanvas(headerEl, columnDef.displayName);

			if (grid.sortColumn && columnDef.id === grid.sortColumn.id) {
				length += 20;
			}

			let colIndex = grid.getColumnIndex(columnDef.id);
			let allColumns = grid.getColumns();
			let column = allColumns[colIndex];

			if (length !== column.width) {
				column.width = Math.round(length);
				grid.setColumns(allColumns);
				grid.onColumnsResized.notify({grid: grid});
			}
		}

		function resizeColumn(headerEl) {
			if (!headerEl) {
				return;
			}

			let columnDef = headerEl.data('column');

			if (!columnDef || !columnDef.resizable) {
				return;
			}

			//let headerWidth = getElementWidth(headerEl[0]);
			let colIndex = grid.getColumnIndex(columnDef.id);
			let allColumns = grid.getColumns();
			let column = allColumns[colIndex];

			let internColumnTextWidth = getMaxColumnTextWidth(columnDef, colIndex);

			if (internColumnTextWidth > 0) {
				//let autoSizeWidth = Math.max(headerWidth, internColumnTextWidth) + 1;

				//if (autoSizeWidth !== column.width) {
					column.width = Math.round(internColumnTextWidth);
					grid.setColumns(allColumns);
					grid.onColumnsResized.notify({grid: grid});
				//}
			}
		}

		function getMaxColumnTextWidth(columnDef, colIndex) {
			let texts = [];
			let rowEl = createRow(columnDef);
			let data = grid.getData();
			if (Slick.Data && data instanceof Slick.Data.DataView) {
				data = data.getRows();
			}

			if (data.length === 0) {
				return -1;
			}

			for (let i = 0; i < data.length; i++) {
				texts.push(columnDef.id === 'group' ? data[i]['title'] : data[i][columnDef.field]);
			}
			let width = getMaxTextTemplate(texts, columnDef, colIndex, data, rowEl);
			deleteRow(rowEl);
			return width;
		}

		function getMaxTextTemplate(texts, columnDef, colIndex, data, rowEl) {
			let max = 0;
			let indentWidth = 0;
			let maxTemplate = null;
			let formatFun = columnDef.formatter;

			$(texts).each(function (index, text) {
				let template;
				indentWidth = 0;
				if (formatFun) {
					let result = formatFun(index, colIndex, text, columnDef, data[index], false, null, { autosizecolumn: true });
					template = $('<span>' + result + '</span>');
					text = template.text() || text;
				}
				$(template).find('*').each(function() {
					if(this.style.width) {
						indentWidth += parseInt(this.style.width,10);
					}
				});
				let length = text && _.isString(text) ? getElementWidthUsingCanvas(rowEl, text) : 0;
				length += indentWidth;
				if (template.length > 0) {
					let count = 0;
					elementsToCheck.some(function(v) {
						let stringCheck = template[0].innerHTML.match(new RegExp(v,'g'));
						count += stringCheck? stringCheck.length : 0;
					});

					length += 30*count;
				}
				if (columnDef.id === 'group' || columnDef.id === 'tree') {
					length += 30;
				}
				if (length > max) {
					max = length;
					maxTemplate = template || text;
				}
			});
			return max;
		}

		function createRow(columnDef) {
			let rowEl = $('<div class="slick-row"><div class="'+ (columnDef.id !== 'group' ? 'slick-cell' : 'slick-cell slick-group') + '"></div></div>');
			rowEl.find('.slick-cell').css({
				'visibility': 'hidden',
				'text-overflow': 'initial',
				'white-space': 'nowrap'
			});
			let gridCanvas = $container.find('.grid-canvas');
			$(gridCanvas).append(rowEl);
			return rowEl;
		}

		function deleteRow(rowEl) {
			$(rowEl).remove();
		}

		function getElementWidth(element) {
			let width, clone = element.cloneNode(true);
			clone.style.cssText = 'position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;';
			element.parentNode.insertBefore(clone, element);
			width = clone.offsetWidth;
			clone.parentNode.removeChild(clone);
			return width;
		}

		function getElementWidthUsingCanvas(element, text) {
			context.font = element.css('font-size') + ' ' + element.css('font-family');
			let metrics = context.measureText(text);
			return metrics.width + 10;
		}

		$.extend(this, {
			'init': init,
			'destroy': destroy,
			'resizeColumn': resizeColumn,
			'resizeAllColumns': resizeAllColumns,
			'resizeColumnToHeader': resizeColumnToHeader,
			'pluginName': 'AutoColumnSize'
		});
	}
}(jQuery));