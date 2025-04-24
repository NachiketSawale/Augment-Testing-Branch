/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name estimate.main.directive:simulationChartSettingsGrid
	 * @require _, $compile, platformGridAPI, platformTranslateService, $timeout, math
	 * @element div
	 * @restrict A
	 * @description A directive that displays a grid
	 */
	angular.module('estimate.main').directive('estimateMainSimulationChartSettingsGrid', ['_', '$injector', '$compile', 'platformGridAPI',
		'platformTranslateService', '$timeout', 'math',
		function (_, $injector, $compile, platformGridAPI, platformTranslateService, $timeout, math) {
			return {
				restrict: 'A',
				scope: {
					model: '=',
					groups : '=',
					entity: '='
				},
				link: function ($scope, elem) {

					$scope.gridId = 'bec4cd8ebb6845abb04ec8969c9350f1-' + math.randomInt(0, 10000);
					$scope.gridData = {
						state: $scope.gridId
					};
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}

					let gridOptions = {
						skipPermissionCheck: true,
						tree: true,
						childProp: 'Children',
						parentProp: 'Parent',
						indicator: true,
						idProperty: 'Id',
						editable: true
					};

					let grid = {
						data: [],
						lazyInit: true,
						enableConfigSave: false,
						columns: [
							{
								id: 'code',
								field: 'Code',
								name: 'Code',
								name$tr$: 'cloud.common.entityCode',
								formatter: 'code',
								editor: null,
								readonly: true,
								width: 100
							},
							{
								id: 'description',
								field: 'DescriptionInfo',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'translation',
								editor: null,
								readonly: true,
								width: 150
							}, {
								field: 'Add',
								editor: 'boolean',
								formatter: 'boolean',
								id: 'Add',
								name: 'Add',
								name$tr$: 'estimate.main.simulationChart.chartDialog.gridColumns.add',
								toolTip: 'Add',
								toolTip$tr$: 'estimate.main.simulationChart.chartDialog.gridColumns.add',
								width: 40,
								validator: function (item, value){
									$scope.$evalAsync(function () {
										let gridValidator = $injector.get('estimateMainCostCodeChartDialogMainService').gridValidator;
										let manipulatedItems = gridValidator($scope.entity, item, value, 'Add', gridOptions.childProp);
										_.forEach(manipulatedItems, function (item) {
											validateAddcheckbox(item);
											platformGridAPI.rows.refreshRow({gridId: $scope.gridId, item: item});
										});
									});
									return true;
								}
							}, {
								field: 'Subtract',
								editor: 'boolean',
								formatter: 'boolean',
								id: 'Subtract',
								name: 'Subtract',
								name$tr$: 'estimate.main.simulationChart.chartDialog.gridColumns.subtract',
								toolTip: 'Subtract',
								toolTip$tr$: 'estimate.main.simulationChart.chartDialog.gridColumns.subtract',
								width: 40,
								validator: function (item, value){
									$scope.$evalAsync(function () {
										let gridValidator = $injector.get('estimateMainCostCodeChartDialogMainService').gridValidator;
										let manipulatedItems = gridValidator($scope.entity, item, value, 'Subtract', gridOptions.childProp);
										_.forEach(manipulatedItems, function (item) {
											validateSubtractcheckbox(item);
											platformGridAPI.rows.refreshRow({gridId: $scope.gridId, item: item});
										});
									});
									return true;
								}
							}
						],
						id: $scope.gridId,
						options: gridOptions
					};

					function validateAddcheckbox(row) {
						let elements = platformGridAPI.rows.selection({gridId: $scope.gridId, wantsArray: true});
						let data = platformGridAPI.items.data($scope.gridId);
						if (elements.length === data.length) {
							if (row.Add === true) {
								_.forEach($scope.model, function (item) {
									if (item.Children !== undefined && item.Children !== null && item.Children.length > 0) {
										item.Add = true;
										checkedAddChildNode(item.Children, item);
									} else {
										item.Add = true;
									}
								});
							} else {
								_.forEach($scope.model, function (item) {
									if (item.Children !== undefined && item.Children !== null && item.Children.length > 0) {
										item.Add = false;
										checkedAddChildNode(item.Children, item);
									} else {
										item.Add = false;
									}
								});
							}
						}
					}

					function checkedAddChildNode(node,row){
						if(row.Add===true) {
							_.forEach(node, function (item1) {
								if (item1.Children !== undefined && item1.Children !== null && item1.Children.length > 0) {
									item1.Add = true;
									checkedAddChildNode(item1.Children,item1);
								} else {
									item1.Add = true;
								}
							});
						}
						else{
							_.forEach(node, function (item1) {
								if (item1.Children !== undefined && item1.Children !== null && item1.Children.length > 0) {
									item1.Add = false;
									checkedAddChildNode(item1.Children,item1);
								} else {
									item1.Add = false;
								}
							});
						}
					}

					function validateSubtractcheckbox(row){
						let elements = platformGridAPI.rows.selection({gridId: $scope.gridId,wantsArray: true});
						let data = platformGridAPI.items.data($scope.gridId);
						if(elements.length===data.length) {
							if (row.Subtract === true) {
								_.forEach($scope.model, function (item) {
									if (item.Children !== undefined && item.Children !== null && item.Children.length > 0) {
										item.Subtract = true;
										checkedSubtractChildNode(item.Children,item);
									} else {
										item.Subtract = true;
									}
								});
							}
							else{
								_.forEach($scope.model, function (item) {
									if(item.Children!==undefined && item.Children!==null && item.Children.length>0){
										item.Subtract=false;
										checkedSubtractChildNode(item.Children,item);
									}
									else{
										item.Subtract=false;
									}
								});
							}
						}
					}

					function checkedSubtractChildNode(node,row){
						if(row.Subtract===true) {
							_.forEach(node, function (item1) {
								if (item1.Children !== undefined && item1.Children !== null && item1.Children.length > 0) {
									item1.Subtract = true;
									checkedSubtractChildNode(item1.Children,item1);
								} else {
									item1.Subtract = true;
								}
							});
						}
						else{
							_.forEach(node, function (item1) {
								if (item1.Children !== undefined && item1.Children !== null && item1.Children.length > 0) {
									item1.Subtract = false;
									checkedSubtractChildNode(item1.Children,item1);
								} else {
									item1.Subtract = false;
								}
							});
						}
					}

					platformTranslateService.translateObject(grid.columns, 'name');

					platformGridAPI.grids.config(grid);

					elem.append($compile('<div class="flex-box flex-column"><div data-platform-Grid class="subview-container flex-basis-auto" data="gridData"></div></div>')($scope));

					$timeout(function () {
						platformGridAPI.grids.resize($scope.gridId);
					});

					$scope.$on('wzdlgStepChanged', function () {
						platformGridAPI.grids.resize($scope.gridId);
					});

					$scope.$watch('model', function (newValue) {
						platformGridAPI.items.data($scope.gridId, newValue);
					});

				}
			};
		}]);
})();
