/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	salesBillingModule.factory('salesBillingCreateConsecutiveBillNoWizardService',
		['globals', '_', '$http', '$translate', '$injector', 'platformTranslateService', 'platformSidebarWizardCommonTasksService', 'platformDataValidationService', 'platformModalFormConfigService', 'salesBillingService',
			function (globals, _, $http, $translate, $injector, platformTranslateService, platformSidebarWizardCommonTasksService, platformDataValidationService, platformModalFormConfigService, salesBillingService) {

				var service = {};

				function assertBillIsNotReadOnly(title, billItem) {
					var message = $translate.instant('sales.billing.billIsReadOnly');
					return $injector.get('salesCommonStatusHelperService').assertIsNotReadOnly(title, message, salesBillingService, billItem);
				}

				function assertBillIsHasNoConsecutiveBillNo(title, billItem) {
					if (_.trim(_.get(billItem, 'ConsecutiveBillNo')) === '') {
						return true;
					} else {
						var message = $translate.instant('sales.billing.billHasAlreadyConsecutiveBillNo');
						var modalOptions = {
							headerText: $translate.instant(title),
							bodyText: message,
							iconClass: 'ico-info'
						};
						$injector.get('platformModalService').showDialog(modalOptions);
						return false;
					}
				}

				service.showDialog = function showDialog() {
					var selectedBills = salesBillingService.getSelectedEntities(),
						title = 'sales.billing.createConsecutiveBillNoWizardTitle',
						msg = $translate.instant('sales.billing.noCurrentBillSelection');

					// process if only one bill is selected
					if (_.size(selectedBills) === 1) {
						var selectedBill = _.first(selectedBills);

						// check bill status (readonly?)
						if (!assertBillIsNotReadOnly($translate.instant(title), selectedBill)) {
							return;
						}
						// stop here if bill already has a Consecutive Bill No.
						if (!assertBillIsHasNoConsecutiveBillNo($translate.instant(title), selectedBill)) {
							return;
						}
						// TODO:
						//  there should be a wizard which allows to select:
						//  1) Generate the number based on defined number sequence
						//  2) Take over the number from Bill No. (equals "nothing defined for consecutive number" since when no consective number defined and no wizard executed we pass already bill no. to Finance, but maybe we can show bill no. in the consecutive number field when user selects this option
						//  3) Enter the code in the field (incl. validation for duplicate codes)
						var updateConsecutiveBillNoField = function updateConsecutiveBillNoField(entity, value) {
							entity.ConsecutiveBillNo = (value === true) ? $translate.instant('cloud.common.isGenerated') : entity.BillNo;
							$injector.get('platformRuntimeDataService').readonly(entity, [{
								field: 'ConsecutiveBillNo',
								readonly: value
							}]);
						};
						var dataItem = {
							SelectedBill: selectedBill,
							BillNo: selectedBill.BillNo,
							GenerateConsecutiveBillNo: true,
							ConsecutiveBillNo: selectedBill.BillNo // on init we take over from billno
						};
						updateConsecutiveBillNoField(dataItem, true);
						var modalDialogConfig = {
							title: $translate.instant(title),
							dataItem: dataItem,
							formConfiguration: {
								fid: 'sales.billing.createConsecutiveBillNoWizardDialog',
								version: '0.1.0',
								showGrouping: false,
								groups: [{
									gid: 'baseGroup',
									attributes: ['billno', 'generateconsecutivebillno', 'consecutivebillno']
								}],
								rows: [
									// Code field / BillNo (current Bill)
									{
										gid: 'baseGroup',
										rid: 'billno',
										label$tr$: 'sales.billing.entityBillNo',
										model: 'BillNo',
										required: false,
										readonly: true,
										type: 'code',
										sortOrder: 0
									},
									// Generate the number based on defined number sequence
									{
										gid: 'baseGroup',
										rid: 'generateconsecutivebillno',
										label$tr$: 'sales.billing.generateConsecutiveBillNoOpt',
										model: 'GenerateConsecutiveBillNo',
										required: false,
										readonly: false,
										type: 'boolean',
										sortOrder: 1,
										validator: function (entity, value) {
											updateConsecutiveBillNoField(entity, value);
										}
									},
									// fill in ConsecutiveBillNo
									{
										gid: 'baseGroup',
										rid: 'consecutivebillno',
										label$tr$: 'sales.billing.entityConsecutiveBillNo',
										model: 'ConsecutiveBillNo',
										required: true,
										type: 'code',
										sortOrder: 2,
										validator: function (entity, modelValue, field) {
											return $injector.get('salesBillingValidationService').validateConsecutiveBillNo(entity, modelValue, field);
										}
									}
								]
							},
							dialogOptions: {
								disableOkButton: function disableOkButton() {
									return false; // TODO:
								}
							},
							handleOK: function handleOK(result) {
								if (_.has(result, 'data.GenerateConsecutiveBillNo')) {
									var generateConsecutiveBillNo = _.get(result, 'data.GenerateConsecutiveBillNo');
									if (generateConsecutiveBillNo === true && _.isObject(selectedBill)) {
										$http.get(globals.webApiBaseUrl + 'sales/billing/generateconsecutivebillno?billHeaderId=' + selectedBill.Id)
											.then(function (response) {
												var consecutiveBillNo = response.data;
												selectedBill.ConsecutiveBillNo = consecutiveBillNo;
												_.each(salesBillingService.getDataProcessor(), function (proc) {
													proc.processItem(selectedBill);
												});
												salesBillingService.markItemAsModified(selectedBill);
												salesBillingService.updateAndExecute(function () {});
											});
									} else {
										selectedBill.ConsecutiveBillNo = _.get(result, 'data.ConsecutiveBillNo');
										_.each(salesBillingService.getDataProcessor(), function (proc) {
											proc.processItem(selectedBill);
										});
										salesBillingService.markItemAsModified(selectedBill);
										salesBillingService.updateAndExecute(function () {});
									}
								}
							},
							handleCancel: function handleCancel() {
							}
						};

						platformTranslateService.translateFormConfig(modalDialogConfig.formConfiguration);
						$injector.get('platformModalFormConfigService').showDialog(modalDialogConfig);

					} else {
						$injector.get('platformSidebarWizardCommonTasksService').showErrorNoSelection(title, msg);
					}
				};

				return service;
			}
		]);
})();
