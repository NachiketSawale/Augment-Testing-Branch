/**
 * Created by pel on 7/2/2019.
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'procurement.inventory';
	angular.module(moduleName).controller('procurementInventoryHeaderGridController',
		['$scope', '$translate', 'platformGridControllerService', 'procurementInventoryHeaderDataService', 'procurementInventoryHeaderUIStandardService',
			'inventoryHeaderReadonlyProcessor','cloudDesktopSidebarService','inventoryHeaderElementValidationService','procurementCommonClipboardService',
			function ($scope, $translate, gridControllerService, dataService, gridColumns,inventoryHeaderReadonlyProcessor,cloudDesktopSidebarService,
				inventoryHeaderElementValidationService,procurementCommonClipboardService) {

				var gridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: onCellChangeCallBack,
					type: 'procurement.inventory',
					dragDropService: procurementCommonClipboardService
				};
				function onCellChangeCallBack(e) {
					var entity=e.item;
					inventoryHeaderReadonlyProcessor.handlerItemReadOnlyStatus(entity);
				}
				gridControllerService.initListController($scope, gridColumns, dataService, inventoryHeaderElementValidationService, gridConfig);
			}]
	);
})(angular);
