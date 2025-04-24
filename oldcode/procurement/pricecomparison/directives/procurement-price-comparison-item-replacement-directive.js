(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,console */
	/**
	 * @ngdoc directive
	 * @name procurementPriceComparisonItemReplacementDirective
	 * @element div
	 * @restrict A
	 * @description
	 *
	 * a directive for show replacement item dialog in procurement pricecomparison item container.
	 */
	angular.module(moduleName).directive('procurementPriceComparisonItemReplacementDirective', [
		function () {
			var controllerFn = ['$scope', '$timeout', 'platformGridAPI', 'basicsCommonDialogGridControllerService',
				'procurementPriceComparisonItemReplacementService', 'procurementPriceComparisonItemConfigService',
				function ($scope, $timeout, platformGridAPI, basicsCommonDialogGridControllerService, dataService, itemConfigService) {

					var gridConfig = {
						initCalled: false,
						columns: [],
						grouping: false,
						forceFitColumns: true,
						uuid: $scope.$parent.dataInfo.gridId
					};

					var columnsDef = {
						getStandardConfigForListView: function () {
							var columns = itemConfigService.getReplacementItemColumns();
							return {
								columns: columns
							};
						}
					};

					var markQtnCellChanges = function (args) {
						// var objColumn = args.grid.getColumns()[args.cell],
						var objColumn = platformGridAPI.columns.configuration($scope.getContainerUUID()).visible[args.cell],
							currentField = objColumn.field;

						// mark cell in this grid
						args.item._flagItemModifiedStatus = args.item._flagItemModifiedStatus || {};
						args.item._flagItemModifiedStatus[currentField] = true;

						// mark cell in parent grid corresponding field as edited
						try {
							var parentFieldItemId = args.item._addedParentItem.ChildrenIds[currentField],
								quoteInfo = dataService.getChosenQuoteForContract(),
								qtnField = itemConfigService.getQuoteColumnFieldName(quoteInfo.quoteHeaderId);
							itemConfigService.markQtnCellChanges(parentFieldItemId, qtnField);
						} catch (e) {
							console.warn(e.message);
						}
					};

					var onCellModified = function (e, args) {
						markQtnCellChanges(args);
						dataService.collectReplaceItemModifiedData(args, $scope.getContainerUUID());
					};

					basicsCommonDialogGridControllerService.initListController($scope, columnsDef, dataService, null, gridConfig);

					platformGridAPI.events.register($scope.getContainerUUID(), 'onCellChange', onCellModified);
					$scope.$on('$destroy', function () {
						platformGridAPI.events.unregister($scope.getContainerUUID(), 'onCellChange', onCellModified);
					});

					// set data for the grid after contrller initialized.
					$timeout(function () {
						dataService.setList(itemConfigService.replacementItems);
					}, 0);
				}];

			return {
				restrict: 'A',
				scope: {
					gridData: '=gridData'
				},
				templateUrl: globals.appBaseUrl + 'app/components/base/grid-partial.html',
				controller: controllerFn
			};
		}
	]);
})(angular);