(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc controller
	 * @name procurementInvoiceContractGridController
	 * @require $scope, platformContextService, platformGridControllerBase, $filter,  procurementInvoiceHeaderDataService, procurementInvoiceHeaderGridColumns,  invoiceHeaderElementValidationService, modelViewerStandardFilterService
	 * @description controller for contract header
	 */
	angular.module('procurement.invoice').controller('procurementInvoiceContractGridController',
		['$scope', 'procurementInvoiceGridControllerService', 'procurementInvoiceContractDataService',
			'procurementInvoiceContractValidationService', 'procurementInvoiceContractUIStandardService',
			'modelViewerStandardFilterService', 'procurementInvoiceHeaderDataService', 'procurementStockAlternativeDialogService', 'basicsWorkflowSidebarRegisterService', '$injector',
			function ($scope, gridControllerService, dataService, validationService, gridColumns,
				modelViewerStandardFilterService, procurementInvoiceHeaderDataService, procurementStockAlternativeDialogService,  basicsWorkflowSidebarRegisterService, $injector) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, dataService.getServiceName());

				var createBtnIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'create';
				});

				function updateToolsEvent() {
					if ($scope.tools) {
						$scope.tools.update();
					}
					let selectedItem =dataService.getSelected();
					if(selectedItem) {
						if(!_.isNil(selectedItem.PrcItemFk)) {
							return dataService.readBasItemTypeFk(selectedItem).then((result => {
								if (!_.isNil(result.data)) {
									let prctItem = result.data;
									if (prctItem.BasItemTypeFk === 7) {
										dataService.canReadonlyByPrcItemBasItemType(selectedItem, true);
									}
								}
							}));
						}
					}
				}

				dataService.registerSelectionChanged(updateToolsEvent);

				$scope.tools.items.splice(createBtnIdx + 1, 0,
					{
						id: 'createotheritem',
						caption: 'procurement.common.copyContractItems',
						type: 'item',
						iconClass: 'control-icons ico-copy-action1-2',
						fn: function () {
							var itemSelected = dataService.getSelected();
							dataService.createOtherContracts(itemSelected);
						},
						disabled: function () {
							var headerSelectedItem = procurementInvoiceHeaderDataService.getSelected();
							return !headerSelectedItem || !dataService.canCreateContractItem();
						}
					}, {
						id: 'alternative',
						caption: 'procurement.stock.title.alternative',
						iconClass: 'tlb-icons ico-alternative',
						type: 'item',
						fn: function () {
							var selected = dataService.getSelected();
							if (selected && !_.isNil(selected.MdcMaterialFk)) {
								var stockId = selected.PrjStockFk;
								var materialId = selected.MdcMaterialFk;
								var materialCode = selected.MaterialCode;
								var materialDescription = selected.MaterialDescription;
								procurementStockAlternativeDialogService.showDialog({requestId: materialId, code: materialCode, description: materialDescription, stockId: stockId});

							} else {
								procurementStockAlternativeDialogService.noMaterialRecordMessage();
							}

						}
					});

				// To Register Contract EntityFacade For Invoice Module
				basicsWorkflowSidebarRegisterService.registerEntityForModule('2838F3025E1F43409E7A27BFC567CB5A', 'procurement.invoice', false,
					function getSelectedContractId() {
						let invoiceContractDataService = $injector.get('procurementInvoiceContractDataService');
						let selectedContractEntity = invoiceContractDataService.getSelected();
						if (selectedContractEntity) {
							return selectedContractEntity.Id;
						}
						return undefined;
					}, function getContractIdList() {
						let invoiceContractDataService = $injector.get('procurementInvoiceContractDataService');
						let items = invoiceContractDataService.getList();
						return _.map(_.isArray(items) ? items : [], function (contractEntity) {
							return contractEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);

			}]
	);
})(angular);