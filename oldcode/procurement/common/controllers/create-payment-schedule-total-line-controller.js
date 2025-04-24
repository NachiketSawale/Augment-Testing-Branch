(function (angular) {
	'use strict';

	/* global _, globals */
	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('createPaymentScheduleTotalLineController', [
		'$scope',
		'$http',
		'$translate',
		'platformModalService',
		'prcCommonGetVatPercent',
		'basicsLookupdataLookupDescriptorService',
		'prcGetIsCalculateOverGrossService',
		'procurementModuleConstant',
		function (
			$scope,
			$http,
			$translate,
			platformModalService,
			prcCommonGetVatPercent,
			basicsLookupdataLookupDescriptorService,
			prcGetIsCalculateOverGrossService,
			procurementModuleConstant
		) {
			$scope.options = $scope.$parent.modalOptions;
			var parentService = $scope.options.parentService;
			var dataService = $scope.options.service;
			var area = $scope.options.area;
			var preUrl = globals.webApiBaseUrl + 'procurement/common/prcpaymentschedule/';
			const currentModuleName = parentService.getModule().name;
			if (area === 'sales') {
				preUrl = globals.webApiBaseUrl + 'sales/contract/paymentschedule/';
			}

			angular.extend($scope.options,{
				okText: $translate.instant('basics.common.ok'),
				cancelText: $translate.instant('basics.common.cancel'),
				onOk: function(){
					setPaymentScheduleTotal();
					$scope.$close({ok: true});
				},
				cancel: function(){
					setTotalSetting({
						PsTotalId: originalPsTotalId,
						TotalNetOc: originalTotalNetOc,
						TotalGrossOc: originalTotalGrossOc
					});
					$scope.$close({ok: false});
				}
			});

			$scope.createPSText = $translate.instant('procurement.common.paymentSchedule.createPaymentScheduleLineText');
			$scope.netOcText = $translate.instant('procurement.common.paymentSchedule.netOcText');
			$scope.grossOcText = $translate.instant('procurement.common.paymentSchedule.grossOcText');
			var setPSTotalFailed = $translate.instant('procurement.common.paymentSchedule.setPaymentScheduleTotalFailed');
			var setPaymentScheduleTotalText = $translate.instant('procurement.common.paymentSchedule.setPaymentScheduleTotal');
			$scope.showTotalDropDown = area === 'procurement';
			$scope.isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
			$scope.currentItem = dataService.getPaymentScheduleTotalSetting();
			var originalTotalNetOc = $scope.currentItem.TotalNetOc;
			var originalTotalGrossOc = $scope.currentItem.TotalGrossOc;
			var originalPsTotalId = $scope.currentItem.PsTotalId;
			$scope.totalSourceConfig = {
				field: 'PsTotalId',
				displayText: 'Code',
				validator: validatePsTotalId
			};
			$scope.totalNetOcConfig = {
				field: 'TotalNetOc',
				validator: validateTotalNetOc
			};
			$scope.totalGrossOcConfig = {
				field: 'TotalGrossOc',
				validator: validateTotalGrossOc
			};

			$scope.okBtnDisable = !($scope.currentItem && $scope.currentItem.TotalGrossOc && $scope.currentItem.TotalNetOc && $scope.currentItem.TotalGrossOc !== 0 && $scope.currentItem.TotalNetOc !== 0);

			function setTotalSetting(newSetting) {
				dataService.setPaymentScheduleTotalSetting(newSetting);
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

			function getHeaderSelectedItem() {
				return currentModuleName === procurementModuleConstant.package.moduleName ?
					parentService.parentService().getSelected() :
					parentService.getSelected();
			}

			function validateTotalNetOc(entity, value) {
				$scope.okBtnDisable = !value;
				var totals;
				var mainSelectedItem = getHeaderSelectedItem();
				var totalSetting = dataService.getPaymentScheduleTotalSetting();
				if (area === 'procurement') {
					totals = basicsLookupdataLookupDescriptorService.getData('DisplayTotals');
				}
				else {
					var ordSelected = parentService.getSelected();
					totals = [{
						Id: 0,
						Code: 'Total',
						ValueNetOc: ordSelected.AmountNetOc,
						GrossOc: ordSelected.AmountGrossOc
					}];
				}
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
						var vatPercent = prcCommonGetVatPercent.getVatPercent(mainSelectedItem.TaxCodeFk, mainSelectedItem.BpdVatGroupFk);
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
				$scope.okBtnDisable = !value;
				var totals;
				var mainSelectedItem = getHeaderSelectedItem();
				var totalSetting = dataService.getPaymentScheduleTotalSetting();
				if (area === 'procurement') {
					totals = basicsLookupdataLookupDescriptorService.getData('DisplayTotals');
				}
				else {
					var ordSelected = parentService.getSelected();
					totals = [{
						Id: 0,
						Code: 'Total',
						ValueNetOc: ordSelected.AmountNetOc,
						GrossOc: ordSelected.AmountGrossOc
					}];
				}
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
						var vatPercent = prcCommonGetVatPercent.getVatPercent(mainSelectedItem.TaxCodeFk, mainSelectedItem.BpdVatGroupFk);
						var totalNetOc = parseFloat((value / (1 + vatPercent / 100)).toFixed(2));
						setTotalSetting({
							PsTotalId: null,
							TotalNetOc: totalNetOc,
							TotalGrossOc: value
						});
					}
				}
			}

			function setPaymentScheduleTotal() {
				var parentSelectedItem = parentService.getSelected();
				var rate = 1;
				if (parentSelectedItem) {
					if (currentModuleName === 'procurement.package') {
						var mainSelectedItem = parentService.parentService().getSelected();
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
						valData.OrdHeaderFk = parentSelectedItem.Id;
					}
					$http.post(preUrl + 'setpaymentscheduletotal', valData
					).then(function (res) {
						if (res.data) {
							setTotalSetting({
								paymentScheduleNetOc: totalSetting.TotalNetOc,
								paymentScheduleGrossOc: totalSetting.TotalGrossOc,
								hasTotalSetting: true
							});
							$scope.modalOptions && $scope.modalOptions.createItem && $scope.modalOptions.createItem();
						}
						else {
							platformModalService.showDialog({
								headerTextKey: setPaymentScheduleTotalText,
								bodyTextKey: setPSTotalFailed,
								iconClass: 'ico-error'
							});
						}
					});
				}
			}
		}]);
})(angular);