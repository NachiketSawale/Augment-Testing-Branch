/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, _ */

(function () {
	'use strict';
	let moduleName = 'sales.contract';

	/**
	 * @ngdoc service
	 * @name salesContractBillFromPaymentScheduleWizardDialogService
	 * @function
	 * @requires platformSidebarWizardCommonTasksService salesContractService
	 *
	 * @description
	 * # service for revenue creation dialog
	 */
	angular.module(moduleName).factory('salesContractBillFromPaymentScheduleWizardDialogService',
		['$injector', '$q', '$http', '$translate', 'platformModalService', 'platformSidebarWizardCommonTasksService', 'salesContractService', 'salesContractPaymentScheduleDataService', 'platformRuntimeDataService', 'salesBillingNumberGenerationSettingsService',
			function ($injector, $q, $http, $translate, platformModalService, platformSidebarWizardCommonTasksService, salesContractService, salesContractPaymentScheduleDataService, platformRuntimeDataService, salesBillingNumberGenerationSettingsService) {

				var data = {
					hasBoqs: true,
					boqItems: [],
					orderPaymentStatusList:[]
				};
				let service = {}, initDataItem = {};

				angular.extend(service, {
					generateFormDialog: generateFormDialog,
					createRevenueDialogConfirmation: createRevenueDialogConfirmation,
					generateContractBillFromPaymentSchedule: generateContractBillFromPaymentSchedule,
					getContractSelected: getContractSelected,
					getContractPaymentScheduleSelected: getContractPaymentScheduleSelected,
					isUniqueContract: isUniqueContract,
					// init: init
					hasBoqs: hasBoqs,
					getFirstBoq: getFirstBoq,
					resetToDefault: resetToDefault,
					getDataItem: getDataItem,
					getOrderPaymentStatus: getOrderPaymentStatus
				});

				// init();

				return service;

				function getValidOrderPaymentScheduleTypeById(typeId) {
					let item = _.find(data.orderPaymentStatusList, function(item){
						return typeId === item.Id;
					});

					return item && item.Id ? (item.IsAgreed || item.IsIssued): false;
				}

				function generateFormDialog() {

					// Select contract
					let selectedContract = salesContractService.getSelected(),
						title = 'sales.contract.generateBillFromPaymentSchedule',
						msg = $translate.instant('sales.contract.noCurrentContractSelection');

					// Select payment schedule
					let selectedPaymentSchedule = salesContractPaymentScheduleDataService.getSelected(),
						noPaymentScheduleSelectedMsg = $translate.instant('sales.contract.noCurrentContractPaymentScheduleSelection');

					if (platformSidebarWizardCommonTasksService.assertSelection(selectedContract, title, msg) &&
						platformSidebarWizardCommonTasksService.assertSelection(selectedPaymentSchedule, title, noPaymentScheduleSelectedMsg)) {

						// If payment schedule is not saved, then show error message
						if (selectedPaymentSchedule.Version === 0){
							platformModalService.showErrorBox('sales.contract.noCurrentValidContractPaymentScheduleSelection', title);
							return;
						}

						// Validate payment schedule status
						let isValidStatusIsAgreedOrIsIssued = selectedPaymentSchedule && selectedPaymentSchedule.OrdPsStatusFk ? getValidOrderPaymentScheduleTypeById(selectedPaymentSchedule.OrdPsStatusFk): true;
						if (!isValidStatusIsAgreedOrIsIssued){
							platformModalService.showErrorBox('sales.contract.noCurrentValidContractPaymentScheduleSelectionStatus', title);
							return;
						}

						// If contract can generate billing
						$http.get(globals.webApiBaseUrl + 'sales/contract/canGenerateBill?MainItemId=' + selectedContract.Id).then(function (res) {
							if (res.data.CanGenerate) {

								// If payment schedule is already assigned by bill, then show error message
								$http.post(globals.webApiBaseUrl + 'sales/contract/paymentschedule/hasbillingassigned',{ Code: 'CODE', Id: selectedPaymentSchedule.Id }).then(function (response) {
									// if (selectedPaymentSchedule.BilHeaderFk !== null && selectedPaymentSchedule.BilHeaderFk > 0){
									if (response.data){
										platformModalService.showErrorBox('sales.contract.assignedPsBillHeaderMsg', title);
										return false;
									}

									// Proceed to show wizard to generate bill
									salesContractService.updateAndExecute(function () {
										$http.get(globals.webApiBaseUrl + 'sales/contract/boq/list?contractId=' + selectedContract.Id).then(function(response){
											let contractBoqs = response.data || [];
											data.hasBoqs = !_.isEmpty(contractBoqs);
											data.boqItems = angular.copy(contractBoqs) || [];

											// Attached to lookup
											$injector.invoke(['basicsLookupdataLookupDescriptorService', function (basicsLookupdataLookupDescriptorService) {
												basicsLookupdataLookupDescriptorService.removeData('salesContractExistedBoqs');
												basicsLookupdataLookupDescriptorService.updateData('salesContractExistedBoqs', data.boqItems );
											}]);

											platformModalService.showDialog({
												templateUrl: 'sales.contract/templates/sales-contract-bill-from-payment-schedule-wizard.html',
												controller: 'salesContractBillFromPaymentScheduleWizardController'
											});
										});
									});

								});

							}
							else {
								platformModalService.showMsgBox(res.data.Message, title, 'info');
							}
						});
					}
				}

				function createRevenueDialogConfirmation(){
					let modalOptions = {
						headerTextKey: $translate.instant('sales.contract.wizardCWCreateRevenue'),
						bodyTextKey: $translate.instant('sales.contract.wizardCWCreateRevenueAlreadyExistsConfirm'),
						showYesButton: true,
						showNoButton: true,
						iconClass: 'ico-question'
					};

					return platformModalService.showDialog(modalOptions);
				}

				/**
				 * @ngdoc function
				 * @name generateContractBillFromPaymentSchedule
				 * @function
				 * @methodOf salesContractCreateRevenueWizardDialogService
				 * @description post data to transfer revenue to estimate
				 * @param entity
				 * @returns promise
				 */
				function generateContractBillFromPaymentSchedule(entity){
					let boqItemToSave = $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('salesContractExistedBoqs', entity.BoqFk);

					let postData = {
						RadioTypeId: entity.RadioType === '0' ? 0 : 1,
						ContractId: entity.Id,
						WipFk: entity.WipFk,
						BoqHeaderFk: entity.BoqHeaderFk,
						BoqFk: boqItemToSave ? boqItemToSave.BoqRootItem.Id : null,
						PreviousBillFk: entity.PreviousBillFk,
						BillTypeFk: entity.TypeFk,
						RubricCategoryFk: entity.RubricCategoryFk,
						ConfigurationFk:entity.ConfigurationFk,
						BillNo: entity.BillNo,
						PaymentScheduleId: entity.PaymentScheduleId,
						Description: entity.Description,
						ResponsibleCompanyFk: entity.ResponsibleCompanyFk,
						ClerkFk: entity.ClerkFk,
						PaymentScheduleDateRequest: entity.PaymentScheduleDateRequest,
						PaymentSchedulePaymentBalanceNet: entity.PaymentBalanceNet || 0
					};

					return $http.post(globals.webApiBaseUrl + 'sales/billing/createbillfromcontractpaymentschedule', postData);
				}

				function getContractSelected(){
					return angular.copy(salesContractService.getSelected());
				}

				function getContractPaymentScheduleSelected(){
					return angular.copy(salesContractPaymentScheduleDataService.getSelected());
				}

				function isUniqueContract(id){
					var defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'sales/wip/isuniquecontract?ordHeaderFk=' + id).then(function(response){
						defer.resolve(response.data);
					});
					return defer.promise;
				}

				function hasBoqs(){
					return data.hasBoqs;
				}

				function getFirstBoq(){
					return hasBoqs() ?
						_.first(_.sortBy(data.boqItems, 'Id')) :
						null;
				}

				// - Rubric Category
				function validateSelectedRubricCategory(entity, value) {
					platformRuntimeDataService.readonly(entity, [{
						field: 'BillNo',
						readonly: salesBillingNumberGenerationSettingsService.hasToGenerateForRubricCategory(value)
					}]);
					entity.BillNo = salesBillingNumberGenerationSettingsService.provideNumberDefaultText(value, entity.BillNo);
				}

				function resetToDefault(scope){
					let contractSelected = getContractSelected();
					let contractPaymentScheduleSelected = getContractPaymentScheduleSelected();
					initDataItem = {
						RadioType: scope.modalOptions.hasBoqs ? '0': '1',

						WipFk: null,

						BoqHeaderFk: scope.modalOptions.hasBoqs ? getFirstBoq().BoqHeader.Id : null,
						BoqFk: scope.modalOptions.hasBoqs ? getFirstBoq().Id : null,
						// fields
						Id: contractSelected.Id,
						ProjectFk: contractSelected.ProjectFk,

						TypeFk: contractPaymentScheduleSelected.BilTypeFk,
						RubricCategoryFk: null,
						BillNo: null,
						PaymentScheduleId: contractPaymentScheduleSelected.Id,
						PaymentScheduleDateRequest: contractPaymentScheduleSelected.DateRequest,
						// #146063 Description of Payment Schedule is ignored in creating bill process
						Description: contractPaymentScheduleSelected.DescriptionInfo.Translated,
						ResponsibleCompanyFk: contractSelected.CompanyResponsibleFk,
						ClerkFk: contractSelected.ClerkFk,

						PaymentBalanceNet: contractPaymentScheduleSelected.PaymentBalanceNet
					};

					// set billing type
					if (contractPaymentScheduleSelected.BilTypeFk) {
						$injector.get('salesBillTypeLookupDataService').getItemByIdAsync(contractPaymentScheduleSelected.BilTypeFk).then(function (typeEntity) {
							initDataItem.TypeFk = _.get(typeEntity, 'Id') || 0;
							initDataItem.RubricCategoryFk = _.get(typeEntity, 'RubricCategoryFk') || 0;
							validateSelectedRubricCategory(initDataItem, initDataItem.RubricCategoryFk);
						});
					}
					// TODO: check this code (if needs to be enabled use salesBillTypeLookupDataService instead of getDefaultBillingType / basicsLookupdataSimpleLookupService
					// else {
					//  getDefaultBillingType().then(function (typeEntity) {
					//      initDataItem.TypeFk = _.get(typeEntity, 'Id') || 0;
					//      initDataItem.RubricCategoryFk = _.get(typeEntity, 'BasRubricCategoryFk') || 0;
					//  });
					// }

					// // set default rubric category
					// var lookupService = 'basicsMasterDataRubricCategoryLookupDataService';
					// var rubricCategoryDataService = $injector.get(lookupService);
					// rubricCategoryDataService.setFilter(7); // Customer Billing ([BAS_RUBRIC])
					// rubricCategoryDataService.getList({lookupType: lookupService}).then(function (data) {
					//  var defaultItem = _.find(data, {IsDefault: true});
					//  initDataItem.RubricCategoryFk = _.get(defaultItem, 'Id') || 0;
					//  validateSelectedRubricCategory(initDataItem, initDataItem.RubricCategoryFk);
					// });





				}

				function getDataItem(){
					return initDataItem;
				}

				function getOrderPaymentStatus() {
					let postData = {};
					let selectedPaymentSchedule = salesContractPaymentScheduleDataService.getSelected();
					if (selectedPaymentSchedule && selectedPaymentSchedule.OrdPsStatusFk) {
						postData = {'ID': selectedPaymentSchedule.OrdPsStatusFk};
					}
					return $http.post(globals.webApiBaseUrl + 'basics/customize/OrderPaymentSchedulesStatus/list', postData).then(
						function (response) {
							_.remove(response.data, {IsLive: false});
							data.orderPaymentStatusList = response.data;
						});
				}
			}]);
})();
