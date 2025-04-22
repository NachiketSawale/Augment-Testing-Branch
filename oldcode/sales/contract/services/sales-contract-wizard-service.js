/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	/**
	 * @ngdoc factory
	 * @name sales.contract.services: salesContractWizardService
	 * @description
	 * Provides wizard configuration and implementation of all sales contract wizards
	 */
	angular.module('sales.contract').factory('salesContractWizardService', ['globals', '_', '$injector', '$translate', '$http', 'salesContractService', 'basicsCommonChangeStatusService', 'platformSidebarWizardConfigService', 'platformTranslateService', 'salesContractCreateBillWizardDialogService', 'salesContractCreateWipWizardDialogService', 'salesCommonBoqWizardService', 'salesContractCreateRevenueWizardDialogService',
		'salesContractBoqService', 'procurementCommonGeneratePaymentScheduleService', 'prcCommonMaintainPaymentScheduleVersionService', 'salesContractPaymentScheduleDataService', 'salesContractBillFromPaymentScheduleWizardDialogService',
		'updatePaymentScheduleDOCService', 'procurementCommonPaymentScheduleFormatterProcessor', 'salesContractTransactionDataService', 'documentProjectDocumentsStatusChangeService', 'generatePaymentScheduleFromScheduleService', 'businesspartnerCertificateCertificateContainerServiceFactory', 'salesContractAdvanceDataService',
		function (globals, _, $injector, $translate, $http, salesContractService, basicsCommonChangeStatusService, platformSidebarWizardConfigService, platformTranslateService, salesContractCreateBillWizardDialogService, salesContractCreateWipWizardDialogService, salesCommonBoqWizardService, salesContractCreateRevenueWizardDialogService,
			salesContractBoqService, procurementCommonGeneratePaymentScheduleService, prcCommonMaintainPaymentScheduleVersionService, salesContractPaymentScheduleDataService, salesContractBillFromPaymentScheduleWizardDialogService,
			updatePaymentScheduleDOCService, procurementCommonPaymentScheduleFormatterProcessor, salesContractTransactionDataService, documentProjectDocumentsStatusChangeService, generatePaymentScheduleFromScheduleService, businesspartnerCertificateCertificateContainerServiceFactory, salesContractAdvanceDataService) {

			var service = {};

			// helper
			function assertContractIsNotReadOnly(title, contractItem) {
				var message = $translate.instant('sales.contract.contractIsReadOnly');
				return $injector.get('salesCommonStatusHelperService').assertIsNotReadOnly(title, message, salesContractService, contractItem);
			}

			// wizard functions

			// Contract      <editor-fold desc="[Contract]">
			var changeContractStatus = function changeContractStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						projectField: 'ProjectFk',
						statusName: 'salescontract',
						mainService: salesContractService,
						statusField: 'OrdStatusFk',
						descField: 'DescriptionInfo.Translated',
						statusDisplayField: 'Description',
						title: 'sales.contract.wizardCSChangeOrdStatus',
						statusProvider: function (entity) {
							return $injector.get('basicsLookupdataSimpleLookupService').getList({
								valueMember: 'Id',
								displayMember: 'Description',
								lookupModuleQualifier: 'sales.contract.status',
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
						updateUrl: 'sales/contract/changestatus',
						handleSuccess: function handleSuccess(result) {
							if (result.changed === true && result.executed === true) {
								var list = salesContractService.getList();
								var item = result.entity;
								var oldItem = _.find(list, {Id: item.Id});
								var mainOrder = _.find(list, {Id: item.OrdHeaderFk});
								if (oldItem) {
									_.each(salesContractService.getDataProcessor(), function (processor) {
										processor.processItem(item);
									});
									var isChangeOrder = item.OrdHeaderFk !== null && item.PrjChangeFk !== null;
									if (isChangeOrder && mainOrder) {
										var lookupService = $injector.get('salesContractStatusLookupDataService');
										var statusList = lookupService.getListSync('salesContractStatusLookupDataService');
										var oldItemStatus = _.find(statusList, {Id: oldItem.OrdStatusFk});
										var itemStatus = _.find(statusList, {Id: item.OrdStatusFk});
										var oldItemStatusIsAppr = oldItemStatus.IsOrdered && oldItemStatus.IsLive && !oldItemStatus.IsCanceled;
										var itemStatusIsAppr = itemStatus.IsOrdered && itemStatus.IsLive && !itemStatus.IsCanceled;
										if (oldItemStatusIsAppr !== itemStatusIsAppr) {
											if (itemStatusIsAppr) {
												mainOrder.ApprovedChangeOrderGrossOc = mainOrder.ApprovedChangeOrderGrossOc + item.AmountGrossOc;
												mainOrder.ApprovedChangeOrderNetOc = mainOrder.ApprovedChangeOrderNetOc + item.AmountNetOc;
												mainOrder.NotApprChangeOrderGrossOc = mainOrder.NotApprChangeOrderGrossOc - item.AmountGrossOc;
												mainOrder.NotApprChangeOrderNetOc = mainOrder.NotApprChangeOrderNetOc - item.AmountNetOc;
											}
											else {
												mainOrder.ApprovedChangeOrderGrossOc = mainOrder.ApprovedChangeOrderGrossOc - item.AmountGrossOc;
												mainOrder.ApprovedChangeOrderNetOc = mainOrder.ApprovedChangeOrderNetOc - item.AmountNetOc;
												mainOrder.NotApprChangeOrderGrossOc = mainOrder.NotApprChangeOrderGrossOc + item.AmountGrossOc;
												mainOrder.NotApprChangeOrderNetOc = mainOrder.NotApprChangeOrderNetOc + item.AmountNetOc;
											}
										}
									}
									else if (!item.OrdHeaderFk) {
										item.ApprovedChangeOrderGrossOc = oldItem.ApprovedChangeOrderGrossOc;
										item.ApprovedChangeOrderNetOc = oldItem.ApprovedChangeOrderNetOc;
										item.NotApprChangeOrderGrossOc = oldItem.NotApprChangeOrderGrossOc;
										item.NotApprChangeOrderNetOc = oldItem.NotApprChangeOrderNetOc;
									}

									angular.extend(oldItem, item);
									salesContractService.setSelected({}).then(function () {
										salesContractService.setSelected(oldItem);
										salesContractService.gridRefresh();
									});
								}
								salesContractService.gridRefresh();
							}
						}
					}
				);
			};
			service.changeContractStatus = changeContractStatus().fn;

			service.changeCode = function changeCode() {
				$injector.get('salesCommonCodeChangeWizardService').showDialog();
			};
			service.changeSalesConfiguration = function changeSalesConfiguration() {
				let selectedContract = salesContractService.getSelected();
				let contractStatusLookup = $injector.get('salesContractStatusLookupDataService');
				let title = 'sales.contract.entityChangeSalesContractConfig';
				let message = $translate.instant('sales.contract.noContractHeaderSelected');

				if (!$injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedContract, 'sales.contract.contractSelectionMissing', message)) {
					return;
				}

				if (selectedContract !== null) {
					contractStatusLookup.getItemByIdAsync(selectedContract.OrdStatusFk, {dataServiceName: 'salesContractStatusLookupDataService'}).then(function (contractStatus) {
						if (contractStatus.IsOrdered || contractStatus.IsCanceled || contractStatus.IsReadOnly) {
							$injector.get('platformModalService').showMsgBox('sales.common.entityRestrictedStatus', title, 'info');
						}
						else {
							$injector.get('salesCommonChangeSalesTypeOrConfigurationWizardService').showChangeSalesTypeOrConfigurationWizard();
						}
					});
				}
			};

			// </editor-fold>

			// Create Wizards / Tools      <editor-fold desc="[Create Wizards / Tools]">
			service.createBill = function createBill() {
				salesContractCreateBillWizardDialogService.createBillDialog();
			};

			service.createWip = function createWip() {
				salesContractCreateWipWizardDialogService.createWipDialog();
			};

			service.createRevenue = function createRevenue() {
				salesContractCreateRevenueWizardDialogService.createRevenueDialog();
			};

			service.createWicFromContract = function createWicFromContract() {
				var contractHeader = salesContractService.getSelected();
				if (!contractHeader) {
					return $injector.get('platformModalService').showMsgBox('sales.contract.frameworkWicCatalog.errorNoSelectOneContract', 'cloud.common.informationDialogHeader', 'info');
				}
				if (assertContractIsNotReadOnly($translate.instant('sales.contract.frameworkWicCatalog.createWicCatalog'), salesContractService.getSelected())) {
					$http.get(globals.webApiBaseUrl + 'sales/contract/' + 'canbeframework?contractId=' + contractHeader.Id).then(function (res) {
						if (res.data.Result === true) {
							$injector.get('salesContractCreateFrameworkWicCatalogWizardService').createWicFromContract();
						} else {
							return $injector.get('platformModalService').showMsgBox('sales.contract.frameworkWicCatalog.' + res.data.Message, 'sales.contract.frameworkWicCatalog.createWicCatalog', 'ico-info');
						}
					});
				}
			};

			service.generateTransactions = function () {
				var header = salesContractService.getSelected();
				var platformModalService = $injector.get('platformModalService');

				if (!header) {
					platformModalService.showMsgBox('sales.contract.noContractHeaderSelected', 'cloud.common.informationDialogHeader', 'info');
				}
				else {
					$injector.get('$http').get(globals.webApiBaseUrl + 'sales/contract/transaction/generate?mainItemId=' + header.Id).then(function (res) {
						if (res.data === 0) {
							platformModalService.showMsgBox('sales.contract.noNewTransactionGenerated', 'cloud.common.informationDialogHeader', 'info');
						}

						$injector.get('salesContractTransactionDataService').load();
					}).finally(function () {
						$injector.get('salesContractValidationDataService').load();
					});
				}
			};
			// </editor-fold>

			// Payment Schedule      <editor-fold desc="[Payment Schedule]">
			var changePaymentScheduleStatus = function changePaymentScheduleStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						statusName: 'salescontractpaymentschedule',
						mainService: salesContractService,
						dataService: salesContractPaymentScheduleDataService,
						statusField: 'OrdPsStatusFk',
						descField: 'Description',
						statusDisplayField: 'DescriptionInfo.Translated',
						title: 'sales.contract.wizardCSChangeOrdPsStatus',
						handleSuccess: function handleSuccess(result) {
							if (result.changed === true && result.executed === true) {
								var item = result.entity;
								var selectedItem = _.find(salesContractPaymentScheduleDataService.getList(), {Id: item.Id});
								if (selectedItem) {
									salesContractPaymentScheduleDataService.copyPaymentBalanceAfterChangeStatus(selectedItem, item);
									angular.extend(selectedItem, item);
									procurementCommonPaymentScheduleFormatterProcessor.processItem(selectedItem);
									salesContractPaymentScheduleDataService.setSelected({}).then(function () {
										salesContractPaymentScheduleDataService.setSelected(selectedItem);
										salesContractPaymentScheduleDataService.setFieldsReadOnly(selectedItem);
										salesContractPaymentScheduleDataService.gridRefresh();
									});
								}
							}
						}
					}
				);
			};

			service.changePaymentScheduleStatus = changePaymentScheduleStatus().fn;

			service.generatePaymentSchedule = function generatePaymentSchedule() {
				if (salesContractPaymentScheduleDataService.ifItsMainOrderIsBilled()) {
					var platformModalService = $injector.get('platformModalService');
					platformModalService.showMsgBox($translate.instant('sales.common.CannotCreateCallOffPS'), $translate.instant('sales.common.infoTitle'), 'info');
				}
				else {
					procurementCommonGeneratePaymentScheduleService.showGeneratePaymentScheduleWizardDialog(null, salesContractService);
				}
			};

			service.maintainPaymentScheduleVersion = function () {
				prcCommonMaintainPaymentScheduleVersionService.maintainPaymentScheduleVersion(salesContractService, 'sales.contract');
			};

			service.updatePaymentScheduleDOC = function () {
				updatePaymentScheduleDOCService.updatePaymentScheduleDOC(salesContractService);
			};

			service.generateBillFromPaymentSchedule = function generateBillFromPaymentSchedule() {
				salesContractBillFromPaymentScheduleWizardDialogService.getOrderPaymentStatus().then(function () {
					salesContractBillFromPaymentScheduleWizardDialogService.generateFormDialog();
				});
			};

			service.generatePaymentScheduleFromSchedule = function generatePaymentScheduleFromSchedule() {
				let header = salesContractService.getSelected();
				generatePaymentScheduleFromScheduleService.createDialog(header, salesContractPaymentScheduleDataService);
			};
			// </editor-fold>

			// BoQ      <editor-fold desc="[BoQ]">
			service.GaebImport = function GaebImport(wizardParameter) {
				salesCommonBoqWizardService.GaebImport(salesContractService, 'salesContractBoqStructureService', wizardParameter);
			};

			service.createAndImportBoqs = function createAndImportBoqs(wizardParameter) {
				if (assertContractIsNotReadOnly($translate.instant('boq.main.createAndImportMultipleBoQs'), salesContractService.getSelected())) {
					salesCommonBoqWizardService.createAndImportBoqs(salesContractService, 'salesContractBoqStructureService', wizardParameter, salesContractBoqService);
				}
			};

			service.GaebExport = function GaebExport(wizardParameter) {
				salesCommonBoqWizardService.GaebExport(salesContractService, 'salesContractBoqStructureService', wizardParameter);
			};

			service.importOenOnlv = function () {
				if (assertContractIsNotReadOnly($translate.instant('boq.main.oen.onlvImport'), salesContractService.getSelected())) {
					salesCommonBoqWizardService.importOenOnlv(salesContractService, 'salesContractBoqStructureService');
				}
			};

			service.exportOenOnlv = function () {
				if (assertContractIsNotReadOnly($translate.instant('boq.main.oen.onlvExport'), salesContractService.getSelected())) {
					salesCommonBoqWizardService.exportOenOnlv(salesContractService, 'salesContractBoqStructureService');
				}
			};

			service.importCrbSia = function importCrbSia() {
				if (assertContractIsNotReadOnly($translate.instant('boq.main.siaImport'), salesContractService.getSelected())) {
					salesCommonBoqWizardService.importCrbSia(salesContractService, 'salesContractBoqStructureService');
				}
			};

			service.exportCrbSia = function exportCrbSia() {
				salesCommonBoqWizardService.exportCrbSia(salesContractService, 'salesContractBoqStructureService');
			};

			service.BoqExcelExport = function BoqExcelExport(wizardParameter) {
				salesCommonBoqWizardService.BoqExcelExport(salesContractService, 'salesContractBoqStructureService', wizardParameter);
			};

			service.BoqExcelImport = function BoqExcelImport(wizardParameter) {
				salesCommonBoqWizardService.BoqExcelImport(salesContractService, 'salesContractBoqStructureService', wizardParameter);
			};

			service.startQuantityInspector = function () {
				salesCommonBoqWizardService.startQuantityInspector(salesContractService, 'salesContractBoqStructureService');
			};

			service.scanBoq = function scanBoq(wizardParameter) {
				salesCommonBoqWizardService.scanBoq(salesContractService, 'salesContractBoqStructureService', wizardParameter);
			};

			service.selectGroups = function selectGroups(wizardParameter) {
				salesCommonBoqWizardService.selectGroups(salesContractService, 'salesContractBoqStructureService', wizardParameter);
			};

			service.RenumberBoQ = function RenumberBoQ() {
				if (assertContractIsNotReadOnly($translate.instant('boq.main.boqRenumber'), salesContractService.getSelected())) {
					salesCommonBoqWizardService.RenumberBoQ(salesContractService, 'salesContractBoqStructureService');
				}
			};

			service.TakeoverBoQ = function TakeoverBoQ() {
				// Check contract is selected
				var selectedContract = salesContractService.getSelected();
				var message = $translate.instant('sales.contract.noContractHeaderSelected');

				if (!$injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedContract, 'sales.contract.contractSelectionMissing', message)) {
					return;
				}
				if (assertContractIsNotReadOnly($translate.instant('sales.common.wizard.takeoverBoq'), selectedContract)) {
					$injector.get('salesCommonCopyBoqWizardService').showDialog();
				}
			};

			service.updateBoq = function updateBoq() {
				salesCommonBoqWizardService.updateBoq(salesContractService, 'salesContractBoqStructureService', 'sales.contract');
			};

			service.changeBoqHeaderStatus = function changeBoqHeaderStatus() {
				if (assertContractIsNotReadOnly($translate.instant('boq.main.wizardChangeBoqStatus'), salesContractService.getSelected())) {
					salesCommonBoqWizardService.changeBoqHeaderStatus(salesContractService, 'salesContractBoqService').fn();
				}
			};

			service.scanBoq = function scanBoq(wizardParameter) {
				salesCommonBoqWizardService.scanBoq(salesContractService, 'salesContractBoqStructureService', wizardParameter);
			};

			service.selectGroups = function selectGroups(wizardParameter) {
				salesCommonBoqWizardService.selectGroups(salesContractService, 'salesContractBoqStructureService', wizardParameter);
			};

			service.RenumberBoQ = function RenumberBoQ() {
				if (assertContractIsNotReadOnly($translate.instant('boq.main.boqRenumber'), salesContractService.getSelected())) {
					salesCommonBoqWizardService.RenumberBoQ(salesContractService, 'salesContractBoqStructureService');
				}
			};

			service.TakeoverBoQ = function TakeoverBoQ() {
				// Check contract is selected
				var selectedContract = salesContractService.getSelected();
				var message = $translate.instant('sales.contract.noContractHeaderSelected');

				if (!$injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedContract, 'sales.contract.contractSelectionMissing', message)) {
					return;
				}
				if (assertContractIsNotReadOnly($translate.instant('sales.common.wizard.takeoverBoq'), selectedContract)) {
					$injector.get('salesCommonCopyBoqWizardService').showDialog();
				}
			};

			service.updateBoq = function updateBoq() {
				salesCommonBoqWizardService.updateBoq(salesContractService, 'salesContractBoqStructureService', 'sales.contract');
			};

			service.changeBoqHeaderStatus = function changeBoqHeaderStatus() {
				if (assertContractIsNotReadOnly($translate.instant('boq.main.wizardChangeBoqStatus'), salesContractService.getSelected())) {
					salesCommonBoqWizardService.changeBoqHeaderStatus(salesContractService, 'salesContractBoqService').fn();
				}
			};

			service.updateProjectBoq = function updateProjectBoq() {
				if (assertContractIsNotReadOnly($translate.instant('sales.common.updatePrjBoqWizard.title'), salesContractService.getSelected())) {
					var selectedRecord = salesContractService.getSelected();
					var title = 'sales.common.updatePrjBoqWizard.title';
					var message = $translate.instant('sales.contract.noContractHeaderSelected');
					if (!$injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedRecord, title, message)) {
						return;
					}
					$injector.get('salesCommonUpdateProjectBoqWizard').showDialog('sales.contract', selectedRecord.Id);
				}
			};

			// </editor-fold>

			// Estimate      <editor-fold desc="[Estimate]">
			function updateEstimate() {
				var title = 'sales.contract.updateEstimateWizard.title';
				var platformTranslateService = $injector.get('platformTranslateService');
				var platformSidebarWizardConfigService = $injector.get('platformSidebarWizardConfigService');
				var platformModalFormConfigService = $injector.get('platformModalFormConfigService');
				var msg = $translate.instant('sales.contract.noCurrentContractSelection'),
					platformSidebarWizardCommonTasksService = $injector.get('platformSidebarWizardCommonTasksService');


				var updateEstimateConfig = {
					title: $translate.instant(title),
					dataItem: {
						selectedLevel: 'SelectedItems',
						IsUpdEstimate: true,
						doSplitByBaseCostTotal: 1
					},
					formConfiguration: {
						fid: 'sales.contract.updateEstimate',
						version: '0.1.1',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['selecteditem']
							}
						],
						'overloads': {},
						rows: [
							{
								gid: 'baseGroup',
								rid: 'SelectedItem',
								label: 'Select Contract Scope',
								label$tr$: 'sales.contract.updateEstimateWizard.selectContractScope',
								type: 'radio',
								model: 'selectedLevel',
								options: {
									labelMember: 'Description',
									valueMember: 'Value',
									groupName: 'updateEstimateConConfig',
									items: [
										{Id: 1, Description: $translate.instant('sales.contract.updateEstimateWizard.highlightedContractItems'), Value: 'SelectedItems'},
										{Id: 2, Description: $translate.instant('sales.contract.updateEstimateWizard.entireContracts'), Value: 'AllItems'}
									]},
								sortOrder: 1
							},
							{
								gid: 'baseGroup',
								rid: 'distributeBasedOn',
								label: 'Distribute based on',
								label$tr$: 'sales.contract.distributeBasedOn',
								type: 'radio',
								model: 'doSplitByBaseCostTotal',
								sortOrder: 2,
								options: {
									labelMember: 'Description',
									valueMember: 'Value',
									groupName: 'distributeBase',
									items: [
										{
											Id: 1,
											Description: $translate.instant('estimate.main.grandTotal'),
											Value: 1
										},
										{
											Id: 2,
											Description: $translate.instant('estimate.main.baseCostTotal'),
											Value: 2
										}
									]
								}
							}]
					},
					handleOK: function handleOK(result) {
						if (!result || !result.ok || !result.data) {return;}
						if (salesContractBoqService.getIfSelectedIdElse() <= 0) {
							return;
						}
						var contract = salesContractService.getSelected();
						var contractItems = salesContractService.getSelectedEntities();
						var postData = {
							'ProjectFk': contract ? contract.ProjectFk : -1,
							'ContractHeaderIds': contractItems && contractItems.length ? _.map(contractItems, 'Id') : [],
							'SelectedLevel': result.data.selectedLevel,
							'DoSplitByBaseCostTotal': result.data.doSplitByBaseCostTotal !== 1
						};

						function updEstimate() {
							$http.post(globals.webApiBaseUrl + 'sales/contract/boq/updateestimate', postData)
								.then(function () {
									return $injector.get('platformModalService').showMsgBox('sales.contract.updateEstimateWizard.updateEstimateSuccess', 'sales.contract.updateEstimateWizard.title', 'info');
								});
						}

						if (postData.SelectedLevel === 'SelectedItems') {
							if (platformSidebarWizardCommonTasksService.assertSelection(contract, title, msg)) {
								salesContractService.updateAndExecute(updEstimate);
							}
						} else {
							salesContractService.updateAndExecute(updEstimate);
						}
					}
				};

				platformTranslateService.translateFormConfig(updateEstimateConfig.formConfiguration);
				updateEstimateConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
				platformModalFormConfigService.showDialog(updateEstimateConfig);
			}

			service.updateEstimate = updateEstimate;

			// TODO: rename (see #143618)
			service.updateEstimate2 = function updateEstimate2() {
				var selectedContract = salesContractService.getSelected();
				if (!$injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedContract, 'sales.common.wizard.updateEstimate', $translate.instant('sales.contract.noContractHeaderSelected'))) {
					return;
				}
				if (assertContractIsNotReadOnly($translate.instant('sales.common.wizard.updateEstimate'), selectedContract)) {
					$injector.get('salesCommonUpdateEstimateWizardService').showUpdateEstimateWizard();
				}
			};
			// </editor-fold>

			// Documents Project      <editor-fold desc="[Documents Project]">
			service.changeStatusForProjectDocument = documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(salesContractService, 'sales.contract').fn;
			// </editor-fold>

			let certificateDataService = businesspartnerCertificateCertificateContainerServiceFactory.getDataService('sales.contract', salesContractService);

			service.changeCertificateStatus = changeCertificateStatus().fn;

			function changeCertificateStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						projectField: 'ProjectFk',
						statusName: 'certificate',
						guid: '538325604B524F328FDF436FB14F1FC8',
						mainService: salesContractService,
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

			service.generateAdvancePaymentBill = function generateAdvancePaymentBill() {
				var selectedAdvance = $injector.get('salesContractAdvanceDataService').getSelected();
				if(selectedAdvance) {
					$injector.get('platformModalService').showDialog({
						templateUrl: 'sales.contract/templates/sales-contract-bill-from-advance-payment-line-wizard.html',
						controller: 'salesContractBillFromAdvanceLineWizardController'
					});
				}
				else {
					$injector.get('platformModalService').showErrorBox($translate.instant('sales.contract.noCurrentContractAdvanceLineSelection'), 'cloud.common.errorMessage');
				}
			};

			var changeAdvanceLineStatus = function changeAdvanceLineStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						statusName: 'salescontractadvance',
						mainService: salesContractService,
						dataService: salesContractAdvanceDataService,
						statusField: 'OrdAdvanceStatusFk',
						descField: 'Description',
						statusDisplayField: 'DescriptionInfo.Translated',
						title: 'sales.contract.wizardCSChangeAdvanceLineStatusTitle',
						handleSuccess: function handleSuccess(result) {
							if (result.changed && result.executed === true) {
								var item = result.entity;
								var oldEntity = $injector.get('salesContractAdvanceDataService').getItemById(item.Id);
								if (oldEntity) {
									_.forEach($injector.get('salesContractAdvanceDataService').getDataProcessor(), function (processor) {
										processor.processItem(item);
									});
									angular.extend(oldEntity, item);
									$injector.get('salesContractAdvanceDataService').gridRefresh();
								}
							}
						}
					}
				);
			};

			service.setAdvancePaymentLineStatus = changeAdvanceLineStatus().fn;

			return service;
		}

	]);
})();
