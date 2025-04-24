(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	let moduleName = 'procurement.requisition';

	/* jshint -W072 */
	angular.module(moduleName).factory('procurementRequisitionWizardService',
		['platformTranslateService',
			'platformSidebarWizardConfigService',
			'$translate',
			'$injector',
			'platformModalService',
			'procurementRequisitionHeaderDataService',
			'procurementRequisitionCopyRequisitionWizard',
			'basicsCommonChangeStatusService',
			'procurementReqCreateRfqWizardDataService',
			'procurementRequisitionWizardCreateContractService',
			'procurementCommonPrcItemDataService',
			'procurementCommonItemStatusChangeService',
			'documentProjectDocumentsStatusChangeService',
			'procurementCommonItemQuantityValidationFlagService',
			'platformDataValidationService',
			'procurementCommonPrcItemValidationService',
			'platformRuntimeDataService',
			'boqMainGaebImportService',
			'boqMainGaebExportService',
			'procurementCommonCreateBusinessPartnerService',
			'procurementCommonReplaceNeutralMaterialService',
			'procurementCommonUpdateItemPriceService',
			'procurementCommonGenerateDeliveryScheduleService',
			'boqMainExportOptionsService',
			'basicsExportService',
			'boqMainImportOptionsService',
			'basicsImportService',
			'prcRequisitionHeaderUpdateEstimateService',
			'ProcurementCommonChangeConfigurationService',
			'boqMainElementValidationService',
			'procurementCommonPrcBoqService',
			'boqMainWizardService',
			'basicsCommonChangeCodeService',
			'prcCommonItemExportOptionsService',
			'procurementCommonUpdatePackageBoqService',
			'procurementCommonUpdatePackageMaterialService',
			'procurementCommonImportMaterialService',
			'basicsCommonFileDownloadService', '$http',
			'prcCommonSplitOverallDiscountService',
			'procurementCommonCreateSuggestedBidderService',
			'procurementCommonSelectAlternateGroupService',
			'prcCommonPaymentScheduleStatusChangeService',
			'procurementContextService',
			'procurementItemProjectChangeService',
			'procurementRequisitionEditBudgetWizardService',
			'ProcurementCommonDisableEnabledService',
			function (platformTranslateService,
				platformSidebarWizardConfigService,
				$translate,
				$injector,
				platformModalService,
				headerDataService,
				procurementRequisitionCopyRequisitionWizard,
				basicsCommonChangeStatusService,
				procurementReqCreateRfqWizardDataService,
				requisitionWizardCreateContractService,
				procurementCommonPrcItemDataService,
				prcChangeStatusService,
				documentProjectDocumentsStatusChangeService,
				procurementCommonItemQuantityValidationFlagService,
				platformDataValidationService,
				procurementCommonPrcItemValidationService,
				platformRuntimeDataService,
				boqMainGaebImportService,
				boqMainGaebExportService,
				procurementCommonCreateBusinessPartnerService,
				procurementCommonReplaceNeutralMaterialService,
				procurementCommonUpdateItemPriceService,
				procurementCommonGenerateDeliveryScheduleService,
				boqMainExportOptionsService,
				basicsExportService,
				boqMainImportOptionsService,
				basicsImportService,
				prcRequisitionHeaderUpdateEstimateService,
				ProcurementCommonChangeConfigurationService,
				boqMainValidationService,
				procurementCommonPrcBoqService,
				boqMainWizardService,
				basicsCommonChangeCodeService,
				prcCommonItemExportOptionsService,
				procurementCommonUpdatePackageBoqService,
				procurementCommonUpdatePackageMaterialService,
				procurementCommonImportMaterialService,
				basicsCommonFileDownloadService, $http,
				prcCommonSplitOverallDiscountService,
				procurementCommonCreateSuggestedBidderService,
				procurementCommonSelectAlternateGroupService,
				prcCommonPaymentScheduleStatusChangeService,
				procurementContextService,
				procurementItemProjectChangeService,
				procurementRequisitionEditBudgetWizardService,
				procurementCommonDisableEnabledService) {

				let service = {};
				let wizardID = 'procurementRequisitionSidebarWizards';

				// set context values
				procurementContextService.setLeadingService(headerDataService);
				procurementContextService.setMainService(headerDataService);

				function changeRequisitionStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							projectField: 'ProjectFk',
							statusName: 'requisition',
							mainService: headerDataService,
							statusField: 'ReqStatusFk',
							statusDisplayField: 'DescriptionInfo.Translated',
							title: 'procurement.requisition.wizard.change.status.headerText',
							updateUrl: 'requisition/requisition/wizard/changestatus',
							groupId: 1,
							id: 11
						}
					);
				}

				function changeRequisitionCode() {
					return basicsCommonChangeCodeService.provideCodeChangeInstance({
						mainService: headerDataService,
						validationService: 'procurementRequisitionHeaderValidationService',
						title: 'procurement.requisition.wizard.change.code.headerText'
					});
				}

				function changeProjectChangeStatus() {
					let prcBoqMainService = $injector.get('prcBoqMainService');
					let boqMainService = prcBoqMainService.getService(headerDataService);
					return boqMainWizardService.changeProjectChangeStatus(headerDataService, boqMainService);
				}

				function changeItemProjectChangeStatus() {
					let prcItemPrjChangeService = procurementItemProjectChangeService.getService(headerDataService, procurementCommonPrcItemDataService.getService());
					return prcItemPrjChangeService.changeProjectChangeStatus();
				}

				function changeStatusForItem() {
					return prcChangeStatusService.providePrcItemStatusChangeInstance(headerDataService, procurementCommonPrcItemDataService);
				}

				function changeStatusForProjectDocument() {
					return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(headerDataService, 'procurement.requisition');
				}

				function changePaymentScheduleStatus() {
					return prcCommonPaymentScheduleStatusChangeService.providePrcPaymentScheduleStatusChangeInstance(headerDataService);
				}

				function removeItemQuantityValidation() {
					let item = procurementCommonPrcItemDataService.getService().getSelected();
					if (item === null) {
						platformModalService.showMsgBox($translate.instant('cloud.common.noItemSelection'), 'Info', 'ico-info');
						return;
					}
					procurementCommonItemQuantityValidationFlagService.validateOrNot = false;
					platformDataValidationService.removeFromErrorList(item, 'Quantity', procurementCommonPrcItemValidationService, procurementCommonPrcItemDataService.getService());
					platformRuntimeDataService.applyValidationResult(true, item, 'Quantity');
					procurementCommonPrcItemDataService.getService().gridRefresh();
				}

				function validateAndUpdateItemQuantity() {
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'procurement.requisition/partials/procurement-requisition-validate-and-update-item-quantity.html',
						backdrop: false
					}).then(function (result) {
						if (result.ok === true) {
							procurementCommonPrcItemDataService.getService().load();
						}
					});
				}

				// update Estimate
				service.updateEstimate = function () {
					let header = headerDataService.getSelected();
					if (!header || header.Id <= 0) {
						platformModalService.showMsgBox($translate.instant('procurement.requisition.selectedRequisition'), $translate.instant('procurement.package.updateEstimate'));
						return;
					}

					$injector.get('prcCommonUpdateEstimatePrcStructureDataSerivce').setProcurementMainData(header.Id, null, 'requisition');

					let requestData = {
						headerId: header.Id,
						sourceType: 'requisition',
						qtnHeaderIds:null
					};

					$http.post(globals.webApiBaseUrl + 'procurement/common/option/getIsHasPrcItemAndPrcBoq', requestData).then(function (response) {
						let prcCommonUpdateEstimateService = $injector.get('prcCommonUpdateEstimateService');
						prcCommonUpdateEstimateService.setIsHasPrcItem(response.data.isHasPrcItem);
						prcCommonUpdateEstimateService.setIsHasPrcBoq(response.data.isHasPrcBoq);

						platformModalService.showDialog({
							headerTextKey: 'procurement.package.updateEstimate',
							templateUrl: globals.appBaseUrl + 'procurement.common/templates/update-estimate-dialog.html',
							controller: 'procurementRequisitionUpdateEstimateWizardController',
							resizeable: true,
							width: '700px'
						});
					});
				};

				service.removeItemQuantityValidation = removeItemQuantityValidation;

				service.validateAndUpdateItemQuantity = validateAndUpdateItemQuantity;

				service.changeProjectChangeStatus = changeProjectChangeStatus().fn;
				service.changeItemProjectChangeStatus = changeItemProjectChangeStatus().fn;

				service.changeRequisitionStatus = changeRequisitionStatus().fn;

				service.changeRequisitionCode = changeRequisitionCode().fn;

				service.changeStatusForItem = changeStatusForItem().fn;

				service.changeStatusForProjectDocument = changeStatusForProjectDocument().fn;

				service.changePaymentScheduleStatus = changePaymentScheduleStatus().fn;

				service.copyRequisition = function copyRequisition() {
					headerDataService.updateAndExecute(function () {
						procurementRequisitionCopyRequisitionWizard.execute();
					});
				};

				service.createRequestForQuote = function createRequestForQuote() {
					let header = headerDataService.getSelected();

					let modalOptions = {
						headerTextKey: 'cloud.common.informationDialogHeader',
						bodyTextKey: 'procurement.requisition.rfq.disableProgressError',
						showOkButton: true,
						iconClass: 'ico-info'
					};

					// eslint-disable-next-line no-prototype-builtins
					if (header?.hasOwnProperty('Id')) {

						if (header.ReqStatus && !header.ReqStatus.Isaccepted) {
							modalOptions.bodyTextKey = 'procurement.requisition.rfq.disableAcceptedError';
							platformModalService.showDialog(modalOptions);
						} else {
							let canCreate = 1, baseNotCreated = 2, baseStatusNotAllowed = 3, selfStatusNotAllowed = 4;
							procurementReqCreateRfqWizardDataService.checkReqCanCreateRFQ(header.Id).then(function (response) {
								let checkResult = response.data;
								if (checkResult === baseNotCreated) {
									modalOptions.bodyTextKey = 'procurement.requisition.rfq.baseNotCreated';
									platformModalService.showDialog(modalOptions);
								} else if (checkResult === canCreate) {
									headerDataService.updateAndExecute(function () {
										procurementReqCreateRfqWizardDataService.execute();
									});
								} else if (checkResult === baseStatusNotAllowed) {
									modalOptions.bodyTextKey = 'procurement.requisition.rfq.baseStatusNotAllowed';
									platformModalService.showDialog(modalOptions);
								} else if (checkResult === selfStatusNotAllowed) {
									modalOptions.bodyTextKey = 'procurement.requisition.rfq.selfStatusNotAllowed';
									platformModalService.showDialog(modalOptions);
								}
							}, function (error) {
								modalOptions.bodyTextKey = error;
								modalOptions.iconClass = 'ico-error';
								platformModalService.showDialog(modalOptions);
							});
						}

					} else {
						// eslint-disable-next-line no-prototype-builtins
						if (!header?.hasOwnProperty('Id')) {
							modalOptions.bodyTextKey = 'procurement.requisition.rfq.notSelectRequisitionError';
							platformModalService.showDialog(modalOptions);
						}
					}
				};

				service.createContract = function createContract() {
					headerDataService.updateAndExecute(function () {
						requisitionWizardCreateContractService.execute();
					});
				};

				service.createBusinessPartner = function createBusinessPartner() {
					procurementCommonCreateBusinessPartnerService.createBusinessPartner(headerDataService);
				};

				service.replaceNeutralMaterail = function () {
					procurementCommonReplaceNeutralMaterialService.showReplaceNeutralMaterialWizardDialog(headerDataService);
				};

				service.updateItemPrice = function () {
					procurementCommonUpdateItemPriceService.showUpdateItemPriceWizardDialog(headerDataService);
				};

				service.generateItemDeliverySchedule = function () {
					procurementCommonGenerateDeliveryScheduleService.showGenerateDeliveryScheduleWizardDialog(procurementCommonPrcItemDataService, headerDataService);
				};
				service.changeProcurementConfiguration = function () {
					if (!headerDataService.hasSelection()) {
						platformModalService.showMsgBox(
							$translate.instant('procurement.requisition.selectedRequisition'),
							$translate.instant('cloud.common.informationDialogHeader'), 'ico-info');
						return;
					}

					let parentValidationService = $injector.get('procurementRequisitionHeaderValidationService');
					ProcurementCommonChangeConfigurationService.execute(headerDataService, parentValidationService);
				};


				service.gaebImport = function gaebImport(wizardParameter) {
					headerDataService.updateAndExecute(function () {
						let prcBoqMainService = $injector.get('prcBoqMainService');
						let boqMainService = prcBoqMainService.getService(headerDataService);
						let options = {};
						options.boqMainService = boqMainService;
						options.wizardParameter = wizardParameter;
						boqMainGaebImportService.showImportDialog(options);
					});
				};


				service.createAndImportBoqs = function gaebImport(wizardParameter) {

					headerDataService.updateAndExecute(function () {

						let prcBoqMainService = $injector.get('prcBoqMainService');
						let boqMainService = prcBoqMainService.getService(headerDataService);
						let prcBoqService = procurementCommonPrcBoqService.getService(headerDataService, boqMainService);

						let selectedHeader = headerDataService.getSelected();
						if (selectedHeader) {
							let options = {};
							options.boqRootItem = null; // will be created by boqMainGaebImportService
							options.projectId = selectedHeader.ProjectFk;
							options.boqMainService = null;
							options.mainService = headerDataService;
							options.createItemService = prcBoqService;
							options.wizardParameter = wizardParameter;
							boqMainGaebImportService.showImportMultipleFilesDialog(options);
						}
					});
				};

				service.gaebExport = function gaebExport(wizardParameter) {

					headerDataService.updateAndExecute(function () {
						let prcBoqMainService = $injector.get('prcBoqMainService');
						prcBoqMainService = prcBoqMainService.getService(headerDataService);

						let options = {};

						// pass Change Request id
						let mainEntity = headerDataService.getSelected();
						// eslint-disable-next-line no-prototype-builtins
						if (mainEntity?.hasOwnProperty('ProjectChangeFk')) {
							options.ProjectChangeFk = mainEntity.ProjectChangeFk;
						}

						options.boqMainService = prcBoqMainService;
						options.wizardParameter = wizardParameter;
						boqMainGaebExportService.showDialog(options);

					});
				};

				service.importOenOnlv = function importOenOnlv() {
					headerDataService.updateAndExecute(function () {
						boqMainWizardService.importOenOnlv($injector.get('prcBoqMainService').getService(headerDataService));
					});
				};

				service.exportOenOnlv = function exportOenOnlv() {
					headerDataService.updateAndExecute(function () {
						boqMainWizardService.exportOenOnlv($injector.get('prcBoqMainService').getService(headerDataService));
					});
				};

				service.importCrbSia = function importCrbSia() {
					headerDataService.updateAndExecute(function () {
						boqMainWizardService.importCrbSia($injector.get('prcBoqMainService').getService(headerDataService));
					});
				};

				service.exportCrbSia = function exportCrbSia() {
					headerDataService.updateAndExecute(function () {
						boqMainWizardService.exportCrbSia($injector.get('prcBoqMainService').getService(headerDataService));
					});
				};

				service.BoqExcelExport = function BoqExcelExport(wizardParameter) {
					headerDataService.updateAndExecute(function () {
						let boqMainService = $injector.get('prcBoqMainService');
						boqMainService = boqMainService.getService(headerDataService);
						let options = boqMainExportOptionsService.getExportOptions(boqMainService);
						options.MainContainer.Id = 'boq.main.containerheader.boqStructure';
						options.wizardParameter = wizardParameter;
						basicsExportService.showExportDialog(options);
					});
				};

				service.BoqExcelImport = function BoqExcelImport(wizardParameter) {
					headerDataService.updateAndExecute(function () {
						let boqMainService = $injector.get('prcBoqMainService');
						boqMainService = boqMainService.getService(headerDataService);
						let options = boqMainImportOptionsService.getImportOptions(boqMainService);
						options.wizardParameter = wizardParameter;
						basicsImportService.showImportDialog(options);
					});
				};

				service.scanBoq = function scanBoq() {
					headerDataService.updateAndExecute(function () {
						let prcBoqMainService = $injector.get('prcBoqMainService');
						prcBoqMainService = prcBoqMainService.getService(headerDataService);
						let params = {};
						params.ContinueButton = false;
						boqMainValidationService.scanBoqAndShowResult(prcBoqMainService.getRootBoqItem(), 'x83', params);
					});
				};

				// change status of boq (in procurement requisition module)
				function changeBoqHeaderStatus() {
					let prcBoqMainService = $injector.get('prcBoqMainService');
					// By masking the following getService calls into this function contruct we delay calling the getService functions
					// which makes sure the underlying mainService information is set into the so called moduleContext.
					let getMyPrcBoqMainService = function () {
						return prcBoqMainService.getService(headerDataService);
					};
					let getPrcBoqService = function () {
						return procurementCommonPrcBoqService.getService(headerDataService, getMyPrcBoqMainService());
					};
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							statusName: 'boq',
							mainService: headerDataService,
							// prcBoqService returns a composite object, entity is { BoqHeader: {...} }
							getDataService: function () {
								return {
									getSelected: function () {
										return _.get(getPrcBoqService().getSelected(), 'BoqHeader');
									},
									gridRefresh: function () {
										getPrcBoqService().gridRefresh();
									},
									getSelectedEntities: function () {
										const list = getPrcBoqService().getSelectedEntities();
										return list.map(e => e.BoqHeader);
									}
								};
							},
							statusField: 'BoqStatusFk',
							statusDisplayField: 'DescriptionInfo.Translated',
							title: 'boq.main.wizardChangeBoqStatus',
							updateUrl: 'boq/main/changeheaderstatus'
						}
					);
				}

				service.changeBoqHeaderStatus = changeBoqHeaderStatus().fn;

				service.selectGroups = function selectGroups() {
					headerDataService.updateAndExecute(function() {
						boqMainWizardService.selectGroups($injector.get('prcBoqMainService').getService(headerDataService));
					});
				};

				service.selectPrcItemGroups = function selectPrcItemGroups() {
					let commonPrcItemService = procurementCommonPrcItemDataService.getService();
					procurementCommonSelectAlternateGroupService.showSelectAlternateGroupWizardDialog(commonPrcItemService);
				};

				service.renumberBoQ = function renumberBoQ() {
					headerDataService.updateAndExecute(function () {
						let prcBoqMainService = $injector.get('prcBoqMainService');
						prcBoqMainService = prcBoqMainService.getService(headerDataService);
						let boqMainRenumberService = $injector.get('boqMainRenumberService');
						boqMainRenumberService.renumberBoqItems(prcBoqMainService);
					});
				};

				service.renumberFreeBoq = function() {
					headerDataService.updateAndExecute(function () {
						let modalOptions = {
							headerTextKey: 'boq.main.freeBoqRenumber',
							bodyTextKey: 'boq.main.renumberOptionTitle',
							templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-main-renumber-freeboq.html',
							selectBoQs: $translate.instant('boq.main.renumberAllBoqs'),
							eachBoQ: $translate.instant('boq.main.renumberEachBoq'),
							currentPrj: $translate.instant('boq.main.renumberCurrentPrj'),
							renumberDependance: $translate.instant('boq.main.renumberDependance')
							// iconClass: 'ico-question',
							// showCancelButton: true
						};

						const boqMainStandardTypes = $injector.get('boqMainStandardTypes');
						let prcBoqMainService = $injector.get('prcBoqMainService');
						prcBoqMainService = prcBoqMainService.getService(headerDataService);

						platformModalService.showDialog(modalOptions).then(function (result) {
							if (result.ok) {
								// noinspection JSUnresolvedVariable
								if (result.isRenumberCurrent && prcBoqMainService.getStructure().BoqStandardFk !== boqMainStandardTypes.free) {
									platformModalService.showMsgBox($translate.instant('boq.main.freeBoqWarningMessage'),
										$translate.instant('boq.main.freeBoqRenumber'), 'warning');
								}
								prcBoqMainService.renumberFreeBoq(result.isRenumberCurrent, result.isWithinBoq);
							}
						});
					});
				};

				service.updateBoq = function updateBoq() {
					let selectedHeader = headerDataService.getSelected();
					if (selectedHeader) {
						headerDataService.updateAndExecute(function () {
							let headerData = {
								Module: 'procurement.requisition',
								HeaderId: selectedHeader.Id,
								ExchangeRate: selectedHeader.ExchangeRate
							};
							let projectId = selectedHeader.ProjectFk;
							boqMainWizardService.updateBoq($injector.get('prcBoqMainService').getService(headerDataService), projectId, headerDataService, headerData);
						});
					}
				};

				service.resetServiceCatalogNo = function resetServiceCatalogNo() {
					headerDataService.updateAndExecute(function () {
						let prcBoqMainService = $injector.get('prcBoqMainService');
						prcBoqMainService = prcBoqMainService.getService(headerDataService);
						let boqMainResetServiceCatalogNoService = $injector.get('boqMainResetServiceCatalogNoService');
						boqMainResetServiceCatalogNoService.resetServiceCatalogNoOfBoqItems(prcBoqMainService);
					});
				};

				let wizards = {
					items: [
						{
							id: 1,
							text: 'Change Status Wizard',
							text$tr$: 'procurement.common.wizard.change.status.wizard',
							groupIconClass: 'sidebar-icons ico-wiz-change-status',
							visible: true,
							subitems: [
								changeRequisitionStatus(),
								changeStatusForItem(),
								changeStatusForProjectDocument()
							]
						},
						{
							id: 2,
							text: 'Create Wizard',
							text$tr$: 'procurement.requisition.wizard.create.wizard',
							groupIconClass: 'sidebar-icons ico-wiz-create-contracts',
							subitems: [
								{
									id: 21,
									groupId: 2,
									text: 'Copy Requisition',
									text$tr$: 'procurement.requisition.wizard.copy.requisition',
									type: 'item',
									showItem: true,
									cssClass: 'md rw',
									fn: service.copyRequisition
								},
								{
									id: 22,
									groupId: 2,
									text: 'Create Request For Quote',
									text$tr$: 'procurement.requisition.wizard.create.request.for.quote',
									type: 'item',
									showItem: true,
									cssClass: 'md rw',
									fn: service.createRequestForQuote
								},
								{
									id: 23,
									groupId: 2,
									text: 'Create Contract',
									text$tr$: 'procurement.requisition.wizard.create.contract',
									type: 'item',
									showItem: true,
									cssClass: 'md rw',
									fn: service.createContract
								},
								{
									id: 24,
									groupId: 2,
									text: 'Create Business Partner',
									type: 'item',
									showItem: true,
									cssClass: 'md rw',
									fn: service.createBusinessPartner
								}
							]
						},
						{
							id: 3,
							text: 'BoQ Wizard',
							text$tr$: 'procurement.common.wizard.boq.wizard',
							groupIconClass: 'sidebar-icons ico-wiz-gaeb-ex',
							subitems: [
								{
									id: 31,
									groupId: 3,
									text: 'GAEB-Import',
									text$tr$: 'procurement.common.wizard.gaeb.import',
									type: 'item',
									showItem: true,
									cssClass: 'md rw',
									fn: service.gaebImport
								},
								{
									id: 32,
									groupId: 3,
									text: 'GAEB-Export',
									text$tr$: 'procurement.common.wizard.gaeb.export',
									type: 'item',
									showItem: true,
									cssClass: 'md rw',
									fn: service.gaebExport
								},
								{
									id: 33,
									groupId: 3,
									text: 'Renumber BoQ',
									text$tr$: 'procurement.common.wizard.renumber.boq',
									type: 'item',
									showItem: true,
									cssClass: 'md rw',
									fn: service.renumberBoQ
								}
							]
						}

					]
				};

				service.prcItemExcelImport = function prcItemExcelImport() {
					let headerEntity = headerDataService.getSelected();
					if (!headerEntity || angular.isUndefined(headerEntity.Id)) {
						platformModalService.showMsgBox($translate.instant('procurement.requisition.selectedRequisition'), 'Info', 'ico-info');
						return;
					}
					headerDataService.updateAndExecute(function () {
						let prcItemImportOptionsService = $injector.get('prcCommonItemImportOptionsService');
						let options = prcItemImportOptionsService.getImportOptions(moduleName);
						let mainEntity = headerDataService.getSelected();
						let prcHeaderFk = mainEntity ? mainEntity.PrcHeaderFk : null;
						options.ImportDescriptor.CustomSettings = {
							PrcHeaderFk: prcHeaderFk,
							IsImportPriceAfterTax: options.isOverGross ? options.isOverGross : false,
							BpdVatGroupFk: headerEntity.BpdVatGroupFk,
							HeaderTaxCodeFk: headerEntity.TaxCodeFk
						};
						basicsImportService.showImportDialog(options);
					});
				};

				service.prcItemExcelExport = function prcItemExcelExport(wizardParameter) {
					headerDataService.updateAndExecute(function () {
						let headerItem = headerDataService.getSelected();
						if (!headerItem) {
							return;
						}

						let options = prcCommonItemExportOptionsService.getExportOptions(headerDataService,
							{
								ModuleName: 'procurement.requisition.prcitems',
								MainContainer: {
									uuid: '5D58A4A9633A485986776456695E1241',
									Id: '1'
								}, wizardParameter: wizardParameter
							});
						basicsExportService.showExportDialog(options);
					});
				};

				service.active = function activate() {
					platformSidebarWizardConfigService.activateConfig(wizardID, wizards);
				};

				service.deactive = function deactivate() {
					platformSidebarWizardConfigService.deactivateConfig(wizardID);
				};

				service.updatePackageBoq = function updatePackageBoq() {
					procurementCommonUpdatePackageBoqService.showUpdatePackageBoqWizardDialog(headerDataService);
				};

				service.updatePackageMaterial = function updatePackageMaterial() {
					procurementCommonUpdatePackageMaterialService.updatePackageWithAdditionalItems(headerDataService);
				};

				service.splitOverallDiscount = function splitOverallDiscount() {
					let splitOverallDiscountUrl = globals.webApiBaseUrl + 'procurement/requisition/requisition/splitoveralldiscount';
					prcCommonSplitOverallDiscountService.splitOverallDiscount(headerDataService, splitOverallDiscountUrl);
				};

				// loads or updates translated strings
				let loadTranslations = function () {
					platformTranslateService.translateObject(wizards, ['text']);

				};

				service.exportMaterial = function () {
					headerDataService.updateAndExecute(function () {
						let headerItem = headerDataService.getSelected();
						if (!headerItem) {
							return;
						}
						$http.get(globals.webApiBaseUrl + 'procurement/common/wizard/exportmaterial?objectFk=' + headerItem.Id + '&ProjectFk=' + headerItem.ProjectFk + '&CurrencyFk=' + headerItem.BasCurrencyFk + '&moduleName=' + moduleName + '&subObjectFk=' + 0).then(
							function (response) {
								if (response.data?.FileName) {
									basicsCommonFileDownloadService.download(null, {
										FileName: response.data.FileName,
										Path: response.data.path
									});
								}
							}
						);
					});
				};

				service.importMaterial = function () {
					headerDataService.updateAndExecute(function () {
						procurementCommonImportMaterialService.execute(headerDataService, headerDataService, moduleName);
					});
				};

				service.enhanceBidderSearch = function enhanceBidderSearch() {
					headerDataService.updateAndExecute(function () {
						procurementCommonCreateSuggestedBidderService.execute(headerDataService);
					});
				};

				service.editBudget = function editBudget() {
					headerDataService.updateAndExecute(function () {
						procurementRequisitionEditBudgetWizardService.execute();
					});
				};

				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule('procurement.package')) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				service.materialItem = ()=>{
					procurementCommonDisableEnabledService.execute();
				}

				return service;
			}]);
})(angular);
