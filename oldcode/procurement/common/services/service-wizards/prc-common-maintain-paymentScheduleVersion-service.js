(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('prcCommonMaintainPaymentScheduleVersionService', ['platformModalService', '$translate', '$http',
		function (platformModalService, $translate, $http) {
			var service = {}, title, msg;
			service.maintainPaymentScheduleVersion = function (parentService, modName, options) {
				var parentSelected = parentService.getSelected();
				var area = 'procurement';
				var moduleName = parentService.getModule().name;
				if (parentSelected === null) {
					title = $translate.instant('procurement.common.wizard.noItemSelectedTitle');
					msg = $translate.instant('procurement.common.wizard.noItemSelected');
					platformModalService.showMsgBox(msg, title, 'ico-warning');

				} else if (parentSelected && modName === 'procurement.contract' && parentSelected.ContractHeaderFk) {
					if (parentService.getServiceName() === 'procurementContractHeaderDataService') {
						title = $translate.instant('procurement.common.wizard.noItemSelectedTitle');
						msg = $translate.instant('procurement.common.paymentSchedule.pleaseSelectMainContract');
						platformModalService.showMsgBox(msg, title, 'ico-warning');

					}
				} else {
					var getPaymentScheduleVersionUrl;
					if (moduleName.match('sales')) {
						area = 'sales';
						getPaymentScheduleVersionUrl = globals.webApiBaseUrl + 'sales/contract/paymentschedule/paymentscheduleversion?MainItemId=' + parentSelected.Id;
					} else {
						if (modName === 'procurement.package') {
							getPaymentScheduleVersionUrl = globals.webApiBaseUrl + 'procurement/common/prcpaymentschedule/paymentscheduleversion?MainItemId=' + options.PrcHeaderFk;
						}
						else {
							getPaymentScheduleVersionUrl = globals.webApiBaseUrl + 'procurement/common/prcpaymentschedule/paymentscheduleversion?MainItemId=' + parentSelected.PrcHeaderEntity.Id;
						}
					}
					$http.get(getPaymentScheduleVersionUrl).then(function (response) {
						var data = response.data;
						if (data.length) {
							_.remove(data, function (i) {
								return !i.Version;
							});
							platformModalService.showDialog({
								area: area,
								currentItem: data,
								mainItemId: area === 'sales' ? parentSelected.Id : (modName === 'procurement.package' ? options.PrcHeaderFk : parentSelected.PrcHeaderEntity.Id),
								templateUrl: globals.appBaseUrl + 'procurement.common/partials/wizard/maintain-payment-schedule-version.html',
								backdrop: false,
								showCancelButton: true,
								showOkButton: true,
								width: '500px'
							}).then(function () {
							});
						} else {
							var title = 'procurement.common.wizard.noPaymentScheduleVersion';
							var msg = 'procurement.common.wizard.noPaymentScheduleVersion';
							platformModalService.showMsgBox(msg, title, 'ico-info');

						}
					});
				}
			};

			return angular.extend(service, {});
		}]);
})(angular);