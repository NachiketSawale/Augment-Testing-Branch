/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global _ */
(function() {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainDynamicQuantityColumnService', ['PlatformMessenger',
		function (PlatformMessenger) {

			let dynamicQuantityColumns = [];

			function setDynamicQuantityColumns(lineItems) {
				if (!lineItems) {
					return;
				}
				let columns = [];
				_.forEach(lineItems, function (item) {
					if (item && item.DynamicQuantityColumns && item.DynamicQuantityColumns.length) {
						let dynamicCols = item.DynamicQuantityColumns;
						_.forEach(dynamicCols, function (col) {
							if (col) {
								col.cssClass = 'text-right';
								col.editor$name = 'quantity';
								col.formatter$name = 'quantity';
								col.searchable = false;
								col.sortable = true;
								col.toolTip = col.Field + 'Quantity Item';
								col.toolTip$tr$ = col.Field + 'estimate.main.quantityTarget';
								col.width = 100;
								col.id = col.Field;
								col.field = col.Field;
								col.domain = 'quantity';
								col.editor = 'quantity';
								col.name = col.Field;
								col.name$tr$ = col.Field + 'estimate.main.quantityTarget';
								col.name$tr$param$ = undefined;
								col.isDynamic = true;
								col.required = false;
								col.hidden = false;
								col.formatter = 'quantity';
								col.pinned = false;
								item[col.field] = col.Value;
								if (!_.find(columns, {id: col.id})) {
									columns.push(col);
								}
							}
						});
					}
				});
				dynamicQuantityColumns = angular.copy(columns);
				return columns;
			}

			function getDynamicQuantityColumns() {
				return dynamicQuantityColumns;
			}

			let service = {
				setDynamicQuantityColumns: setDynamicQuantityColumns,
				getDynamicQuantityColumns: getDynamicQuantityColumns,
				updateDynamicQuantityColumns: new PlatformMessenger()
			};

			return service;
		}]);
})();
