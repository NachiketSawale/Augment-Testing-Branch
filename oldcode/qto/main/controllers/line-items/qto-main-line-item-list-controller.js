/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */

	'use strict';

	let moduleName = 'qto.main';

	angular.module(moduleName).controller('qtoMainLineItemListController',
		['$scope', 'platformGridControllerService', 'platformPermissionService', 'permissions', 'qtoMainLineItemDataService', 'qtoMainLineItemDynamicConfigService',
			'qtoMainClipboardService', 'qtoMainHeaderDataService', 'qtoMainDetailService',
			function ($scope, gridControllerService, platformPermissionService , permissions, dataService, uiStandardService,
			          qtoMainClipboardService, qtoMainHeaderDataService, qtoMainDetailService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
					type: 'LineItems',
					dragDropService: qtoMainClipboardService
				};

				myGridConfig = angular.extend(dataService.getGridConfig(), myGridConfig);
				gridControllerService.initListController($scope, uiStandardService, dataService, null, myGridConfig);

				platformPermissionService.restrict('b806c811989248a0bf06aa05a496ecda', permissions.read);

				qtoMainHeaderDataService.registerQtoDetailLineItemUpdate(recalculateLineItemQuantities);
				function recalculateLineItemQuantities(e, arg) {
					let lineItemList = dataService.getList();
					if (lineItemList && lineItemList.length > 0) {
						let qtoDetailList = [];
						qtoDetailList = qtoDetailList.concat(qtoMainDetailService.getList());
						if(arg.qtoDetialsOfAffectedBoq) {
							let existedDetailIds = _.map(qtoDetailList, 'Id');
							_.forEach(arg.qtoDetialsOfAffectedBoq, function(detail){
								if(_.indexOf(existedDetailIds,detail.Id) === -1){
									qtoDetailList.push(detail);
								}
							});
						}

						let updateLineItemQuantity =  function updateLineItemQuantity(lineItem, details) {
							let iqQuantity = 0, bqQuantity = 0;
							_.forEach(details, function (detail) {
								if (detail.IsIQ && detail.WipHeaderFk ===  null && detail.PesHeaderFk === null && detail.QtoLineTypeFk !== 8 && !detail.IsBlocked) {
									iqQuantity += detail.Result;
								}

								if (detail.IsBQ && detail.BilHeaderFk === null && detail.PesHeaderFk === null && detail.QtoLineTypeFk !== 8 && !detail.IsBlocked){
									bqQuantity += detail.Result;
								}
							});

							lineItem.IqQuantity = iqQuantity;
							lineItem.BqQuantity = bqQuantity;

							dataService.calculateLineItemQuantites(lineItem);
						};

						_.forEach(lineItemList, function (lineItem) {
							let details = _.filter(qtoDetailList, {EstHeaderFk: lineItem.EstHeaderFk, EstLineItemFk: lineItem.Id});
							if (details && details.length > 0) {
								updateLineItemQuantity(lineItem, details);
							}
						});

						dataService.gridRefresh();
					}
				}

				$scope.$on('$destroy', function () {
					qtoMainHeaderDataService.unregisterQtoDetailLineItemUpdate(recalculateLineItemQuantities);
				});
			}
		]);
})();