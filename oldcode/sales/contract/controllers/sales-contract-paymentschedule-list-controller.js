(function () {
	'use strict';
	/* global _ */
	var moduleName = 'sales.contract';

	angular.module(moduleName).controller('salesContractPaymentScheduleListController',
		['$scope', '$translate', 'platformGridControllerService', 'platformPermissionService', 'salesContractPaymentScheduleDataService', 'salesContractPaymentScheduleUIStandardService', 'salesContractPaymentScheduleValidationService',
			'platformGridAPI',
			'paymentScheduleTotalSettingService',
			'basicCustomizeSystemoptionLookupDataService',
			function ($scope, $translate, platformGridControllerService, platformPermissionService, dataService, gridColumns, validationService,
				platformGridAPI,
				paymentScheduleTotalSettingService,
				basicCustomizeSystemoptionLookupDataService) {

				var gridConfig = {initCalled: false,
					columns: [],
					parentProp: 'PaymentScheduleFk',
					childProp: 'ChildItems',
				};
				platformGridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);
				var mainService = dataService.parentService();
				paymentScheduleTotalSettingService.initTotalSetting($scope, dataService, mainService);

				var hasWritePermission = platformPermissionService.hasWrite('a958c52e47c349eca3e930ec279545ce');
				const systemOptionIdOfHideGroupIcon = 10122;
				var tools = [{
					id: 't1000',
					sort: 1000,
					caption: $translate.instant('sales.common.reBalanceTo100'),
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					disabled: function () {
						return !$scope.showTotalSettingSection || dataService.getList().length === 0 || !hasWritePermission;
					},
					fn: function updateCalculation() {
						dataService.updateCalculation();
					}
				}];
				var bulkEditor = _.find($scope.tools.items, {id: 't14'});
				var originalBulkEditor = bulkEditor.disabled;
				bulkEditor.disabled = function () {
					var selectedItem = dataService.getSelected();
					if (selectedItem) {
						if (dataService.isSumLine(selectedItem)) {
							return true;
						}
						return originalBulkEditor();
					}
					return true;
				};
				$scope.addTools(tools);
				initPaymentScheduleGroupBtn();

				function onBeforeEditCell(e, args){
					// Readonly for PaymentSchedule BillType with BillNo
					if (args.column.id.indexOf('biltypefk') > -1 && args.item.BilHeaderFk > 0){
						return false;
					}
				}

				function pushSumLineFirstAndRender() {
					var list = dataService.pushSumLineFirst();
					if (list && list.length) {
						var grid = platformGridAPI.grids.element('id', $scope.gridId);
						if (grid.instance) {
							grid.instance.resetActiveCell();
							grid.instance.setSelectedRows([]);
							grid.dataView.setItems(list, grid.options.idProperty);
							grid.instance.invalidate();
						}
					}
				}

				function initPaymentScheduleGroupBtn() {
					basicCustomizeSystemoptionLookupDataService.getParameterValueAsync(systemOptionIdOfHideGroupIcon).then(function (parameterValue) {
						if (parameterValue &&
							(parameterValue.toLowerCase() === 'false' || parameterValue === '0')) {
							$scope.addTools([{
								id: 'ordPaymentScheduleNewParent',
								caption: $translate.instant('cloud.common.toolbarNewDivision'),
								type: 'item',
								iconClass: 'tlb-icons ico-fld-ins-below',
								disabled: function () {
									return !dataService.ordCanCreateParentCallBackFunc();
								},
								fn: dataService.createNewParent,
							}]);
						}
					});
				}

				platformGridAPI.events.register($scope.gridId, 'onRowsChanged', pushSumLineFirstAndRender);
				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);

				dataService.registerFilters();

				$scope.$on('$destroy', function () {
					dataService.unregisterFilters();
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);
					platformGridAPI.events.unregister($scope.gridId, 'onRowsChanged', pushSumLineFirstAndRender);
				});
			}
		]);
})();
