/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name sales.billing.services: salesBillingWizardService
	 * @description
	 * Provides wizard configuration and implementation of all sales billing wizards
	 */
	angular.module('sales.billing').factory('salesBillingWizardService',
		['_', 'globals', '$q', '$injector', '$translate', '$http', 'basicsCommonChangeStatusService', 'salesBillingService', 'platformTranslateService', 'salesCommonBoqWizardService', 'platformModalService', 'cloudDesktopSidebarService', 'salesBillingValidationDataService', 'platformDialogService', 'salesBillingAssignBillToPaymentScheduleWizardDialogService', 'documentProjectDocumentsStatusChangeService', 'businesspartnerCertificateCertificateContainerServiceFactory', 'salesBillingPaymentService',
			function (_, globals, $q, $injector, $translate, $http, basicsCommonChangeStatusService, salesBillingService, platformTranslateService, salesCommonBoqWizardService, platformModalService, cloudDesktopSidebarService, salesBillingValidationDataService, platformDialogService, salesBillingAssignBillToPaymentScheduleWizardDialogService, documentProjectDocumentsStatusChangeService, businesspartnerCertificateCertificateContainerServiceFactory, salesBillingPaymentService) {

				var service = {};

				// helper
				function assertBillIsNotReadOnly(title, billItem) {
					var message = $translate.instant('sales.billing.billIsReadOnly');
					return $injector.get('salesCommonStatusHelperService').assertIsNotReadOnly(title, message, salesBillingService, billItem);
				}

				// Billing      <editor-fold desc="[Billing]">
				var changeBillStatus = function changeBillStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							projectField: 'ProjectFk',
							statusName: 'billing',
							mainService: salesBillingService,
							statusField: 'BilStatusFk',
							codeField: 'BillNo',
							descField: 'DescriptionInfo.Translated',
							statusDisplayField: 'Description',
							title: 'sales.billing.wizardCSChangeBilStatus',
							statusProvider: function (entity) {
								return $injector.get('basicsLookupdataSimpleLookupService').getList({
									valueMember: 'Id',
									displayMember: 'Description',
									lookupModuleQualifier: 'sales.billing.status',
									filter: {
										customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
										field: 'RubricCategoryFk'
									}
								}).then(function (respond) {
									return _.filter(respond, function (item) {
										return (item.RubricCategoryFk === entity.RubricCategoryFk) && item.isLive;
									});
								});
							},
							updateUrl: 'sales/billing/changestatus',
							handleSuccess: function handleSuccess(result) {
								if (result.changed === true && result.executed === true) {
									var item = result.entity;
									var oldItem = _.find(salesBillingService.getList(), {Id: item.Id});
									if (oldItem) {
										_.each(salesBillingService.getDataProcessor(), function (processor) {
											processor.processItem(item);
										});

										angular.extend(oldItem, item);
										salesBillingService.setSelected({}).then(function () {
											salesBillingService.setSelected(oldItem);
											salesBillingService.gridRefresh();
										});
									}
									salesBillingService.checkBilStatus(item);
								}
							}
						}
					);
				};

				service.changeBillStatus = changeBillStatus().fn;

				service.setPreviousBill = function setPreviousBill() {
					var selectedBills = salesBillingService.getSelectedEntities(),
						title = 'sales.billing.setPreviousBillWizardTitle',
						msg = $translate.instant('sales.billing.noCurrentBillSelection');

					// process if only one bill is selected
					if (_.size(selectedBills) === 1) {
						var selectedBill = _.first(selectedBills);

						// check bill status (readonly?)
						if (!assertBillIsNotReadOnly($translate.instant(title), selectedBill)) {
							return;
						}

						var filters = [{
							key: 'sales-billing-set-previous-bill-wizard-filter',
							serverKey: 'sales-billing-previousbill-filter-by-server',
							serverSide: true,
							fn: function (dlgEntity/* , state */) {
								return {
									BillId: dlgEntity.BillId, // see ALM 117119
									IsSetPreviousBillWizard: true, // see ALM 117119
									OrdHeaderFk: dlgEntity.OrdHeaderId,
									ProjectFk: dlgEntity.ProjectId
								};
							}
						}];
						$injector.get('basicsLookupdataLookupFilterService').registerFilter(filters);

						var dataItem = {
							BillId: selectedBill.Id,
							PreviousBillId: selectedBill.PreviousBillFk,
							OrdHeaderId: selectedBill.OrdHeaderFk,
							ProjectId: selectedBill.ProjectFk
						};
						var modalDialogConfig = {
							title: $translate.instant(title),
							dataItem: dataItem,
							formConfiguration: {
								fid: 'sales.billing.setPreviousBillWizardDialog',
								version: '0.2.0',
								showGrouping: false,
								groups: [{
									gid: 'baseGroup',
									attributes: ['previousBillId']
								}],
								rows: [
									// (previous) Bill
									{
										gid: 'baseGroup',
										rid: 'previousBillId',
										model: 'PreviousBillId',
										sortOrder: 1,
										label: 'Previous Bill',
										label$tr$: 'sales.common.PreviousBill',
										type: 'directive',
										directive: 'basics-lookupdata-lookup-composite',
										options: {
											lookupDirective: 'sales-common-bill-dialog-v2',
											descriptionMember: 'DescriptionInfo.Translated',
											lookupOptions: {
												filterKey: 'sales-billing-set-previous-bill-wizard-filter',
												showClearButton: true
											}
										}
									}
								]
							},
							dialogOptions: {
								disableOkButton: function disableOkButton() {
									return dataItem.PreviousBillId === selectedBill.PreviousBillFk;
								}
							},
							handleOK: function handleOK(result) {
								if (_.has(result, 'data.PreviousBillId')) {
									var previousBillId = _.get(result, 'data.PreviousBillId');
									if (previousBillId > 0 && _.isObject(selectedBill)) {
										// check if change of previous bill reference is possible
										$http.get(globals.webApiBaseUrl + 'sales/billing/ispreviousbillchangepossible?&bilHeaderId=' + selectedBill.Id)
											.then(function (response) {
												if (!response.data) {
													platformDialogService.showErrorBox($translate.instant('sales.billing.changePreviousBillError'), 'sales.billing.setPreviousBillWizardTitle');
												} else {
													// Detect Circular Dependency
													$http.get(globals.webApiBaseUrl + 'sales/billing/detectcirculardependency?projectId=' + selectedBill.ProjectFk + '&bilHeaderId=' + selectedBill.Id + '&newPreviousBillId=' + previousBillId)
														.then(function (response) {
															if (response.data === false) {
																selectedBill.PreviousBillFk = previousBillId;
																_.each(salesBillingService.getDataProcessor(), function (proc) {
																	proc.processItem(selectedBill);
																});
																salesBillingService.markItemAsModified(selectedBill);
															} else {
																platformDialogService.showErrorBox($translate.instant('sales.billing.setPreviousDetectedCircularDependency'), 'sales.billing.setPreviousBillWizardTitle');
															}
														});
												}
											});
									} else {
										// check if deletion of previous bill reference is possible
										$http.get(globals.webApiBaseUrl + 'sales/billing/ispreviousbillchangepossible?&bilHeaderId=' + selectedBill.Id)
											.then(function (response) {
												if (!response.data) {
													platformDialogService.showErrorBox($translate.instant('sales.billing.deletePreviousBillError'), 'sales.billing.setPreviousBillWizardTitle');
												} else {
													selectedBill.PreviousBillFkForDeletion = selectedBill.PreviousBillFk;
													selectedBill.PreviousBillFk = previousBillId;
													_.each(salesBillingService.getDataProcessor(), function (proc) {
														proc.processItem(selectedBill);
													});
													salesBillingService.markItemAsModified(selectedBill);
												}
											});
									}
								}
								$injector.get('basicsLookupdataLookupFilterService').unregisterFilter(filters);
							},
							handleCancel: function handleCancel() {
								$injector.get('basicsLookupdataLookupFilterService').unregisterFilter(filters);
							}
						};

						platformTranslateService.translateFormConfig(modalDialogConfig.formConfiguration);
						$injector.get('platformModalFormConfigService').showDialog(modalDialogConfig);
					} else {
						$injector.get('platformSidebarWizardCommonTasksService').showErrorNoSelection(title, msg);
					}
				};

				service.createXBill = function createXBill() {
					var currentBillHeader = salesBillingService.getSelected();

					if (currentBillHeader) {
						var additionalDocuments = [];
						const fileReader = new FileReader();

						platformDialogService.showYesNoDialog('sales.billing.wizard.xBillAddAdditionalDocuments', 'sales.billing.wizard.generateXBill', 'no', undefined, undefined, {}).then(function (result) {
							if (result.yes) {
								var fileElement = angular.element('<input type="file"/>');
								fileElement.attr('accept', '.pdf, .png, .jpg, .csv, .xlsx, .odc');
								fileElement.attr('multiple', '');
								fileElement.change(function () {
									loadFiles(this.files, 0);
								});
								fileElement.click();

							} else {
								createXBill();
							}
						});

						function loadFiles(files, index) {
							fileReader.readAsDataURL(files[index]);
							fileReader.onload = (e) => {
								additionalDocuments.push({FileName: files[index].name, Content: e.target.result.split(',')[1]});
								if (++index < files.length) {
									loadFiles(files, index);
								} else {
									createXBill();
								}
							};
						}

						function createXBill() {
							var requestParam = {BillHeader: currentBillHeader, AdditionalDocuments: additionalDocuments};

							$http.post(globals.webApiBaseUrl + 'sales/billing/createxbill', requestParam)
								.then(function (response) {
									if (response.data !== null) {
										if (response.data.FileName) {
											platformDialogService.showMsgBox(response.data.FileName + ',  ' + $translate.instant('sales.billing.wizard.xBillCreationSucceeded'), 'cloud.common.infoBoxHeader', 'info');
										} else {
											if (response.data.ErrorMessage) {
												platformDialogService.showErrorBox(response.data.ErrorMessage, 'cloud.common.errorMessage');
											}
											if (response.data.ErrorLogPath) {
												window.open(response.data.ErrorLogPath);
											}
										}
									}
								});
						}
					}
				};

				service.changeCode = function changeCode() {
					$injector.get('salesCommonCodeChangeWizardService').showDialog();
				};

				service.createAccruals = function createAccruals() {
					$injector.get('salesBillingCreateAccrualsWizardService').showDialog();
				};

				service.createConsecutiveBillNo = function createConsecutiveBillNo() {
					$injector.get('salesBillingCreateConsecutiveBillNoWizardService').showDialog();
				};

				service.createCreditMemo = function createCreditMemo() {
					salesBillingService.updateAndExecute(function () {
						$injector.get('salesBillingCreateCreditMemoDialogService').showDialog();
					});
				};

				service.assignBillToPaymentScheduleLine = function assignBillToPaymentScheduleLine() {
					salesBillingAssignBillToPaymentScheduleWizardDialogService.generateFormDialog();
				};
				// </editor-fold>

				// BoQ      <editor-fold desc="[BoQ]">
				service.GaebImport = function GaebImport(wizardParameter) {
					salesCommonBoqWizardService.GaebImport(salesBillingService, 'salesBillingBoqStructureService', wizardParameter);
				};

				service.GaebExport = function GaebExport(wizardParameter) {
					salesCommonBoqWizardService.GaebExport(salesBillingService, 'salesBillingBoqStructureService', wizardParameter);
				};

				service.importOenOnlv = function () {
					if (assertBillIsNotReadOnly($translate.instant('boq.main.oen.onlvImport'), salesBillingService.getSelected())) {
						salesCommonBoqWizardService.importOenOnlv(salesBillingService, 'salesBillingBoqStructureService');
					}
				};

				service.exportOenOnlv = function () {
					if (assertBillIsNotReadOnly($translate.instant('boq.main.oen.onlvExport'), salesBillingService.getSelected())) {
						salesCommonBoqWizardService.exportOenOnlv(salesBillingService, 'salesBillingBoqStructureService');
					}
				};

				service.importCrbSia = function importCrbSia() {
					if (assertBillIsNotReadOnly($translate.instant('boq.main.siaImport'), salesBillingService.getSelected())) {
						salesCommonBoqWizardService.importCrbSia(salesBillingService, 'salesBillingBoqStructureService');
					}
				};

				service.exportCrbSia = function exportCrbSia() {
					salesCommonBoqWizardService.exportCrbSia(salesBillingService, 'salesBillingBoqStructureService');
				};

				service.boqExportExcel = function (wizardParameter) {
					salesCommonBoqWizardService.BoqExcelExport(salesBillingService, 'salesBillingBoqStructureService', wizardParameter);
				};

				service.boqImportExcel = function (wizardParameter) {
					salesCommonBoqWizardService.BoqExcelImport(salesBillingService, 'salesBillingBoqStructureService', wizardParameter);
				};

				service.startQuantityInspector = function () {
					salesCommonBoqWizardService.startQuantityInspector(salesBillingService, 'salesBillingBoqStructureService');
				};

				service.scanBoq = function scanBoq(wizardParameter) {
					salesCommonBoqWizardService.scanBoq(salesBillingService, 'salesBillingBoqStructureService', wizardParameter);
				};

				service.RenumberBoQ = function RenumberBoQ() {
					if (assertBillIsNotReadOnly($translate.instant('boq.main.boqRenumber'), salesBillingService.getSelected())) {
						salesCommonBoqWizardService.RenumberBoQ(salesBillingService, 'salesBillingBoqStructureService');
					}
				};

				service.TakeoverBoQ = function TakeoverBoQ() {
					// Check bill is selected
					var selectedBill = salesBillingService.getSelected();
					var message = $translate.instant('sales.billing.noBillHeaderSelected');

					if (!$injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedBill, 'sales.billing.billSelectionMissing', message)) {
						return;
					}
					if (assertBillIsNotReadOnly($translate.instant('sales.common.wizard.takeoverBoq'), selectedBill)) {
						$injector.get('salesCommonCopyBoqWizardService').showDialog();
					}
				};

				service.updateBoq = function () {
					salesCommonBoqWizardService.updateBoq(salesBillingService, 'salesBillingBoqStructureService', 'sales.billing');
				};

				service.changeSalesConfiguration = function changeSalesConfiguration() {
					let selectedBill = salesBillingService.getSelected();
					let statusLookup = $injector.get('salesBillingStatusLookupDataService');
					let title = 'sales.billing.entityChangeSalesBillConfig';
					let message = $translate.instant('sales.billing.noBillHeaderSelected');

					if (!$injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedBill, 'sales.billing.billSelectionMissing', message)) {
						return;
					}

					if (selectedBill !== null) {
						statusLookup.getItemByIdAsync(selectedBill.BilStatusFk, {dataServiceName: 'salesBillingStatusLookupDataService'}).then(function (billStatus) {
							if (billStatus.IsBilled || billStatus.IsArchived || billStatus.IsPosted || billStatus.IsReadOnly || billStatus.IsCanceled) {
								$injector.get('platformModalService').showMsgBox('sales.common.entityRestrictedStatus', title, 'info');
							} else {
								$injector.get('salesCommonChangeSalesTypeOrConfigurationWizardService').showChangeSalesTypeOrConfigurationWizard();
							}
						});
					}
				};

				service.changeBoqHeaderStatus = function changeBoqHeaderStatus() {
					if (assertBillIsNotReadOnly($translate.instant('boq.main.boqRenumber'), salesBillingService.getSelected())) {
						salesCommonBoqWizardService.changeBoqHeaderStatus(salesBillingService, 'salesBidBoqService').fn();
					}
				};
				// </editor-fold>

				// Billing Posting      <editor-fold desc="[Billing Posting]">
				service.createTransactions = function () {
					var header = salesBillingService.getSelected();

					if (!header || !header.Id) {
						// showMsgBox('selectedOne', null, 'selected');
						return;
					}

					salesBillingService.updateAndExecute(function () {
						$http.get(globals.webApiBaseUrl + 'sales/billing/transaction/create?mainItemId=' + header.Id);
					});
				};

				service.prepareTransaction = function () {
					var header = salesBillingService.getSelected();

					if (!header || !header.Id) {
						showMsgBox('selectedOne', null, 'selected');
						return;
					}

					var headers = salesBillingService.getSelectedEntities();
					var headerIds = headers.map(function (item) {
						return item.Id;
					});

					salesBillingService.updateAndExecute(function () {
						// $http.get(globals.webApiBaseUrl + 'sales/billing/transaction/prepare?mainItemId=' + header.Id).then(function () {
						$http.post(globals.webApiBaseUrl + 'sales/billing/transaction/prepare', {MainItemIds: headerIds}).then(function () {
							if (headerIds.length === 1) {
								// salesBillingService.setSelected();
								// $timeout(function () {
								//  salesBillingService.setSelected(header);
								// }, 200);

								// #109588 - refresh bill status to identify OK & ERROR while posting
								salesBillingService.refreshSelectedEntities();
								// end of #109588
							} else {
								salesBillingService.currentSelectItem = headers;
								salesBillingService.refreshView();
							}
						});
					});
				};

				service.prepareTransactionForAll = function () {
					var invoice = salesBillingService.getList();
					if (!invoice || invoice.length <= 0) {
						showMsgBox('noRecord');
						return;
					}
					var searchFilter = cloudDesktopSidebarService.getFilterRequestParams();
					salesBillingService.updateAndExecute(function () {
						$http.post(globals.webApiBaseUrl + 'sales/billing/transaction/prepareforall', searchFilter).then(function (res) {
							if (!angular.isUndefined(res.data) && res.data.length > 0) {
								showMsgBox('taskWait');
								salesBillingValidationDataService.addJob(res.data);
								salesBillingValidationDataService.updateAll();
							} else {
								showMsgBox('taskFail', res.data);
							}

						});
					});
				};

				function showMsgBox(bodyText, bodyTextParam, titleParam) {
					var strBody = 'procurement.invoice.transaction.' + bodyText;
					if (bodyTextParam) {
						strBody = $translate.instant(strBody, {reason: bodyTextParam});
					} else {
						strBody = $translate.instant(strBody);
					}

					var strTitle = 'procurement.invoice.transaction.generateTransaction';
					strTitle = $translate.instant(strTitle, {status: titleParam || 'all'});

					platformModalService.showMsgBox(strBody, strTitle, 'info');
				}

				// </editor-fold>

				// Indirect Cost Balancing      <editor-fold desc="[Indirect Cost Balancing]">
				function assertIndirectCostBalancingBillAndConfig(selectedBill, title) {
					// bill selected? otherwise show error dialog
					if (!$injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedBill, title, $translate.instant('sales.billing.noBillHeaderSelected'))) {
						return false;
					}
					// config available?
					var currentIndirectsBalConfig = $injector.get('salesBillingIndirectBalancingService').getCurrentConfig();
					if (currentIndirectsBalConfig === null) {
						platformDialogService.showInfoBox('sales.billing.noConfigForSelectedBill');
						return false;
					}
					return true;
				}

				service.setBoqItemFlag = function setBoqItemFlag() {
					var selectedBill = salesBillingService.getSelected();
					if (!assertIndirectCostBalancingBillAndConfig(selectedBill, 'sales.billing.applyIndirectCostsBalancingConfigTooltip')) {
						return;
					}
					$injector.get('salesBillingIndirectBalancingService').applyIndirectCostsBalancingConfig(_.get(selectedBill, 'Id'));
				};

				service.updateDirectCostPerUnit = function updateDirectCostPerUnit() {
					var selectedBill = salesBillingService.getSelected();
					if (!assertIndirectCostBalancingBillAndConfig(selectedBill, 'sales.billing.updateDirectCostPerUnitTooltip')) {
						return;
					}
					$injector.get('salesBillingIndirectBalancingService').updateDirectCostPerUnit(_.get(selectedBill, 'Id'));
				};

				service.createInterCompanyInvoice = function createConsecutiveBillNo() {
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'procurement.common/templates/wizard/create-inter-company-dialog.html',
						controller: 'salesBillingCreateInterCompanyInvoiceController',
						width: '900px',
						resizeable: true
					});
				};

				// </editor-fold>

				// Documents Project      <editor-fold desc="[Documents Project]">
				service.changeStatusForProjectDocument = documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(salesBillingService, 'sales.billing').fn;
				// </editor-fold>

				let certificateDataService = businesspartnerCertificateCertificateContainerServiceFactory.getDataService('sales.billing', salesBillingService);

				service.changeCertificateStatus = changeCertificateStatus().fn;

				function changeCertificateStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							projectField: 'ProjectFk',
							statusName: 'certificate',
							guid: '538325604B524F328FDF436FB14F1FC8',
							mainService: salesBillingService,
							dataService: certificateDataService,
							descField: 'Reference',
							statusField: 'CertificateStatusFk',
							statusDisplayField: 'DescriptionInfo.Translated',
							title: 'businesspartner.main.certificateStatusTitle',
							updateUrl: 'businesspartner/certificate/certificate/status',
							id: 17,
							// If status change, run the validateCertificateStatusFk function, as it cannot run by common function
							// if the common function has changed to be supported, this function should be removed
							handleSuccess: function (result) {
								if (result.changed) {
									var item = result.entity;
									var oldEntity = certificateDataService.getItemById(item.Id);
									if (oldEntity) {
										_.forEach(certificateDataService.getDataProcessor(), function (processor) {
											processor.processItem(item);
										});
										angular.extend(oldEntity, item);
										certificateDataService.gridRefresh();
									}
								}
							},
							doValidationAndSaveBeforeChangeStatus: true
						}
					);
				}

				var changePaymentBillStatus = function changePaymentBillStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							statusName: 'salesbillingpaymentstatus',
							mainService: salesBillingService,
							dataService: salesBillingPaymentService,
							statusField: 'PaymentStatusFk',
							descField: 'Description',
							statusDisplayField: 'DescriptionInfo.Translated',
							title: 'sales.billing.wizardCSChangeBillPaymentStatusTitle',
							handleSuccess: function handleSuccess(result) {
								if (result.changed && result.executed === true) {
									var item = result.entity;
									var oldEntity = $injector.get('salesBillingPaymentService').getItemById(item.Id);
									if (oldEntity) {
										_.forEach($injector.get('salesBillingPaymentService').getDataProcessor(), function (processor) {
											processor.processItem(item);
										});
										angular.extend(oldEntity, item);
										$injector.get('salesBillingPaymentService').gridRefresh();
									}
								}
							}
						}
					);
				};

				service.changeBillPaymentStatus = changePaymentBillStatus().fn;

				return service;
			}

		]);
})();
