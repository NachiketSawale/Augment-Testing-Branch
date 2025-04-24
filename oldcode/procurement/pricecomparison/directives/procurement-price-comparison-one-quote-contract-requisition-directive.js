/**
 * Created by chi on 5/6/2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	angular.module(moduleName).directive('procurementPriceComparisonOneQuoteContractRequisition', [
		function () {
			var controller = ['$scope', '$timeout', 'platformGridAPI', 'basicsCommonDialogGridControllerService',
				'procurementRequisitionHeaderUIStandardService', 'procurementPriceComparisonOneQuoteContractRequisitionService',
				'procurementPriceComparisonCommonService',
				function ($scope, $timeout, platformGridAPI, basicsCommonDialogGridControllerService,
					procurementRequisitionHeaderUIStandardService, dataService, commonService) {// scope: inherit from parent

					var gridConfig = {
						initCalled: false,
						columns: [],
						uuid: '7af726cca0ec49fab7a7fa4dd5bd5811',
						grouping: false,
						parentProp: '',
						childProp: 'Children',
						cellChangeCallBack: updateCellValue
					};

					$scope.setTools = function (tools) {
						var customerObj = angular.copy(tools.items);
						tools.items = [];
						$scope.tools = tools;
						commonService.getTools(tools, customerObj);
						var layoutConf = _.find($scope.tools.items, {id: 't200'});
						layoutConf.list.items = [layoutConf.list.items[0]];
					};

					$scope.removeToolByClass = function () {
					};

					basicsCommonDialogGridControllerService.initListController($scope, getUIStandard(), dataService, null, gridConfig);

					if ($scope.options) {
						dataService.setOptions($scope.options);
					} else {
						dataService.setOptions({dataSource: 'dataService'});
					}

					platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', checkAll);
					$scope.$on('$destroy', function () {
						platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', checkAll);
					});

					// load the grid data
					$timeout(function () {
						dataService.load();
					});

					function updateCellValue(args) {
						var columns = platformGridAPI.columns.configuration($scope.gridId).visible;
						if (!_.isEmpty(columns) && columns[args.cell].field === 'isChecked') {
							var dataView = platformGridAPI.grids.element('id', $scope.gridId).dataView;
							var selectedItem = dataView.getItem(args.row);
							// _.forEach(selectedItem.Children, function (child) {
							// 	if (child.Id > 0) {
							// 		child.isChecked = selectedItem.isChecked;
							// 	}
							// });
							dataService.updateCheckedItems(selectedItem);
							// refresh the grid
							platformGridAPI.grids.invalidate($scope.gridId);
						}
					}

					// noinspection JSUnusedLocalSymbols
					function checkAll(e, args) {
						if (args.grid.id !== $scope.gridId) {
							return;
						}
						if (args.column.field === 'isChecked') {
							var dataView = platformGridAPI.grids.element('id', $scope.gridId).dataView;
							dataService.updateCheckedItems(dataView.getItems());
							$scope.$apply();
						}
					}

					function getUIStandard() {
						var listConfig = angular.copy(procurementRequisitionHeaderUIStandardService.getStandardConfigForListView());
						listConfig.columns = listConfig.columns.filter(e => e.id !== 'id');
						var columns = listConfig.columns;

						var additonalColumns = [
							{
								id: 'reqTotal',
								field: 'reqTotal',
								name: 'Quote Subtotal',
								name$tr$: 'procurement.pricecomparison.compareQuoteSubtotal',
								width: 120,
								sortable: true,
								formatter: 'money',
								searchable: true
							},
							{
								id: 'isChecked',
								field: 'isChecked',
								name: 'Select All',
								name$tr$: 'procurement.pricecomparison.htmlTranslate.selectAll',
								formatter: 'boolean',
								editor: 'boolean',
								width: 100,
								headerChkbox: true,
								cssClass: 'cell-center'
							}
						];

						_.forEach(columns, function (col) {
							if (col.editor) {
								delete col.editor;
							}
							if (col.editorOptions) {
								delete col.editorOptions;
							}
						});

						_.forEach(additonalColumns, function (col) {
							var found = _.find(columns, {id: col.id});
							if (!found) {
								columns.splice(0, 0, col);
							}
						});

						return {
							getStandardConfigForListView: function getStandardConfigForListView() {
								return listConfig;
							}
						};
					}
				}
			];

			return {
				restrict: 'A',
				scope: {options: '='}, // use parent scope, this directive is mostly used as a configured item into a form view
				templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/create-one-quote-contract-requisition-directive.html',
				controller: controller
			};
		}
	]);
})(angular);
