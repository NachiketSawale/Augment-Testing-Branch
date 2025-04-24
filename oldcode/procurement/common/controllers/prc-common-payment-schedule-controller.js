(function (angular) {
	'use strict';

	/* global _ */
	/**
	 * @ngdoc controller
	 * @name procurementCommonPaymentScheduleListController
     * @description controller for PaymentSchedule
	 */
	angular.module('procurement.common').controller('procurementCommonPaymentScheduleListController',
		['$scope', '$translate','procurementContextService', 'platformGridControllerService', 'procurementCommonPaymentScheduleDataService',
			'procurementCommonPaymentScheduleValidationService', 'procurementCommonPaymentScheduleUIStandardService','platformPermissionService','procurementModuleConstant',
			'paymentScheduleTotalSettingService', 'platformGridAPI',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope,$translate, moduleContext, gridControllerService, dataServiceFactory, validationService, gridColumns,platformPermissionService,procurementModuleConstant,
				paymentScheduleTotalSettingService, platformGridAPI) {

				var gridConfig = {initCalled: false, columns: []},
					mainService = moduleContext.getMainService(),
					dataService = dataServiceFactory.getService(mainService);
				validationService = validationService.getService(dataService);
				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				var hasWritePermission = false;

				if(moduleContext.getModuleName() === procurementModuleConstant.package.moduleName){
					hasWritePermission = platformPermissionService.hasWrite('3f5e1709104c407ea503562029609dfd');
					paymentScheduleTotalSettingService.initTotalSetting($scope, dataService, mainService);
				}

				if(moduleContext.getModuleName() === procurementModuleConstant.requisition.moduleName){
					hasWritePermission = platformPermissionService.hasWrite('423730d7024b4d8babe269dda3790b59');
					paymentScheduleTotalSettingService.initTotalSetting($scope, dataService, mainService);
				}

				if(moduleContext.getModuleName() === procurementModuleConstant.contract.moduleName){
					hasWritePermission = platformPermissionService.hasWrite('0613476f0a9a4a87ba62f830fff99c7d');
					paymentScheduleTotalSettingService.initTotalSetting($scope, dataService, mainService);
				}

				var tools = [{
					id: 't1000',
					sort: 1000,
					caption: $translate.instant('procurement.common.paymentSchedule.reBalanceTo100'),
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					disabled: function () {
						return !$scope.showTotalSettingSection || dataService.getList().length === 0 || !hasWritePermission;
					},
					fn: function updateCalculation() {
						dataService.updateCalculation();
					}
				}, {
					id: 'd999',
					sort: 999,
					type: 'divider'
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
				gridControllerService.addTools(tools);

				// for refresh the tool bar enable and disable
				var refreshDisplay = function () {
					var phase = $scope.$root.$$phase;
					if (phase !== '$apply' && phase !== '$digest') {
						$scope.$apply();
					}
				};

				dataService.registerFilters();
				dataService.registerItemModified(refreshDisplay);

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

				platformGridAPI.events.register($scope.gridId, 'onRowsChanged', pushSumLineFirstAndRender);

				$scope.$on('$destroy', function () {
					dataService.unregisterFilters();
					dataService.unregisterItemModified(refreshDisplay);
					platformGridAPI.events.unregister($scope.gridId, 'onRowsChanged', pushSumLineFirstAndRender);
				});
			}]
	);

})(angular);