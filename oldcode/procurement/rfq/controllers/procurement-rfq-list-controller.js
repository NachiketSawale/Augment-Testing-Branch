(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	/**
	 * @ngdoc controller
	 * @name procurement.rfq.controller:procurementRfqListController
	 * @requires $scope, platformGridControllerService
	 * @description
	 * #
	 * Controller for rfq header grid container (leading grid container).
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('procurementRfqListController',
		['$scope', '$injector', 'platformGridControllerService', 'procurementRfqHeaderUIStandardService',
			'procurementRfqMainService', 'procurementRfqHeaderValidationService', 'modelViewerStandardFilterService', 'procurementCommonNavigationService',
			'platformGridAPI', '$timeout', 'procurementCommonClipboardService','procurementCommonCreateButtonBySystemOptionService',
			function ($scope, $injector, platformGridControllerService, columnsService, dataService, validationService,
				modelViewerStandardFilterService, procurementCommonNavigationService, platformGridAPI, $timeout, procurementCommonClipboardService,procurementCommonCreateButtonBySystemOptionService) {

				var gridContainerGuid = '037c70c17687481a88c726b1d1f82459';
				var containerInfoService = $injector.get('procurementRfqContainerInformationService');
				var gridConfig = {
					cellChangeCallBack: function cellChangeCallBack(arg) {
						// var entity = arg.item;
						var col = arg.grid.getColumns()[arg.cell].field;
						// handel characterist
						var colService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 52, gridContainerGuid, containerInfoService);
						var column = arg.grid.getColumns()[arg.cell];
						colService.fieldChange(arg.item, col, column);
					},
					type: 'procurement.rfq',
					dragDropService: procurementCommonClipboardService
				};
				platformGridControllerService.initListController($scope, columnsService, dataService, validationService(dataService), gridConfig);

				// adding procurement quote context toolbar button left of the toolbar buttons getNavigationToolbarButton
				procurementCommonNavigationService.createNavigationItem($scope, dataService);
				updateNavigationButton();

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'procurementRfqMainService');

				function updateToolBar() {
					$scope.tools.update();
				}

				function updateNavigationButton() {
					procurementCommonNavigationService.updateNavigationItem($scope, dataService);
				}

				dataService.registerSelectionChanged(updateNavigationButton);
				dataService.rfqUpdateDone.register(updateToolBar);

				// handle characterist
				var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 52, gridContainerGuid.toUpperCase(), containerInfoService);

				var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, 52);

				// dev-10043: fix general performance issue, should be after initListController !important
				$injector.get('basicsCharacteristicColumnUpdateService').attachToGrid($scope, characterColumnService, characteristicDataService, dataService);

				$timeout(function () {
					characterColumnService.refresh();
				});
				$scope.$on('$destroy', function () {
					// cloudDesktopSidebarService.unRegisterSidebarContainer(sidebarInfo.name, true);

					dataService.unregisterSelectionChanged(updateNavigationButton);
					dataService.rfqUpdateDone.unregister(updateToolBar);
				});
				procurementCommonCreateButtonBySystemOptionService.removeGridCreateButton($scope,['create']);
			}
		]);
})(angular);