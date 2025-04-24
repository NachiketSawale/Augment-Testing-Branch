/**
 * Created by wed on 4/25/2019.
 */

(function (angular) {
	'use strict';

	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonHeaderCheckHelperService', [
		'_',
		'$timeout',
		'platformGridAPI',
		'platformRuntimeDataService',
		'basicsCommonHeaderColumnCheckboxControllerService',
		'procurementPriceComparisonCheckBidderService',
		function (_,
			$timeout,
			platformGridAPI,
			platformRuntimeDataService,
			basicsCommonHeaderColumnCheckboxControllerService,
			checkBidderService) {

			function createHeaderCheckboxHandler(field, defValue, completeFn) {
				return function (items) {
					_.each(items, function (item) {
						if (isRowCheckboxReadonly(item, field)) {
							item[field] = defValue;
						}
					});
					if (angular.isFunction(completeFn)) {
						completeFn(items, field);
					}
				};
			}

			function isRowCheckboxReadonly(item, field) {
				return !!_.find(item.__rt$data.readonly, {field: field, readonly: true});
			}

			function setHeaderCheckBoxDisabledStatus(gridId, columnIds, disabled, isSyncToField, tryTimes) {
				let grid = platformGridAPI.grids.element('id', gridId);
				let gridInstance = grid ? grid.instance : null;
				if (gridInstance) {
					let columnHeaders = gridInstance.getColumnHeaders();
					let columns = gridInstance.getColumns();
					let items = gridInstance.getData().getItems();
					_.each(columnIds, function (columnId) {
						let elem = columnHeaders.find('#chkbox_' + gridInstance.getUID() + '_' + columnId);
						if (elem.length) {
							elem.prop('disabled', disabled);
						}
					});
					if (isSyncToField) {
						_.each(items, function (item) {
							let syncFields = _.filter(columns, function (col) {
								return _.includes(columnIds, col.id);
							});
							platformRuntimeDataService.readonly(item, _.map(syncFields, function (col) {
								return {
									field: col.field,
									readonly: disabled
								};
							}));
						});
						platformGridAPI.grids.invalidate(gridId);
					}
				}
				if (tryTimes) {
					$timeout(function () {
						tryTimes--;
						setHeaderCheckBoxDisabledStatus(gridId, columnIds, disabled, isSyncToField, tryTimes);
					}, 100);
				}
			}

			function disabledHeaderCheckBox(gridId, columnIds, isSyncToField, tryTimes) {
				setHeaderCheckBoxDisabledStatus(gridId, columnIds, true, isSyncToField, tryTimes);
			}

			function enabledHeaderCheckBox(gridId, columnIds, isSyncToField, tryTimes) {
				setHeaderCheckBoxDisabledStatus(gridId, columnIds, false, isSyncToField, tryTimes);
			}

			function config(scope, checkFields, handlerSet, onRowCountChanged) {
				let headerCheckBoxEvents = [
						{
							source: 'grid',
							name: 'onHeaderCheckboxChanged',
							fn: function (e, args) {
								let column = args.column;
								let items = args.grid.getData().getItems();
								let handlers = handlerSet || {};
								let handler = handlers[column.field + 'Handler'];
								let skipFn = handler && angular.isFunction(handler.skipFn) ? handler.skipFn : function () {
									return false;
								};
								let onChanged = handler && angular.isFunction(handler.onChanged) ? handler.onChanged : angular.noop;
								_.each(items, function (item) {
									if (!skipFn(item)) {
										item[column.field] = e.target.checked && item.Visible;
									}
								});
								onChanged(items, e.target.checked);
							}
						},
						{
							source: 'grid',
							name: 'onRowCountChanged',
							fn: function (e) {
								$timeout(function () {
									scope.updateHeaderCheckState();
								}, 1500);
								if (angular.isFunction(onRowCountChanged)) {
									onRowCountChanged(e);
								}
							}
						}
					],
					options = {
						skipFn: function (item, column, i) {
							let handlers = handlerSet || {};
							let handler = handlers[column.field + 'Handler'];
							let skipFn = handler && angular.isFunction(handler.skipFn) ? handler.skipFn : function () {
								return false;
							};
							return skipFn(item, column, i);
						}
					};
				basicsCommonHeaderColumnCheckboxControllerService.init(scope, null, checkFields, headerCheckBoxEvents, options);
				let baseUpdateFn = scope.updateHeaderCheckState;
				scope.updateHeaderCheckState = function () {
					let grid = platformGridAPI.grids.element('id', scope.gridId);
					let gridInstance = grid ? grid.instance : null;
					if (gridInstance) {
						if (angular.isFunction(baseUpdateFn)) {
							baseUpdateFn();
						}
					} else {
						$timeout(function () {
							scope.updateHeaderCheckState();
						}, 50);
					}
				};
			}

			function configForBidder(scope, userOptions) {
				let options = angular.extend({
					completeFn: angular.noop,
					visibleSkipFn: function (/* item */) {
						return false;
					}
				}, userOptions);
				config(scope, ['Visible', 'IsHighlightChanges'], {
					'VisibleHandler': {
						onChanged: function (items, checked) {
							_.each(items, function (item) {
								if (options.visibleSkipFn(item)) {
									item.Visible = true;
								}
								if (item.Children && item.Children.length > 0) {
									_.each(item.Children, function (child) {
										child.Visible = checked;
									});
								}
							});
							options.completeFn(items, 'Visible');
						},
						skipFn: options.visibleSkipFn
					},
					'IsHighlightChangesHandler': {
						onChanged: function (items, checked) {
							_.each(items, function (item) {
								if (checkBidderService.item.isReference(item.Id)) {
									item.IsHighlightChanges = false;
								}
								if (item.Children && item.Children.length > 0) {
									_.each(item.Children, function (child) {
										child.IsHighlightChanges = checked;
									});
								}
							});
							options.completeFn(items, 'IsHighlightChanges');
						},
						skipFn: function (item) {
							return checkBidderService.item.isReference(item.Id);
						}
					},
					'IsCountInTargetHandler': {
						onChanged: function (items, checked) {
							_.each(items, function (item) {
								if (!checkBidderService.item.isIncludedTargetCalculationColumn(item.Id) || item.IsIdealBidder) {
									item.IsCountInTarget = false;
								}
								if (item.Children && item.Children.length > 0) {
									_.each(item.Children, function (child) {
										child.IsCountInTarget = checked;
									});
								}
							});
							options.completeFn(items, 'IsCountInTarget');
						},
						skipFn: function (item) {
							return !checkBidderService.item.isIncludedTargetCalculationColumn(item.Id);
						}
					},
				});
			}

			function configForCompareRows(scope, userOptions) {
				let options = angular.extend({completeFn: angular.noop}, userOptions);
				config(scope, ['ShowInSummary', 'AllowEdit', 'DeviationField'], {
					'VisibleHandler': {
						onChanged: function (items) {
							options.completeFn(items, 'Visible');
						}
					},
					'ShowInSummaryHandler': {
						onChanged: createHeaderCheckboxHandler('ShowInSummary', false, options.completeFn),
						skipFn: function (item) {
							return isRowCheckboxReadonly(item, 'ShowInSummary');
						}
					},
					'AllowEditHandler': {
						onChanged: createHeaderCheckboxHandler('AllowEdit', false, options.completeFn),
						skipFn: function (item) {
							return isRowCheckboxReadonly(item, 'AllowEdit');
						}
					},
					'DeviationFieldHandler': {
						onChanged: createHeaderCheckboxHandler('DeviationField', false, options.completeFn),
						skipFn: function (item) {
							return isRowCheckboxReadonly(item, 'DeviationField');
						}
					}
				});

			}

			function configForQuoteRows(scope, userOptions) {
				let options = angular.extend({
						completeFn: angular.noop
					}, userOptions),
					skipFn = function (item) {
						return isRowCheckboxReadonly(item, 'Visible') && !item.IsSorting;
					};
				config(scope, ['Visible'], {
					'VisibleHandler': {
						onChanged: createHeaderCheckboxHandler('Visible', false, options.completeFn),
						skipFn: skipFn
					}
				}, function (/* e */) {

				});
			}

			return {
				config: config,
				configForBidder: configForBidder,
				configForCompareRows: configForCompareRows,
				configForQuoteRows: configForQuoteRows,
				disabledHeaderCheckBox: disabledHeaderCheckBox,
				enabledHeaderCheckBox: enabledHeaderCheckBox
			};

		}]);

})(angular);