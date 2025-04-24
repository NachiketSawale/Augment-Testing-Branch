/**
 * Created by wed on 12/31/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonColumnResizeHelperService', [
		'_',
		'platformGridAPI',
		'mainViewService',
		'procurementPriceComparisonCommonService',
		function (_,
			platformGridAPI,
			mainViewService,
			commonService) {

			function registerColumnResizeProcessor($scope, options) {

				var registerOpts = angular.extend({
					isVerticalCompareRows: function () {
						return false;
					},
					getTree: function () {
						return null;
					},
					initGridConfiguration: function (/* columns */) {

					}
				}, options);

				var redrawGrid = function (columns) {
					var isVerticalCompareRows = registerOpts.isVerticalCompareRows();
					if (isVerticalCompareRows) {
						platformGridAPI.grids.columnGrouping($scope.gridId, false);
					}
					registerOpts.initGridConfiguration(columns);
					var itemList = registerOpts.getTree();
					if (!_.isEmpty(itemList)) {
						platformGridAPI.items.data($scope.gridId, itemList);
						platformGridAPI.grids.resize($scope.gridId);
					}
					if (isVerticalCompareRows) {
						platformGridAPI.grids.columnGrouping($scope.gridId, true);
					}
				};

				var onColumnsResized = function () {
					var grid = platformGridAPI.grids.element('id', $scope.gridId);
					var currColumns = grid.columns.current;
					var visibleColumns = grid.columns.visible;
					var resizeCol = _.find(visibleColumns, function (col) {
						return col.previousWidth !== col.width;
					});
					if (resizeCol && _.startsWith(resizeCol.field, 'QuoteCol_')) {
						var resizeTerms = resizeCol.field.split('_');
						var resizeField = resizeTerms.length === 5 ? resizeTerms[4] : 'LineValue';
						_.each(currColumns, function (currCol) {
							if (_.startsWith(currCol.field, 'QuoteCol_')) {
								var terms = currCol.field.split('_');
								var field = terms.length === 5 ? terms[4] : 'LineValue';
								if (field === resizeField) {
									currCol.width = resizeCol.width;
								}
							}
							currCol.hidden = !currCol.hidden;
						});
						mainViewService.setViewConfig($scope.gridId, currColumns, null, true);
						redrawGrid(currColumns);
					} else {
						var configColumns = commonService.configColumns;
						var bidderColumn = _.find(configColumns, {id: '_rt$bidder'});
						if (bidderColumn) {
							var currBidder = _.find(currColumns, {id: '_rt$bidder'});
							if (!currBidder) {
								var completeColumns = _.clone(configColumns);
								if (!_.some(completeColumns, {id: 'tree'})) {
									completeColumns.unshift({id: 'tree'});
								}
								if (!_.some(completeColumns, {id: 'indicator'})) {
									completeColumns.unshift({id: 'indicator'});
								}
								var index = _.findIndex(completeColumns, function (item) {
									return item.id === bidderColumn.id;
								});
								_.each(currColumns, function (currCol) {
									if (currCol.field === resizeCol.field) {
										currCol.width = resizeCol.width;
									}
									currCol.hidden = !currCol.hidden;
								});
								currColumns.splice(index, 0, bidderColumn);
								_.remove(currColumns, function (col) {
									return _.startsWith(col.field, 'QuoteCol_');
								});
								mainViewService.setViewConfig($scope.gridId, currColumns, null, true);
								redrawGrid(currColumns);
							}
						}
					}
				};

				platformGridAPI.events.register($scope.gridId, 'onColumnsResized', onColumnsResized);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onColumnsResized', onColumnsResized);
				});
			}

			return {
				registerColumnResizeProcessor: registerColumnResizeProcessor
			};

		}]);

})(angular);