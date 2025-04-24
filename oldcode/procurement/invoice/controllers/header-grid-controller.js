(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module('procurement.invoice').controller('procurementInvoiceHeaderGridController',
		['$injector', '$scope', '$translate', 'platformGridControllerService', 'procurementInvoiceHeaderDataService',
			'invoiceHeaderElementValidationService', 'procurementInvoiceUIStandardService',
			'modelViewerStandardFilterService', 'procurementCommonNavigationService', 'platformGridAPI', '$timeout', 'basicsCommonInquiryHelperService', 'procurementCommonClipboardService',
			'correctInvoiceType', 'basicsCharacteristicColumnUpdateService', 'basicsCharacteristicDataServiceFactory','procurementCommonCreateButtonBySystemOptionService',
			function ($injector, $scope, $translate, gridControllerService, dataService, validationService, gridColumns,
				modelViewerStandardFilterService, procurementCommonNavigationService, platformGridAPI, $timeout, basicsCommonInquiryHelperService, procurementCommonClipboardService,
				correctInvoiceType, basicsCharacteristicColumnUpdateService, basicsCharacteristicDataServiceFactory,procurementCommonCreateButtonBySystemOptionService) {
				var containerInfoService = $injector.get('procurementInvoiceContainerInformationService');
				var gridContainerGuid = 'da419bc1b8ee4a2299cf1dde81cf1884';
				var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 47, gridContainerGuid, containerInfoService);
				var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, 47);
				var gridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function (arg) {
						var column = arg.grid.getColumns()[arg.cell];
						var field = arg.grid.getColumns()[arg.cell].field;
						characterColumnService.fieldChange(arg.item, field, column);
					},
					type: 'procurement.invoice',
					dragDropService: procurementCommonClipboardService
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				// dev-10043: fix general performance issue, should be after initListController !important
				basicsCharacteristicColumnUpdateService.attachToGrid($scope, characterColumnService, characteristicDataService, dataService);

				$scope.addTools([
					{
						id: 'createBlank',
						caption: 'cloud.common.taskBarNewRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						fn: dataService.createBlankItem,
						permission: '#c'
					},
					{
						id: 'createCopy',
						caption: 'procurement.invoice.toolbarNewByCopy',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new-copy',
						fn: dataService.createItem,
						permission: '#c'
					},
					{
						id: 'correctInvoice',
						caption: 'procurement.invoice.toolbarCorrect',
						type: 'dropdown-btn',
						iconClass: 'tlb-icons ico-correct',
						fn: function() {},
						list: {
							showImages: true,
							cssClass: 'dropdown-menu-right',
							items: [{
								id: 'correctInvoiceProcess',
								type: 'item',
								caption: 'procurement.invoice.toolbarCorrectInvoiceCorrect',
								iconClass: 'tlb-icons ico-correct',
								fn: function() { dataService.correctInvoice(correctInvoiceType.Correct); },
								disabled: false
							}, {
								id: 'cancelInvoiceProcess',
								type: 'item',
								caption: 'procurement.invoice.toolbarCorrectInvoiceCancel',
								iconClass: 'tlb-icons ico-cancel',
								fn: function() { dataService.correctInvoice(correctInvoiceType.Cancel); },
								disabled: false
							}]
						},
						disabled: function () {
							const selectedItem = dataService.getSelected();
							return !(selectedItem && selectedItem.Version > 0);
						}
					}
				]);

				_.remove($scope.tools.items, function (item) {
					return item.id === 'create';
				});

				// make createCoy button after createBlank button in container toolbar
				var createBlankIndex = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'createBlank';
				});

				var createCopyItem = _.remove($scope.tools.items, function (item) {
					return item.id === 'createCopy';
				});

				$scope.tools.items.splice(createBlankIndex + 1, 0, createCopyItem[0]);

				basicsCommonInquiryHelperService.activateProvider($scope, true);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, dataService.getServiceName());

				procurementCommonNavigationService.createNavigationItem($scope, dataService);
				updateNavigationButton();

				function updateNavigationButton() {
					procurementCommonNavigationService.updateNavigationItem($scope, dataService);
				}

				function updateNavigateAfterDeleteCon(e, deleteIds) {
					procurementCommonNavigationService.updateNavigationListItemAfterClear($scope, 'procurement.contract', deleteIds);
				}

				function updateNavigateAfterDeletePes(e, deleteIds) {
					procurementCommonNavigationService.updateNavigationListItemAfterClear($scope, 'procurement.pes', deleteIds);
				}

				dataService.onUpdateSucceeded.register(updateNavigationButton);
				dataService.clearContractEntity.register(updateNavigateAfterDeleteCon);
				dataService.clearPesEntity.register(updateNavigateAfterDeletePes);
				dataService.registerSelectionChanged(updateNavigationButton);


				$scope.$on('$destroy', function () {
					dataService.onUpdateSucceeded.unregister(updateNavigationButton);
					dataService.clearContractEntity.unregister(updateNavigateAfterDeleteCon);
					dataService.clearPesEntity.unregister(updateNavigateAfterDeletePes);
					dataService.unregisterSelectionChanged(updateNavigationButton);
				});
				 procurementCommonCreateButtonBySystemOptionService.removeGridCreateButton($scope,['createBlank','createCopy']);
			}]
	);
})(angular);