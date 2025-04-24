(function ($) {
	'use strict';

	// register namespace
	$.extend(true, window, {
		Slick: {
			CheckboxColumn: CheckboxColumn
		}
	});

	function CheckboxColumn(options) {
		let _grid;
		let _handler = new Slick.EventHandler();
		let _options = options;
		let _treeConfiguration;
		let _idProperty;

		function init(grid) {
			_grid = grid;
			_idProperty = _grid.getOptions().idProperty;
			_treeConfiguration = _grid.getOptions().treeConfiguration;
			_handler
				.subscribe(_grid.onCellEditorRendered, handleCellEditorRendered)
				.subscribe(_grid.onHeaderClick, handleHeaderClick)
				.subscribe(_grid.onKeyDown, handleKeyDown)
				.subscribe(_grid.getData().onRowCountChanged, handleOnRowCountChanged);
		}

		function checkIndeterminateness(columnDef) {
			let headers = _grid.getColumnHeaders();
			let ele = headers.find('#chkbox_' + _grid.getUID() + '_' + columnDef.id);

			if (ele.length) {
				let data = _grid.getData().getItems();
				let hasTrueValue = false;
				let hasFalseValue = false;

				if (data.length) {
					hasTrueValue =  childrenHasValue(data, columnDef, true) ? true : false;
					hasFalseValue = childrenHasValue(data, columnDef, false) ? true : false;
				}

				ele.prop('disabled', !data.length);
				ele.prop('indeterminate', hasTrueValue && hasFalseValue);
				ele.prop('checked', hasTrueValue && !hasFalseValue);
			}
		}

		function destroy() {
			_handler.unsubscribeAll();
		}

		function isReadOnly(item, fieldName) {
			let res = false;
			if (_options.runtimeDataService) {
				const roRecord = _options.runtimeDataService.getEntityReadOnlyFields(item).find((ro) => ro.field === fieldName);
				if (roRecord) {
					res = roRecord.readOnly;
				}
			}
			return res;
		}

		function handleOnRowCountChanged(){
			let columns = _grid.getColumns();
			for (let i = 0; i < columns.length; i++) {
				if (columns[i].headerChkbox) {
					checkIndeterminateness(columns[i], true);
				}
			}
		}

		function handleSelection(columnDef, currentItem) {
			if ((columnDef.editorOptions && !columnDef.editorOptions.multiSelect) || (columnDef.formatterOptions && !columnDef.formatterOptions.multiSelect)) {
				if (!columnDef.editorOptions.service && _.isString(columnDef.editorOptions.serviceName)) { // jshint ignore:line
					columnDef.editorOptions.service = options.injector.get(columnDef.editorOptions.serviceName);
				}

				if (columnDef.editorOptions.service) { // jshint ignore:line
					let refresh = false;
					_.each(_.filter(_grid.getData().getFilteredItems().rows, function (o) {
						return o[columnDef.field] === true;
					}), function (item) {
						if (item !== currentItem) {
							_.set(item, columnDef.field, false);
							refresh = true;
						}
					});

					if (refresh) {
						_grid.invalidate();
					}
				}
			}
		}

		function handleKeyDown(e, args) {
			if (e.which === 32) {
				let columnDef = _grid.getColumns()[args.cell];

				if (columnDef && columnDef.editor && !_grid.getEditorLock().isActive() && (columnDef.type === 'boolean' || columnDef.type === 'marker') ||
					(!columnDef.editor && columnDef.type === 'marker')) {
					let item = _grid.getDataItem(args.row);

					let res = isReadOnly(item, columnDef.field);

					if (!res) {
						let isMarkerMode = columnDef.type === 'marker';

						if (isMarkerMode) {
							let currentItem = _grid.getData().getRows()[args.row];
							handleSelection(columnDef, currentItem);
							if (columnDef.onChange) {
								columnDef.onChange(item);
							}
						}

						toggle(item, columnDef, args);

						if (!isMarkerMode) {
							checkIndeterminateness(_grid.getColumns(true)[args.cell]);
						}
						else {
							let markedItems = _.filter(_grid.getData().getFilteredItems().rows, {IsMarked: true});
							trigger(_grid, _grid.onMarkerSelectionChanged, {
								items: markedItems
							});
						}
					}

					e.stopPropagation();
					e.stopImmediatePropagation();
				}
			}
		}

		function handleCellEditorRendered(e, args) {
			const active = _grid.getActiveCell()

			let columnDef = args.column;
			if (columnDef.editor && (columnDef.type === 'boolean' || columnDef.type === 'radio')) {

				if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
					e.preventDefault();
					e.stopImmediatePropagation();
				} else {
					let item = _grid.getDataItem(active.row);
					let res = isReadOnly(item, columnDef.field);

					let isMarkerMode = columnDef.type === 'radio';

					if (!res || isMarkerMode) {
						if (isMarkerMode) {
							let currentItem = _grid.getData().getRows()[active.row];
							handleSelection(columnDef, currentItem);
							if (columnDef.onChange) {
								columnDef.onChange(item);
							}
						}

						let isCheckbox = columnDef.type === 'boolean';

						toggle(item, columnDef, {row: active.row, cell: active.cell}, isCheckbox);

						if (isCheckbox) {
							let value = _.get(item, columnDef.field);
							loopThroughParents(item, columnDef.field, active.cell);
							let selectedRows = _grid.getSelectedRows();
							_.forEach(selectedRows, function (row) {
								let rowItem = _grid.getDataItem(row);
								if (rowItem !== item) {
									let rowItemReadOnly = isReadOnly(rowItem, columnDef.field);
									if (!rowItemReadOnly && _.get(rowItem, columnDef.field) !== value) {
										let result = handleValidation(columnDef.validator, rowItem, value, columnDef.field);

										if (result.valid) {
											if (columnDef.asyncValidator) {
												columnDef.asyncValidator(rowItem, value, columnDef.field)
													.then(function (result) {
														result = _options.runtimeDataService.applyValidationResult(result, rowItem, columnDef.field);
														handleResults(_grid, rowItem, args, columnDef, result, value);
													});
											} else {
												handleResults(_grid, rowItem, args, columnDef, result, value);
											}
										}
									}
									_grid.invalidateRow(row);
									loopThroughParents(rowItem, columnDef.field, active.cell);
								}
							});
							_grid.render();
						} else {
							loopThroughParents(item, columnDef.field, active.cell);
						}

						if (!isMarkerMode) {
							checkIndeterminateness(_grid.getColumns(true)[active.cell]);
						} else {
							let markedItems = _.filter(_grid.getData().getFilteredItems().rows, {IsMarked: true});
							trigger(_grid, _grid.onMarkerSelectionChanged, {
								items: markedItems
							});
						}
					}
				}
			}
		}

		function handleHeaderClick(e, args) {
			if ($(e.target).is(':checkbox')) {
				// if editing, try to commit
				if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
					e.preventDefault();
					e.stopImmediatePropagation();
					return;
				}
				let data = args.grid.getData().getItems();
				loopThroughChildren(data, args.column, e.target.checked);
				_grid.onHeaderCheckboxChanged.notify(args, e, _grid);
				e.stopPropagation();
				e.stopImmediatePropagation();
				args.grid.invalidate();
			}
		}

		function loopThroughParents(item, field, cellIdx) {
			if (_treeConfiguration) {
				let parent = _treeConfiguration.parent(item);
				if(parent) {
					let rowIdx = _grid.getData().getIdxById(parent.Id);
					let childItems = _treeConfiguration.children(parent);
					if (childItems) {
						const trueCnt = childItems.filter(function (i) {
							return _.get(i, field) === true;
						}).length;

						const falseCnt = childItems.filter(function (i) {
							return _.get(i, field, false) === false;
						}).length;
						let value;
						let ele = $(`.ui-item-id-${parent.id} .ui-item-field-${field} :input[type="checkbox"]`);

						if (ele && ele.length > 0) {
							if ((trueCnt !== 0 && trueCnt !== childItems.length) || (falseCnt !== 0 && falseCnt !== childItems.length) || (trueCnt === 0 && falseCnt === 0)) {
								ele.prop('indeterminate', true);
								value = null;
							}
							else if (trueCnt === 0) {
								ele.prop('checked', false);
								value = false;
							}
							else {
								ele.prop('checked', true);
								value = true;
							}
							if (value !== null) {
								_grid.invalidateRow(rowIdx);
							}
						}
						_.set(parent, field, value);
					}
					loopThroughParents(parent, field, cellIdx);
				}
			}
		}

		function loopThroughChildren(items, column, value) {
			for (let i = 0; i < items.length; i++) {
				let rowItemReadOnly = isReadOnly(items[i], column.fieldName);

				if (!rowItemReadOnly) {
					let result = handleValidation(column.validator, items[i], value, column.fieldName);

					if (result) {
						if (column.field.indexOf('.') > -1) {
							_.set(items[i], column.field, value);
						} else {
							items[i][column.field] = value;
						}
						_grid.invalidateRow(_grid.getData().getIdxById(items[i][_idProperty]));
					}
				}
				if(_treeConfiguration) {
					let childItems = _treeConfiguration.children(items[i]);
					if(childItems && Array.isArray(childItems)) {
						loopThroughChildren(childItems, column, value);
					}
				}
			}
		}

		function childrenHasValue(items, column, valueToCheckFor) {
			for (let i = 0; i < items.length; i++) {
				if(_.get(items[i], column.field) === valueToCheckFor)
				{
					return true;
				}
				if (_treeConfiguration) {
					let childItems = _treeConfiguration.children(items[i]);
					if (childItems && Array.isArray(childItems)) {
						if(childrenHasValue(childItems, column, valueToCheckFor)) {
							return true;
						}
					}
				}
			}
		}

		function toggle(item, column, args, isCheckbox) {
			let rows = _grid.getSelectedRows();

			if (rows.indexOf(args.row) === -1) {
				_grid.setSelectedRows([args.row]);
				_grid.gotoCell(args.row, args.cell, false);
			}

			let newValue = !_.get(item, column.field);
			let result = handleValidation(column.validator, item, newValue, column.field);

			if (result) {
				if (column.asyncValidator) {
					column.asyncValidator(item, !_.get(item, column.field), column.field)
						.then(function (result) {
							result = _options.runtimeDataService.applyValidationResult(result, item, column.field);

							handleResults(_grid, item, args, column, result, newValue);

							return result;
						});
				} else {
					handleResults(_grid, item, args, column, result, newValue);
				}
			}

			if(isCheckbox && _treeConfiguration) {
				let childItems = _treeConfiguration.children(item);
				if(childItems && Array.isArray(childItems)) {
					loopThroughChildren(childItems, column, newValue);
				}
			}
		}

		function handleResults(_grid, item, args, column, result, value) {
			if (result) {
				const prevValue = _.get(item, column.field);
				let gridRowInfo = options.editorControlContextService.getGridRowInfo(_grid.getOptions().uuid, item);
				if (gridRowInfo) {
					let colContext = gridRowInfo.columnContexts.get(column.id);
					colContext.value = value;
				}
				_.set(item, column.field, value);

				_grid.getOptions().api.valueChanged.next({
					oldValue: prevValue,
					newValue: value,
					field: column,
					entity: item});

				trigger(_grid, _grid.onCellChange, {
					row: args.row,
					cell: args.cell,
					item: item
				});
			}

			_grid.updateRow(args.row);
		}

		function trigger(self, evt, args, e) {
			e = e || new Slick.EventData();
			args = args || {};
			args.grid = self;
			return evt.notify(args, e, self);
		}

		function handleValidation(validator, item, value, field) {
			let result = validator ? validator(item, value, field) : true;

			return result;
		}

		$.extend(this, {
			init: init,
			destroy: destroy
		});
	}
})(jQuery);