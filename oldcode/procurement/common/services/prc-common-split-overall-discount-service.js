(function () {
	'use strict';

	var moduleName = 'procurement.common';
	angular.module(moduleName).service('prcCommonSplitOverallDiscountService', [
		'$http',
		'$translate',
		'platformModalService',
		function(
			$http,
			$translate,
			platformModalService
		) {
			var self = this;

			self.splitOverallDiscount = function splitOverallDiscount(mainService, url) {
				var selectedItem = mainService.getSelected();
				var message = '';
				if (selectedItem) {
					var title = $translate.instant('procurement.common.discountSplittDialogTitle');
					message = $translate.instant('procurement.common.itemNOtSaved');
					if (selectedItem.Version === 0) {
						return platformModalService.showMsgBox(message,  title, 'ico-question');
					}
					mainService.updateAndExecute(function () {
						const params = {
							Id: selectedItem.Id,
							PrcHeaderFk: selectedItem.PrcHeaderFk ?? null,
							OverallDiscount: selectedItem.OverallDiscount,
							OverallDiscountOc: selectedItem.OverallDiscountOc,
							TaxCodeFk: selectedItem.TaxCodeFk ?? null,
							BpdVatGroupFk: selectedItem.BpdVatGroupFk,
							ExchangeRate: selectedItem.ExchangeRate
						};
						$http.post(url, params)
							.then(function (result) {
								if (result.data.Result === true) {
									mainService.refresh();
									if (result.data.Item === 0 && result.data.Boq === 0) {
										message = $translate.instant('procurement.common.discountSplitNothing', {itemNum: 0, boqNum: 0});
									}
									else {
										message = $translate.instant('procurement.common.discountSplitSucceessfully', {itemNum: result.data.Item, boqNum: result.data.Boq});
									}
									platformModalService.showMsgBox(message,  title, 'ico-info');
								}
							});
					});
				}
				else {
					message = $translate.instant('cloud.common.noCurrentSelection');
					platformModalService.showMsgBox(message,  'Info', 'ico-info');
				}
			};
		}
	]);
})();