(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name procurementRequisitionHeaderGridController
	 * @require $scope, platformGridControllerBase, $filter,  procurementRequisitionHeaderDataService, procurementRequisitionHeaderUIStandardService, slickGridEditors, lookupDataService, reqHeaderElementValidationService, modelViewerStandardFilterService
	 * @description controller for requisition header
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.requisition').controller('procurementRequisitionHeaderGridController',
		['$scope', '$translate', 'platformGridControllerService',
			'procurementRequisitionHeaderDataService', 'procurementRequisitionHeaderUIStandardService',
			'procurementRequisitionHeaderValidationService', 'cloudDesktopSidebarService', 'basicsLookupdataLookupDataService',
			'procurementCommonHelperService', '$injector', 'modelViewerStandardFilterService', 'estimateProjectRateBookConfigDataService', 'procurementCommonNavigationService',
			'platformGridAPI', '$timeout', '_', 'procurementCommonClipboardService','procurementCommonCreateButtonBySystemOptionService',
			function ($scope, $translate, gridControllerService,
				dataService, gridColumns, validationService, cloudDesktopSidebarService, basicsLookupdataLookupDataService,
				procurementCommonHelperService, $injector, modelViewerStandardFilterService, estimateProjectRateBookConfigDataService, procurementCommonNavigationService,
				platformGridAPI, $timeout, _, procurementCommonClipboardService,procurementCommonCreateButtonBySystemOptionService) {
				let gridContainerGuid = '509f8b1f81ea475fbebf168935641489';
				let containerInfoService = $injector.get('procurementRequisitionContainerInformationService');
				let gridConfig = {
					initCalled: false,
					columns: [],
					rowChangeCallBack: function (/* arg */) {
						let helperService = $injector.get('salesCommonContainerInformationHelperService');
						if (helperService) {
							helperService.initMasterDataFilter('procurementPackageDataService');
						}
					},
					cellChangeCallBack: function cellChangeCallBack(arg) {
						let entity = arg.item;
						let col = arg.grid.getColumns()[arg.cell].field;
						dataService.cellChange(entity, col);
						// handel characterist
						let colService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 51, gridContainerGuid.toUpperCase(), containerInfoService);
						let column = arg.grid.getColumns()[arg.cell];
						colService.fieldChange(arg.item, col, column);
					},
					type: 'procurement.requisition',
					dragDropService: procurementCommonClipboardService
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				// region Sidebar stuff
				cloudDesktopSidebarService.showHideButtons([{
					sidebarId: cloudDesktopSidebarService.getSidebarIds().search,
					active: true
				}]);

				// todo : unregister
				// cloudDesktopSidebarService.registerSidebarContainer({
				// eslint-disable-next-line no-tabs
				/*	name: cloudDesktopSidebarService.getSidebarIds().info,
					title: 'info',
					type: 'template',
					templateUrl: globals.appBaseUrl + 'procurement.requisition/templates/sidebar-info.html'
				 }, true); */

				// adding project context toolbar button left of the toolbar buttons getNavigationToolbarButton
				// $scope.tools.items.unshift(procurementCommonHelperService.getNavigationToolbarButton(dataService,'procurement.rfq','procurementRfqMainService'));
				procurementCommonNavigationService.createNavigationItem($scope, dataService);
				updateNavigationButton();

				// binding module readOnly handler
				// var moduleReadOnlyStatusHandler = new procurementCommonHelperService.ModuleStatusHandler();
				// moduleReadOnlyStatusHandler.bindGridReadOnlyListener($scope.gridId); //bind listener

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'procurementRequisitionHeaderDataService');

				function updateToolBar() {
					$scope.tools.update();
				}

				function updateNavigationButton() {
					procurementCommonNavigationService.updateNavigationItem($scope, dataService);
				}

				dataService.registerSelectionChanged(updateNavigationButton);
				dataService.registerUpdateDone(updateToolBar);
				// handle characterist
				let characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 51, gridContainerGuid.toUpperCase(), containerInfoService);

				let characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, 51);

				// dev-10043: fix general performance issue, should be after initListController !important
				$injector.get('basicsCharacteristicColumnUpdateService').attachToGrid($scope, characterColumnService, characteristicDataService, dataService);

				let deepCopyIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'createDeepCopy';
				});

				if (deepCopyIdx > -1) {
					$scope.tools.items[deepCopyIdx].permission = {
						'c58d860ef43642c689c78986463557c1': 4
					};
				}

				$scope.$on('$destroy', function () {
					// moduleReadOnlyStatusHandler.unbindGridReadOnlyListener($scope.gridId); //unbind listener

					dataService.unregisterSelectionChanged(updateNavigationButton);
					dataService.unregisterUpdateDone(updateToolBar);
					estimateProjectRateBookConfigDataService.clearData();
				})
				procurementCommonCreateButtonBySystemOptionService.removeGridCreateButton($scope,['create']);
			}
		]);
})(angular);