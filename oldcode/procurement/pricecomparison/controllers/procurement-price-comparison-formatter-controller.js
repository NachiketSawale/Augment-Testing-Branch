(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	angular.module(moduleName).controller('procurementPriceComparisonFormatterController', [
		'$scope',
		'$timeout',
		'$translate',
		'platformGridControllerService',
		'platformGridAPI',
		'platformModalService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonFormatterService',
		'procurementPriceComparisonSettingConfiguration',
		function (
			$scope,
			$timeout,
			$translate,
			platformGridControllerService,
			platformGridAPI,
			platformModalService,
			commonService,
			formatterService,
			settingConfiguration) {

			var currentConfig = settingConfiguration.getCurrentConfig();
			var configure = currentConfig.compareField;
			var dataService = formatterService.getService(currentConfig.configService);
			$scope.gridId = configure.formatterGridId;

			$scope.modalOptions.headerText = $translate.instant('procurement.pricecomparison.compareConditionFormattingConfig');

			var gridConfig = {
				uuid: $scope.gridId,
				initCalled: false,
				columns: [],
				grouping: false,
				skipPermissionCheck: true
			};
			var columns = {
				getStandardConfigForListView: function () {
					return {
						columns: [
							{
								id: 'conditionScript',
								field: 'Script',
								name: 'Condition',
								name$tr$: 'procurement.pricecomparison.compareConditionFormatterCondition',
								editor: 'description',
								formatter: scriptFieldFormatter,
								width: 250,
								searchable: true
							},
							{
								id: 'conditionFormat',
								field: 'Style',
								name: 'Format',
								name$tr$: 'procurement.pricecomparison.compareConditionFormatterFormat',
								width: 250,
								searchable: true
							}
						]
					};
				}
			};
			var toolbarItems = [
				{
					id: 'create',
					sort: 20,
					caption: 'cloud.common.taskBarNewRecord',
					iconClass: commonService.icons.toolBars.add,
					type: 'item',
					fn: function () {
						dataService.createItem();
					}
				},
				{
					id: 'delete',
					sort: 30,
					caption: 'cloud.common.taskBarDeleteRecord',
					iconClass: commonService.icons.toolBars.delete,
					type: 'item',
					fn: function () {
						dataService.deleteItem(dataService.getSelected());
					}
				},
				{
					id: 't109',
					sort: 40,
					caption: $translate.instant('procurement.pricecomparison.compareConditions.aboutTheConditions'),
					type: 'item',
					iconClass: commonService.icons.toolBars.question,
					fn: showConditionExplanation
				},
				{
					id: 'd3',
					sort: 60,
					type: 'divider'
				}
			];

			$scope.onContentResized = function () {};
			$scope.setTools = function (tools) {
				$scope.tools = commonService.getTools(tools, toolbarItems);
			};

			// TODO: grid only show the first time (this feature should be fixed in platformgrid.directive.js)
			// clean the grid first due to the directive only save the grid onStateChange, but in the popup modal, no state change.
			if (platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.unregister($scope.gridId);
			}

			$scope.sampleText = $translate.instant('procurement.pricecomparison.compareConditions.sampleText');
			$scope.styleHandle = {
				// method: styleHandle.setEditorStyle() is available, this will call the setEditorStyle() in directive
				// this method is defined in child directive
				setEditorStyle: function () {},

				// call this method from directive
				updateStyleCallback: function (currentStyle) {
					dataService.getSelected().Style = currentStyle;
					dataService.gridRefresh();
				}
			};

			$scope.onOK = function () {
				var formatter = {};
				var itemList = dataService.getList();
				_.forEach(itemList, function (item) {
					formatter[item.Script] = item.Style;
				});

				var formatterJson = angular.toJson(formatter);

				$scope.$close({isOK: true, data: formatterJson});
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close({isOK: false});
			};

			platformGridControllerService.initListController($scope, columns, dataService, null, gridConfig);
			dataService.gridId = $scope.gridId;
			dataService.conditionalFormat = $scope.conditionalFormat;

			// when controller initialized, refresh to show grid (height) correctly, then load data.
			$timeout(function () {
				platformGridAPI.grids.resize($scope.gridId);
				dataService.load();

				// set the first row's style into directive
				dataService.registerSelectionChanged(onCurrentItemChanged);

				var currentItem = _.head(dataService.getList());
				if (currentItem && Object.getOwnPropertyNames(currentItem).length > 0) {
					$scope.styleHandle.initStyle = currentItem.Style;
					dataService.setSelected(currentItem);
				}
			});

			// noinspection JSUnusedLocalSymbols
			function scriptFieldFormatter(row, cell, value, columnDef, dataContext) {
				var rs;
				var errorMsg = '';

				// can not be empty
				if (_.isEmpty(value)) {
					errorMsg = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {
						fieldName: $translate.instant('procurement.pricecomparison.compareConditionFormatterCondition')
					}
					);
					rs = '<div class="invalid-cell" title="' + errorMsg + '">' + value + '</div>';
				}
				else if (dataService.validateReduplicateField(dataContext)) {
					errorMsg = $translate.instant('procurement.pricecomparison.compareConditions.errorMessage');
					rs = '<div class="invalid-cell" title="' + errorMsg + '">' + value + '</div>';
				}
				else {
					rs = value;
				}

				return rs;
			}

			// open a popup to explain the conditions
			function showConditionExplanation() {
				var dialogScope = $scope.$new(true);
				dialogScope.onOK = function () {
					this.$close({isOK: true, data: {}});// use parent.close method to close dialog (this = parent.scope).
				};
				return platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/price-comparison-explain.html',
					backdrop: false,
					width: '640px',
					scope: dialogScope
				});
			}

			function onCurrentItemChanged() {
				if (!dataService.getSelected()) {
					var currentItem = _.head(dataService.getList());
					dataService.setSelected(currentItem);
					return;
				}
				var currentStyle = dataService.getSelected().Style;
				$scope.styleHandle.setEditorStyle(currentStyle);
			}

			$scope.$on('$destroy', function () {
				dataService.unregisterSelectionChanged(onCurrentItemChanged);
			});
		}]);
})(angular);