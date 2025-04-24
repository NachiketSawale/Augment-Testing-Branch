(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	/**
	 * @ngdoc controller
	 * @name procurementPesHeaderController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of header.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.pes').controller('procurementPesHeaderController',
		['_', '$scope', '$translate', 'procurementPesHeaderService',
			'platformGridControllerService', 'procurementPesHeaderUIStandardService',
			'procurementPesHeaderValidationService',
			'procurementPesBillingSchemaDataService',
			'modelViewerStandardFilterService', '$injector', 'estimateProjectRateBookConfigDataService', 'procurementCommonNavigationService',
			'platformGridAPI','$timeout', 'procurementCommonClipboardService', 'platformContextMenuItems','procurementCommonCreateButtonBySystemOptionService',
			function (_, $scope, $translate, procurementPesHeaderService,
				platformGridControllerService, procurementPesHeaderUIStandardService,
				procurementPesHeaderValidationService,
				procurementPesBillingSchemaDataService,
				modelViewerStandardFilterService, $injector, estimateProjectRateBookConfigDataService, procurementCommonNavigationService,
				platformGridAPI,$timeout, procurementCommonClipboardService, platformContextMenuItems,procurementCommonCreateButtonBySystemOptionService) {
				var gridContainerGuid = 'ebe726dbf2c5448f90b417bf2a30b4eb';
				var containerInfoService = $injector.get('procurementPesContainerInformationService');
				var gridConfig = {
					rowChangeCallBack: function (/* arg */) {
						var helperService = $injector.get('salesCommonContainerInformationHelperService');
						if(helperService) {
							helperService.initMasterDataFilter('procurementPesHeaderService');
						}
						var selectedLineItem = procurementPesHeaderService.getSelected();
						if(selectedLineItem) {
							$injector.get('pesHeaderLookupDataService').setProjectId(selectedLineItem.ProjectFk);
						}
					},
					cellChangeCallBack: function cellChangeCallBack(arg) {
						var entity = arg.item;
						var col = arg.grid.getColumns()[arg.cell].field;
						procurementPesHeaderService.cellChange(entity,col);
						// handel characterist
						var colService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(procurementPesHeaderService, 49, gridContainerGuid.toUpperCase(),containerInfoService);
						var column = arg.grid.getColumns()[arg.cell];
						colService.fieldChange(arg.item, col, column);
					},
					type: 'procurement.pes',
					dragDropService: procurementCommonClipboardService
				};

				platformGridControllerService.initListController($scope, procurementPesHeaderUIStandardService, procurementPesHeaderService, procurementPesHeaderValidationService(procurementPesHeaderService), gridConfig);


				var createBtnIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'create';
				});

				procurementCommonNavigationService.createNavigationItem($scope, procurementPesHeaderService);
				updateNavigationButton ();

				$scope.tools.items.splice(createBtnIdx, 1,
					Object.assign({
						id: 'create',
						caption: $translate.instant('cloud.common.taskBarNewRecord'),
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						permission: {ebe726dbf2c5448f90b417bf2a30b4eb: 4},
						fn: procurementPesHeaderService.createBlankItem
					}, platformContextMenuItems.setContextGroupNew()));

				const createCopy = Object.assign({
					id: 'createCopy',
					caption: $translate.instant('procurement.pes.toolbarNewByCopy'),
					type: 'item',
					iconClass: 'tlb-icons ico-rec-new-copy',
					permission: {ebe726dbf2c5448f90b417bf2a30b4eb: 4},
					fn: procurementPesHeaderService.createItem,
					sort: 2
				}, platformContextMenuItems.setContextGroupNew());

				$scope.tools.items.splice(createBtnIdx + 1, 0, createCopy);

				let oldSetTools = $scope.setTools;
				$scope.setTools = function(tools, cached) {
					if(!_.some(tools.items, item=>item.id === 'createCopy')) {
						let createIndex = _.findIndex(tools.items, item=>item.id === 'create');
						tools.items.splice(createIndex + 1, 0, createCopy);
					}
					oldSetTools(tools, cached);
					$scope.tools.items.splice(_.findIndex(tools.items, item=>item.id === 'createCopy'), 1);
					let createIndex = _.findIndex(tools.items, item=>item.id === 'create');
					$scope.tools.items.splice(createIndex + 1, 0, createCopy);
				};

				procurementPesBillingSchemaDataService.registerBillingSchemaChangeEvent();
				// procurementPesBillingSchemaDataService.registerParentEntityCreateEvent();

				modelViewerStandardFilterService.attachMainEntityFilter($scope, procurementPesHeaderService.getServiceName());

				function updateToolBar() {
					$scope.tools.update();
				}
				function updateNavigationButton () {
					procurementCommonNavigationService.updateNavigationItem($scope, procurementPesHeaderService);
				}

				procurementPesHeaderService.onUpdateSucceeded.register(updateToolBar);
				procurementPesHeaderService.registerSelectionChanged(updateNavigationButton);
				procurementPesHeaderService.onUpdateNavigationItemNeeded.register(updateNavigationButton);
				// handle characterist
				var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(procurementPesHeaderService, 49, gridContainerGuid.toUpperCase(),containerInfoService);

				var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(procurementPesHeaderService, 49);

				// dev-10043: fix general performance issue, should be after initListController !important
				$injector.get('basicsCharacteristicColumnUpdateService').attachToGrid($scope, characterColumnService, characteristicDataService, procurementPesHeaderService);

				$scope.$on('$destroy', function () {

					// procurementPesBillingSchemaDataService.unregisterBillingSchemaChangeEvent();
					// procurementPesBillingSchemaDataService.unregisterParentEntityCreateEvent();
					estimateProjectRateBookConfigDataService.clearData();
					procurementPesHeaderService.unregisterSelectionChanged(updateNavigationButton);
					procurementPesHeaderService.onUpdateSucceeded.unregister(updateToolBar);
					procurementPesHeaderService.onUpdateNavigationItemNeeded.unregister(updateNavigationButton);
				});
				procurementCommonCreateButtonBySystemOptionService.removeGridCreateButton($scope,['create','createCopy']);
			}

		]);
})(angular);