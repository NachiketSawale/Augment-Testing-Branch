(function (angular) {
	'use strict';
	/* global globals */

	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('updatePaymentScheduleDOCService',[
		'$http',
		'$translate',
		'platformModalService',
		'procurementCommonPaymentScheduleDataService',
		function (
			$http,
			$translate,
			platformModalService,
			dataServiceFactory
		) {
			var service = {}, self = this;

			self.handleOk = function (result) {
				$http.post(globals.webApiBaseUrl + self.updateUrl, result)
					.then(function () {
						self.parentService.refresh();
						// eslint-disable-next-line no-unused-vars
					}, function (data) {
					});
			};

			service.updatePaymentScheduleDOC = function (parentService) {
				self.parentService = parentService;
				var parentSelected = parentService.getSelected();
				var paymentScheduleService = dataServiceFactory.getService(parentService);
				var selectedPaymentShedule = paymentScheduleService.getSelected();
				self.paymentScheduleService = paymentScheduleService;
				self.selectedPaymentShedule = selectedPaymentShedule;
				if (!parentSelected || !parentSelected.Id) {
					platformModalService.showMsgBox('procurement.common.wizard.updatePaymetScheduleDOC.pleaseSelectAHeader', 'procurement.common.wizard.updatePaymetScheduleDOC.updateFailedTitle', 'warning');
					return;
				}

				var modalOptions = {
					paymentScheduleId: (selectedPaymentShedule && selectedPaymentShedule.Id && selectedPaymentShedule.Version) ? selectedPaymentShedule.Id : -1,
					headerTextKey: 'procurement.common.wizard.updatePaymetScheduleDOC.caption',
					templateUrl: globals.appBaseUrl + 'procurement.common/partials/wizard/update-paymentschedule-degreeofcompletion.html'
				};

				platformModalService.showDialog(modalOptions).then(function (result) {
					if (result) {
						var module = parentService.getModule();
						if (module && module.name === 'procurement.contract') {
							self.updateUrl = 'procurement/common/prcpaymentschedule/updatepaymentscheduledegreeofcompletion';
							result.PrcHeaderFk = parentSelected.PrcHeaderFk;
						}
						else if (module && module.name === 'sales.contract') {
							self.updateUrl = 'sales/contract/paymentschedule/updatepaymentscheduledegreeofcompletion';
							result.OrdHeaderFk = parentSelected.Id;
						}
						self.handleOk(result);
					}
				});
			};

			return angular.extend(service,{});
		}]);
})(angular);