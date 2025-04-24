/**
 * Created by lnt on 3/22/2019.
 */

(function () {
	/* global _ */
	'use strict';
	let moduleName = 'qto.main';
	let qtoMainModule = angular.module(moduleName);

	qtoMainModule.factory('qtoBoqStructureService', ['$injector', '$q', 'boqMainServiceFactory', 'qtoMainHeaderDataService', 'qtoMainBoqFilterService','PlatformMessenger','boqMainCommonService','boqMainLineTypes', 'QtoTargetType',
		function ($injector, $q, boqMainServiceFactory, qtoMainHeaderDataService, qtoMainBoqFilterService,PlatformMessenger,boqMainCommonService,boqMainLineTypes, QtoTargetType) {

			let gridId = null;
			let service = {};
			let originalToolItems;
			let highlightItem;
			let lastSelectedItem;
			let option = {
				maintainHeaderInfo: false,
				parent: qtoMainHeaderDataService,
				moduleContext: {
					moduleName: qtoMainModule
				},
				toolBar: {
					id: 'filterBoq',
					costgroupName: 'BoqItemFk',
					iconClass: 'tlb-icons ico-filter-boq'
				},
				serviceName: 'qtoBoqStructureService'
			};
			let boqMainRoundingService = $injector.get('boqMainRoundingService');
			let boqMainDetailFormConfigService = $injector.get('boqMainDetailFormConfigService');

			let dynamicConfigData = {};
			dynamicConfigData.IQBQQuantityGroup  = [
				{
					id: 'installedquantity',
					field: 'InstalledQuantity',
					name: 'InstalledQuantity',
					width: 120,
					forceVisible:true,
					toolTip: 'IQ Quantity',
					name$tr$: 'qto.main.InstalledQuantity',
					// formatter: 'quantity',
					formatter: function (row, cell, value, columnDef, entity, plainText) {
						return boqMainDetailFormConfigService.initQuantityFormatter(row, cell, value, columnDef, entity, plainText);
					},
					formatterOptions:{
						decimalPlaces: function (columnDef, field) {
							return boqMainRoundingService.getUiRoundingDigits(columnDef,field, service);
						}
					},
					'type': 'quantity'
				},
				{
					id: 'billedquantity',
					field: 'BilledQuantity',
					name: 'BilledQuantity',
					width: 120,
					forceVisible: true,
					toolTip: 'BQ Quantity',
					name$tr$: 'qto.main.BilledQuantity',
					// formatter: 'quantity',
					formatter: function (row, cell, value, columnDef, entity, plainText) {
						return boqMainDetailFormConfigService.initQuantityFormatter (row, cell, value, columnDef, entity, plainText);
					},
					formatterOptions:{
						decimalPlaces: function (columnDef, field) {
							return boqMainRoundingService.getUiRoundingDigits(columnDef,field, service);
						}
					},
					'type': 'quantity'
				},
				{
					id: 'iqprevquantity',
					field: 'IQPrevQuantity',
					name: 'IQPrevQuantity',
					width: 120,
					forceVisible:true,
					toolTip: 'IQ Previous Quantity',
					name$tr$: 'qto.main.IQPreviousQuantity',
					formatter: function (row, cell, value, columnDef, entity, plainText) {
						return boqMainDetailFormConfigService.initQuantityFormatter(row, cell, value, columnDef, entity, plainText);
					},
					formatterOptions:{
						decimalPlaces: function (columnDef, field) {
							return boqMainRoundingService.getUiRoundingDigits(columnDef,field, service);
						}
					},
					'type': 'quantity'
				},
				{
					id: 'bqprevquantity',
					field: 'BQPrevQuantity',
					name: 'BQPrevQuantity',
					width: 120,
					forceVisible:true,
					toolTip: 'BQ Previous Quantity',
					name$tr$: 'qto.main.BQPreviousQuantity',
					formatter: function (row, cell, value, columnDef, entity, plainText) {
						return boqMainDetailFormConfigService.initQuantityFormatter(row, cell, value, columnDef, entity, plainText);
					},
					formatterOptions:{
						decimalPlaces: function (columnDef, field) {
							return boqMainRoundingService.getUiRoundingDigits(columnDef,field, service);
						}
					},
					'type': 'quantity'
				},
				{
					id: 'iqremainingquantity',
					field: 'IQRemainingQuantity',
					name: 'IQRemainingQuantity',
					width: 120,
					forceVisible:true,
					toolTip: 'IQ Remaining Quantity',
					name$tr$: 'qto.main.IQRemainingQuantity',
					formatter: function (row, cell, value, columnDef, entity, plainText) {
						return boqMainDetailFormConfigService.initQuantityFormatter(row, cell, value, columnDef, entity, plainText);
					},
					formatterOptions:{
						decimalPlaces: function (columnDef, field) {
							return boqMainRoundingService.getUiRoundingDigits(columnDef,field, service);
						}
					},
					'type': 'quantity'
				},
				{
					id: 'bqremainingquantity',
					field: 'BQRemainingQuantity',
					name: 'BQRemainingQuantity',
					width: 120,
					forceVisible:true,
					toolTip: 'BQ Remaining Quantity',
					name$tr$: 'qto.main.BQRemainingQuantity',
					formatter: function (row, cell, value, columnDef, entity, plainText) {
						return boqMainDetailFormConfigService.initQuantityFormatter(row, cell, value, columnDef, entity, plainText);
					},
					formatterOptions:{
						decimalPlaces: function (columnDef, field) {
							return boqMainRoundingService.getUiRoundingDigits(columnDef,field, service);
						}
					},
					'type': 'quantity'
				},
				{
					id: 'iqtotalquantity',
					field: 'IQTotalQuantity',
					name: 'IQTotalQuantity',
					width: 120,
					forceVisible:true,
					toolTip: 'IQ Total Quantity',
					name$tr$: 'qto.main.IQTotalQuantity',
					formatter: function (row, cell, value, columnDef, entity, plainText) {
						return boqMainDetailFormConfigService.iQTotalQuantityFormatter(row, cell, value, columnDef, entity, plainText);
					},
					formatterOptions:{
						decimalPlaces: function (columnDef, field) {
							return boqMainRoundingService.getUiRoundingDigits(columnDef,field, service);
						}
					},
					'type': 'quantity'
				},
				{
					id: 'bqtotalquantity',
					field: 'BQTotalQuantity',
					name: 'BQTotalQuantity',
					width: 120,
					forceVisible:true,
					toolTip: 'BQ Total Quantity',
					name$tr$: 'qto.main.BQTotalQuantity',
					formatter: function (row, cell, value, columnDef, entity, plainText) {
						return boqMainDetailFormConfigService.iQTotalQuantityFormatter(row, cell, value, columnDef, entity, plainText);
					},
					formatterOptions:{
						decimalPlaces: function (columnDef, field) {
							return boqMainRoundingService.getUiRoundingDigits(columnDef,field, service);
						}
					},
					'type': 'quantity'
				},
				{
					id: 'ordquantity',
					field: 'OrdQuantity',
					name: 'OrdQuantity',
					width: 120,
					forceVisible: true,
					toolTip: 'Contract Quantity',
					name$tr$: 'boq.main.OrdQuantity',
					formatter: function (row, cell, value, columnDef, entity, plainText) {
						return boqMainDetailFormConfigService.initQuantityFormatter(row, cell, value, columnDef, entity, plainText);
					},
					formatterOptions:{
						decimalPlaces: function (columnDef, field) {
							return boqMainRoundingService.getUiRoundingDigits(columnDef,field, service);
						}
					},
					'type': 'quantity'
				},
				{
					id: 'cumulativepercentage',
					field: 'CumulativePercentage',
					name: 'CumulativePercentage',
					width: 120,
					forceVisible:true,
					toolTip: 'IQ Cumulative Percentage',
					name$tr$: 'qto.main.CumulativePercentage',
					formatter: function (row, cell, value, columnDef, entity, plainText) {
						return boqMainDetailFormConfigService.cumulativePercentageFormatter(row, cell, value, columnDef, entity, plainText);
					},
					'type': 'quantity'
				},
				{
					id: 'percentagequantity',
					field: 'PercentageQuantity',
					name: 'IQPercentageQuantity',
					width: 120,
					forceVisible:true,
					toolTip: 'Percentage Quantity',
					name$tr$: 'qto.main.PercentageQuantity',
					formatter: 'quantity',
					'type': 'quantity'
				},
				{
					id: 'bqcumulativepercentage',
					field: 'BQCumulativePercentage',
					name: 'BQCumulativePercentage',
					width: 120,
					forceVisible: true,
					toolTip: 'BQ Cumulative Percentage',
					name$tr$: 'qto.main.BQCumulativePercentage',
					formatter: function (row, cell, value, columnDef, entity, plainText) {
						return boqMainDetailFormConfigService.cumulativePercentageFormatter(row, cell, value, columnDef, entity, plainText);
					},
					'type': 'quantity'
				},
				{
					id: 'bqpercentagequantity',
					field: 'BQPercentageQuantity',
					name: 'BQPercentageQuantity',
					width: 120,
					forceVisible: true,
					toolTip: 'Percentage Quantity',
					name$tr$: 'qto.main.BQPercentageQuantity',
					formatter: 'quantity',
					'type': 'quantity'
				},
				{
					id: 'bqfinalprice',
					field: 'BQFinalPrice',
					name: 'BQFinalPrice',
					width: 120,
					forceVisible:true,
					toolTip: 'BQ Final Price',
					name$tr$: 'qto.main.BQFinalPrice',
					formatter: 'money'
				},
				{
					id: 'iqfinalprice',
					field: 'IQFinalPrice',
					name: 'IQFinalPrice',
					width: 120,
					forceVisible:true,
					toolTip: 'IQ Final Price',
					name$tr$: 'qto.main.IQFinalPrice',
					formatter: 'money'
				},
				{
					id: 'orderfinalprice',
					field: 'OrderFinalPrice',
					name: 'OrderFinalPrice',
					width: 120,
					forceVisible:true,
					toolTip: 'Contract Final Price',
					name$tr$: 'qto.main.OrderFinalPrice',
					formatter: 'money'
				},
				{
					id: 'bqtotalfinalprice',
					field: 'BQTotalFinalPrice',
					name: 'BQTotalFinalPrice',
					width: 120,
					forceVisible:true,
					toolTip: 'BQ Total Final Price',
					name$tr$: 'qto.main.BQTotalFinalPrice',
					formatter: 'money'
				},
				{
					id: 'iqtotalfinalprice',
					field: 'IQTotalFinalPrice',
					name: 'IQTotalFinalPrice',
					width: 120,
					forceVisible:true,
					toolTip: 'IQ Total Final Price',
					name$tr$: 'qto.main.IQTotalFinalPrice',
					formatter: 'money'
				}
				];
			dynamicConfigData.AQWQQuantityGroup  =[
				{
					id: 'quantityadj',
					field: 'QuantityAdj',
					name: 'QuantityAdj',
					width: 120,
					forceVisible:true,
					toolTip: 'QuantityAdj',
					name$tr$: 'boq.main.QuantityAdj',
					formatter: function (row, cell, value, columnDef, entity, plainText) {
						return boqMainDetailFormConfigService.initQuantityFormatter(row, cell, value, columnDef, entity, plainText);
					},
					formatterOptions:{
						decimalPlaces: function (columnDef, field) {
							return boqMainRoundingService.getUiRoundingDigits(columnDef,field, service);
						}
					},
					'type': 'quantity'
				},
				{
					id: 'quantityadjdetail',
					field: 'QuantityAdjDetail',
					name: 'QuantityAdjDetail',
					width: 120,
					forceVisible:true,
					toolTip: 'QuantityAdjDetail',
					name$tr$: 'qto.main.QuantityAdjDetail',
					'formatter': function (row, cell, value, columnDef, dataContext) {
						let formattedValue = $injector.get('basicsCommonStringFormatService').detail2CultureFormatter(row, cell, value, columnDef, dataContext);
						return formattedValue;
					},
					'type': 'string'
				},
				{
					id: 'quantity',
					field: 'Quantity',
					name: 'Quantity',
					width: 120,
					forceVisible:true,
					toolTip: 'Quantity',
					name$tr$: 'boq.main.Quantity',
					formatter: function (row, cell, value, columnDef, entity, plainText) {
						return boqMainDetailFormConfigService.initQuantityFormatter(row, cell, value, columnDef, entity, plainText);
					},
					formatterOptions:{
						decimalPlaces: function (columnDef, field) {
							return boqMainRoundingService.getUiRoundingDigits(columnDef,field, service);
						}
					},
					'type': 'quantity'
				},
				{
					id: 'quantitydetail',
					field: 'QuantityDetail',
					name: 'QuantityDetail',
					width: 120,
					forceVisible:true,
					toolTip: 'QuantityDetail',
					name$tr$: 'qto.main.QuantityDetail',
					'formatter': function (row, cell, value, columnDef, dataContext) {
						let formattedValue = $injector.get('basicsCommonStringFormatService').detail2CultureFormatter(row, cell, value, columnDef, dataContext);
						return formattedValue;
					},
					'type': 'string'
				},
				{
					id: 'quantitymax',
					field: 'QuantityMax',
					name: 'QuantityMax',
					width: 120,
					forceVisible:true,
					toolTip: 'Maximum Quantity',
					name$tr$: 'boq.main.QuantityMax',
					formatter: function (row, cell, value, columnDef, entity, plainText) {
						return boqMainDetailFormConfigService.initQuantityFormatter(row, cell, value, columnDef, entity, plainText);
					},
					formatterOptions:{
						decimalPlaces: function (columnDef, field) {
							return boqMainRoundingService.getUiRoundingDigits(columnDef,field, service);
						}
					},
					'type': 'quantity'
				},
				{
					id: 'isfreequantity',
					field: 'IsFreeQuantity',
					name: 'IsFreeQuantity',
					width: 120,
					forceVisible:true,
					toolTip: 'Free Quantity',
					name$tr$: 'boq.main.IsFreeQuantity',
					formatter: 'boolean',
					'type': 'boolean'
				},
				{
					id: 'calculatequantitysplitting',
					field: 'CalculateQuantitySplitting',
					name: 'CalculateQuantitySplitting',
					width: 120,
					forceVisible:true,
					toolTip: 'Calculate Quantity Splitting',
					name$tr$: 'boq.main.CalculateQuantitySplitting',
					formatter: function (row, cell, value, columnDef, entity, plainText) {
						return boqMainDetailFormConfigService.initQuantityFormatter(row, cell, value, columnDef, entity, plainText);
					},
					formatterOptions:{
						decimalPlaces: function (columnDef, field) {
							return boqMainRoundingService.getUiRoundingDigits(columnDef,field, service);
						}
					},
					'type': 'quantity'
				}
			];
			dynamicConfigData.GQQuantityGroup = [
				{
					id: 'guessedquantity',
					field: 'GuessedQuantity',
					name: 'GQ Quantity',
					width: 120,
					forceVisible: true,
					toolTip: 'GQ Quantity',
					name$tr$: 'qto.main.GuessedQuantity',
					formatter: function (row, cell, value, columnDef, entity, plainText) {
						return boqMainDetailFormConfigService.initQuantityFormatter (row, cell, value, columnDef, entity, plainText);
					},
					formatterOptions:{
						decimalPlaces: function (columnDef, field) {
							return boqMainRoundingService.getUiRoundingDigits(columnDef,field, service);
						}
					},
					'type': 'quantity'
				}
			];

			let serviceContainer = boqMainServiceFactory.createNewBoqMainService(option);
			serviceContainer.data.doNotLoadOnSelectionChange = true;
			serviceContainer.data.forceChildServiceUnload = true;
			serviceContainer.data.usesCache = true;
			serviceContainer.data.supportUpdateOnSelectionChanging = false;
			service.selectItemAfterReadData = false;
			service = serviceContainer.service;

			service.setContainerUUID('F116BD36D831483DA0364D1DB70AF4D7');

			// add filter in boq controller
			let boqServiceOption = service.getBoqServiceOption();
			qtoMainBoqFilterService.addMarkersChanged(service, boqServiceOption.hierarchicalNodeItem.presenter.tree, boqServiceOption.hierarchicalNodeItem.toolBar);

			service.selectedBoqHeaderChanged.register(function () {
				let list = service.getList(); // Delivers a flat list if there is a underlying hierachical tree
				// set the filter.
				var filterBoqs = $injector.get('qtoMainDetailService').filterBoqs;
				if (filterBoqs && list && list.length > 0){
					_.each(list, function (item){
						let index = _.indexOf(filterBoqs, item.Id);
						item.IsMarked = index !== -1;
					});

					if (lastSelectedItem) {
						if (lastSelectedItem !== service.getSelected()) {
							let index = _.findIndex(list, {'Id': lastSelectedItem.Id});
							if (index !== -1) {
								service.setSelected(lastSelectedItem);
							}
						}
					}
				}
			});

			service.setHighlight = function(item){
				highlightItem = item;
			};

			service.getHighlight = function (){
				return highlightItem;
			};

			service.setLastSelectedItem = function (item){
				lastSelectedItem = item;
			};

			service.getLastSelectedItem = function (){
				return lastSelectedItem;
			};

			// sum the qto detail result per boq tiem
			service.calculateQtoDetaiByBoqitem = function calculateQtoDetaiByBoqitem(qtoDetailList, boqItemList, boqItemFk){
				let tempDetailList = _.filter(qtoDetailList, {'BoqItemFk': boqItemFk});

				let isLineItemAssigned = _.some(tempDetailList, function(detail) {
					return !!detail.EstLineItemFk;
				});

				let wQuantites = 0, aQuantites = 0;
				let billQuantities = 0,installedQuantities= 0, guessedQuantities = 0;

				let qtoHeader = qtoMainHeaderDataService.getSelected();
				let isForWqAq = (qtoHeader.QtoTargetType === 3 || qtoHeader.QtoTargetType === 4);
				let isForPesIq = false;
				let isForIqNBq = false;
				let splitQuantityService = $injector.get('boqMainSplitQuantityServiceFactory').getService(service, 'qto.main');
				let splitItems = splitQuantityService.getList();
				if(isForWqAq){
					_.forEach(tempDetailList, function(tempDetail){
						if(tempDetail.IsAQ && tempDetail.WipHeaderFk ===  null && tempDetail.BilHeaderFk === null && tempDetail.PesHeaderFk === null && tempDetail.QtoLineTypeFk !== 8 && !tempDetail.IsBlocked){
							aQuantites += tempDetail.Result;
						}

						if(tempDetail.IsWQ && tempDetail.WipHeaderFk ===  null && tempDetail.BilHeaderFk === null && tempDetail.PesHeaderFk === null && tempDetail.QtoLineTypeFk !== 8 && !tempDetail.IsBlocked){
							wQuantites += tempDetail.Result;
						}
					});

					/* calculate split quantity */
					_.forEach(splitItems, function (splitItem) {
						let tempAQuantities = 0, tempWQuantities = 0;
						let qtoLines2BoqItem = _.filter(tempDetailList, {'BoqItemFk': splitItem.BoqItemFk});
						if(qtoLines2BoqItem.length > 0) {
							let qtoLines2SplitItem = _.filter(tempDetailList, {'BoqSplitQuantityFk': splitItem.Id});
							_.forEach(qtoLines2SplitItem, function (qtoLine2SplitItem) {
								if (qtoLine2SplitItem.IsAQ && qtoLine2SplitItem.WipHeaderFk === null && qtoLine2SplitItem.BilHeaderFk === null && qtoLine2SplitItem.PesHeaderFk === null && qtoLine2SplitItem.QtoLineTypeFk !== 8 && !qtoLine2SplitItem.IsBlocked) {
									tempAQuantities += qtoLine2SplitItem.Result;
								}

								if (qtoLine2SplitItem.IsWQ && qtoLine2SplitItem.WipHeaderFk === null && qtoLine2SplitItem.BilHeaderFk === null && qtoLine2SplitItem.PesHeaderFk === null && qtoLine2SplitItem.QtoLineTypeFk !== 8 && !qtoLine2SplitItem.IsBlocked) {
									tempWQuantities += qtoLine2SplitItem.Result;
								}
							});

							splitItem.Quantity = tempWQuantities;
							splitItem.QuantityAdj = tempAQuantities;
						}
					});

				}else {
					if(qtoHeader.QtoTargetType ===1){
						isForPesIq = true;
						isForIqNBq = false;
					}else {
						isForPesIq = false;
						isForIqNBq = true;
					}

					_.forEach(tempDetailList, function(tempDetail){
						if(tempDetail.IsIQ && tempDetail.WipHeaderFk ===  null && tempDetail.PesHeaderFk === null && tempDetail.QtoLineTypeFk !== 8 && !tempDetail.IsBlocked){
							installedQuantities += tempDetail.Result;
						}

						if(tempDetail.IsBQ && tempDetail.BilHeaderFk === null && tempDetail.PesHeaderFk === null && tempDetail.QtoLineTypeFk !== 8 && !tempDetail.IsBlocked){
							billQuantities += tempDetail.Result;
						}

						if(tempDetail.IsGQ && tempDetail.QtoLineTypeFk !== 8 && !tempDetail.IsBlocked){
							guessedQuantities += tempDetail.Result;
						}
					});

					/* calculate split quantity */
					_.forEach(splitItems, function (splitItem) {
						let tempBillQuantities = 0, tempInstalledQuantities = 0, tempGuessedQuantity = 0;
						let qtoLines2BoqItem = _.filter(tempDetailList, {'BoqItemFk': splitItem.BoqItemFk});
						if(qtoLines2BoqItem.length > 0) {
							let qtoLines2SplitItem = _.filter(tempDetailList, {'BoqSplitQuantityFk': splitItem.Id});
							_.forEach(qtoLines2SplitItem, function (qtoLine2SplitItem) {
								if (qtoLine2SplitItem.IsIQ && qtoLine2SplitItem.WipHeaderFk === null && qtoLine2SplitItem.PesHeaderFk === null && qtoLine2SplitItem.QtoLineTypeFk !== 8 && !qtoLine2SplitItem.IsBlocked) {
									tempInstalledQuantities += qtoLine2SplitItem.Result;
								}

								if (qtoLine2SplitItem.IsBQ && qtoLine2SplitItem.BilHeaderFk === null && qtoLine2SplitItem.PesHeaderFk === null && qtoLine2SplitItem.QtoLineTypeFk !== 8 && !qtoLine2SplitItem.IsBlocked) {
									tempBillQuantities += qtoLine2SplitItem.Result;
								}

								if (qtoLine2SplitItem.IsGQ) {
									tempGuessedQuantity += qtoLine2SplitItem.Result;
								}
							});

							splitItem.InstalledQuantity = tempInstalledQuantities;
							splitItem.IQQuantityTotal = splitItem.IQPreviousQuantity + tempInstalledQuantities;
							splitItem.BilledQuantity = tempBillQuantities;
							splitItem.BQQuantityTotal = splitItem.BQPreviousQuantity + tempBillQuantities;
							splitItem.GuessedQuantity = tempGuessedQuantity;
						}
					});
				}

				splitQuantityService.gridRefresh();

				let tempBoqItem = _.find(boqItemList, {'Id': boqItemFk});
				if(tempBoqItem) {
					let promise = $q.when(true);
					let qtoMainLineItemDataService = $injector.get('qtoMainLineItemDataService');
					if (isForIqNBq && isLineItemAssigned) {
						let lineItems = qtoMainLineItemDataService.getList();
						if (lineItems.length === 0) {
							promise = qtoMainLineItemDataService.load();
						}
					}

					promise.then(function () {
						tempBoqItem.Quantity = isForWqAq ? wQuantites : tempBoqItem.Quantity;
						tempBoqItem.QuantityAdj = isForWqAq ? aQuantites : tempBoqItem.QuantityAdj;

						tempBoqItem.InstalledQuantity = installedQuantities;
						tempBoqItem.BilledQuantity = billQuantities;
						tempBoqItem.GuessedQuantity = guessedQuantities;

						if (isForIqNBq && isLineItemAssigned){
							let lineItemIds = _.map(tempDetailList, 'EstLineItemFk');
							let allLineItems = qtoMainLineItemDataService.getList();
							let filteredLineItems = _.filter(allLineItems, (lineItem) => _.includes(lineItemIds, lineItem.Id));
							let qtoMainLineItemHelperService = $injector.get('qtoMainLineItemHelperService');
							tempBoqItem.InstalledQuantity = qtoMainLineItemHelperService.calcBoqQuantiyWithLineItemQty(tempBoqItem, filteredLineItems, 'IqQuantity');
							tempBoqItem.BilledQuantity = qtoMainLineItemHelperService.calcBoqQuantiyWithLineItemQty(tempBoqItem, filteredLineItems, 'BqQuantity');
						}

						if (isForPesIq) {
							tempBoqItem.IQRemainingQuantity = (tempBoqItem.OrdQuantity - tempBoqItem.IQPrevQuantity) < 0 ? 0 : tempBoqItem.OrdQuantity - tempBoqItem.IQPrevQuantity;
							tempBoqItem.IQTotalQuantity = tempBoqItem.IQPrevQuantity + tempBoqItem.InstalledQuantity;
						} else if (isForIqNBq) {
							tempBoqItem.IQRemainingQuantity = (tempBoqItem.OrdQuantity - tempBoqItem.IQPrevQuantity) < 0 ? 0 : tempBoqItem.OrdQuantity - tempBoqItem.IQPrevQuantity;
							tempBoqItem.IQTotalQuantity = tempBoqItem.IQPrevQuantity + tempBoqItem.InstalledQuantity;

							tempBoqItem.BQRemainingQuantity = (tempBoqItem.OrdQuantity - tempBoqItem.BQPrevQuantity) < 0 ? 0 : tempBoqItem.OrdQuantity - tempBoqItem.BQPrevQuantity;
							tempBoqItem.BQTotalQuantity = tempBoqItem.BQPrevQuantity + tempBoqItem.BilledQuantity;
						}

						service.calProcess(tempBoqItem);
						if (tempBoqItem) {
							service.boqItemQuantityChanged.fire(tempBoqItem);

							if (service.isCrbBoq() && tempBoqItem.BoqLineTypeFk === 11) {
								let boqPosition = _.find(service.getList(), {'Id': tempBoqItem.BoqItemFk});

								boqPosition.Quantity = 0;
								boqPosition.QuantityAdj = 0;
								boqPosition.InstalledQuantity = 0;
								boqPosition.BilledQuantity = 0;
								boqPosition.GuessedQuantity = 0;
								if (isForPesIq) {
									boqPosition.IQRemainingQuantity = 0;
									boqPosition.IQTotalQuantity = 0;
								}
								if (isForIqNBq) {
									boqPosition.IQRemainingQuantity = 0;
									boqPosition.IQTotalQuantity = 0;

									boqPosition.BQRemainingQuantity = 0;
									boqPosition.BQTotalQuantity = 0;
								}

								let boqMainCrbBoqItemService = $injector.get('boqMainCrbBoqItemService');
								_.forEach(_.filter(boqPosition.BoqItems, function (subQuantity) {
									return boqMainCrbBoqItemService.isSubQuantityUsedForTheCalculation(subQuantity);
								}), function (subQuantity) {
									boqPosition.Quantity += subQuantity.Quantity;
									boqPosition.QuantityAdj += subQuantity.QuantityAdj;
									boqPosition.InstalledQuantity += subQuantity.InstalledQuantity;
									boqPosition.BilledQuantity += subQuantity.BilledQuantity;
									if (isForPesIq) {
										boqPosition.IQRemainingQuantity += subQuantity.IQRemainingQuantity;
										boqPosition.IQTotalQuantity += subQuantity.IQTotalQuantity;
									}
									if (isForIqNBq) {
										boqPosition.IQRemainingQuantity += subQuantity.IQRemainingQuantity;
										boqPosition.IQTotalQuantity += subQuantity.IQTotalQuantity;

										boqPosition.BQRemainingQuantity += subQuantity.BQRemainingQuantity;
										boqPosition.BQTotalQuantity += subQuantity.BQTotalQuantity;
									}
								});

								service.calProcess(boqPosition);
								service.calcCumulativePercentage(boqPosition);
								service.calcPercentageQuantity(boqPosition);
							}

							if (tempBoqItem.IsOenBoq) {
								let list = service.getList();
								let rootItem = service.getRootBoqItem();
								if (rootItem && _.isArray(list) && list.length > 0) {
									service.calcTotalPriceAndHoursForBoq();
								}

							} else {
								service.calcItemsPriceHoursNew(tempBoqItem, true);
								service.calcCumulativePercentage(tempBoqItem);
								service.calcPercentageQuantity(tempBoqItem);
							}
						}
						service.gridRefresh();
						service.setReadonlyInQto(tempBoqItem);
					});
				}
			};

			service.CalculateBoqItemByWipOrPesChange = function(boqItem, boqItemList, rootItem){
				if(boqItem) {
					service.calProcess(boqItem);
					if(rootItem){
						service.calculateBoqItem(rootItem, boqItemList);
					}
					service.gridRefresh();
					service.setReadonlyInQto(boqItem);
				}
			};

			// calculate PrevQuantity, TotalQuantity, OrdQuantity, RemQuantity and TotalPrice
			service.calculateBoqItem = function calculateBoqItem(rootItem, list) {
				let calculatedProperties = ['TotalPrice', 'TotalHours', 'Finalprice'];

				let mySumValues = {total: 0, hours: 0, totalPrice: 0, totalHours: 0};

				// Recursively dig deeper
				service.calcChildTree(rootItem, mySumValues, calculatedProperties, list);

				if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Finalprice') !== -1) {
					rootItem.DiscountedPrice  = 0; // On this level there is no accumulated discounted price
					if (rootItem.IsLumpsum) {
						rootItem.Finalprice = rootItem.LumpsumPrice;
					}
					else {
						rootItem.Finalprice = mySumValues.total;
					}
					// Calculate the discount values
					let discount = rootItem.Discount;
					if (rootItem.DiscountPercentIt !== 0 && rootItem.Discount === 0) {
						discount = (rootItem.Finalprice * rootItem.DiscountPercentIt / 100);
					}
					rootItem.Finalprice -= discount; // discount => abs (-)
				}
				if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Hours') !== -1) {
					rootItem.Hours += mySumValues.hours;
				}
				// eslint-disable-next-line no-prototype-builtins
				if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalPrice') !== -1 && rootItem.hasOwnProperty('TotalQuantity')) {
					rootItem.TotalPrice += mySumValues.totalPrice;
					let totalpriceDiscount = rootItem.Discount;
					if (rootItem.DiscountPercentIt !== 0 && rootItem.Discount === 0) {
						totalpriceDiscount  = (rootItem.TotalPrice * rootItem.DiscountPercentIt / 100);
					}
					rootItem.TotalPrice -= totalpriceDiscount; // discount => abs (-)
				}
				// eslint-disable-next-line no-prototype-builtins
				if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalHours') !== -1 && rootItem.hasOwnProperty('TotalQuantity')) {
					rootItem.TotalHours += mySumValues.totalHours;
				}
			};

			service.calProcess = function calProcess(item){
				calcTotalQuantity(item);
				service.calcTotalPrice(item);
			};

			service.calcTotalPrice = function calcTotalPrice(item) {
				// eslint-disable-next-line no-prototype-builtins
				if (item.hasOwnProperty('TotalQuantity')) {
					item.PreEscalationTotal = item.DiscountedUnitprice * item.TotalQuantity* item.Factor;
					item.TotalPrice = item.PreEscalationTotal + item.ExtraTotal;
				}

				if(item.IsOenBoq) {

					let qtoHeader = qtoMainHeaderDataService.getSelected();
					let lvHeader  = qtoHeader ? qtoHeader.OenLvHeader : null;
					if(service.isItemWithIT(item)){
						if(lvHeader && lvHeader.IsWithPriceShares){
							item.BQItemTotalUrb1 = item.Urb1 * item.BilledQuantity;
							item.BQItemTotalUrb2 = item.Urb2 * item.BilledQuantity;
							item.BQItemTotal = item.BQItemTotalUrb1+item.BQItemTotalUrb2;

							item.IQItemTotalUrb1 = item.Urb1 * item.InstalledQuantity;
							item.IQItemTotalUrb2 = item.Urb2 * item.InstalledQuantity;
							item.IQItemTotal = item.IQItemTotalUrb1+item.IQItemTotalUrb2;

							item.IQItemTotalFPUrb1 = item.Urb1 * item.IQTotalQuantity;
							item.IQItemTotalFPUrb2 = item.Urb2 * item.IQTotalQuantity;
							item.IQTotalFinalTotal = item.IQItemTotalFPUrb1+item.IQItemTotalFPUrb2;

							item.BQItemTotalFPUrb1 = item.Urb1 * item.BQTotalQuantity;
							item.BQItemTotalFPUrb2 = item.Urb2 * item.BQTotalQuantity;
							item.BQTotalFinalTotal = item.BQItemTotalFPUrb1+item.BQItemTotalFPUrb2;

							item.OrdItemTotalUrb1 = item.Urb1 * item.OrdQuantity;
							item.OrdItemTotalUrb2 = item.Urb2 * item.OrdQuantity;
							item.OrdItemTotal = item.OrdItemTotalUrb1+item.OrdItemTotalUrb2;

						}else{
							item.BQItemTotalUrb1 = 0;
							item.BQItemTotalUrb2 = 0;
							item.BQItemTotal = item.Price * item.BilledQuantity;

							item.IQItemTotalUrb1 = 0;
							item.IQItemTotalUrb2 = 0;
							item.IQItemTotal = item.Price* item.InstalledQuantity;


							item.IQItemTotalFPUrb1 = 0;
							item.IQItemTotalFPUrb2 = 0;
							item.IQTotalFinalTotal = item.Price* item.IQTotalQuantity;

							item.BQItemTotalFPUrb1 = 0;
							item.BQItemTotalFPUrb2 = 0;
							item.BQTotalFinalTotal = item.Price* item.BQTotalQuantity;

							item.OrdItemTotalUrb1 = 0;
							item.OrdItemTotalUrb2 = 0;
							item.OrdItemTotal = item.Price* item.OrdQuantity;
						}
					}
				}else {
					item.totalBQItemTotalOc = item.BilledQuantity * item.PriceOc * item.Factor;
					item.totalBQFinalPriceOc = (item.totalBQItemTotalOc + item.ExtraIncrementOc) * (1 - item.DiscountPercent / 100);

					item.totalIQItemTotalOc = item.InstalledQuantity * item.PriceOc * item.Factor;
					item.totalIQFinalPriceOc = (item.totalIQItemTotalOc + item.ExtraIncrementOc) * (1 - item.DiscountPercent / 100);

					item.totalIQTotalFPOc = item.IQTotalQuantity * item.PriceOc * item.Factor;
					item.totalIQTotalFinalPriceOc = (item.totalIQTotalFPOc + item.ExtraIncrementOc) * (1 - item.DiscountPercent / 100);

					item.totalBQTotalFPOc = item.BQTotalQuantity * item.PriceOc * item.Factor;
					item.totalBQTotalFinalPriceOc = (item.totalBQTotalFPOc + item.ExtraIncrementOc) * (1 - item.DiscountPercent / 100);

					item.totalOrdItemTotalOc = item.OrdQuantity * item.PriceOc * item.Factor;
					item.totalOrdFinalPriceOc = (item.totalOrdItemTotalOc + item.ExtraIncrementOc) * (1 - item.DiscountPercent / 100);
				}
				// eslint-disable-next-line no-prototype-builtins
				if(item.hasOwnProperty('PrevQuantity')){
					item.PrevPeriodPrice = item.DiscountedUnitprice * item.PrevQuantity;
				}
			};

			function calcTotalQuantity(item) {
				item.TotalQuantity = item.Quantity + (item.PrevQuantity ? item.PrevQuantity : 0);
				if (item.OrdQuantity > item.TotalQuantity) {
					item.RemQuantity = item.OrdQuantity - item.TotalQuantity;
				}
				else {
					item.RemQuantity = 0;
				}
			}

			service.setSelectedBoq2QtoLine = function setSelectedBoq2QtoLine(e, item) {
				$injector.get('qtoMainDetailService').setSelectBoq(item);
				if (!_.isEmpty(item) && 0 === item.BoqLineTypeFk) {
					$injector.get('qtoMainCreationService').addCreationProcessor('qtoBoqStructureController', function (creationItem) {
						creationItem.BoqItemFk = item.Id;
					});
				} else {
					$injector.get('qtoMainCreationService').removeCreationProcessor('qtoBoqStructureController');
				}

				// service.setReadonlyInQto(item);
			};

			service.setReadonlyInQto = function(item){
				// set the readonly in qto
				$injector.get('platformRuntimeDataService').readonly(item, [
					{field:  'Quantity', readonly: 'readonly'},
					{field:  'QuantityDetail', readonly: 'readonly'},
					{field:  'QuantityAdj', readonly: 'readonly'},
					{field:  'QuantityAdjDetail', readonly: 'readonly'},
					{field:  'TotalQuantity', readonly: 'readonly'},
					{field:  'BoqLineTypeFk', readonly: 'readonly'}
				]);
			};

			service.setReadonlyForBoq = function (item) {
				let fields = [];
				_.forOwn(item, function (value, key) {
					let field = {field: key, readonly: true};
					fields.push(field);
				});

				$injector.get('platformRuntimeDataService').readonly(item, fields);
			};

			service.setOriginalToolItems = function (toolItems) {
				originalToolItems = toolItems;
			};

			service.getOriginalToolItems = function () {
				return  originalToolItems;
			};

			service.setGrid = function setGrid(value){
				gridId = value;
			};

			service.getGrid = function getGrid(){
				return gridId;
			};


			service.calcQtoBoqOrdPreEscalation = function calcQtoBoqOrdPreEscalation (sumValues,childItem){
				if(childItem.IsOenBoq){

					sumValues.IQPreEscalation +=  service.isItemWithIT(childItem) ? (childItem.Price * childItem.InstalledQuantity * childItem.Factor): 0;

					sumValues.BQPreEscalation +=  service.isItemWithIT(childItem) ? (childItem.Price * childItem.BilledQuantity * childItem.Factor): 0;

					sumValues.IQFPPreEscalation +=  service.isItemWithIT(childItem) ? (childItem.Price * childItem.IQTotalQuantity * childItem.Factor): 0;
					sumValues.BQFPPreEscalation +=  service.isItemWithIT(childItem) ? (childItem.Price * childItem.BQTotalQuantity * childItem.Factor): 0;

					sumValues.OrderPreEscalation += service.isItemWithIT(childItem) ? (childItem.Price * childItem.OrdQuantity * childItem.Factor) : 0;


					if (Object.prototype.hasOwnProperty.call(childItem, 'IQTotalQuantity')) {
						sumValues.PreEscalationTotalForIQ += childItem.IQTotalQuantity * childItem.Factor * childItem.Price;
					}

					if (Object.prototype.hasOwnProperty.call(childItem, 'BQTotalQuantity')) {
						sumValues.PreEscalationTotalForBQ += childItem.BQTotalQuantity * childItem.Factor* childItem.Price;
					}

				}else {
					sumValues.OrderPreEscalation += service.isItemWithIT(childItem) ? (childItem.DiscountedUnitprice * childItem.OrdQuantity * childItem.Factor) : 0;
				}
			};

			service.calcQtoBoqSumValues = function calcQtoBoqSumValues (sumValues,childItem){
				sumValues.totalBQFinalPriceOc += childItem.totalBQFinalPriceOc;

				sumValues.totalIQFinalPriceOc += childItem.totalIQFinalPriceOc;

				sumValues.totalIQTotalFinalPriceOc += childItem.totalIQTotalFinalPriceOc;
				sumValues.totalBQTotalFinalPriceOc += childItem.totalBQTotalFinalPriceOc;

				sumValues.totalOrdFinalPriceOc += childItem.totalOrdFinalPriceOc;

				if(childItem.IsOenBoq){
					sumValues.BQItemTotal += childItem.BQItemTotal;
					sumValues.BQItemTotalUrb1 += childItem.BQItemTotalUrb1;
					sumValues.BQItemTotalUrb2 += childItem.BQItemTotalUrb2;


					sumValues.IQItemTotal += childItem.IQItemTotal;
					sumValues.IQItemTotalUrb1 += childItem.IQItemTotalUrb1;
					sumValues.IQItemTotalUrb2 += childItem.IQItemTotalUrb2;


					sumValues.IQTotalFinalTotal += childItem.IQTotalFinalTotal;
					sumValues.IQItemTotalFPUrb1 += childItem.IQItemTotalFPUrb1;
					sumValues.IQItemTotalFPUrb2 += childItem.IQItemTotalFPUrb2;


					sumValues.BQTotalFinalTotal += childItem.BQTotalFinalTotal;
					sumValues.BQItemTotalFPUrb1 += childItem.BQItemTotalFPUrb1;
					sumValues.BQItemTotalFPUrb2 += childItem.BQItemTotalFPUrb2;

					sumValues.OrdItemTotal += childItem.OrdItemTotal;
					sumValues.OrdItemTotalUrb1 += childItem.OrdItemTotalUrb1;
					sumValues.OrdItemTotalUrb2 += childItem.OrdItemTotalUrb2;
				}else{
					sumValues.BQItemTotal = childItem.BQItemTotal;
					sumValues.BQItemTotalUrb1 = childItem.BQItemTotalUrb1;
					sumValues.BQItemTotalUrb2 = childItem.BQItemTotalUrb2;

					sumValues.IQItemTotal = childItem.IQItemTotal;
					sumValues.IQItemTotalUrb1 = childItem.IQItemTotalUrb1;
					sumValues.IQItemTotalUrb2 = childItem.IQItemTotalUrb2;

					sumValues.IQTotalFinalTotal = childItem.IQTotalFinalTotal;
					sumValues.IQItemTotalFPUrb1 = childItem.IQItemTotalFPUrb1;
					sumValues.IQItemTotalFPUrb2 = childItem.IQItemTotalFPUrb2;

					sumValues.BQTotalFinalTotal = childItem.BQTotalFinalTotal;
					sumValues.BQItemTotalFPUrb1 = childItem.BQItemTotalFPUrb1;
					sumValues.BQItemTotalFPUrb2 = childItem.BQItemTotalFPUrb2;

					sumValues.OrdItemTotal = childItem.OrdItemTotal;
					sumValues.OrdItemTotalUrb1 = childItem.OrdItemTotalUrb1;
					sumValues.OrdItemTotalUrb2 = childItem.OrdItemTotalUrb2;
				}

			};

			service.calcQtoBoqRootItemNewFinalPrice = function calcQtoBoqRootItemNewFinalPrice (sumValues,rootItem) {
				rootItem.totalBQFinalPriceOc = sumValues.totalBQFinalPriceOc;

				rootItem.totalIQFinalPriceOc = sumValues.totalIQFinalPriceOc;

				rootItem.totalOrdFinalPriceOc = sumValues.totalOrdFinalPriceOc;

				rootItem.totalIQTotalFinalPriceOc =sumValues.totalIQTotalFinalPriceOc;

				rootItem.totalBQTotalFinalPriceOc =sumValues.totalBQTotalFinalPriceOc;

				if (rootItem.IsOenBoq) {
					let qtoHeader = qtoMainHeaderDataService.getSelected();
					let lvHeader = qtoHeader.OenLvHeader;

					let exchangeRate = service.getCurrentExchangeRate();

					// root :103 DivisionLevelFirst:1 DivisionLevelSecond:2,DivisionLevelThird;3 DivisionLevelFourth:4
					if (lvHeader && (rootItem.BoqLineTypeFk === boqMainLineTypes.root && lvHeader.IsAllowedBoqDiscount ||
						 rootItem.BoqLineTypeFk === boqMainLineTypes.level1 && lvHeader.IsAllowedHgDiscount ||
						 rootItem.BoqLineTypeFk === boqMainLineTypes.level2 && lvHeader.IsAllowedOgDiscount ||
						 rootItem.BoqLineTypeFk === boqMainLineTypes.level3 && lvHeader.IsAllowedLgDiscount ||
						 rootItem.BoqLineTypeFk === boqMainLineTypes.level4 && lvHeader.IsAllowedUlgDiscount)) {
						if (lvHeader.IsWithPriceShares && !lvHeader.IsSumDiscount) {
							rootItem.Urb1 = rootItem.Urb1Oc / exchangeRate;
							rootItem.Urb2 = rootItem.Urb2Oc / exchangeRate;

							let discountUrb1 = sumValues.BQItemTotalUrb1 * rootItem.DiscountPercentItUrb1 / 100;
							let discountUrb2 = sumValues.BQItemTotalUrb2 * rootItem.DiscountPercentItUrb2 / 100;
							let discount = discountUrb1 + discountUrb2;
							rootItem.BQFinalPrice = sumValues.BQItemTotal - discount;

							rootItem.BQItemTotal = sumValues.BQItemTotal;
							rootItem.BQItemTotalUrb1 = sumValues.BQItemTotalUrb1;
							rootItem.BQItemTotalUrb2 = sumValues.BQItemTotalUrb2;

							discountUrb1 = sumValues.IQItemTotalUrb1 * rootItem.DiscountPercentItUrb1 / 100;
							discountUrb2 = sumValues.IQItemTotalUrb2 * rootItem.DiscountPercentItUrb2 / 100;
							discount = discountUrb1 + discountUrb2;
							rootItem.IQFinalPrice = sumValues.IQItemTotal - discount;

							rootItem.IQItemTotal = sumValues.IQItemTotal;
							rootItem.IQItemTotalUrb1 = sumValues.IQItemTotalUrb1;
							rootItem.IQItemTotalUrb2 = sumValues.IQItemTotalUrb2;

							discountUrb1 = sumValues.IQItemTotalFPUrb1 * rootItem.DiscountPercentItUrb1 / 100;
							discountUrb2 = sumValues.IQItemTotalFPUrb2 * rootItem.DiscountPercentItUrb2 / 100;
							discount = discountUrb1 + discountUrb2;
							rootItem.IQTotalFinalPrice = sumValues.IQTotalFinalTotal - discount;

							rootItem.IQTotalFinalTotal = sumValues.IQTotalFinalTotal;
							rootItem.IQItemTotalFPUrb1 = sumValues.IQItemTotalFPUrb1;
							rootItem.IQItemTotalFPUrb2 = sumValues.IQItemTotalFPUrb2;

							discountUrb1 = sumValues.BQItemTotalFPUrb1 * rootItem.DiscountPercentItUrb1 / 100;
							discountUrb2 = sumValues.BQItemTotalFPUrb2 * rootItem.DiscountPercentItUrb2 / 100;
							discount = discountUrb1 + discountUrb2;
							rootItem.BQTotalFinalPrice = sumValues.BQTotalFinalTotal - discount;

							rootItem.BQTotalFinalTotal = sumValues.BQTotalFinalTotal;
							rootItem.BQItemTotalFPUrb1 = sumValues.BQItemTotalFPUrb1;
							rootItem.BQItemTotalFPUrb2 = sumValues.BQItemTotalFPUrb2;


							discountUrb1 = sumValues.OrdItemTotalUrb1 * rootItem.DiscountPercentItUrb1 / 100;
							discountUrb2 = sumValues.OrdItemTotalUrb2 * rootItem.DiscountPercentItUrb2 / 100;
							discount = discountUrb1 + discountUrb2;
							rootItem.OrderFinalPrice = sumValues.OrdItemTotal - discount;

							rootItem.OrdItemTotal = sumValues.OrdItemTotal;
							rootItem.OrdItemTotalUrb1 = sumValues.OrdItemTotalUrb1;
							rootItem.OrdItemTotalUrb2 = sumValues.OrdItemTotalUrb2;

						} else {
							let ordDiscount = sumValues.OrdItemTotal * rootItem.DiscountPercentIt / 100;
							let bqDiscount = sumValues.BQItemTotal * rootItem.DiscountPercentIt / 100;
							let iqDiscount = sumValues.IQItemTotal * rootItem.DiscountPercentIt / 100;

							let iqTotalFPDiscount = sumValues.IQTotalFinalTotal * rootItem.DiscountPercentIt / 100;
							let bqTotalFPDiscount = sumValues.BQTotalFinalTotal * rootItem.DiscountPercentIt / 100;

							rootItem.BQFinalPrice = rootItem.BQItemTotal - bqDiscount;
							rootItem.IQFinalPrice = rootItem.IQItemTotal - iqDiscount;

							rootItem.IQTotalFinalPrice = rootItem.IQTotalFinalTotal - iqTotalFPDiscount;
							rootItem.BQTotalFinalPrice = rootItem.BQTotalFinalTotal - bqTotalFPDiscount;
							rootItem.OrderFinalPrice = rootItem.OrdItemTotal - ordDiscount;

							rootItem.BQItemTotal = sumValues.BQItemTotal;
							rootItem.BQItemTotalUrb1 = sumValues.BQItemTotalUrb1;
							rootItem.BQItemTotalUrb2 = sumValues.BQItemTotalUrb2;

							rootItem.IQItemTotal = sumValues.IQItemTotal;
							rootItem.IQItemTotalUrb1 = sumValues.IQItemTotalUrb1;
							rootItem.IQItemTotalUrb2 = sumValues.IQItemTotalUrb2;

							rootItem.IQTotalFinalTotal = sumValues.IQTotalFinalTotal;
							rootItem.IQItemTotalFPUrb1 = sumValues.IQItemTotalFPUrb1;
							rootItem.IQItemTotalFPUrb2 = sumValues.IQItemTotalFPUrb2;

							rootItem.BQTotalFinalTotal = sumValues.BQTotalFinalTotal;
							rootItem.BQItemTotalFPUrb1 = sumValues.BQItemTotalFPUrb1;
							rootItem.BQItemTotalFPUrb2 = sumValues.BQItemTotalFPUrb2;

							rootItem.OrdItemTotal = sumValues.OrdItemTotal;
							rootItem.OrdItemTotalUrb1 = sumValues.OrdItemTotalUrb1;
							rootItem.OrdItemTotalUrb2 = sumValues.OrdItemTotalUrb2;

							rootItem.PreEscalationTotalForIQ = sumValues.PreEscalationTotalForIQ;
							rootItem.PreEscalationTotalForBQ = sumValues.PreEscalationTotalForBQ;

						}
					} else {
						rootItem.BQFinalPrice = sumValues.BQItemTotal;
						rootItem.IQFinalPrice = sumValues.IQItemTotal;

						rootItem.BQTotalFinalPrice = sumValues.BQTotalFinalTotal;
						rootItem.IQTotalFinalPrice = sumValues.IQTotalFinalTotal;

						rootItem.OrderFinalPrice = sumValues.OrdItemTotal;


						rootItem.BQItemTotal = sumValues.BQItemTotal;
						rootItem.BQItemTotalUrb1 = sumValues.BQItemTotalUrb1;
						rootItem.BQItemTotalUrb2 = sumValues.BQItemTotalUrb2;


						rootItem.IQItemTotal = sumValues.IQItemTotal;
						rootItem.IQItemTotalUrb1 = sumValues.IQItemTotalUrb1;
						rootItem.IQItemTotalUrb2 = sumValues.IQItemTotalUrb2;


						rootItem.IQTotalFinalTotal = sumValues.IQTotalFinalTotal;
						rootItem.IQItemTotalFPUrb1 = sumValues.IQItemTotalFPUrb1;
						rootItem.IQItemTotalFPUrb2 = sumValues.IQItemTotalFPUrb2;

						rootItem.BQTotalFinalTotal = sumValues.BQTotalFinalTotal;
						rootItem.BQItemTotalFPUrb1 = sumValues.BQItemTotalFPUrb1;
						rootItem.BQItemTotalFPUrb2 = sumValues.BQItemTotalFPUrb2;

						rootItem.OrdItemTotal = sumValues.OrdItemTotal;
						rootItem.OrdItemTotalUrb1 = sumValues.OrdItemTotalUrb1;
						rootItem.OrdItemTotalUrb2 = sumValues.OrdItemTotalUrb2;

						rootItem.PreEscalationTotalForIQ = sumValues.PreEscalationTotalForIQ;
						rootItem.PreEscalationTotalForBQ = sumValues.PreEscalationTotalForBQ;

					}
				} else {

					if (rootItem.DiscountPercentIt !== 0 && rootItem.Discount === 0) {
						rootItem.totalBQFinalPriceOc -= (rootItem.totalBQFinalPriceOc * rootItem.DiscountPercentIt / 100);
						rootItem.totalIQFinalPriceOc -= (rootItem.totalIQFinalPriceOc * rootItem.DiscountPercentIt / 100);

						rootItem.totalIQTotalFinalPriceOc -= (rootItem.totalIQTotalFinalPriceOc * rootItem.DiscountPercentIt / 100);
						rootItem.totalBQTotalFinalPriceOc -= (rootItem.totalBQTotalFinalPriceOc * rootItem.DiscountPercentIt / 100);

						rootItem.totalOrdFinalPriceOc -= (rootItem.totalOrdFinalPriceOc * rootItem.DiscountPercentIt / 100);
					}

					if (rootItem.IsLumpsum) {
						let tbqfp = (rootItem.totalBQFinalPriceOc * 100 * ((100 - rootItem.DiscountPercentIt) / 100) * 100) / 10000;
						rootItem.totalBQFinalPriceOc = sumValues.totalBQFinalPriceOc = rootItem.BQFinalPrice = tbqfp;

						let tiqfp = (rootItem.totalIQFinalPriceOc * 100 * ((100 - rootItem.DiscountPercentIt) / 100) * 100) / 10000;
						rootItem.totalIQFinalPriceOc = sumValues.totalIQFinalPriceOc = rootItem.IQFinalPrice = tiqfp;

						let tiqtotalfp = (rootItem.totalIQTotalFinalPriceOc * 100 * ((100 - rootItem.DiscountPercentIt) / 100) * 100) / 10000;
						rootItem.totalIQTotalFinalPriceOc = sumValues.totalIQTotalFinalPriceOc = rootItem.IQTotalFinalPrice = tiqtotalfp;

						let tbqtotalfp = (rootItem.totalBQTotalFinalPriceOc * 100 * ((100 - rootItem.DiscountPercentIt) / 100) * 100) / 10000;
						rootItem.totalBQTotalFinalPriceOc = sumValues.totalBQTotalFinalPriceOc = rootItem.BQTotalFinalPrice = tbqtotalfp;


						let tordfp = (rootItem.totalOrdFinalPriceOc * 100 * ((100 - rootItem.DiscountPercentIt) / 100) * 100) / 10000;
						rootItem.totalOrdFinalPriceOc = sumValues.totalOrdFinalPriceOc = rootItem.OrderFinalPrice = tordfp;

					} else {
						rootItem.BQFinalPrice = rootItem.totalBQFinalPriceOc;

						rootItem.IQFinalPrice = rootItem.totalIQFinalPriceOc;

						rootItem.BQTotalFinalPrice = rootItem.totalBQTotalFinalPriceOc;
						rootItem.IQTotalFinalPrice = rootItem.totalIQTotalFinalPriceOc;

						rootItem.OrderFinalPrice = rootItem.totalOrdFinalPriceOc;
					}

				}

			};

			service.initQtoSumValues = function initQtoSumValues (sumValues){
				sumValues.totalBQFinalPrice =0;
				sumValues.totalBQFinalPriceOc =0;

				sumValues.totalIQFinalPrice =0;
				sumValues.totalIQFinalPriceOc =0;

				sumValues.totalIQTotalFinalPriceOc =0;
				sumValues.totalBQTotalFinalPriceOc =0;

				sumValues.totalOrdFinalPrice =0;
				sumValues.totalOrdFinalPriceOc =0;

				sumValues.OrderPreEscalation =0;

				sumValues.BQItemTotal = 0;
				sumValues.BQItemTotalUrb1 =0;
				sumValues.BQItemTotalUrb2 = 0;

				sumValues.IQItemTotal = 0;
				sumValues.IQItemTotalUrb1 = 0;
				sumValues.IQItemTotalUrb2 = 0;

				sumValues.IQTotalFinalTotal = 0;
				sumValues.IQItemTotalFPUrb1 = 0;
				sumValues.IQItemTotalFPUrb2 = 0;

				sumValues.BQTotalFinalTotal = 0;
				sumValues.BQItemTotalFPUrb1 = 0;
				sumValues.BQItemTotalFPUrb2 = 0;

				sumValues.OrdItemTotal =0;
				sumValues.OrdItemTotalUrb1 = 0;
				sumValues.OrdItemTotalUrb2 = 0;
			};

			service.calcQtoBoqNewFinalPrice = function calcQtoBoqNewFinalPrice(item){

				if(item.IsOenBoq){
					if(service.isItemWithIT(item)){
						item.BQFinalPrice = item.BQItemTotal ;
						item.IQFinalPrice = item.IQItemTotal;

						item.BQTotalFinalPrice = item.BQTotalFinalTotal;
						item.IQTotalFinalPrice = item.IQTotalFinalTotal;

						item.OrderFinalPrice = item.OrdItemTotal;
					}
				}else {
					// Finalprice = (ItemTotal + ExtraIncrement) * (1 -DiscountPercent / 100)
					item.BQItemTotal = item.BilledQuantity * item.Price * item.Factor;
					item.BQFinalPrice = service.isItemWithIT(item) ? (item.BQItemTotal + item.ExtraIncrement) * (1 - item.DiscountPercent / 100) : 0;

					item.IQItemTotal = item.InstalledQuantity * item.Price * item.Factor;
					item.IQFinalPrice = service.isItemWithIT(item) ? (item.IQItemTotal + item.ExtraIncrement) * (1 - item.DiscountPercent / 100) : 0;

					item.IQTotalFinalTotal = item.IQTotalQuantity * item.Price * item.Factor;
					item.IQTotalFinalPrice = service.isItemWithIT(item) ? (item.IQTotalFinalTotal + item.ExtraIncrement) * (1 - item.DiscountPercent / 100) : 0;

					item.BQTotalFinalTotal = item.BQTotalQuantity * item.Price * item.Factor;
					item.BQTotalFinalPrice = service.isItemWithIT(item) ? (item.BQTotalFinalTotal + item.ExtraIncrement) * (1 - item.DiscountPercent / 100) : 0;

					item.OrderPreEscalation = service.isItemWithIT(item) ? (item.DiscountedUnitprice * item.OrdQuantity * item.Factor) : 0;
					item.OrderItemTotal = item.OrdQuantity * item.Price * item.Factor;
					item.OrderFinalPrice = service.isItemWithIT(item) ? (item.OrderItemTotal + item.ExtraIncrement) * (1 - item.DiscountPercent / 100) : 0;

					item.DiscountedPriceIQOc = item.DiscountedUnitpriceOc * item.InstalledQuantity * item.Factor;
					item.DiscountedPriceBQOc = item.DiscountedUnitpriceOc * item.BilledQuantity * item.Factor;
					item.DiscountedPriceOrderOc = item.DiscountedUnitpriceOc * item.OrdQuantity * item.Factor;

					item.PreEscalationIQOc = service.isItemWithIT(item) ? item.DiscountedPriceIQOc : 0;
					item.PreEscalationBQOc = service.isItemWithIT(item) ? item.DiscountedPriceBQOc : 0;
					item.PreEscalationOrderOc = service.isItemWithIT(item) ? item.DiscountedPriceOrderOc : 0;

					item.IQItemTotalOc = item.InstalledQuantity * item.PriceOc * item.Factor;
					item.IQFinalPriceOC = service.isItemWithIT(item) ? (item.IQItemTotalOc + item.ExtraIncrementOc) * (1 - item.DiscountPercent / 100) : 0;

					item.BQItemTotalOc = item.BilledQuantity * item.PriceOc * item.Factor;
					item.BQFinalPriceOC = service.isItemWithIT(item) ? (item.BQItemTotalOc + item.ExtraIncrementOc) * (1 - item.DiscountPercent / 100) : 0;

					item.OrderItemTotalOc = item.OrdQuantity * item.PriceOc * item.Factor;
					item.OrderFinalPriceOC = service.isItemWithIT(item) ? (item.OrderItemTotalOc + item.ExtraIncrementOc) * (1 - item.DiscountPercent / 100) : 0;
				}
			};

			service.reSetQtoBoqParentNewFinalPrice= function reSetQtoBoqParentNewFinalPrice(parentItem) {
				parentItem.BQFinalPrice = 0;
				parentItem.IQFinalPrice = 0;

				parentItem.BQTotalFinalPrice = 0;
				parentItem.IQTotalFinalPrice = 0;

				parentItem.OrderFinalPrice = 0;

				parentItem.BQFinalPriceOC = 0;
				parentItem.IQFinalPriceOC = 0;
				parentItem.OrderFinalPriceOC = 0;

				parentItem.PreEscalationIQOc = 0;
				parentItem.PreEscalationBQOc = 0;
				parentItem.PreEscalationOrderOc = 0;
				parentItem.OrderPreEscalation = 0;

				parentItem.DiscountedPriceIQOc = 0;
				parentItem.DiscountedPriceBQOc = 0;
				parentItem.DiscountedPriceOrderOc = 0;
			};

			service.sumQtoBoqParentNewFinalPrice = function sumQtoBoqParentNewFinalPrice(parentItem,childItem) {
				let bqFinalPrice = _.isNaN(childItem.BQFinalPrice) || _.isUndefined(childItem.BQFinalPrice) ? 0 : childItem.BQFinalPrice;
				let iqFinalPrice = _.isNaN(childItem.IQFinalPrice) || _.isUndefined(childItem.IQFinalPrice)? 0 : childItem.IQFinalPrice;
				let orderFinalPrice = _.isNaN(childItem.OrderFinalPrice) || _.isUndefined(childItem.OrderFinalPrice)? 0 : childItem.OrderFinalPrice;

				let bqTotalFinalPrice = _.isNaN(childItem.BQTotalFinalPrice) || _.isUndefined(childItem.BQTotalFinalPrice) ? 0 : childItem.BQTotalFinalPrice;
				let iqTotalFinalPrice = _.isNaN(childItem.IQTotalFinalPrice) || _.isUndefined(childItem.IQTotalFinalPrice) ? 0 : childItem.IQTotalFinalPrice;

				if(parentItem.IsOenBoq){
					if(service.isItemWithIT(childItem)) {
						parentItem.BQItemTotal += childItem.BQItemTotal;
						parentItem.BQItemTotalUrb1 += childItem.BQItemTotalUrb1;
						parentItem.BQItemTotalUrb2 += childItem.BQItemTotalUrb2;


						parentItem.IQItemTotal += childItem.IQItemTotal;
						parentItem.IQItemTotalUrb1 += childItem.IQItemTotalUrb1;
						parentItem.IQItemTotalUrb2 += childItem.IQItemTotalUrb2;

						parentItem.IQTotalFinalTotal += childItem.IQTotalFinalTotal;
						parentItem.IQItemTotalFPUrb1 += childItem.IQItemTotalFPUrb1;
						parentItem.IQItemTotalFPUrb2 += childItem.IQItemTotalFPUrb2;

						parentItem.BQTotalFinalTotal += childItem.BQTotalFinalTotal;
						parentItem.BQItemTotalFPUrb1 += childItem.BQItemTotalFPUrb1;
						parentItem.BQItemTotalFPUrb2 += childItem.BQItemTotalFPUrb2;


						parentItem.OrdItemTotal += childItem.OrdItemTotal;
						parentItem.OrdItemTotalUrb1 += childItem.OrdItemTotalUrb1;
						parentItem.OrdItemTotalUrb2 += childItem.OrdItemTotalUrb2;
					}else{
						parentItem.BQItemTotal = childItem.BQItemTotal;
						parentItem.BQItemTotalUrb1 = childItem.BQItemTotalUrb1;
						parentItem.BQItemTotalUrb2 = childItem.BQItemTotalUrb2;


						parentItem.IQItemTotal = childItem.IQItemTotal;
						parentItem.IQItemTotalUrb1 = childItem.IQItemTotalUrb1;
						parentItem.IQItemTotalUrb2 = childItem.IQItemTotalUrb2;

						parentItem.IQTotalFinalTotal = childItem.IQTotalFinalTotal;
						parentItem.IQItemTotalFPUrb1 = childItem.IQItemTotalFPUrb1;
						parentItem.IQItemTotalFPUrb2 = childItem.IQItemTotalFPUrb2;

						parentItem.BQTotalFinalTotal = childItem.BQTotalFinalTotal;
						parentItem.BQItemTotalFPUrb1 = childItem.BQItemTotalFPUrb1;
						parentItem.BQItemTotalFPUrb2 = childItem.BQItemTotalFPUrb2;


						parentItem.OrdItemTotal = childItem.OrdItemTotal;
						parentItem.OrdItemTotalUrb1 = childItem.OrdItemTotalUrb1;
						parentItem.OrdItemTotalUrb2 = childItem.OrdItemTotalUrb2;
					}


					let qtoHeader = qtoMainHeaderDataService.getSelected();
					let lvHeader  = qtoHeader.OenLvHeader;

					let exchangeRate = service.getCurrentExchangeRate();

					// root :103 DivisionLevelFirst:1 DivisionLevelSecond:2,DivisionLevelThird;3 DivisionLevelFourth:4
					if (lvHeader && parentItem.BoqLineTypeFk === boqMainLineTypes.root && lvHeader.IsAllowedBoqDiscount ||
						parentItem.BoqLineTypeFk === boqMainLineTypes.level1 && lvHeader.IsAllowedHgDiscount ||
						 parentItem.BoqLineTypeFk === boqMainLineTypes.level2 && lvHeader.IsAllowedOgDiscount ||
						 parentItem.BoqLineTypeFk === boqMainLineTypes.level3 && lvHeader.IsAllowedLgDiscount ||
						 parentItem.BoqLineTypeFk === boqMainLineTypes.level4 && lvHeader.IsAllowedUlgDiscount)
					{

						if(lvHeader.IsWithPriceShares && !lvHeader.IsSumDiscount) {
							parentItem.Urb1 = parentItem.Urb1Oc / exchangeRate;
							parentItem.Urb2 = parentItem.Urb2Oc / exchangeRate;

							let discountUrb1 = parentItem.BQItemTotalUrb1 * parentItem.DiscountPercentItUrb1 / 100;
							let discountUrb2 = parentItem.BQItemTotalUrb2 * parentItem.DiscountPercentItUrb2 / 100;
							let discount = discountUrb1 + discountUrb2;
							parentItem.BQFinalPrice = parentItem.BQItemTotal - discount;



							discountUrb1 = parentItem.IQItemTotalUrb1 * parentItem.DiscountPercentItUrb1 / 100;
							discountUrb2 = parentItem.IQItemTotalUrb2 * parentItem.DiscountPercentItUrb2 / 100;
							discount = discountUrb1 + discountUrb2;
							parentItem.IQFinalPrice = parentItem.IQItemTotal - discount;

							discountUrb1 = parentItem.IQItemTotalFPUrb1 * parentItem.DiscountPercentItUrb1 / 100;
							discountUrb2 = parentItem.IQItemTotalFPUrb2 * parentItem.DiscountPercentItUrb2 / 100;
							discount = discountUrb1 + discountUrb2;
							parentItem.IQTotalFinalPrice = parentItem.IQTotalFinalTotal - discount;


							discountUrb1 = parentItem.BQItemTotalFPUrb1 * parentItem.DiscountPercentItUrb1 / 100;
							discountUrb2 = parentItem.BQItemTotalFPUrb2 * parentItem.DiscountPercentItUrb2 / 100;
							discount = discountUrb1 + discountUrb2;
							parentItem.BQTotalFinalPrice = parentItem.BQTotalFinalTotal - discount;


							discountUrb1 = parentItem.IQItemTotalUrb1 * parentItem.DiscountPercentItUrb1 / 100;
							discountUrb2 = parentItem.IQItemTotalUrb2 * parentItem.DiscountPercentItUrb2 / 100;
							discount = discountUrb1 + discountUrb2;
							parentItem.OrderFinalPrice = parentItem.OrdItemTotal - discount;


						}else{
							let ordDiscount = parentItem.OrdItemTotal * parentItem.DiscountPercentIt / 100;
							let bqDiscount = parentItem.BQItemTotal * parentItem.DiscountPercentIt / 100;
							let iqDiscount = parentItem.IQItemTotal * parentItem.DiscountPercentIt / 100;

							let bqTotalFPDiscount = parentItem.BQTotalFinalTotal * parentItem.DiscountPercentIt / 100;
							let iqTotalFPDiscount = parentItem.IQTotalFinalTotal * parentItem.DiscountPercentIt / 100;

							parentItem.BQFinalPrice = parentItem.BQItemTotal - bqDiscount;
							parentItem.IQFinalPrice = parentItem.IQItemTotal - iqDiscount;

							parentItem.BQTotalFinalPrice = parentItem.BQTotalFinalTotal - bqTotalFPDiscount;
							parentItem.IQTotalFinalPrice = parentItem.IQTotalFinalTotal - iqTotalFPDiscount;

							parentItem.OrderFinalPrice = parentItem.OrdItemTotal - ordDiscount;

						}

					}else{
						parentItem.BQFinalPrice = parentItem.BQItemTotal;
						parentItem.IQFinalPrice = parentItem.IQItemTotal;

						parentItem.BQTotalFinalPrice = parentItem.BQTotalFinalTotal;
						parentItem.IQTotalFinalPrice = parentItem.IQTotalFinalTotal;

						parentItem.OrderFinalPrice = parentItem.OrdItemTotal;
					}
				}else {
					if (parentItem.IsLumpsum) {
						let bqFinalPriceLumpsum = (bqFinalPrice * 100 * ((100 - parentItem.DiscountPercentIt) / 100) * 100) / 10000;
						parentItem.BQFinalPrice += (bqFinalPriceLumpsum * 100 * ((100 - parentItem.DiscountPercentIt) / 100) * 100) / 10000;


						let iqFinalPriceLumpsum = (iqFinalPrice * 100 * ((100 - parentItem.DiscountPercentIt) / 100) * 100) / 10000;
						parentItem.IQFinalPrice += (iqFinalPriceLumpsum * 100 * ((100 - parentItem.DiscountPercentIt) / 100) * 100) / 10000;

						let bqTotalFPLumpSum = (bqTotalFinalPrice * 100 * ((100 - parentItem.DiscountPercentIt) / 100) * 100) / 10000;
						parentItem.BQTotalFinalPrice += (bqTotalFPLumpSum * 100 * ((100 - parentItem.DiscountPercentIt) / 100) * 100) / 10000;

						let iqTotalFPLumpSum = (iqTotalFinalPrice * 100 * ((100 - parentItem.DiscountPercentIt) / 100) * 100) / 10000;
						parentItem.IQTotalFinalPrice += (iqTotalFPLumpSum * 100 * ((100 - parentItem.DiscountPercentIt) / 100) * 100) / 10000;

						let orderFinalPriceLumpsum = (orderFinalPrice * 100 * ((100 - parentItem.DiscountPercentIt) / 100) * 100) / 10000;
						parentItem.OrderFinalPrice += (orderFinalPriceLumpsum * 100 * ((100 - parentItem.DiscountPercentIt) / 100) * 100) / 10000;

					} else {
						parentItem.BQFinalPrice += (bqFinalPrice * 100 * ((100 - parentItem.DiscountPercentIt) / 100) * 100) / 10000;
						parentItem.IQFinalPrice += (iqFinalPrice * 100 * ((100 - parentItem.DiscountPercentIt) / 100) * 100) / 10000;

						parentItem.BQTotalFinalPrice += (bqTotalFinalPrice * 100 * ((100 - parentItem.DiscountPercentIt) / 100) * 100) / 10000;
						parentItem.IQTotalFinalPrice += (iqTotalFinalPrice * 100 * ((100 - parentItem.DiscountPercentIt) / 100) * 100) / 10000;

						parentItem.OrderFinalPrice += (orderFinalPrice * 100 * ((100 - parentItem.DiscountPercentIt) / 100) * 100) / 10000;
					}
					if (childItem.OrderPreEscalation) {
						parentItem.OrderPreEscalation += childItem.OrderPreEscalation;
					} else {
						let orderPreEscalation = service.isItemWithIT(childItem) ? (childItem.DiscountedUnitprice * childItem.OrdQuantity * childItem.Factor) : 0;
						parentItem.OrderPreEscalation += orderPreEscalation;
					}
				}
			};

			service.initQtoBoqNewFinalPrices = function initQtoBoqNewFinalPrices(boqItem,sumValues) {
				if ((boqMainCommonService.isItem(boqItem) || (boqItem.IsCrbBoq && boqItem.BoqLineTypeFk === 11)) && !boqItem.IsOenBoq) {

					// Finalprice = (ItemTotal + ExtraIncrement) * (1 -DiscountPercent / 100)
					boqItem.BQPreEscalation = service.isItemWithIT(boqItem) ? (boqItem.DiscountedUnitprice * boqItem.BilledQuantity * boqItem.Factor) : 0;
					boqItem.BQItemTotal = boqItem.BilledQuantity * boqItem.Price * boqItem.Factor;
					boqItem.BQFinalPrice = service.isItemWithIT(boqItem) ? (boqItem.BQItemTotal + boqItem.ExtraIncrement) * (1 - boqItem.DiscountPercent / 100) : 0;

					boqItem.IQPreEscalation = service.isItemWithIT(boqItem) ? (boqItem.DiscountedUnitprice * boqItem.InstalledQuantity * boqItem.Factor) : 0;

					boqItem.IQFPPreEscalation = service.isItemWithIT(boqItem) ? (boqItem.DiscountedUnitprice * boqItem.IQTotalQuantity * boqItem.Factor) : 0;
					boqItem.BQFPPreEscalation = service.isItemWithIT(boqItem) ? (boqItem.DiscountedUnitprice * boqItem.BQTotalQuantity * boqItem.Factor) : 0;

					boqItem.IQItemTotal = boqItem.InstalledQuantity * boqItem.Price * boqItem.Factor;
					boqItem.IQFinalPrice = service.isItemWithIT(boqItem) ? (boqItem.IQItemTotal + boqItem.ExtraIncrement) * (1 - boqItem.DiscountPercent / 100) : 0;

					boqItem.IQTotalFinalTotal = boqItem.IQTotalQuantity * boqItem.Price * boqItem.Factor;
					boqItem.IQTotalFinalPrice = service.isItemWithIT(boqItem) ? (boqItem.IQTotalFinalTotal + boqItem.ExtraIncrement) * (1 - boqItem.DiscountPercent / 100) : 0;

					boqItem.BQTotalFinalTotal = boqItem.BQTotalQuantity * boqItem.Price * boqItem.Factor;
					boqItem.BQTotalFinalPrice = service.isItemWithIT(boqItem) ? (boqItem.BQTotalFinalTotal + boqItem.ExtraIncrement) * (1 - boqItem.DiscountPercent / 100) : 0;


					boqItem.OrderPreEscalation = service.isItemWithIT(boqItem) ? (boqItem.DiscountedUnitprice * boqItem.OrdQuantity * boqItem.Factor) : 0;
					boqItem.OrderItemTotal = boqItem.OrdQuantity * boqItem.Price * boqItem.Factor;
					boqItem.OrderFinalPrice =  service.isItemWithIT(boqItem) ? (boqItem.OrderItemTotal + boqItem.ExtraIncrement) * (1 - boqItem.DiscountPercent / 100) : 0;
				}else if( boqItem.IsOenBoq){

					let exchangeRate = service.getCurrentExchangeRate();
					let qtoHeader = qtoMainHeaderDataService.getSelected();
					let lvHeader  = qtoHeader.OenLvHeader;

					if(boqMainCommonService.isItem(boqItem)) {
						if (lvHeader && lvHeader.IsWithPriceShares) {
							boqItem.Urb1 = boqItem.Urb1Oc / exchangeRate;
							boqItem.Urb2 = boqItem.Urb2Oc / exchangeRate;

							let BQItemTotalUrb1 = boqItem.Urb1 * boqItem.BilledQuantity;
							let BQItemTotalUrb2 = boqItem.Urb2 * boqItem.BilledQuantity;

							boqItem.BQItemTotal = BQItemTotalUrb1 + BQItemTotalUrb2;
							boqItem.BQItemTotalUrb1 = BQItemTotalUrb1;
							boqItem.BQItemTotalUrb2 = BQItemTotalUrb2;
							boqItem.BQFinalPrice = boqItem.BQItemTotal;

							let IQItemTotalUrb1 = boqItem.Urb1 * boqItem.InstalledQuantity;
							let IQItemTotalUrb2 = boqItem.Urb2 * boqItem.InstalledQuantity;

							boqItem.IQItemTotal = IQItemTotalUrb1 + IQItemTotalUrb2;
							boqItem.IQItemTotalUrb1 = IQItemTotalUrb1;
							boqItem.IQItemTotalUrb2 = IQItemTotalUrb2;
							boqItem.IQFinalPrice = boqItem.IQItemTotal;

							let IQItemTotalFPUrb1 = boqItem.Urb1 * boqItem.IQTotalQuantity;
							let IQItemTotalFPUrb2 = boqItem.Urb2 * boqItem.IQTotalQuantity;
							boqItem.IQItemTotalFPUrb1 = IQItemTotalFPUrb1;
							boqItem.IQItemTotalFPUrb2 = IQItemTotalFPUrb2;
							boqItem.IQTotalFinalTotal = IQItemTotalFPUrb1+IQItemTotalFPUrb2;
							boqItem.IQTotalFinalPrice = boqItem.IQTotalFinalTotal;

							let BQItemTotalFPUrb1 = boqItem.Urb1 * boqItem.BQTotalQuantity;
							let BQItemTotalFPUrb2 = boqItem.Urb2 * boqItem.BQTotalQuantity;
							boqItem.BQItemTotalFPUrb1 = BQItemTotalFPUrb1;
							boqItem.BQItemTotalFPUrb2 = BQItemTotalFPUrb2;
							boqItem.BQTotalFinalTotal = BQItemTotalFPUrb1+BQItemTotalFPUrb2;
							boqItem.BQTotalFinalPrice = boqItem.BQTotalFinalTotal;

							let OrdItemTotalUrb1 = boqItem.Urb1 * boqItem.OrdQuantity;
							let OrdItemTotalUrb2 = boqItem.Urb2 * boqItem.OrdQuantity;

							boqItem.OrdItemTotal = OrdItemTotalUrb1 + OrdItemTotalUrb2;
							boqItem.OrdItemTotalUrb1 = OrdItemTotalUrb1;
							boqItem.OrdItemTotalUrb2 = OrdItemTotalUrb2;
							boqItem.OrderFinalPrice = boqItem.OrdItemTotal;

						} else {
							boqItem.BQItemTotalUrb1 = 0;
							boqItem.BQItemTotalUrb2 = 0;
							boqItem.IQItemTotalUrb1 = 0;
							boqItem.IQItemTotalUrb2 = 0;

							boqItem.BQItemTotalFPUrb1=0;
							boqItem.BQItemTotalFPUrb2=0;
							boqItem.IQItemTotalFPUrb1=0;
							boqItem.IQItemTotalFPUrb2=0;

							boqItem.OrdItemTotalUrb1 = 0;
							boqItem.OrdItemTotalUrb2 = 0;

							boqItem.BQPreEscalation = service.isItemWithIT(boqItem) ? (boqItem.Price * boqItem.BilledQuantity * boqItem.Factor) : 0;
							boqItem.BQFinalPrice = service.isItemWithIT(boqItem) ? (boqItem.BQPreEscalation + boqItem.ExtraIncrement) * (1 - boqItem.DiscountPercent / 100) : 0;

							boqItem.IQPreEscalation = service.isItemWithIT(boqItem) ? (boqItem.Price * boqItem.InstalledQuantity * boqItem.Factor) : 0;
							boqItem.IQFinalPrice = service.isItemWithIT(boqItem) ? (boqItem.IQPreEscalation + boqItem.ExtraIncrement) * (1 - boqItem.DiscountPercent / 100) : 0;

							boqItem.IQFPPreEscalation = service.isItemWithIT(boqItem) ? (boqItem.Price * boqItem.IQTotalQuantity * boqItem.Factor) : 0;
							boqItem.IQTotalFinalPrice = service.isItemWithIT(boqItem) ? (boqItem.IQFPPreEscalation + boqItem.ExtraIncrement) * (1 - boqItem.DiscountPercent / 100) : 0;

							boqItem.BQFPPreEscalation = service.isItemWithIT(boqItem) ? (boqItem.Price * boqItem.BQTotalQuantity * boqItem.Factor) : 0;
							boqItem.BQTotalFinalPrice = service.isItemWithIT(boqItem) ? (boqItem.BQFPPreEscalation + boqItem.ExtraIncrement) * (1 - boqItem.DiscountPercent / 100) : 0;

							boqItem.OrderPreEscalation = service.isItemWithIT(boqItem) ? (boqItem.Price * boqItem.OrdQuantity * boqItem.Factor) : 0;
							boqItem.OrderFinalPrice = service.isItemWithIT(boqItem) ? (boqItem.OrderPreEscalation + boqItem.ExtraIncrement) * (1 - boqItem.DiscountPercent / 100) : 0;
						}
					}else if(boqMainCommonService.isDivisionOrRoot(boqItem)) {
						if (lvHeader && (boqItem.BoqLineTypeFk === boqMainLineTypes.root && lvHeader.IsAllowedBoqDiscount ||
							 boqItem.BoqLineTypeFk === boqMainLineTypes.level1 && lvHeader.IsAllowedHgDiscount ||
							 boqItem.BoqLineTypeFk === boqMainLineTypes.level2 && lvHeader.IsAllowedOgDiscount ||
							 boqItem.BoqLineTypeFk === boqMainLineTypes.level3 && lvHeader.IsAllowedLgDiscount ||
							 boqItem.BoqLineTypeFk === boqMainLineTypes.level4 && lvHeader.IsAllowedUlgDiscount)) {

							if(lvHeader.IsWithPriceShares && !lvHeader.IsSumDiscount) {
								boqItem.Urb1 = boqItem.Urb1Oc / exchangeRate;
								boqItem.Urb2 = boqItem.Urb2Oc / exchangeRate;

								let discountUrb1 = sumValues.BQItemTotalUrb1 * boqItem.DiscountPercentItUrb1 / 100;
								let discountUrb2 = sumValues.BQItemTotalUrb2 * boqItem.DiscountPercentItUrb2 / 100;
								let discount = discountUrb1 + discountUrb2;
								sumValues.BQItemTotal = boqItem.BQFinalPrice = boqItem.BQItemTotal - discount;

								discountUrb1 = sumValues.IQItemTotalUrb1 * boqItem.DiscountPercentItUrb1 / 100;
								discountUrb2 = sumValues.IQItemTotalUrb2 * boqItem.DiscountPercentItUrb2 / 100;
								discount = discountUrb1 + discountUrb2;
								sumValues.IQItemTotal =boqItem.IQFinalPrice = boqItem.IQItemTotal - discount;

								discountUrb1 = sumValues.IQItemTotalFPUrb1 * boqItem.DiscountPercentItUrb1 / 100;
								discountUrb2 = sumValues.IQItemTotalFPUrb2 * boqItem.DiscountPercentItUrb2 / 100;
								discount = discountUrb1 + discountUrb2;
								sumValues.IQTotalFinalTotal =boqItem.IQTotalFinalPrice = boqItem.IQTotalFinalTotal - discount;

								discountUrb1 = sumValues.BQItemTotalFPUrb1 * boqItem.DiscountPercentItUrb1 / 100;
								discountUrb2 = sumValues.BQItemTotalFPUrb2 * boqItem.DiscountPercentItUrb2 / 100;
								discount = discountUrb1 + discountUrb2;
								sumValues.BQTotalFinalTotal =boqItem.BQTotalFinalPrice = boqItem.BQTotalFinalTotal - discount;


								discountUrb1 = sumValues.OrdItemTotalUrb1 * boqItem.DiscountPercentItUrb1 / 100;
								discountUrb2 = sumValues.OrdItemTotalUrb2 * boqItem.DiscountPercentItUrb2 / 100;
								discount = discountUrb1 + discountUrb2;
								sumValues.OrdItemTotal = boqItem.OrderFinalPrice = boqItem.OrdItemTotal - discount;

							}else{
								let ordDiscount = boqItem.OrdItemTotal * boqItem.DiscountPercentIt / 100;
								let bqDiscount = boqItem.BQItemTotal * boqItem.DiscountPercentIt / 100;
								let iqDiscount = boqItem.IQItemTotal * boqItem.DiscountPercentIt / 100;

								let iqTotalFPDiscount = boqItem.IQTotalFinalTotal * boqItem.DiscountPercentIt / 100;
								let bqTotalFPDiscount = boqItem.BQTotalFinalTotal * boqItem.DiscountPercentIt / 100;

								boqItem.BQFinalPrice = boqItem.BQItemTotal - bqDiscount;
								boqItem.IQFinalPrice = boqItem.IQItemTotal - iqDiscount;

								boqItem.BQTotalFinalPrice = boqItem.BQTotalFinalTotal - bqTotalFPDiscount;
								boqItem.IQTotalFinalPrice = boqItem.IQTotalFinalTotal - iqTotalFPDiscount;

								boqItem.OrderFinalPrice = boqItem.OrdItemTotal - ordDiscount;
							}
						}else {
							boqItem.BQFinalPrice = boqItem.BQItemTotal ? boqItem.BQItemTotal : 0;
							boqItem.IQFinalPrice = boqItem.IQItemTotal ? boqItem.IQItemTotal : 0;

							boqItem.BQTotalFinalPrice = boqItem.BQTotalFinalTotal ? boqItem.BQTotalFinalTotal : 0;
							boqItem.IQTotalFinalPrice = boqItem.IQTotalFinalTotal ? boqItem.IQTotalFinalTotal : 0;

							boqItem.OrderFinalPrice = boqItem.OrdItemTotal ? boqItem.OrdItemTotal : 0;
						}
					}
				}
			};

			service.calcPercentageQuantity = function calcPercentageQuantity(boqItem) {
				if (_.isObject(boqItem) && Object.hasOwnProperty.call(boqItem, 'IQTotalQuantity') && Object.hasOwnProperty.call(boqItem, 'BQTotalQuantity')) {
					if (boqMainCommonService.isItem(boqItem) || (boqItem.IsCrbBoq && boqItem.BoqLineTypeFk === 11)) {
						boqItem.PercentageQuantity = boqItem.OrdQuantity === 0 ? 0 : boqItem.InstalledQuantity / boqItem.OrdQuantity * 100;
						boqItem.BQPercentageQuantity = boqItem.OrdQuantity === 0 ? 0 : boqItem.BilledQuantity / boqItem.OrdQuantity * 100;

						if(service.isCrbBoq() && boqMainCommonService.isItem(boqItem) && _.isArray(boqItem.BoqItems) && boqItem.BoqItems.length > 0){
							_.forEach(boqItem.BoqItems, function(subQuantity){
								service.calcPercentageQuantity(subQuantity);
							});
						}
					}else if (boqMainCommonService.isDivisionOrRoot(boqItem)) {
						boqItem.PercentageQuantity = (!_.isNumber(boqItem.OrdItemTotal) || boqItem.OrdItemTotal === 0) ? 0 : boqItem.IQPreEscalation / boqItem.OrdItemTotal * 100;
						boqItem.BQPercentageQuantity = (!_.isNumber(boqItem.OrdItemTotal) || boqItem.OrdItemTotal === 0) ? 0 : boqItem.BQPreEscalation / boqItem.OrdItemTotal * 100;
					}
				}
			};

			service.calcCumulativePercentage = function calcCumulativePercentage(boqItem) {
				if (_.isObject(boqItem) && Object.hasOwnProperty.call(boqItem, 'IQTotalQuantity') && Object.hasOwnProperty.call(boqItem, 'BQTotalQuantity')) {
					if (boqMainCommonService.isItem(boqItem) || (boqItem.IsCrbBoq && boqItem.BoqLineTypeFk === 11)) {

						boqItem.CumulativePercentage = boqItem.OrdQuantity === 0 ? 0 : boqItem.IQTotalQuantity / boqItem.OrdQuantity * 100;
						boqItem.BQCumulativePercentage = boqItem.OrdQuantity === 0 ? 0 : boqItem.BQTotalQuantity / boqItem.OrdQuantity * 100;

						if(service.isCrbBoq() && boqMainCommonService.isItem(boqItem) && _.isArray(boqItem.BoqItems) && boqItem.BoqItems.length > 0){
							_.forEach(boqItem.BoqItems, function(subQuantity){
								service.calcCumulativePercentage(subQuantity);
							});
						}
					} else if (boqMainCommonService.isDivisionOrRoot(boqItem)) {
						boqItem.CumulativePercentage = (!_.isNumber(boqItem.OrdItemTotal) || boqItem.OrdItemTotal === 0) ? 0 : boqItem.PreEscalationTotalForIQ / boqItem.OrdItemTotal * 100;
						boqItem.BQCumulativePercentage = (!_.isNumber(boqItem.OrdItemTotal) || boqItem.OrdItemTotal === 0) ? 0 : boqItem.PreEscalationTotalForBQ / boqItem.OrdItemTotal * 100;
					}
				}
			};

			service.loadQtoBoqDynamicColumns = function loadQtoBoqDynamicColumns(dynamicService){
				let addSourceQuantityColumn = function (){
					dynamicConfigData.AQWQQuantityGroup.push({
						id: 'ExQtoQuantity',
						field: 'ExQtoQuantity',
						name: 'Project(Quantity)',
						width: 120,
						forceVisible: true,
						toolTip: 'Project(Quantity)',
						name$tr$: 'qto.main.exQtoQuantity',
						formatter: function (row, cell, value, columnDef, entity, plainText) {
							return boqMainDetailFormConfigService.initQuantityFormatter(row, cell, value, columnDef, entity, plainText);
						},
						formatterOptions: {
							decimalPlaces: function (columnDef, field) {
								return boqMainRoundingService.getUiRoundingDigits(columnDef, field, service);
							}
						},
						'type': 'quantity'
					});

					dynamicConfigData.AQWQQuantityGroup.push({
						id: 'ExQtoQuantityAdj',
						field: 'ExQtoQuantityAdj',
						name: 'AQ-Quantity(Project)',
						width: 120,
						forceVisible: true,
						toolTip: 'AQ-Quantity(Project)',
						name$tr$: 'qto.main.exQtoQuantityAdj',
						formatter: function (row, cell, value, columnDef, entity, plainText) {
							return boqMainDetailFormConfigService.initQuantityFormatter(row, cell, value, columnDef, entity, plainText);
						},
						formatterOptions: {
							decimalPlaces: function (columnDef, field) {
								return boqMainRoundingService.getUiRoundingDigits(columnDef, field, service);
							}
						},
						'type': 'quantity'
					});
				};

				let qtoHeader = qtoMainHeaderDataService.getSelected();

				if (qtoHeader && (qtoHeader.QtoTargetType === 2 || qtoHeader.QtoTargetType === 1)) {
					dynamicService.detachDataForList('AQWQQuantityGroup');
					dynamicService.attachDynColConfigForList({'IQBQQuantityGroup': dynamicConfigData.IQBQQuantityGroup});
				} else if (qtoHeader && (qtoHeader.QtoTargetType === 3 || qtoHeader.QtoTargetType === 4)) {
					dynamicService.detachDataForList('IQBQQuantityGroup');
					if (qtoHeader.QtoTargetType === 4) {
						addSourceQuantityColumn();
					}

					dynamicService.attachDynColConfigForList({'AQWQQuantityGroup': dynamicConfigData.AQWQQuantityGroup});
				}

				// Qto Purpose: Sales/Wip&Billing, Qto Type and Qto Rubric Category is not Onorm;
				if (qtoMainHeaderDataService.getGqIsAvailable(qtoHeader)){
					dynamicService.attachDynColConfigForList({'GQQuantityGroup': dynamicConfigData.GQQuantityGroup});
				}else{
					dynamicService.detachDataForList('GQQuantityGroup');
				}
			};

			service.extendedTransientPropertiesInQtoBoq = function (boqItem, transientBoqItem){
				boqItem.BilledQuantity      = transientBoqItem.BilledQuantity;
				boqItem.IQPrevQuantity      = transientBoqItem.IQPrevQuantity;
				boqItem.IQRemainingQuantity = transientBoqItem.IQRemainingQuantity;
				boqItem.IQTotalQuantity     = transientBoqItem.IQTotalQuantity;
				boqItem.BQPrevQuantity      = transientBoqItem.BQPrevQuantity;
				boqItem.BQRemainingQuantity = transientBoqItem.BQRemainingQuantity;
				boqItem.BQTotalQuantity     = transientBoqItem.BQTotalQuantity;

				let qtoHeader = qtoMainHeaderDataService.getSelected();
				if (qtoHeader && (qtoHeader.QtoTargetType === QtoTargetType.PrcWqAq || qtoHeader.QtoTargetType === QtoTargetType.PrjWqAq)) {
					boqItem.Quantity = transientBoqItem.ExQtoQuantity;
					boqItem.QuantityDetail = '';
					boqItem.QuantityAdj = transientBoqItem.ExQtoQuantityAdj;
					boqItem.QuantityAdjDetail = '';
				}
			};

			return service;
		}]);
})();
