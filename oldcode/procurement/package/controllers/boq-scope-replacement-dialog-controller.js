
(function (angular) {
	'use strict';
	let moduleName = 'procurement.package';

	angular.module(moduleName).controller('procurementPackageBoqScopeReplacementDialogController', procurementPackageBoqScopeReplacementDialogController);

	procurementPackageBoqScopeReplacementDialogController.$inject = [
		'$scope',
		'$translate',
		'$http',
		'globals',
		'procurementPackageBoqScopeReplacementDialogService',
		'platformModalService',
		'_',
		'procurementCommonPrcBoqMainUIStandardService',
		'basicsCommonDialogGridControllerService',
		'procurementPackageItemAssignmentDataService',
		'$injector',
		'platformGridAPI',
		'prcBoqMainService',
		'procurementContextService',
		'procurementCommonPrcBoqService',
		'procurementCommonTotalDataService',
		'platformTranslateService',
		'platformRuntimeDataService'
	];

	function procurementPackageBoqScopeReplacementDialogController(
		$scope,
		$translate,
		$http,
		globals,
		procurementPackageBoqScopeReplacementDialogService,
		platformModalService,
		_,
		procurementCommonPrcBoqMainUIStandardService,
		basicsCommonDialogGridControllerService,
		procurementPackageItemAssignmentDataService,
		$injector,
		platformGridAPI,
		prcBoqMainService,
		procurementContextService,
		procurementCommonPrcBoqService,
		procurementCommonTotalDataService,
		platformTranslateService,
		platformRuntimeDataService
	) {
		$scope.modalOptions = $scope.modalOptions || {};
		$scope.modalOptions.headerText = $translate.instant('procurement.package.boqScopeReplacement.title');
		$scope.isDisableTargetBoqAfterReplacement = true;
		$scope.modalOptions.cancel = cancel;
		$scope.canUpdate = canUpdate;
		$scope.update = update;
		$scope.isRunning = true;
		$scope.data = $scope.modalOptions.data ? angular.copy($scope.modalOptions.data) : null;
		$scope.gridUUID = '2d38fb5d51564004b9c20f65d8a65b8d';
		$scope.selectGridId = '8392589AE22E46749BE92369001BC256';

		$scope.selectedBoqItemData = {
			state: $scope.selectGridId
		};
		$scope.gridData = {
			state: $scope.gridUUID
		};
		let isUpdated = false;
		loadSelectItem();

		function loadSelectItem() {
			let columns = procurementCommonPrcBoqMainUIStandardService.getStandardConfigForListView().columns;
			let tempColumns = angular.copy(columns);
			let showColumns = _.filter(tempColumns, function (c) {
				return [
					'reference', 'brief',
					'quantity', 'price', 'basuomfk', 'finalprice', 'budgettotal'
				].indexOf(c.id) >= 0;
			});
			_.forEach(tempColumns, function (o) {
				o.readonly = true;
				o.editor = null;
				o.navigator = null;
			});
			if (platformGridAPI.grids.exist($scope.selectGridId)) {
				platformGridAPI.grids.unregister($scope.selectGridId);
			}
			if (!platformGridAPI.grids.exist($scope.selectGridId)) {
				let grid = {
					data: [$scope.data.targetBoqTree],
					columns: angular.copy(showColumns),
					id: $scope.selectGridId,
					options: {
						tree: true,
						indicator: true,
						iconClass: '',
						enableDraggableGroupBy: true,
						enableColumnSort: true,
						collapsed: true,
						parentProp: 'BoqItemFk',
						childProp: 'BoqItems',
						skipPermissionCheck: true
					},
					lazyInit: true,
					enableConfigSave: false
				};
				platformGridAPI.grids.config(grid);
				platformTranslateService.translateGridConfig(grid.columns);
			}
		}

		if ($scope.data?.packageItem && $scope.data?.targetBoqItem) {
			procurementPackageBoqScopeReplacementDialogService.loadData($scope.data.packageItem.Id, $scope.data.targetBoqItem.BoqHeaderFk)
				.finally(function () {
					setTimeout(function () {
						setSelection();
						$scope.isRunning = false;
					}, 100);
				});
		} else {
			return;
		}
		let columns = procurementCommonPrcBoqMainUIStandardService.getStandardConfigForListView().columns;
		let budgetTotalColIndex = -1;
		_.forEach(columns, function (col, key) {
			if (col.id !== 'budgettotal') {
				col.editor = null;
				col.editorOptions = null;
			}
			else {
				budgetTotalColIndex = key;
			}
		});
		columns.unshift({
			id: 'selection',
			field: 'isSelect',
			name$tr$: 'basics.company.importContent.columnSelection',
			formatter: 'boolean',
			editor: 'boolean',
			sortable: false,
			resizable: true,
			width: 100
		});

		if (budgetTotalColIndex > -1) {
			columns.splice(budgetTotalColIndex, 0, {
				id: 'budgetPercent',
				field: 'BudgetPercent',
				name$tr$: 'procurement.package.boqScopeReplacement.budgetPercent',
				formatter: 'percent',
				editor: 'percent',
				width: 80,
				sortable: true
			});
		}

		let uiService = {
			getStandardConfigForListView: function () {
				return {
					addValidationAutomatically: true,
					columns: columns
				};
			}
		};
		let gridConfig = {
			uuid: $scope.gridUUID,
			initCalled: false,
			columns: [],
			grouping: false,
			idProperty: 'Id',
			parentProp: 'BoqItemFk',
			childProp: 'BoQItems',
			enableModuleConfig: true,
			enableConfigSave: true,
			enableTemplateButtons: true
		};

		let validationService = {
			validateisSelect: validateisSelect,
			validateBudgetPercent: validateBudgetPercent,
			validateBudgetTotal: validateBudgetTotal
		};
		basicsCommonDialogGridControllerService.initListController($scope, uiService, procurementPackageBoqScopeReplacementDialogService, validationService, gridConfig);

		let grid = platformGridAPI.grids.element('id', $scope.gridData.state);
		grid.options.collapsed = false;

		$scope.tools.items.unshift({
			id: 't4',
			caption: 'procurement.package.wizard.scopeReplacement.budgetSplit',
			type: 'check',
			iconClass: 'control-icons ico-recalculate',
			fn: function () {
				recalculateReplacementItem();
			},
			disabled: function () {
				return !$scope.data.targetBoqItem || $scope.data.targetBoqItem.BudgetTotal === 0;
			}
		});

		platformGridAPI.events.register($scope.selectGridId, 'onSelectedRowsChanged', onSelectionChanged);
		$scope.$on('$destroy', function destroy() {
			procurementPackageBoqScopeReplacementDialogService.reset();
			platformGridAPI.events.unregister($scope.selectGridId, 'onSelectedRowsChanged', onSelectionChanged);
			if (isUpdated) {
				let boqItemService = prcBoqMainService.getService(procurementContextService.getMainService());
				let commonBoqService = procurementCommonPrcBoqService.getService(procurementContextService.getMainService(), boqItemService);
				let totalDataService = procurementCommonTotalDataService.getService(procurementContextService.getMainService());
				procurementPackageItemAssignmentDataService.load();
				commonBoqService.load();
				totalDataService.loadSubItemsList();
			}
		});

		// //////////////
		function cancel() {
			$scope.$close(false);
		}

		function canUpdate() {
			return procurementPackageBoqScopeReplacementDialogService.canUpdate() && $scope.data.targetBoqItem;
		}

		function update() {
			let canUpdate = procurementPackageBoqScopeReplacementDialogService.canUpdate();
			if (!canUpdate) {
				platformModalService.showMsgBox('procurement.package.boqScopeReplacement.noChange', 'procurement.package.boqScopeReplacement.title', 'ico-warning');
				return;
			}

			if (!$scope.data.targetBoqItem) {
				platformModalService.showMsgBox('procurement.package.boqScopeReplacement.noSelectedReplacementBoq', 'procurement.package.boqScopeReplacement.title', 'ico-warning');
				return;
			}

			let selectedData = procurementPackageBoqScopeReplacementDialogService.getSelectedData();
			let unselectedData = procurementPackageBoqScopeReplacementDialogService.getUnselectedData();

			let selectedDataInfoList = _.map(selectedData, function (item) {
				return {
					Id: item.Id,
					BudgetTotal: item.BudgetTotal,
					BudgetPerUnit: item.BudgetPerUnit
				};
			});
			let unselectedDataIds = _.map(unselectedData, 'Id');
			let request = {
				PackageId: $scope.data.packageItem.Id,
				TargetBoqHeaderId: $scope.data.targetBoqItem?.BoqHeaderFk,
				TargetBoqItemId: $scope.data.targetBoqItem?.Id,
				IsDisableTargetBoqAfterReplacement: $scope.isDisableTargetBoqAfterReplacement,
				ReplacementBoqInfoList: selectedDataInfoList,
				DropReplacementBoqIds: unselectedDataIds
			};
			$scope.isRunning = true;
			$http.post(globals.webApiBaseUrl + 'procurement/package/wizard/updateitemassignmentforboqreplacement', request)
				.then(function (response) {
					procurementPackageBoqScopeReplacementDialogService.updateItemAssignments(response?.data);
					platformGridAPI.grids.invalidate($scope.selectGridId);
					procurementPackageBoqScopeReplacementDialogService.updateBoqItems();
					// don't recalculate budget total related after updating
					procurementPackageBoqScopeReplacementDialogService.loadBySelection($scope.data.targetBoqItem, true);
					isUpdated = true;
					platformModalService.showMsgBox('procurement.package.boqScopeReplacement.updateSuccessfully', 'procurement.package.boqScopeReplacement.title', 'ico-info');
				})
				.finally(function () {
					$scope.isRunning = false;
				});
		}

		function validateisSelect(entity, value) {
			let result = {apply: true, valid: true};
			platformRuntimeDataService.readonly(entity, [
				{field: 'BudgetPercent', readonly: !value || !$scope.data.targetBoqItem.BudgetTotal},
				{field: 'BudgetTotal', readonly: !value}
			]);
			if (!value) {
				entity.BudgetPercent = 0;
			}
			if ($scope.data.targetBoqItem.BudgetTotal !== 0) {
				let selectedData = procurementPackageBoqScopeReplacementDialogService.getSelectedData();
				let sumBudgetTotal = _.sumBy(selectedData, 'BudgetTotal');

				if (value) {
					sumBudgetTotal += entity.BudgetTotal;
				} else {
					sumBudgetTotal -= entity.BudgetTotal;
				}

				if (sumBudgetTotal > $scope.data.targetBoqItem.BudgetTotal) {
					let budgetValidResult = {};
					budgetValidResult.apply = true;
					budgetValidResult.valid = false;
					budgetValidResult.error = $translate.instant('procurement.package.wizard.scopeReplacement.sumBudgetTotalError');
					platformRuntimeDataService.applyValidationResult(budgetValidResult, entity, 'BudgetTotal');
					_.forEach(selectedData, function (item) {
						platformRuntimeDataService.applyValidationResult(budgetValidResult, item, 'BudgetTotal');
					});
				} else {
					if (value) {
						entity.BudgetPercent = (entity.BudgetTotal / $scope.data.targetBoqItem.BudgetTotal) * 100;
					}
					_.forEach(selectedData, function (item) {
						platformRuntimeDataService.applyValidationResult(result, item, 'BudgetTotal');
						platformRuntimeDataService.applyValidationResult(result, item, 'BudgetPercent');
					});
				}
			} else {
				entity.BudgetPercent = 0;
			}

			if (!value) {
				platformRuntimeDataService.applyValidationResult(result, entity, 'BudgetTotal');
				platformRuntimeDataService.applyValidationResult(result, entity, 'BudgetPercent');
			}
			procurementPackageBoqScopeReplacementDialogService.gridRefresh();
			return result;
		}

		function validateBudgetPercent(entity, value) {
			let result = {apply: true, valid: true};
			if ($scope.data.targetBoqItem && $scope.data.targetBoqItem.BudgetTotal !== 0) {
				let selectedData = procurementPackageBoqScopeReplacementDialogService.getSelectedData();
				let sumBudgetPercent = 0;
				_.forEach(selectedData, function (item) {
					if (item.Id !== entity.Id) {
						sumBudgetPercent += item.BudgetPercent;
					}
				});
				sumBudgetPercent += value;
				entity.BudgetTotal = (value * $scope.data.targetBoqItem.BudgetTotal) / 100;
				entity.BudgetPerUnit = entity.Quantity > 0 ? entity.BudgetTotal / entity.Quantity : entity.BudgetPerUnit;
				if (sumBudgetPercent > 100) {
					result.valid = false;
					result.error = $translate.instant('procurement.package.wizard.scopeReplacement.sumPercentError');
					return result;
				}
				else {
					_.forEach(selectedData, function (item) {
						platformRuntimeDataService.applyValidationResult(result, item, 'BudgetTotal');
						if (item.Id !== entity.Id) {
							platformRuntimeDataService.applyValidationResult(result, item, 'BudgetPercent');
						}
					});
					procurementPackageBoqScopeReplacementDialogService.gridRefresh();
				}
			}

			return result;
		}

		function validateBudgetTotal(entity, value) {
			let result = {apply: true, valid: true};
			entity.BudgetPerUnit  = entity.Quantity > 0 ? value / entity.Quantity : entity.BudgetPerUnit;
			if ($scope.data.targetBoqItem && $scope.data.targetBoqItem.BudgetTotal !== 0) {
				let selectedData = procurementPackageBoqScopeReplacementDialogService.getSelectedData();
				let sumBudgetTotal = 0;
				_.forEach(selectedData, function (item) {
					if (item.Id !== entity.Id) {
						sumBudgetTotal += item.BudgetTotal;
					}
				});
				sumBudgetTotal += value;
				entity.BudgetPercent = (value / $scope.data.targetBoqItem.BudgetTotal) * 100;
				if (sumBudgetTotal > $scope.data.targetBoqItem.BudgetTotal) {
					result.valid = false;
					result.error = $translate.instant('procurement.package.wizard.scopeReplacement.sumBudgetTotalError');
					return result;
				}
				else {
					_.forEach(selectedData, function (item) {
						platformRuntimeDataService.applyValidationResult(result, item, 'BudgetPercent');
						if (item.Id !== entity.Id) {
							platformRuntimeDataService.applyValidationResult(result, item, 'BudgetTotal');
						}
					});
					procurementPackageBoqScopeReplacementDialogService.gridRefresh();
				}
			}

			return result;
		}

		function recalculateReplacementItem() {
			if (!$scope.data.targetBoqItem) {
				return;
			}
			let targetBudgetTotal = $scope.data.targetBoqItem.BudgetTotal;
			if (targetBudgetTotal !== 0) {
				// only calculate the data which are not done the budget distribution.
				let selectedData = procurementPackageBoqScopeReplacementDialogService.getSelectedData();
				let selectedDataNoBudget = [];
				let budgetTotalNotDistributed = targetBudgetTotal;
				let budgetPercentNotDistributed = 100;
				let totalOfAllDataSelected = 0;
				_.forEach(selectedData, item => {
					// if item does not set BudgetTotal or has error, then add to selectedDataNoBudget
					if (item.BudgetTotal === 0 || procurementPackageBoqScopeReplacementDialogService.hasError(item)) {
						selectedDataNoBudget.push(item);
					} else { // reduce the total budget
						budgetTotalNotDistributed = budgetTotalNotDistributed - item.BudgetTotal;
						budgetPercentNotDistributed = budgetPercentNotDistributed - item.BudgetPercent;
					}
					totalOfAllDataSelected = totalOfAllDataSelected + item.Finalprice;
				});

				let totalOfDataNoBudget = _.sumBy(selectedDataNoBudget, 'Finalprice');
				let selectedLength = selectedDataNoBudget.length;
				// for all data selected, if there is data with Finalprice is not 0, the weight is calculated as case 1 or case 2. Else as case 3.
				_.forEach(selectedDataNoBudget, function (item) {
					// the weight is calculated among the selected data which are not done the budget distribution.
					if (totalOfDataNoBudget !== 0) { // case 1
						item.weight = item.Finalprice / totalOfDataNoBudget;
					} else if (totalOfAllDataSelected !== 0) { // case 2
						item.weight = 0;
					} else { // case 3
						item.weight = 1 / selectedLength;
					}
				});
				let lastItem = selectedDataNoBudget[selectedLength - 1];
				let notLastItemBudgetTotal = 0;
				let notLastSumPercent = 100 - budgetPercentNotDistributed;
				_.forEach(selectedDataNoBudget, function (item) {
					if (lastItem.Id !== item.Id) {
						item.BudgetTotal = parseFloat((item.weight * budgetTotalNotDistributed).toFixed(2));
						item.BudgetPercent = item.weight * budgetPercentNotDistributed; // here, the percent is calculated among all data selected.
						item.BudgetPerUnit = item.Quantity > 0 ? item.BudgetTotal / item.Quantity : item.BudgetPerUnit;
						notLastItemBudgetTotal += item.BudgetTotal;
						notLastSumPercent += item.BudgetPercent;
					}
					else if (item.weight !== 0) {
						item.BudgetTotal = budgetTotalNotDistributed - notLastItemBudgetTotal;
						item.BudgetPercent = 100 - notLastSumPercent;
						item.BudgetPerUnit = item.Quantity > 0 ? item.BudgetTotal / item.Quantity : item.BudgetPerUnit;
					}
				});
				_.forEach(selectedData, function (item) {
					platformRuntimeDataService.applyValidationResult(true, item, 'BudgetPercent');
					platformRuntimeDataService.applyValidationResult(true, item, 'BudgetTotal');
				});
				procurementPackageBoqScopeReplacementDialogService.gridRefresh();
			}
		}

		function onSelectionChanged() {
			$scope.data.targetBoqItem = platformGridAPI.rows.selection({
				gridId: $scope.selectGridId
			});
			$scope.isRunning = true;
			procurementPackageBoqScopeReplacementDialogService.updateBoqItems();
			procurementPackageBoqScopeReplacementDialogService.loadBySelection($scope.data.targetBoqItem);
			$scope.isRunning = false;
		}

		function setSelection() {
			let grid = platformGridAPI.grids.element('id', $scope.selectGridId);
			if (grid?.dataView) {
				let rows = grid.dataView.mapIdsToRows([$scope.data.targetBoqItem.Id]);
				grid.instance.setSelectedRows(rows);
			}
		}
	}
})(angular);