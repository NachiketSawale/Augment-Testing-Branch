(function () {
	'use strict';
	/* global globals,_ */

	angular.module('procurement.common').factory('paymentScheduleTotalSettingService', [
		'$http',
		'$translate',
		'platformModalService',
		'procurementContextService',
		'basicsLookupdataLookupDescriptorService',
		'procurementCommonTotalDataService',
		'basicsProcurementConfigurationTotalKinds',
		'prcCommonGetVatPercent',
		'prcGetIsCalculateOverGrossService',
		function (
			$http,
			$translate,
			platformModalService,
			moduleContext,
			basicsLookupdataLookupDescriptorService,
			procurementCommonTotalDataService,
			totalKinds,
			prcCommonGetVatPercent,
			prcGetIsCalculateOverGrossService
		) {
			var service = {};

			service.initTotalSetting = function initTotalSetting(scope, dataService, parentService)
			{
				var area = 'procurement';
				var preUrl = globals.webApiBaseUrl + 'procurement/common/prcpaymentschedule/';
				var moduleName = parentService.getModule().name;
				if (moduleName.match('sales')) {
					area = 'sales';
					preUrl = globals.webApiBaseUrl + 'sales/contract/paymentschedule/';
					basicsLookupdataLookupDescriptorService.loadData('OrdPsStatus');
				}

				var totalSetting = dataService.getPaymentScheduleTotalSetting();
				var readonlyNoConsiderTotalSetting = true;
				scope.showTotalSettingSection = true;
				scope.showTotalDropDown = area === 'procurement';
				scope.currentItem = totalSetting;
				scope.totalSourceConfig = {
					field: 'PsTotalId',
					displayText: 'Code',
					validator: validatePsTotalId,
					rt$readonly: function () {
						readonlyNoConsiderTotalSetting = dataService.readonlyNoConsiderTotalSetting();
						return readonlyNoConsiderTotalSetting;
					}
				};
				scope.totalNetOcConfig = {
					field: 'TotalNetOc',
					validator: validateTotalNetOc
				};
				scope.totalGrossOcConfig = {
					field: 'TotalGrossOc',
					validator: validateTotalGrossOc
				};
				scope.setPaymentScheduleTotal = setPaymentScheduleTotal;
				scope.orderMain = 0;
				scope.changeOrder = 0;
				scope.notApprChangeOrder = 0;

				scope.psNetOcText = $translate.instant('procurement.common.paymentSchedule.netOcText');
				scope.psGrossOcText = $translate.instant('procurement.common.paymentSchedule.grossOcText');
				scope.tNetOcText = $translate.instant('procurement.common.paymentSchedule.netOcText');
				scope.tGrossOcText = $translate.instant('procurement.common.paymentSchedule.grossOcText');
				prcGetIsCalculateOverGrossService.getIsCalculateOverGrossPromise().then(function(d) {
					scope.isOverGross = d;
					if (area === 'sales') {
						if (scope.isOverGross) {
							scope.tGrossOcText = $translate.instant('procurement.common.paymentSchedule.grandGrossOcText');
						}
						else if (!scope.isOverGross) {
							scope.tNetOcText = $translate.instant('procurement.common.paymentSchedule.grandNetOcText');
						}
					}
					else {
						if (scope.isOverGross) {
							scope.tGrossOcText = $translate.instant('procurement.common.paymentSchedule.grossOcText');
						}
						else if (!scope.isOverGross) {
							scope.tNetOcText = $translate.instant('procurement.common.paymentSchedule.netOcText');
						}
					}
				});
				scope.totalSource = $translate.instant('procurement.common.paymentSchedule.totalSource');
				scope.totalSourceGrossOc = $translate.instant('procurement.common.paymentSchedule.totalSourceGrossOC');
				scope.totalSourceNetOc = $translate.instant('procurement.common.paymentSchedule.totalSourceNetOC');
				scope.paymentScheduleTarget = $translate.instant('procurement.common.paymentSchedule.paymentScheduleTarget');
				scope.paymentScheduleTargetGrossOc = $translate.instant('procurement.common.paymentSchedule.paymentScheduleTargetGrossOC');
				scope.paymentScheduleTargetNetOc = $translate.instant('procurement.common.paymentSchedule.paymentScheduleTargetNetOC');
				scope.setPaymentScheduleTotalText = $translate.instant('procurement.common.paymentSchedule.setPaymentScheduleTotal');
				scope.varianceText = $translate.instant('procurement.common.paymentSchedule.varianceText');
				scope.varianceSourceTargetText = $translate.instant('procurement.common.paymentSchedule.varianceSourceTargetText');
				scope.contractText = $translate.instant('procurement.common.paymentSchedule.contractText');
				scope.changeText = $translate.instant('procurement.common.paymentSchedule.changeText');
				scope.notApprChangeText = $translate.instant('procurement.common.paymentSchedule.notApprChangeText');
				scope.itemsFromMainNotice = '';
				var mainAndChangeOrderText = $translate.instant('procurement.common.paymentSchedule.mainAndChangeOrder');
				var setPSTotalSuccessfully = $translate.instant('procurement.common.paymentSchedule.setPaymentScheduleTotalSuccessfully');
				var setPSTotalFailed = $translate.instant('procurement.common.paymentSchedule.setPaymentScheduleTotalFailed');

				function updateTotalSettingAfterTotalLoaded(totalList) {
					var list = _.clone(totalList);
					if (list && list.length) {
						basicsLookupdataLookupDescriptorService.removeData('DisplayTotals');
						_.forEach(list, function(e) {
							var type = _.find(basicsLookupdataLookupDescriptorService.getData('PrcTotalType'), {
								Id: e.TotalTypeFk
							});
							e.TypeCode = type ? type.Code : '';
						});
						addMainChangeOrderItem(list);
						basicsLookupdataLookupDescriptorService.attachData({'DisplayTotals': list});

						var totalTypes = basicsLookupdataLookupDescriptorService.getData('PrcTotalType');
						var totalNetItem = _.find(list, {Id: -1});
						if (!totalNetItem) {
							totalNetItem = _.find(list, function (item) {
								var totalType = _.find(totalTypes, {
									Id: item.TotalTypeFk
								});
								if (_.isEmpty(totalType)) {
									return false;
								}
								if (totalType.PrcTotalKindFk === totalKinds.netTotal) {
									return true;
								}
							});
						}
						if (totalNetItem) {
							setTotalSetting({
								Code: totalNetItem.Code,
								PsTotalId: totalNetItem.Id,
								TotalNetOc: totalNetItem.ValueNetOc,
								TotalGrossOc: totalNetItem.GrossOc
							});
						}
					}
				}

				function updateTotalSettingAfterPaymentScheduleLoaded() {
					var parentSeleted = parentService.getSelected();
					if (moduleName === 'procurement.contract') {
						if (parentSeleted && parentSeleted.ContractHeaderFk) {
							scope.showTotalSettingSection = false;
							scope.itemsFromMainNotice = $translate.instant('procurement.common.paymentSchedule.itemsFromMainContract');
						}
						if (parentSeleted && !parentSeleted.ContractHeaderFk) {
							scope.showTotalSettingSection = true;
						}
					}
					else if (moduleName === 'procurement.requisition') {
						if (parentSeleted && parentSeleted.ReqHeaderFk) {
							scope.showTotalSettingSection = false;
							scope.itemsFromMainNotice = $translate.instant('procurement.common.paymentSchedule.itemsFromMainRequistion');
						}
						if (parentSeleted && !parentSeleted.ReqHeaderFk) {
							scope.showTotalSettingSection = true;
						}
					}
					else if (moduleName === 'sales.contract') {
						const isMain = parentSeleted && !parentSeleted.OrdHeaderFk;
						const isCallOff = parentSeleted && parentSeleted.OrdHeaderFk && !parentSeleted.PrjChangeFk;
						const isChangeOrder = parentSeleted && parentSeleted.OrdHeaderFk && parentSeleted.PrjChangeFk;
						if (isCallOff) {
							scope.showTotalSettingSection = true;
							if (scope.isOverGross) {
								scope.orderMain = parentSeleted.AmountGrossOc;
								scope.changeOrder = 0;
								scope.notApprChangeOrder = 0;
								scope.currentItem.TotalGrossOc = (scope.orderMain + scope.changeOrder);
								scope.currentItem.TotalNetOc = (parentSeleted.AmountNetOc + parentSeleted.ApprovedChangeOrderNetOc);
							}
							else if (!scope.isOverGross) {
								scope.orderMain = parentSeleted.AmountNetOc;
								scope.changeOrder = 0;
								scope.notApprChangeOrder = 0;
								scope.currentItem.TotalNetOc = (scope.orderMain + scope.changeOrder);
								scope.currentItem.TotalGrossOc = (parentSeleted.AmountGrossOc + parentSeleted.ApprovedChangeOrderGrossOc);
							}
						}
						else if (isMain || isChangeOrder) {
							const isConsolidateChange = dataService.configurationIsConsolidateChange(parentSeleted.ConfigurationFk);
							if (isConsolidateChange && isChangeOrder) {
								scope.showTotalSettingSection = false;
								scope.itemsFromMainNotice = $translate.instant('procurement.common.paymentSchedule.itemsFromMainContract');
								return;
							}

							scope.showTotalSettingSection = true;
							if (scope.isOverGross) {
								scope.orderMain = parentSeleted.AmountGrossOc;
								scope.changeOrder = parentSeleted.ApprovedChangeOrderGrossOc;
								scope.notApprChangeOrder = parentSeleted.NotApprChangeOrderGrossOc;
								scope.currentItem.TotalGrossOc = (isConsolidateChange && isMain) ? (parentSeleted.AmountGrossOc  + parentSeleted.ApprovedChangeOrderGrossOc) : parentSeleted.AmountGrossOc;
								scope.currentItem.TotalNetOc = (isConsolidateChange && isMain) ? (parentSeleted.AmountNetOc + parentSeleted.ApprovedChangeOrderNetOc) : parentSeleted.AmountNetOc;
							}
							else if (!scope.isOverGross) {
								scope.orderMain = parentSeleted.AmountNetOc;
								scope.changeOrder = parentSeleted.ApprovedChangeOrderNetOc;
								scope.notApprChangeOrder = parentSeleted.NotApprChangeOrderNetOc;
								scope.currentItem.TotalNetOc = (isConsolidateChange && isMain) ? (parentSeleted.AmountNetOc + parentSeleted.ApprovedChangeOrderNetOc) : parentSeleted.AmountNetOc;
								scope.currentItem.TotalGrossOc = (isConsolidateChange && isMain) ? (parentSeleted.AmountGrossOc + parentSeleted.ApprovedChangeOrderGrossOc) : parentSeleted.AmountGrossOc;
							}
						}
					}
				}

				function setTotalSetting(newSetting) {
					dataService.setPaymentScheduleTotalSetting(newSetting);
				}

				function setPaymentScheduleTotal() {
					var parentSelectedItem = parentService.getSelected();
					var mainService = parentService;
					var rate = 1;
					if (parentSelectedItem) {
						if (moduleName === 'procurement.package') {
							var mainSelectedItem = parentService.parentService().getSelected();
							mainService = parentService.parentService();
							rate = mainSelectedItem.ExchangeRate;
						}
						else {
							rate = parentSelectedItem.ExchangeRate;
						}
						var totalSetting = dataService.getPaymentScheduleTotalSetting();
						var valData = {
							PrcHeaderFk: parentSelectedItem.PrcHeaderFk,
							ExchangeRate: rate,
							TotalNetOc: totalSetting.TotalNetOc,
							TotalGrossOc: totalSetting.TotalGrossOc
						};
						if (area === 'sales') {
							var ordPsStatus = basicsLookupdataLookupDescriptorService.getData('OrdPsStatus');
							var agreePsStatus = [];
							_.forEach(ordPsStatus, function (s) {
								if (s.IsAgreed) {
									agreePsStatus[s.Id] = s;
								}
							});
							var fixedAmountNetOc = 0;
							var fixedAmountGrossOc = 0;
							var psList = dataService.getList();
							if (psList && psList.length && agreePsStatus.length) {
								_.forEach(psList, function (ps) {
									if (agreePsStatus[ps.OrdPsStatusFk] || ps.BilHeaderFk) {
										fixedAmountNetOc += ps.AmountNetOc;
										fixedAmountGrossOc += ps.AmountGrossOc;
									}
								});
							}
							if (fixedAmountNetOc > valData.TotalNetOc || fixedAmountGrossOc > valData.TotalGrossOc) {
								platformModalService.showErrorBox($translate.instant('procurement.common.paymentSchedule.psTargetCannotLessFixedPs'), $translate.instant('cloud.common.errorMessage'));
								return false;
							}
							valData.OrdHeaderFk = parentSelectedItem.Id;
						}
						mainService.update().then(function () {
							$http.post(preUrl + 'setpaymentscheduletotal', valData
							).then(function (res) {
								if (res.data) {
									dataService.load();
									setTotalSetting({
										paymentScheduleNetOc: totalSetting.TotalNetOc,
										paymentScheduleGrossOc: totalSetting.TotalGrossOc
									});
									platformModalService.showDialog({
										headerTextKey: scope.setPaymentScheduleTotalText,
										bodyTextKey: setPSTotalSuccessfully,
										iconClass: 'ico-info'
									});
								}
								else {
									platformModalService.showDialog({
										headerTextKey: scope.setPaymentScheduleTotalText,
										bodyTextKey: setPSTotalFailed,
										iconClass: 'ico-error'
									});
								}
							});
						});
					}
				}

				function getMainSelectedItem() {
					var mainSelectedItem;
					if (moduleName === 'procurement.package') {
						mainSelectedItem = parentService.parentService().getSelected();
						return mainSelectedItem;
					}
					mainSelectedItem = parentService.getSelected();
					return mainSelectedItem;
				}

				function validatePsTotalId(entity, value) {
					var totals = basicsLookupdataLookupDescriptorService.getData('DisplayTotals');
					if (totals) {
						var total = _.find(totals, {Id: value});
						if (total) {
							setTotalSetting({
								Code: total.Code,
								PsTotalId: total.Id,
								TotalNetOc: total.ValueNetOc,
								TotalGrossOc: total.GrossOc
							});
						}
					}

				}

				function getTotals(mainSelectedItem) {
					return area === 'procurement' ?
						basicsLookupdataLookupDescriptorService.getData('DisplayTotals') :
						[{Id: 0, Code: 'Total', ValueNetOc: mainSelectedItem.AmountNetOc, GrossOc: mainSelectedItem.AmountGrossOc}];
				}

				function getVatPercent(mainSelectedItem) {
					return area === 'procurement' ?
						prcCommonGetVatPercent.getVatPercent(mainSelectedItem.TaxCodeFk, mainSelectedItem.BpdVatGroupFk) :
						prcCommonGetVatPercent.getVatPercentIgnoreDate(mainSelectedItem.TaxCodeFk, mainSelectedItem.VatGroupFk);
				}

				function validateTotalNetOc(entity, value) {
					const mainSelectedItem = getMainSelectedItem();
					const totals = getTotals(mainSelectedItem);
					var totalSetting = dataService.getPaymentScheduleTotalSetting();
					const vatPercent = getVatPercent(mainSelectedItem);

					if (mainSelectedItem && totals && !totalSetting.Init) {
						var selectedItem = _.find(totals, {
							ValueNetOc: value
						});
						if (selectedItem) {
							setTotalSetting({
								PsTotalId: selectedItem.Id,
								TotalNetOc: value,
								TotalGrossOc: selectedItem.GrossOc
							});
						}
						else {
							var totalGrossOc = parseFloat((value * (1 + vatPercent / 100)).toFixed(2));
							setTotalSetting({
								PsTotalId: null,
								TotalNetOc: value,
								TotalGrossOc: totalGrossOc
							});
						}
					}
				}

				function validateTotalGrossOc(entity, value) {
					const mainSelectedItem = getMainSelectedItem();
					const totals = getTotals(mainSelectedItem);
					var totalSetting = dataService.getPaymentScheduleTotalSetting();
					const vatPercent = getVatPercent(mainSelectedItem);

					if (mainSelectedItem && totals && !totalSetting.Init) {
						var selectedItem = _.find(totals, {
							GrossOc: value
						});
						if (selectedItem) {
							setTotalSetting({
								PsTotalId: selectedItem.Id,
								TotalNetOc: selectedItem.ValueNetOc,
								TotalGrossOc: value
							});
						}
						else {
							var totalNetOc = parseFloat((value / (1 + vatPercent / 100)).toFixed(2));
							setTotalSetting({
								PsTotalId: null,
								TotalNetOc: totalNetOc,
								TotalGrossOc: value
							});
						}
					}
				}

				function addMainChangeOrderItem(totalList) {
					_.remove(totalList, function(n) {
						return n.Id === -1;
					});
					if (moduleName === 'procurement.contract' || moduleName === 'procurement.requisition') {
						var mainAndChangeOrder = {'-1': {ValueNetOc: 0, GrossOc: 0}};
						if (moduleName === 'procurement.contract') {
							mainAndChangeOrder = basicsLookupdataLookupDescriptorService.getData('ConMainAndChangeOrder');
						}
						if (moduleName === 'procurement.requisition') {
							mainAndChangeOrder = basicsLookupdataLookupDescriptorService.getData('ReqMainAndChangeOrder');
						}
						totalList.unshift({
							Id: -1,
							ValueNetOc: mainAndChangeOrder !== undefined ? mainAndChangeOrder['-1'].ValueNetOc: 0,
							GrossOc: mainAndChangeOrder !== undefined ? mainAndChangeOrder['-1'].GrossOc: 0,
							ValueTaxOc: 0,
							Code: mainAndChangeOrderText,
							TypeCode: mainAndChangeOrderText,
							Translated: mainAndChangeOrderText,
							DescriptionInfo: {
								Translated: mainAndChangeOrderText
							}
						});
					}
				}

				if (area === 'procurement') {
					var totalDataService = procurementCommonTotalDataService.getService(parentService);
					totalDataService.registerListLoaded(updateTotalSettingAfterTotalLoaded);
					dataService.registerListLoaded(updateTotalSettingAfterPaymentScheduleLoaded);

					basicsLookupdataLookupDescriptorService.removeData('DisplayTotals');
					var prcTotalList = totalDataService.getList();
					var totalList = _.clone(prcTotalList);
					_.forEach(totalList, function(e) {
						var type = _.find(basicsLookupdataLookupDescriptorService.getData('PrcTotalType'), {
							Id: e.TotalTypeFk
						});
						e.TypeCode = type ? type.Code : '';
					});
					addMainChangeOrderItem(totalList);
					basicsLookupdataLookupDescriptorService.attachData({'DisplayTotals': totalList});

					scope.$on('$destroy', function () {
						totalDataService.unregisterListLoaded(updateTotalSettingAfterTotalLoaded);
						dataService.unregisterListLoaded(updateTotalSettingAfterPaymentScheduleLoaded);
					});
				}
				else {
					dataService.registerListLoaded(updateTotalSettingAfterPaymentScheduleLoaded);

					scope.$on('$destroy', function () {
						dataService.unregisterListLoaded(updateTotalSettingAfterPaymentScheduleLoaded);
					});
				}
			};

			return service;
		}]);

})();
