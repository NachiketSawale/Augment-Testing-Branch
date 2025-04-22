/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */

(function () {
	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc service
	 * @name salesContractBillFromPaymentScheduleWizardDialogService
	 * @function
	 * @requires platformSidebarWizardCommonTasksService salesBillingService
	 *
	 * @description
	 * # service for revenue creation dialog
	 */
	angular.module(moduleName).factory('salesBillingAssignBillToPaymentScheduleWizardDialogService',
		['$injector', '$q', '$http', '$translate', 'platformModalService', 'platformSidebarWizardCommonTasksService', 'salesBillingService',
			function ($injector, $q, $http, $translate, platformModalService, platformSidebarWizardCommonTasksService, salesBillingService) {

				/* TODO: is never used, please check
				var data = {
					hasBoqs: true,
					boqItems: []
				};
				*/
				var service = {}, initDataItem = {};

				angular.extend(service, {
					generateFormDialog: generateFormDialog,
					assignPaymentScheduleToBill: assignPaymentScheduleToBill,
					getBillSelected: getBillSelected,
					getDataItem: getDataItem
				});

				// init();

				return service;

				function generateFormDialog() {

					// Select contract
					var selectedBilling = salesBillingService.getSelected(),
						title = 'sales.billing.assignBillToPaymentScheduleLine',
						msg = $translate.instant('sales.billing.assignBillToPaymentSchedule.noCurrentBillingSelection');

					// Validate
					if (platformSidebarWizardCommonTasksService.assertSelection(selectedBilling, title, msg)) {

						// If payment schedule is already assigned by bill, then show error message
						$http.get(globals.webApiBaseUrl + 'sales/billing/validateassignpaymentschedule?billingFk=' + selectedBilling.Id).then(function (response) {
							var responseDictionary = {};
							responseDictionary[2] = 'billingNotFound';
							responseDictionary[3] = 'noContractAssigned';
							responseDictionary[4] = 'noContractPaymentScheduleFound';

							var statusResponse = response.data;
							if (statusResponse !== 1) {
								platformModalService.showErrorBox('sales.billing.assignBillToPaymentSchedule.' + responseDictionary[statusResponse], title);
								return;
							}

							// Proceed to show wizard to generate bill
							salesBillingService.updateAndExecute(function () {
								var dialogOptions = {
									templateUrl: 'sales.billing/templates/sales-billing-assign-bill-to-payment-schedule-wizard.html',
									controller: 'salesBillingAssignBillToPaymentScheduleWizardController'
								};

								platformModalService.showDialog(dialogOptions);
							});
						});
					}
				}

				/**
				 * @ngdoc function
				 * @name assignPaymentScheduleToBill
				 * @function
				 * @methodOf salesContractCreateRevenueWizardDialogService
				 * @description post data to transfer revenue to estimate
				 * @param entity
				 * @returns promise
				 */
				function assignPaymentScheduleToBill(entity) {
					var selectedBilling = salesBillingService.getSelected();

					var postData = {
						billId: selectedBilling.Id,
						paymentScheduleId: entity.Id,
					};

					return $http.post(globals.webApiBaseUrl + 'sales/billing/assignpaymentscheduletobill', postData);
				}

				function getBillSelected() {
					return angular.copy(salesBillingService.getSelected());
				}

				function getDataItem() {
					return initDataItem;
				}
			}]);
})();
