(function ($) {
	'use strict';

	// register namespace
	$.extend(true, window, {
		'Slick': {
			'CopyPasteManager': CopyPasteManager
		}
	});

	function CopyPasteManager(options) {

		let _grid;
		let _self = this;
		let _options = options || {};
		let _copiedCellStyleLayerKey = _options.copiedCellStyleLayerKey || 'copy-manager';
		let _copiedCellStyle = _options.copiedCellStyle || 'copied';
		let _clearCopyTI = 0;
		let _selector;
		let _selectionModel;

		let editorPasteAllowed = ['description', 'remark', 'code', 'quantity', 'lookup', 'money', 'integer', 'translation', 'comment', 'dynamic'];

		let culture = options.contextService.culture();
		let cultureInfo = options.languageService.getLanguageInfo(culture);

		options.contextService.contextChanged.register(onContextChanged);

		function onContextChanged(type) {
			if (type === 'culture') {
				culture = options.contextService.culture();
				cultureInfo = options.languageService.getLanguageInfo(culture);
			}
		}

		function init(grid) {
			_grid = grid;

			// we need a cell selection model
			_selectionModel = grid.getSelectionModel();
			if (!_selectionModel) {
				throw new Error('Selection model is mandatory for this plugin.');
			}

			_selector = _grid.selector = new Slick.CellRangeSelector({
				'selectionCss': {
					'border': '2px solid black',
					'zIndex': '9999',
				},
				hideDecoratorAfterDragging: true,
				isBatchCopy: false
			});
			grid.registerPlugin(_selector);
			_selector.onCellRangeSelected.subscribe(handleCellRangeSelected);
		}

		function destroy() {
			options.contextService.contextChanged.unregister(onContextChanged);
			_selector.onCellRangeSelected.unsubscribe(handleCellRangeSelected);
			_grid.unregisterPlugin(_selector);
		}

		function handleCellRangeSelected(e, args) {
			_grid.selectedRange = args.range;
			if (args.range) {
				copySelection(_grid);
			}
		}

		function handleCopyFromRows(grid, rows) {
			if (!rows) {
				return;
			}

			//sort rows according to index
			rows = rows.sort((a, b) => a - b);

			let columns = grid.getColumns();
			let clipText = '';

			let clipTextRows = [];

			if (clipTextRows.length === 0 && _grid.getOptions().includeHeaderWhenCopyingToExcel) {
				let clipTextHeaders = [];
				for (let headerCell = 0; headerCell < columns.length - 1; headerCell++) {
					if (columns[headerCell].id !== 'indicator' && columns[headerCell].id !== 'tree' && columns[headerCell].id !== 'marker' && columns[headerCell].id !== 'group') {
						clipTextHeaders.push(getHeaderValueForColumn(columns[headerCell]));
					}
				}
				clipTextRows.push(clipTextHeaders.join('\t'));
			}

			$.each(rows, function (index, value) {
				let clipTextCells = [];
				let dt = grid.getDataItem(value);

				if (dt.__group) {
					clipTextCells.push(dt.printTitle);
				} else {
					for (let rowCell = 0; rowCell < columns.length - 1 + 1; rowCell++) {
						if (columns[rowCell].id !== 'indicator' && columns[rowCell].id !== 'tree' && columns[rowCell].id !== 'marker' && columns[rowCell].id !== 'group') {
							clipTextCells.push(getDataItemValueForColumn(dt, columns[rowCell]));
						}
					}
				}
				clipTextRows.push(clipTextCells.join('\t'));
			});

			clipText += clipTextRows.join('\r\n') + '\r\n';

			return clipText;
		}

		function handleCopyFromCells(range) {
			if (!range) {
				return;
			}

			let columns = _grid.getColumns();
			let clipText = '';

			let clipTextRows = [];

			if (clipTextRows.length === 0 && _grid.getOptions().includeHeaderWhenCopyingToExcel) {
				let clipTextHeaders = [];
				for (let headerCell = range.fromCell; headerCell < range.toCell + 1; headerCell++) {
					if (columns[headerCell].id !== 'indicator' && columns[headerCell].id !== 'tree' && columns[headerCell].id !== 'marker' && columns[headerCell].id !== 'group') {
						clipTextHeaders.push(getHeaderValueForColumn(columns[headerCell]));
					}
				}
				clipTextRows.push(clipTextHeaders.join('\t'));
			}

			for (let i = range.fromRow; i < range.toRow + 1; i++) {
				let clipTextCells = [];
				let dt = _grid.getDataItem(i);

				if (dt.__group) {
					clipTextCells.push(dt.printTitle);
				} else {
					for (var rowCell = range.fromCell; rowCell < range.toCell + 1; rowCell++) {
						if (columns[rowCell].id !== 'indicator' && columns[rowCell].id !== 'tree' && columns[rowCell].id !== 'marker' && columns[rowCell].id !== 'group') {
							clipTextCells.push(getDataItemValueForColumn(dt, columns[rowCell]));
						}
					}
				}
				clipTextRows.push(clipTextCells.join('\t'));
			}
			clipText += clipTextRows.join('\r\n') + '\r\n';

			return clipText;
		}

		function getHeaderValueForColumn(columnDef) {
			return columnDef.name;
		}

		function getDataItemValueForColumn(item, columnDef) {
			let retVal = '';

			if (columnDef.formatter) {
				retVal = columnDef.formatter(0, 0, null, columnDef, item, true);
				if(String(retVal).includes('<div')){
					var d = document.createElement('div');
					d.innerHTML = retVal;
					retVal = d.innerText;
				}
			} else {
				retVal = item[columnDef.field];
			}

			return retVal;
		}

		function setDataItemValueForColumn(rowItem, columnDef, value) {
			if (columnDef.denyPaste) {
				return false;
			}

			if (!columnDef.editor) {
				return false;
			} else if (_.includes(editorPasteAllowed, columnDef.editor$name)) {

				let editorArgs = {
					'container':$('dummy'),  // a dummy container
					'column':columnDef,
					'position':{'top':0, 'left':0},  // a dummy position required by some editors
					'grid':_grid,
					'item':rowItem
				};
				let editor = new columnDef.editor(editorArgs);
				let fi = _.find(_options.runtimeDataService.readonly(rowItem), {field: columnDef.field});
				let rowItemReadOnly = _.get(fi, 'readonly', false);
				if (!rowItemReadOnly && _.get(rowItem, columnDef.field) !== value) {
					if (columnDef.editor$name === 'lookup') {
						if (columnDef.formatterOptions) {
							var service = _options.$injector.get(columnDef.formatterOptions.dataServiceName ? columnDef.formatterOptions.dataServiceName : columnDef.formatterOptions.lookupSimpleLookup ? 'basicsLookupdataSimpleLookupService' : 'basicsLookupdataLookupDescriptorService');

							if (service) {
								var type = columnDef.formatterOptions.dataServiceName ? 1 : columnDef.formatterOptions.lookupSimpleLookup ? 2 : 3;

								switch (type) {
									case 1: // named data service
									case 2:
										service.getList(columnDef.editorOptions.lookupOptions)
											.then(function (data) {
												if (data) {
													let valueId = _.result(_.find(data, function (obj) {
														return _.get(obj, columnDef.editorOptions.lookupOptions.displayMember) === value;
													}), 'Id');

													if (valueId) {
														_.set(rowItem, columnDef.field, valueId);
													}
												}
											});
										break;
									default:
										_.each(service.getData(columnDef.formatterOptions.lookupType), function (obj) {
											if (_.get(obj, columnDef.formatterOptions.displayMember) === value) {
												_.set(rowItem, columnDef.field, obj.Id);
												return true;
											}
										});
								}
							}
						}
					} else if (columnDef.editor$name === 'translation') {
						_.set(rowItem, columnDef.field + '.Description', value);
						_.set(rowItem, columnDef.field + '.Translated', value);
						// ICW 3869 - Estimate Line Items Description - Values not saved after paste action - set modified to true
						_.set(rowItem, columnDef.field + '.Modified', true);
					} else {
						if (columnDef.editor$name === 'quantity' || columnDef.editor$name === 'money') {
							value = options.accounting.unformat(value, cultureInfo.numeric.decimal);
						}
						editor.loadValue(rowItem);
						editor.applyValue(rowItem, value);
						editor.destroy();
					}
					return true;

				} else {
					return false;
				}
			} else {
				return false;
			}

		}

		function _createTextBox(innerText) {
			let ta = document.createElement('textarea');
			ta.style.position = 'absolute';
			ta.style.left = '-9999px';
			ta.style.top = document.body.scrollTop + 'px';
			ta.value = innerText;
			document.body.appendChild(ta);
			ta.select();

			return ta;
		}

		function pasteText (text) {

			let columns = _grid.getColumns();
			let clipText = text;
			let clipRows = clipText.split(/\r?\n/);
			// trim trailing CR if present
			if (clipRows[clipRows.length - 1] === '') {
				clipRows.pop();
			}

			let clippedRange = [];
			let j = 0;

			for (let i = 0; i < clipRows.length; i++) {
				if (clipRows[i] !== '') {
					clippedRange[j++] = clipRows[i].split('\t');
				} else {
					clippedRange[j++] = [''];
				}
			}
			let selectedCell = _grid.getActiveCell();
			let activeRow = null;
			let activeCell = null;

			if (selectedCell) {
				activeRow = selectedCell.row;
				activeCell = selectedCell.cell;
			} else {
				// we don't know where to paste
				return;
			}

			let destH = clippedRange.length;
			let destW = clippedRange.length ? clippedRange[0].length : 0;

			let availableRows = _grid.getDataLength() - activeRow;
			let addRows = 0;

			if (availableRows < destH && _options.newRowCreator) {
				let d = _grid.getData();
				for (addRows = 1; addRows <= destH - availableRows; addRows++) {
					d.push({});
				}
				_grid.setData(d);
				_grid.render();
			}

			let overflowsBottomOfGrid = activeRow + destH > _grid.getDataLength();
			if (_options.newRowCreator && overflowsBottomOfGrid) {
				let newRowsNeeded = activeRow + destH - _grid.getDataLength();
				_options.newRowCreator(newRowsNeeded);
			}

			let clipCommand = {

				isClipboardCommand: true,
				clippedRange: clippedRange,
				oldValues: [],
				copyManager: _self,
				_options: _options,
				activeRow: activeRow,
				activeCell: activeCell,
				destH: destH,
				destW: destW,
				destY: activeRow,
				destX: activeCell,
				maxDestY: _grid.getDataLength(),
				maxDestX: _grid.getColumns().length,
				h: 0,
				w: 0,

				execute: function () {
					this.h = 0;
					let hasChange = false;
					let modifiedItems = [];
					for (let y = 0; y < destH; y++) {
						this.oldValues[y] = [];
						this.w = 0;
						this.h++;

						let destY = activeRow + y;
						let dt = _grid.getDataItem(destY);

						for (let x = 0; x < destW; x++) {
							this.w++;

							let destX = activeCell + x;
							if (dt) {
								if (destY < this.maxDestY && destX < this.maxDestX && (columns[destX].id !== 'indicator' && columns[destX].id !== 'tree' && columns[destX].id !== 'marker' && columns[destX].id !== 'group')) {
									this.oldValues[y][x] = dt[columns[destX].field];

									if (setDataItemValueForColumn(dt, columns[destX], clippedRange[y] ? clippedRange[y][x] : '')) {
										hasChange = true;
										_grid.updateCell(destY, destX);

										modifiedItems.push(dt);
									}
								}
							}
						}
					}
					if (hasChange) {
						let bRange = {
							'fromCell': activeCell,
							'fromRow': activeRow,
							'toCell': activeCell + this.w - 1,
							'toRow': activeRow + this.h - 1
						};

						markCopySelection(bRange);
						this.copyManager.onPasteCells.notify({ranges: [bRange]});
						_grid.onPasteComplete.notify({modifiedItems: modifiedItems, cell: activeCell, grid: _grid});
					}
				}
			};

			if (_options.clipboardCommandHandler) {
				_options.clipboardCommandHandler(clipCommand);
			} else {
				clipCommand.execute();
			}
		}

		function pasteSelection(grid) {
			_grid = grid;
			if (navigator.clipboard) {
				navigator.clipboard.readText()
					.then(pasteText);
			}
		}

		function copySelection(grid) {
			_grid = grid;
			let text = '';
			if (_grid.selectedRange) {
				text = handleCopyFromCells(_grid.selectedRange);
			} else {
				let activeCellNode = grid.getActiveCell();
				if(activeCellNode) {
					if (!activeCellNode.cell && grid.getSelectedRows().length > 0) {
						text = handleCopyFromRows(grid, grid.getSelectedRows());
						_grid.onCopyComplete.notify();
					} else {
						text = handleCopyFromCells(new Slick.Range(activeCellNode.row, activeCellNode.cell, activeCellNode.row, activeCellNode.cell));
						_grid.onCopyComplete.notify();
					}
				}
			}
			if(text !== '') {
				if (navigator.clipboard) {
					navigator.clipboard.writeText(text).then(function () {
						_grid.selector.getCellDecorator().hide();
						_grid.selectedRange = null;
						_grid.onCopyComplete.notify();
					}, function (err) {
						console.error('Could not copy text: ', err);
					});
				}
				else {
					let focusEl = document.activeElement;

					let ta = _createTextBox(text);

					ta.focus();
					document.execCommand('copy');

					setTimeout(function () {
						document.body.removeChild(ta);
						// restore focus
						if (focusEl) {
							focusEl.focus();
						}
					}, 100);
				}
			}
		}

		function markCopySelection(ranges) {
			clearCopySelection();

			let columns = _grid.getColumns();
			let hash = {};
			for (let i = 0; i < ranges.length; i++) {
				for (let j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
					hash[j] = {};
					for (let k = ranges[i].fromCell; k <= ranges[i].toCell && k < columns.length; k++) {
						hash[j][columns[k].id] = _copiedCellStyle;
					}
				}
			}
			_grid.setCellCssStyles(_copiedCellStyleLayerKey, hash);
			clearTimeout(_clearCopyTI);
			_clearCopyTI = setTimeout(function () {
				_self.clearCopySelection();
			}, 2000);
		}

		function clearCopySelection() {
			_grid.removeCellCssStyles(_copiedCellStyleLayerKey);
			_grid.selector.getCellDecorator().hide();
			_grid.selectedRange = null;
		}

		function enableSelection(grid) {
			_grid = grid;
			_grid.selector.initHandler();
		}

		function disableSelection(grid) {
			_grid = grid;
			_grid.selector.destroy();
		}

		$.extend(this, {
			'init': init,
			'destroy': destroy,
			'pluginName': 'CopyPasteManager',

			'clearCopySelection': clearCopySelection,
			'copySelection': copySelection,
			'pasteSelection': pasteSelection,
			'enableSelection': enableSelection,
			'disableSelection': disableSelection,

			'onCopyCells': new Slick.Event(),
			'onCopyCancelled': new Slick.Event(),
			'onPasteCells': new Slick.Event(),
			'onPasteItems': new Slick.Event(),
			'onCopyCellRangeChanged': new Slick.Event(),
		});
	}
})(jQuery);
