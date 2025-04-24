/**
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {

	'use strict';

	// TODO: optimize logic / extract common parts/features
	angular.module('controlling.structure').directive('controllingStructureSelectTemplateUnit', ['globals',
		function (globals) {

			var controller = ['_', '$injector', '$scope', 'platformGridAPI', 'salesCommonUtilsService',
				function (_, $injector, $scope, platformGridAPI, salesCommonUtilsService) {

					var serviceName = _.get($scope, 'options.serviceName');
					var getListName = _.get($scope, 'options.getListName');
					var selectionChanged = _.get($scope, 'options.selectionChanged');
					var markerChanged = _.get($scope, 'options.markerChanged');

					var service = $injector.get(serviceName);

					// Template unit columns
					var templUnitConfig = $injector.get('controllingControllingunittemplateUnitConfigurationService');
					var columns = _.cloneDeep(salesCommonUtilsService.getColumnsSubset(templUnitConfig.getStandardConfigForListView().columns,
						['code', 'descriptioninfo']
					));

					// remove all navigators from all columns
					salesCommonUtilsService.removeNavigators(columns);

					function processPredecessors(items, childItem, processFunc) {
						var parentFk = childItem['ControltemplateUnitFk'];
						var curParent = _.find(items, {Id: parentFk});

						while (curParent !== null && curParent !== undefined) {
							// do something
							processFunc(curParent);
							// go to next predecessor
							curParent = _.find(items, {Id: curParent['ControltemplateUnitFk']});
						}
					}

					function prepareColumns(columns) {
						var markerColumn = _.find(columns, {id: 'marker'});
						_.each(_.without(columns, markerColumn), salesCommonUtilsService.makeColumnReadonly);

						// add Select-Column (marker) if not already exists
						if (!_.some(columns, {id: 'marker'})) {
							columns.unshift(salesCommonUtilsService.createMarkerColumn(serviceName, getListName, true, true));
						}
						return columns;
					}

					var grid = salesCommonUtilsService.createGridEx($scope, prepareColumns(columns), $scope.options.items, {
						parentProp: 'ControltemplateUnitFk',
						childProp: 'ControltemplateUnitChildren'
					});

					// event handler
					grid.addOnSelectedRowChangedEvent(function (selected) {
						selectionChanged(!_.isArray(selected) && _.isObject(selected) ? selected : null);
					});
					grid.addOnCellChangeEvent('IsMarked', function (value, item) {
						// select all predecessor (parents)
						var itemList = salesCommonUtilsService.flatten(service[getListName](), 'ControltemplateUnitChildren');
						processPredecessors(itemList, item, function (curParent) {
							if (item['IsMarked']) {
								curParent.IsMarked = true;
							}
						});

						// on un-select/select, also un-select/select all successors
						if (_.isArray(item.ControltemplateUnitChildren) && _.size(item.ControltemplateUnitChildren) > 0) {
							var allChildren = salesCommonUtilsService.flatten(item.ControltemplateUnitChildren, 'ControltemplateUnitChildren');
							if (item['IsMarked']) {
								_.each(allChildren, salesCommonUtilsService.setMarker);
							} else {
								_.each(allChildren, salesCommonUtilsService.clearMarker);
							}
						}

						markerChanged(item);
						$scope.$apply(); // TODO: why needed now?
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
							var itemList = salesCommonUtilsService.flatten(newItems, 'ControltemplateUnitChildren');
							_.each(itemList, function (item) {
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