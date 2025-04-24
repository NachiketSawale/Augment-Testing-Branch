/**
 * Created by alm on 6/2/2022.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	let moduleName = 'procurement.requisition';

	angular.module(moduleName).controller('procurementRequisitionVariantListController',
		['$scope', '_', 'platformModalService', 'platformGridControllerService', 'procurementRequisitionVariantService','procurementRequisitionVariantValidationService', 'procurementRequisitionVariantUIStandardService', 'procurementCommonPrcBoqService', 'procurementCommonPrcItemDataService',
			function ($scope, _, platformModalService, platformGridControllerService, dataService,validationService, uiService, procurementCommonPrcBoqService, procurementCommonPrcItemDataService) {

				let myGridConfig = {
					initCalled: false,
					columns: []
				};

				platformGridControllerService.initListController($scope, uiService, dataService, validationService, myGridConfig);

				let createBtnIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'create';
				});

				$scope.tools.items.splice(createBtnIdx - 1, 0, {
					id: 'selectBoqVariant',
					sort: 1,
					caption: 'procurement.requisition.variant.selectBoqVariantTitle',
					type: 'item',
					iconClass: 'tlb-icons ico-select-boq-variant',
					disabled: function () {
						let parentService = dataService.parentService();
						let parentSelected =parentService.getSelected();
						return !(parentSelected&&!parentSelected.ReqStatus.Isreadonly);
					},
					fn: function () {
						let variantSelected = dataService.getSelected();
						let parentService = dataService.parentService();
						let parentSelected =parentService.getSelected();
						if (parentSelected) {
							if (parentSelected.ReqStatus.Isreadonly) {
								platformModalService.showMsgBox('procurement.requisition.variant.statusError', 'procurement.requisition.variant.errorMessage', 'warning');
								return;
							} else if (!variantSelected) {
								platformModalService.showMsgBox('procurement.requisition.variant.variantNoSelectMessage', 'procurement.requisition.variant.errorMessage', 'warning');
								return;
							}
							parentService.update().then(function(){
								let boqHeaderList = procurementCommonPrcBoqService.getService().getList();
								if (boqHeaderList.length > 0) {
									let defaultOptions = {
										templateUrl: globals.appBaseUrl + 'procurement.requisition/partials/select-boq-variant.html',
										resizeable: true,
										value: {
											variantId: variantSelected.Id,
											reqHeader:parentSelected
										}
									};
									platformModalService.showDialog(defaultOptions);
								} else {
									platformModalService.showMsgBox('procurement.requisition.variant.noBoqDataMessage', 'procurement.requisition.variant.errorMessage', 'warning');
								}
							});

						}
					}
				}, {
					id: 'selectItemVariant',
					sort: 2,
					caption: 'procurement.requisition.variant.selectItemVariantTitle',
					type: 'item',
					iconClass: 'tlb-icons ico-select-item-variant',
					disabled: function () {
						let parentService = dataService.parentService();
						let parentSelected =parentService.getSelected();
						return !(parentSelected&&!parentSelected.ReqStatus.Isreadonly);
					},
					fn: function () {
						let parentService = dataService.parentService();
						let variantSelected = dataService.getSelected();
						let parentSelected = parentService.getSelected();
						if (parentSelected) {
							if (parentSelected.ReqStatus.Isreadonly) {
								platformModalService.showMsgBox('procurement.requisition.variant.statusError', 'procurement.requisition.variant.errorMessage', 'warning');
								return;
							} else if (!variantSelected) {
								platformModalService.showMsgBox('procurement.requisition.variant.variantNoSelectMessage', 'procurement.requisition.variant.errorMessage', 'warning');
								return;
							}
							parentService.update().then(function(){
								let itemList = procurementCommonPrcItemDataService.getService().getList();
								if (itemList.length > 0) {
									let defaultOptions = {
										templateUrl: globals.appBaseUrl + 'procurement.requisition/partials/select-item-variant.html',
										resizeable: true,
										value: {
											variantId: variantSelected.Id
										}
									};
									platformModalService.showDialog(defaultOptions);
								} else {
									platformModalService.showMsgBox('procurement.requisition.variant.noItemDataMessage', 'procurement.requisition.variant.errorMessage', 'warning');
								}
							});
						}

					}
				});
				$scope.tools.update();

			}
		]);
})(angular);