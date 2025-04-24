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
		let _idProperty;

		function init(grid) {
			_grid = grid;
			_idProperty = grid.getOptions().idProperty ? grid.getOptions().idProperty : 'Id';
			_handler
				.subscribe(_grid.onClick, handleClick)
				.subscribe(_grid.onHeaderClick, handleHeaderClick)
				.subscribe(_grid.onKeyDown, handleKeyDown)
				.subscribe(_grid.onSelectionModeChanged, handleSelectionModeChanged)
				.subscribe(_grid.onItemCountChanged, handleOnItemCountChanged);
		}

		function checkIndeterminateness(columnDef) {
			let headers = _grid.getColumnHeaders();
			let ele = headers.find('#chkbox_' + _grid.getUID() + '_' + columnDef.id);

			if (ele.length) {
				let data = _grid.getData().getItems();
				let hasTrueValue = false;
				let hasFalseValue = false;

				if (data.length) {
					hasTrueValue = childrenHasValue(data, options.childProp, columnDef, true) ? true : false;
					hasFalseValue = childrenHasValue(data, options.childProp, columnDef, false) ? true : false;
				}

				ele.prop('disabled', !data.length);
				ele.prop('indeterminate', hasTrueValue && hasFalseValue);
				ele.prop('checked', hasTrueValue && !hasFalseValue);
			}
		}

		function destroy() {
			_handler.unsubscribeAll();
		}

		function handleSelectionModeChanged(e, args){
			if(args.isMultiSelect && args.items.length > 0) {
				if(options.propagateCheckboxSelection) {
					let childItems = _.get(args.items[0], options.childProp);
					if(childItems && Array.isArray(childItems)) {
						loopThroughChildren(childItems, options.childProp, args.column, true);
					}
					let markedItems = _.filter(_grid.getData().getFilteredItems().rows, {IsMarked: true});
					trigger(_grid, _grid.onMarkerSelectionChanged, {
						items: markedItems
					});
					_grid.invalidate();
				}
			}
		}

		function handleOnItemCountChanged(){
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
					columnDef.editorOptions.service = options.$injector.get(columnDef.editorOptions.serviceName);
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
			if(_grid.getOptions().editable) {
				if (e.which === 32) {
					let columnDef = _grid.getColumns()[args.cell];

					if (columnDef && columnDef.editor && !_grid.getEditorLock().isActive() && (columnDef.domain === 'boolean' || columnDef.domain === 'marker') ||
						(!columnDef.editor && columnDef.domain === 'marker')) {
						let item = _grid.getDataItem(args.row);

						let res = _options.runtimeDataService.isReadonly(item, columnDef.field);

						if (!res) {
							let isMarkerMode = columnDef.domain === 'marker';

							if (isMarkerMode) {
								let currentItem = _grid.getData().getRows()[args.row];
								handleSelection(columnDef, currentItem);
								if (columnDef.onChange) {
									columnDef.onChange(item);
								}
							}

							toggle(item, columnDef, args, false);

							if (!isMarkerMode) {
								checkIndeterminateness(_grid.getColumns(true)[args.cell]);
							} else {
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
		}

		function handleClick(e, args) {
			if(_grid.getOptions().editable) {
				if ((e.target && e.target.nodeName === 'INPUT') || (e.target && e.target.firstChild && e.target.firstChild.nodeName === 'INPUT')) {
					let columnDef = _grid.getColumns()[args.cell];

					if (columnDef.editor &&
						((e.target.type === 'radio' || e.target.type === 'checkbox') || (e.target.firstChild && (e.target.firstChild.type === 'radio' || e.target.firstChild.type === 'checkbox')))) {
						if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
							e.preventDefault();
							e.stopImmediatePropagation();
						} else {
							let item = _grid.getDataItem(args.row);
							let res = _options.runtimeDataService.isReadonly(item, columnDef.field);

							let isMarkerMode = columnDef.domain === 'marker';

							if (!res || isMarkerMode) {
								if (isMarkerMode) {
									let currentItem = _grid.getData().getRows()[args.row];
									handleSelection(columnDef, currentItem);
									if (columnDef.onChange) {
										columnDef.onChange(item);
									}
								}

								let isCheckbox = e.target.type === 'checkbox' || (e.target.firstChild && e.target.firstChild.type === 'checkbox');

								toggle(item, columnDef, args, isCheckbox);

								if (isCheckbox) {
									let value = _.get(item, columnDef.field);
									loopThroughParents(item, options.childProp, columnDef.field, args.cell);
									let selectedRows = _grid.getSelectedRows();
									_.forEach(selectedRows, function (row) {
										let rowItem = _grid.getDataItem(row);
										if(rowItem !== item) {
											let rowItemReadOnly = _options.runtimeDataService.isReadonly(rowItem, columnDef.field);
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

											if(isCheckbox && options.propagateCheckboxSelection) {
												let childItems = _.get(rowItem, options.childProp);
												if(childItems && Array.isArray(childItems)) {
													loopThroughChildren(childItems, options.childProp, columnDef, value);
												}
											}

											_grid.invalidateRow(row);
											loopThroughParents(rowItem, options.childProp, columnDef.field, args.cell);
										}
									});
									_grid.render();
								} else {
									loopThroughParents(item, options.childProp, columnDef.field, args.cell);
								}

								if (!isMarkerMode) {
									checkIndeterminateness(_grid.getColumns(true)[args.cell]);
								} else {
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
				loopThroughChildren(data, options.childProp, args.column, e.target.checked);
				_grid.onHeaderCheckboxChanged.notify(args, e, _grid);
				e.stopPropagation();
				e.stopImmediatePropagation();
				args.grid.invalidate();
			}
		}

		function loopThroughParents(item, childProp, field, cellIdx) {
			if(!options.propagateCheckboxSelection) {
				return;
			}

			let parentId = _.get(item, options.parentProp);
			if(parentId) {
				let rowIdx = _grid.getData().getIdxById(parentId);
				let parentItem = _grid.getData().getRows()[rowIdx];
				let childItems = _.get(parentItem, childProp);
				if (childItems) {
					const trueCnt = childItems.filter(function (i) {
						return _.get(i, field) === true;
					}).length;

					const falseCnt = childItems.filter(function (i) {
						return _.get(i, field, false) === false;
					}).length;
					let value;
					if ((trueCnt !== 0 && trueCnt !== childItems.length) || (falseCnt !== 0 && falseCnt !== childItems.length) || (trueCnt === 0 && falseCnt === 0)) {
						value = null;
					} else if (trueCnt === 0) {
						value = false;
					} else {
						value = true;
					}
					let ele = $('.item-id_' + parentId + ' >.r' + cellIdx + '.item-field_' + field + ' :input[type="checkbox"]');
					if (ele && ele.length > 0) {
						if (value === null) {
							ele.prop('indeterminate', true);
						} else if (value === false) {
							ele.prop('checked', false);
						} else {
							ele.prop('checked', true);
						}
						if (value !== null) {
							_grid.invalidateRow(rowIdx);
						}
					}
					_.set(parentItem, field, value);
				}
				loopThroughParents(parentItem, childProp, field, cellIdx);
			}
		}

		function loopThroughChildren(items, childProp, column, value) {
			for (let i = 0; i < items.length; i++) {
				let rowItemReadOnly = _options.runtimeDataService.isReadonly(items[i], column.fieldName);
				if (!rowItemReadOnly) {
					let result = handleValidation(column.validator, items[i], value, column.fieldName);

					if (result.valid) {
						if (column.field.indexOf('.') > -1) {
							_.set(items[i], column.field, value);
						} else {
							items[i][column.field] = value;
						}
						_grid.invalidateRow(_grid.getData().getIdxById(items[i][_idProperty]));
					}
				}
				if(options.propagateCheckboxSelection) {
					let childItems = _.get(items[i], childProp);
					if(childItems && Array.isArray(childItems)) {
						loopThroughChildren(childItems, childProp, column, value);
					}
				}
			}
		}

		function childrenHasValue(items, childProp, column, valueToCheckFor) {
			for (let i = 0; i < items.length; i++) {
				if(_.get(items[i], column.field) === valueToCheckFor)
				{
					return true;
				}
				let childItems = _.get(items[i], childProp);
				if (childItems && Array.isArray(childItems)) {
					if(childrenHasValue(childItems, childProp, column, valueToCheckFor)) {
						return true;
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

			if (result.valid) {
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

			if(isCheckbox && options.propagateCheckboxSelection) {
				let childItems = _.get(item, options.childProp);
				if(childItems && Array.isArray(childItems)) {
					loopThroughChildren(childItems, options.childProp, column, newValue);
				}
			}
		}

		function handleResults(_grid, item, args, column, result, value) {
			if (result.apply) {
				_.set(item, column.field, value);

				if (options.$rootScope) {
					options.$rootScope.safeApply();
				}

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

			return _options.runtimeDataService.applyValidationResult(result, item, field);
		}

		$.extend(this, {
			init: init,
			destroy: destroy
		});
	}
})(jQuery);