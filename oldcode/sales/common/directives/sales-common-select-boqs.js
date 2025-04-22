/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	angular.module('sales.common').directive('salesCommonSelectBoqs', ['globals',
		function (globals) {

			var controller = ['_', '$injector', '$scope', 'platformGridAPI', 'salesCommonUtilsService',
				function (_, $injector, $scope, platformGridAPI, salesCommonUtilsService) {

					var serviceName = _.get($scope, 'options.serviceName');
					var getListName = _.get($scope, 'options.getListName');
					var columns = _.get($scope, 'options.columns');
					var selectionChanged = _.get($scope, 'options.selectionChanged');
					var markerChanged = _.get($scope, 'options.markerChanged');

					var service = $injector.get(serviceName);

					function prepareColumns(columns) {
						var markerColumn = _.find(columns, {id: 'marker'});
						_.each(_.without(columns, markerColumn), salesCommonUtilsService.makeColumnReadonly);

						// add Select-Column (marker) if not already exists
						if (!_.some(columns, {id: 'marker'})) {
							columns.unshift(salesCommonUtilsService.createMarkerColumn(serviceName, getListName, true, true));
						}
						return columns;
					}

					var grid = salesCommonUtilsService.createGridEx($scope, prepareColumns(columns), $scope.options.items);

					// event handler
					grid.addOnSelectedRowChangedEvent(function (selected) {
						selectionChanged(!_.isArray(selected) && _.isObject(selected) ? selected : null);
					});
					grid.addOnCellChangeEvent('IsMarked', function (value, item) {
						markerChanged(item);
					});

					// columns configuration
					$scope.$watch('options.columns', function (newColumns, oldColumns) {
						if (newColumns !== oldColumns) {
							platformGridAPI.columns.configuration(grid.gridId, prepareColumns(newColumns));
						}
					}, true);

					// data items
					$scope.$watch('options.items', function (newItems, oldItems) {
						if (!_.isEqual(_.map(oldItems, 'Id'), _.map(newItems, 'Id'))) {
							grid.updateData(service[getListName]());
						} else {
							_.each(newItems, function (item) {
								platformGridAPI.rows.refreshRow({gridId: grid.gridId, item: item});
							});
						}
					}, true);

				}];

			return {
				restrict: 'A',
				scope: {
					options: '='
				},
				controller: controller,
				templateUrl: globals.appBaseUrl + '/sales.common/templates/sales-common-grid-select-entity.html',
				link: function (/* scope, ele, attrs */) {
				}
			};
		}]
	);

})();
