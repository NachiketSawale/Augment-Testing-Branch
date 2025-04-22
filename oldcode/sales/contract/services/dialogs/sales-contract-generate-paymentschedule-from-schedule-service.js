(function () {
	'use strict';
	/* global _ */
	var moduleName = 'sales.contract';
	angular.module(moduleName).factory('generatePaymentScheduleFromScheduleService', [
		'platformModalService',
		function (platformModalService) {

			function createDialog(header, service) {
				if (!header) {
					return platformModalService.showMsgBox('sales.contract.noContractHeaderSelected', 'sales.contract.generatePaymentScheduleFromSchedule.title', 'info');
				}
				else {
					let list = service.getList();
					let isDoneItem = (list && list.length) ? _.find(list, {IsDone: true}) : false;
					if (isDoneItem) {
						return platformModalService.showMsgBox('sales.contract.generatePaymentScheduleFromSchedule.haveIsDoneItemsCannotGenerate', 'sales.contract.generatePaymentScheduleFromSchedule.title', 'info');
					}
				}

				var dialogOptions = {
					templateUrl: 'sales.contract/templates/sales-contract-generate-paymentschedule-from-schedule.html',
					header: header,
					service: service,
					width: '800px'
				};

				return platformModalService.showDialog(dialogOptions);
			}

			return {
				createDialog: createDialog
			};
		}
	]);
})();