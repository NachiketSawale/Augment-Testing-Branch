(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.contract';
	/* jshint -W072 */
	angular.module(moduleName).factory('procurementContractWizardService', [
		'_',
		'$q',
		'$http',
		'$document',
		'platformTranslateService',
		'platformSidebarWizardConfigService',
		'$translate',
		'$injector',
		'$timeout',
		'cloudDesktopSidebarService',
		'procurementContractHeaderDataService',
		'procurementCommonPrcItemDataService',
		'platformModalService',
		'platformDialogService',
		'basicsCommonChangeStatusService',
		'procurementContractSidebarDataService',
		'businessPartnerCertificateRequiredCreateService',
		'businesspartnerCertificateCertificateContainerServiceFactory',
		'procurementContractTranslationService',
		'procurementCommonItemStatusChangeService',
		'documentProjectDocumentsStatusChangeService',
		'procurementContractInsertMaterialService',
		'procurementContractUpdateMaterialService',
		'procurementCommonItemQuantityValidationFlagService',
		'platformDataValidationService',
		'procurementCommonPrcItemValidationService',
		'platformRuntimeDataService',
		'boqMainGaebImportService',
		'basicsCommonPurchaseOrderChangeService',
		'procurementOrderChangeService',
		'boqMainGaebExportService',
		'procurementCommonReplaceNeutralMaterialService',
		'procurementCommonUpdateItemPriceService',
		'basicsExportService',
		'boqMainExportOptionsService',
		'procurementCommonGenerateDeliveryScheduleService',
		'procurementChangeOrderItemDataService',
		'prcContractHeaderUpdateEstimateService',
		'basicsCommonFileDownloadService',
		'ProcurementCommonChangeConfigurationService',
		'basicsImportService',
		'boqMainSplitUrbService',
		'prcBoqMainService',
		'procurementContextService',
		'boqMainWizardService',
		'cloudCommonGridService',
		'platformContextService',
		'platformModuleNavigationService',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupDataService',
		'basicsLookupdataLookupFilterService',
		'procurementCommonGeneratePaymentScheduleService',
		'basicsCommonChangeCodeService',
		'boqMainImportOptionsService',
		'prcCommonMaintainPaymentScheduleVersionService',
		'procurementCommonUpdatePackageBoqService',
		'updatePaymentScheduleDOCService',
		'prcCommonSplitOverallDiscountService',
		'platformSchemaService',
		'basicsWorkflowWizardContextService',
		'procurementCommonTotalDataService',
		'prcCommonPaymentScheduleStatusChangeService',
		'procurementCommonSelectAlternateGroupService',
		'ProcurementCommonDisableEnabledService',
		function (
			_,
			$q,
			$http,
			$document,
			platformTranslateService,
			platformSidebarWizardConfigService,
			$translate,
			$injector,
			$timeout,
			cloudDesktopSidebarService,
			procurementContractHeaderDataService,
			procurementCommonPrcItemDataService,
			platformModalService,
			platformDialogService,
			basicsCommonChangeStatusService,
			procurementContractSidebarDataService,
			requriedCertificatesCreateService,
			businesspartnerCertificateCertificateContainerServiceFactory,
			procurementContractTranslationService,
			prcChangeStatusService,
			documentProjectDocumentsStatusChangeService,
			procurementContractInsertMaterialService,
			procurementContractUpdateMaterialService,
			procurementCommonItemQuantityValidationFlagService,
			platformDataValidationService,
			procurementCommonPrcItemValidationService,
			platformRuntimeDataService,
			boqMainGaebImportService,
			basicsCommonPurchaseOrderChangeService,
			procurementOrderChangeService,
			boqMainGaebExportService,
			procurementCommonReplaceNeutralMaterialService,
			procurementCommonUpdateItemPriceService,
			basicsExportService,
			boqMainExportOptionsService,
			procurementCommonGenerateDeliveryScheduleService,
			procurementChangeOrderItemDataService,
			prcContractHeaderUpdateEstimateService,
			basicsCommonFileDownloadService,
			ProcurementCommonChangeConfigurationService,
			basicsImportService,
			boqMainSplitUrbService,
			prcBoqMainService,
			procurementContextService,
			boqMainWizardService,
			cloudCommonGridService,
			platformContextService,
			navigateService,
			basicsLookupdataLookupDescriptorService,
			basicsLookupdataLookupDataService,
			basicsLookupdataLookupFilterService,
			procurementCommonGeneratePaymentScheduleService,
			basicsCommonChangeCodeService,
			boqMainImportOptionsService,
			prcCommonMaintainPaymentScheduleVersionService,
			procurementCommonUpdatePackageBoqService,
			updatePaymentScheduleDOCService,
			prcCommonSplitOverallDiscountService,
			platformSchemaService,
			basicsWorkflowWizardContextService,
			procurementCommonTotalDataService,
			prcCommonPaymentScheduleStatusChangeService,
			procurementCommonSelectAlternateGroupService,
			procurementCommonDisableEnabledService
		) {

			var service = {};

			var wizardID = 'procurementContractSidebarWizards';

			var certificateContainerServiceFactory = null;

			function purchaseOrderChange() {
				return procurementOrderChangeService.provideStatusChangeInstance(
					{
						mainService: procurementContractHeaderDataService,
						statusField: 'ConStatusFk',
						projectField: 'ProjectFk',
						title: 'procurement.contract.wizard.poChange.headerText',
						getItemDataService: function () {
							return procurementChangeOrderItemDataService.getService(procurementContractHeaderDataService);
						},
						statusName: 'contract',
						id: 11
					}
				);
			}

			function changeContractStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						mainService: procurementContractHeaderDataService,
						statusField: 'ConStatusFk',
						projectField: 'ProjectFk',
						title: 'procurement.contract.wizard.change.status.headerText',
						statusName: 'contract',
						updateUrl: 'procurement/contract/wizard/changestatus',
						id: 11
					}
				);
			}


			function changeContractCode() {
				return basicsCommonChangeCodeService.provideCodeChangeInstance({
					mainService: procurementContractHeaderDataService,
					validationService: 'contractHeaderElementValidationService',
					title: 'procurement.contract.wizard.change.code.headerText'
				});

			}

			function changeStatusForItem() {
				return prcChangeStatusService.providePrcItemStatusChangeInstance(procurementContractHeaderDataService, procurementCommonPrcItemDataService);
			}

			function changeStatusForProjectDocument() {
				return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(procurementContractHeaderDataService, 'procurement.contract');
			}

			function changePaymentScheduleStatus() {
				return prcCommonPaymentScheduleStatusChangeService.providePrcPaymentScheduleStatusChangeInstance(procurementContractHeaderDataService);
			}

			function createBusinesspartnerEvaluation() {
				return $injector.get('commonBusinessPartnerEvaluationScreenModalService').getWizards(function (/* businessPartnerEvaluationService */) {
					var defer = $q.defer();
					var header = procurementContractHeaderDataService.getSelected();
					if (header && (header.BusinessPartnerFk || header.BusinessPartnerFk === 0)) {
						$injector.get('basicsLookupdataLookupDataService').getSearchList('quote', 'Code="' + header.CodeQuotation + '"').then(function (qtns) {
							defer.resolve({
								create: {
									clerkPrcFk:header.ClerkPrcFk,
									clerkReqFk:header.ClerkReqFk,
									businessPartnerId: header.BusinessPartnerFk,
									businessPartner2Id: header.BusinessPartner2Fk,
									evaluationMotiveId: 3,
									projectFk: header.ProjectFk,
									qtnHeaderFk: qtns && qtns.items && qtns.items[0] && qtns.items[0].Id,
									conHeaderFk: header.Id,
									canSave: true,
									saveImmediately: true,
									saveCallbackFun: function () {
									}
								}
							});
						});
						return defer.promise;
					}
				}, '91825912027045fdbfb1eb6701be16b2', 'businessPartnerEvaluationAdaptorService');
			}

			function removeItemQuantityValidation() {
				var item = procurementCommonPrcItemDataService.getService().getSelected();
				if (item === null) {
					var title = $translate.instant('procurement.common.wizard.noItemSelectedTitle');
					var msg = $translate.instant('procurement.common.wizard.noItemSelected');
					platformModalService.showMsgBox(msg, title, 'ico-info');
					return;
				}
				procurementCommonItemQuantityValidationFlagService.validateOrNot = false;
				platformDataValidationService.removeFromErrorList(item, 'Quantity', procurementCommonPrcItemValidationService, procurementCommonPrcItemDataService.getService());
				platformRuntimeDataService.applyValidationResult(true, item, 'Quantity');
				procurementCommonPrcItemDataService.getService().gridRefresh();
			}

			function validateAndUpdateItemQuantity() {
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'procurement.contract/partials/procurement-contract-validate-and-update-item-quantity.html',
					backdrop: false
				}).then(function (result) {
					if (result.ok === true) {
						procurementCommonPrcItemDataService.getService().load();
					}
				});
			}

			service.updateEstimate = function updateEstimate() {
				let workflowWizardContext = basicsWorkflowWizardContextService.getContext();
				let header =  workflowWizardContext.entity ? workflowWizardContext.entity : procurementContractHeaderDataService.getSelected();
				if (!header || header.Id <= 0) {
					platformModalService.showMsgBox($translate.instant('procurement.contract.selectedConract'), $translate.instant('procurement.package.updateEstimate'));
					return;
				}

				if (header.IsFramework) {
					platformModalService.showMsgBox($translate.instant('procurement.contract.frameworkContractNotAllow'), $translate.instant('procurement.package.updateEstimate'));
					return;
				}

				$injector.get('prcCommonUpdateEstimatePrcStructureDataSerivce').setProcurementMainData(header.Id, null, 'contract');

				let requestData = {
					headerId: header.Id,
					sourceType: 'contract',
					qtnHeaderIds:null
				};

				$http.post(globals.webApiBaseUrl + 'procurement/common/option/getIsHasPrcItemAndPrcBoq', requestData).then(function (response) {
					let prcCommonUpdateEstimateService = $injector.get('prcCommonUpdateEstimateService');
					prcCommonUpdateEstimateService.setIsHasPrcItem(response.data.isHasPrcItem);
					prcCommonUpdateEstimateService.setIsHasPrcBoq(response.data.isHasPrcBoq);

					return platformModalService.showDialog({
						headerTextKey: 'procurement.package.updateEstimate',
						templateUrl: globals.appBaseUrl + 'procurement.common/templates/update-estimate-dialog.html',
						controller: 'procurementContractUpdateEstimateWizardController',
						resizeable: true,
						width: '700px'
					});
				});
			};


			service.purchaseOrderChange = purchaseOrderChange().fn;

			service.changeContractStatus = changeContractStatus().fn;

			service.changeContractCode = changeContractCode().fn;

			service.changeStatusForItem = changeStatusForItem().fn;

			service.changeStatusForProjectDocument = changeStatusForProjectDocument().fn;

			service.createBusinesspartnerEvaluation = createBusinesspartnerEvaluation().fn;

			service.changePaymentScheduleStatus = changePaymentScheduleStatus().fn;

			service.removeItemQuantityValidation = removeItemQuantityValidation;

			service.validateAndUpdateItemQuantity = validateAndUpdateItemQuantity;

			service.insertMaterial = function insertMaterial() {
				var header = procurementContractHeaderDataService.getSelected();
				if (!header) {
					return;
				}
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'procurement.contract/partials/insert-material-dialog.html',
					backdrop: false
				}).then(function (result) {
					if (result) {
						var prcHeaderFK = header.PrcHeaderFk;
						procurementContractInsertMaterialService.insertMaterial(prcHeaderFK, result.materialcatalogfk,
							result.materialgroupfk, result.materialdiscountgroupfk)
							.then(function () {
								platformModalService.showMsgBox($translate.instant('procurement.common.wizard.insertMaterial.insertMaterialSucceed'),
									$translate.instant('procurement.common.wizard.insertMaterial.insertMaterialTitle'), 'ico-info');
							}, function (error) {
								window.console.error(error);
							});
					}
				});
			};

			service.updateMaterial = function updateMaterial() {
				procurementContractHeaderDataService.updateAndExecute(procurementContractUpdateMaterialService.execute);
			};

			service.renumberFreeBoq = function() {
				procurementContractHeaderDataService.updateAndExecute(function () {
					var modalOptions = {
						headerTextKey: 'boq.main.freeBoqRenumber',
						bodyTextKey: 'boq.main.renumberOptionTitle',
						templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-main-renumber-freeboq.html',
						selectBoQs: $translate.instant('boq.main.renumberAllBoqs'),
						eachBoQ: $translate.instant('boq.main.renumberEachBoq'),
						currentPrj: $translate.instant('boq.main.renumberCurrentPrj'),
						renumberDependance: $translate.instant('boq.main.renumberDependance'),
						// iconClass: 'ico-question',
						showCancelButton: true
					};

					const boqMainStandardTypes = $injector.get('boqMainStandardTypes');
					var prcBoqMainService = $injector.get('prcBoqMainService');
					prcBoqMainService = prcBoqMainService.getService(procurementContractHeaderDataService);
					platformModalService.showDialog(modalOptions).then(function (result) {
						if (result.ok) {
							if (result.isRenumberCurrent && prcBoqMainService.getStructure().BoqStandardFk !== boqMainStandardTypes.free) {
								platformModalService.showMsgBox($translate.instant('boq.main.freeBoqWarningMessage'),
									$translate.instant('boq.main.freeBoqRenumber'), 'warning');
							}
							prcBoqMainService.renumberFreeBoq(result.isRenumberCurrent, result.isWithinBoq);
						}
					});
				});
			};

			service.createRequests = function createRequests() {
				var header = procurementContractHeaderDataService.getSelected();

				if (!header || angular.isUndefined(header.Id)) {
					return;
				}

				procurementContractHeaderDataService.updateAndExecute(function () {
					platformModalService.showDialog({
						currentItem: {
							Id: header.Id,
							Code: header.Code,
							Description: header.Description,
							RelevantDate: moment.utc(Date.now())
						},
						templateUrl: globals.appBaseUrl + 'businesspartner.certificate/partials/required-certificates-create-wizard.html',
						backdrop: false,
						showCancelButton: true,
						showOkButton: true,
						dataProcessor: requriedCertificatesCreateService.updateCertificatesByContract,
						formRows: [
							{
								'model': 'dataItem.RelevantDate',
								'type': 'dateutc',
								'readOnly': false,
								'label': 'Relevant Date',
								'label$tr$': 'procurement.contract.entityRelevantDate'
							},
							{
								'type': 'directive',
								'directive': 'platform-composite-input',
								'label$tr$': 'cloud.common.entityReference',
								'readOnly': true,
								'options': {
									'rows': [{
										'type': 'code',
										'model': 'dataItem.Code',
										'cssLayout': 'md-4 lg-4',
										'readonly': true
									}, {
										'type': 'description',
										'model': 'dataItem.Description',
										'cssLayout': 'md-8 lg-8',
										'validate': false,
										'readonly': true
									}]
								}
							}]
					}).then(function () {
						if (!certificateContainerServiceFactory) { // mike 2015-11-12: delay the service creation to make sure it's creation latter than the module resolver
							certificateContainerServiceFactory = businesspartnerCertificateCertificateContainerServiceFactory.getContainerService('procurement.contract', procurementContractHeaderDataService, procurementContractTranslationService);
						}
						certificateContainerServiceFactory.data.callRefresh();
					});
				});
			};

			service.setReportingDate = function () {
				var header = procurementContractHeaderDataService.getSelected();
				if (!header) {
					return;
				}
				platformModalService.showDialog({
					ConStatusFk: header.ConStatusFk,
					templateUrl: globals.appBaseUrl + 'procurement.contract/partials/set-reporting-date-dialog.html',
					backdrop: false
				}).then(function (result) {
					if (result) {
						procurementContractSidebarDataService.setReportingDate(result.ConStatusFk, result.DateReported)
							.then(function () {
								procurementContractHeaderDataService.refresh();
							}, function (error) {
								window.console.error(error);
							});
					}
				});
			};

			service.changeReportingDate = function changeReportingDate() {
				var header = procurementContractHeaderDataService.getSelected();
				var editHeader = angular.copy(header);
				if (!header) {
					return;
				}
				platformModalService.showDialog({
					currentItem: editHeader,
					templateUrl: globals.appBaseUrl + 'procurement.contract/partials/change-reporting-date-dialog.html',
					backdrop: false
				}).then(function (result) {
					if (result) {
						header.DateReported = result.DateReported;
						procurementContractHeaderDataService.markCurrentItemAsModified();
						procurementContractHeaderDataService.update();
					}
				});
			};

			service.gaebImport = function (wizardParameter) {
				procurementContractHeaderDataService.updateAndExecute(function () {
					var prcBoqMainService = $injector.get('prcBoqMainService');
					var procurementCommonPrcBoqService = $injector.get('procurementCommonPrcBoqService');
					prcBoqMainService = prcBoqMainService.getService(procurementContractHeaderDataService);
					procurementCommonPrcBoqService = procurementCommonPrcBoqService.getService(procurementContractHeaderDataService, prcBoqMainService);
					var options = {};
					options.boqMainService = prcBoqMainService;
					options.wizardParameter = wizardParameter;
					var result = boqMainGaebImportService.showImportDialog(options);
					if (result) {
						var selectedPrcBoq = procurementCommonPrcBoqService.getSelected();
						procurementCommonPrcBoqService.reloadItem(selectedPrcBoq);
					}
				});
			};

			service.gaebExport = function gaebExport(wizardParameter) {
				procurementContractHeaderDataService.updateAndExecute(function () {
					var prcBoqMainService = $injector.get('prcBoqMainService');
					prcBoqMainService = prcBoqMainService.getService(procurementContractHeaderDataService);
					var options = {};
					options.boqMainService = prcBoqMainService;
					options.wizardParameter = wizardParameter;
					boqMainGaebExportService.appendBidderInfo(options, procurementContractHeaderDataService);
					boqMainGaebExportService.showDialog(options);
				});
			};

			service.importOenOnlv = function importOenOnlv() {
				procurementContractHeaderDataService.updateAndExecute(function () {
					boqMainWizardService.importOenOnlv($injector.get('prcBoqMainService').getService(procurementContractHeaderDataService));
				});
			};

			service.exportOenOnlv = function exportOenOnlv() {
				procurementContractHeaderDataService.updateAndExecute(function () {
					boqMainWizardService.exportOenOnlv($injector.get('prcBoqMainService').getService(procurementContractHeaderDataService));
				});
			};

			service.importCrbSia = function importCrbSia() {
				procurementContractHeaderDataService.updateAndExecute(function () {
					boqMainWizardService.importCrbSia($injector.get('prcBoqMainService').getService(procurementContractHeaderDataService));
				});
			};

			service.exportCrbSia = function exportCrbSia() {
				procurementContractHeaderDataService.updateAndExecute(function () {
					boqMainWizardService.exportCrbSia($injector.get('prcBoqMainService').getService(procurementContractHeaderDataService));
				});
			};

			service.boqExcelExport = function boqExcelExport(/* wizardParameter */) {
				procurementContractHeaderDataService.updateAndExecute(function () {
					var boqMainService = $injector.get('prcBoqMainService');
					boqMainService = boqMainService.getService(procurementContractHeaderDataService);
					var options = boqMainExportOptionsService.getExportOptions(boqMainService);
					options.MainContainer.Id = 'boq.main.containerheader.boqStructure';
					basicsExportService.showExportDialog(options);
				});
			};

			service.BoqExcelImport = function BoqExcelImport(wizardParameter) {
				procurementContractHeaderDataService.updateAndExecute(function () {
					var boqMainService = $injector.get('prcBoqMainService');
					boqMainService = boqMainService.getService(procurementContractHeaderDataService);
					var options = boqMainImportOptionsService.getImportOptions(boqMainService);
					options.wizardParameter = wizardParameter;
					basicsImportService.showImportDialog(options);
				});
			};

			// change status of boq (in procurement contract module)
			function changeBoqHeaderStatus() {
				var prcBoqMainService = $injector.get('prcBoqMainService');
				var procurementCommonPrcBoqService = $injector.get('procurementCommonPrcBoqService');
				// By masking the following getService calls into this function contruct we delay calling the getService functions
				// which makes sure the underlying mainService information is set into the so called moduleContext.
				var getMyPrcBoqMainService = function () {
					return prcBoqMainService.getService(procurementContractHeaderDataService);
				};
				var getPrcBoqService = function () {
					return procurementCommonPrcBoqService.getService(procurementContractHeaderDataService, getMyPrcBoqMainService());
				};
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						statusName: 'boq',
						mainService: procurementContractHeaderDataService,
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

			service.splitUrbItems = function splitUrbItems() {

				procurementContractHeaderDataService.updateAndExecute(function () {
					var boqMainService = $injector.get('prcBoqMainService');
					var boqHeaderService = boqMainService.getService(procurementContractHeaderDataService);
					var boqStructureService = boqMainService.getService(procurementContextService.getMainService());
					var params = {};
					params.boqHeaderService = boqHeaderService;
					params.boqStructureService = boqStructureService;
					boqMainSplitUrbService.showDialog(params);
				});
			};

			service.renumberBoQ = function () {
				procurementContractHeaderDataService.updateAndExecute(function () {
					var prcBoqMainService = $injector.get('prcBoqMainService');
					prcBoqMainService = prcBoqMainService.getService(procurementContractHeaderDataService);
					var boqMainRenumberService = $injector.get('boqMainRenumberService');
					boqMainRenumberService.renumberBoqItems(prcBoqMainService);
				});
			};

			service.updateBoq = function updateBoq() {
				var selectedHeader = procurementContractHeaderDataService.getSelected();
				if (selectedHeader) {
					procurementContractHeaderDataService.updateAndExecute(function () {
						var headerData = {
							Module: 'procurement.contract',
							HeaderId: selectedHeader.Id,
							ExchangeRate: selectedHeader.ExchangeRate
						};
						var projectId = selectedHeader.ProjectFk;
						boqMainWizardService.updateBoq($injector.get('prcBoqMainService').getService(procurementContractHeaderDataService), projectId, procurementContractHeaderDataService, headerData);
					});
				}
			};

			service.exportMaterial = function () {
				procurementContractHeaderDataService.updateAndExecute(function () {
					var headerItem = procurementContractHeaderDataService.getSelected();
					if (!headerItem) {
						return;
					}

					$http.get(globals.webApiBaseUrl + 'procurement/common/wizard/exportmaterial?objectFk=' + headerItem.Id + '&ProjectFk=' + headerItem.ProjectFk + '&CurrencyFk=' + headerItem.BasCurrencyFk + '&moduleName=' + moduleName + '&subObjectFk=' + 0).then(function (response) {
						if (response.data && response.data.FileName) {
							basicsCommonFileDownloadService.download(null, {
								FileName: response.data.FileName,
								Path: response.data.path
							});
						}
					});
				});
			};

			service.prcItemExcelImport = function prcItemExcelImport() {
				var headerEntity = procurementContractHeaderDataService.getSelected();
				if (!headerEntity || angular.isUndefined(headerEntity.Id)) {
					platformModalService.showMsgBox($translate.instant('procurement.contract.selectedConract'), 'Info', 'ico-info');
					return;
				}
				procurementContractHeaderDataService.updateAndExecute(function () {
					var prcItemImportOptionsService = $injector.get('prcCommonItemImportOptionsService');
					var options = prcItemImportOptionsService.getImportOptions(moduleName);
					var mainEntity = procurementContractHeaderDataService.getSelected();
					var prcHeaderFk = mainEntity ? mainEntity.PrcHeaderFk : null;
					options.ImportDescriptor.CustomSettings = {
						PrcHeaderFk: prcHeaderFk,
						IsImportPriceAfterTax : options.isOverGross ? options.isOverGross : false,
						BpdVatGroupFk: headerEntity.BpdVatGroupFk,
						HeaderTaxCodeFk: headerEntity.TaxCodeFk
					};
					basicsImportService.showImportDialog(options);
				});
			};

			service.formatBoQSpecification = function formatBoQSpecification(){
				procurementContractHeaderDataService.updateAndExecute(function () {
					var prcBoqMainService = $injector.get('prcBoqMainService');
					prcBoqMainService = prcBoqMainService.getService(procurementContractHeaderDataService);
					boqMainWizardService.formatBoQSpecification(prcBoqMainService, procurementContractHeaderDataService);
				});
			};

			var wizards = {
				showImages: true,
				showTitles: true,
				showSelected: true,
				cssClass: 'sidebarWizard',
				items: [
					{
						id: 1,
						text: 'Change Status Wizard',
						text$tr$: 'procurement.common.wizard.change.status.wizard',
						groupIconClass: 'sidebar-icons ico-wiz-change-status',
						visible: true,
						subitems: [
							purchaseOrderChange(),
							changeContractStatus(),
							changeStatusForItem(),
							changeStatusForProjectDocument()
						]
					},
					{
						id: 2,
						text: 'Certificates Wizard',
						text$tr$: 'businesspartner.certificate.wizard.certificateWizard.wizardCaption',
						groupIconClass: 'sidebar-icons ico-wiz-change-status',
						visible: false,
						subitems: [
							{
								id: 21,
								text: 'Create Requests',
								text$tr$: 'businesspartner.certificate.wizard.certificateWizard.caption',
								type: 'item',
								showItem: true,
								fn: service.createRequests
							}
						]
					},
					{
						id: 3,
						text: 'Report Data Wizard',
						text$tr$: 'procurement.common.wizard.report.data.wizard',
						groupIconClass: 'sidebar-icons ico-wiz-change-status',
						subitems: [
							{
								id: 31,
								text: 'Set Reporting Date',
								text$tr$: 'procurement.common.wizard.set.reporting.date',
								type: 'item',
								showItem: true,
								fn: service.setReportingDate
							},
							{
								id: 32,
								text: 'Change Reporting Date',
								text$tr$: 'procurement.common.wizard.change.reporting.date',
								type: 'item',
								showItem: true,
								fn: service.changeReportingDate
							}
						]

					},
					{
						id: 4,
						text: 'BoQ Wizard',
						text$tr$: 'procurement.common.wizard.boq.wizard',
						groupIconClass: 'sidebar-icons ico-wiz-gaeb-ex',
						subitems: [
							{
								id: 41,
								text: 'GAEB-Import',
								text$tr$: 'procurement.common.wizard.gaeb.import',
								type: 'item',
								showItem: true,
								fn: service.gaebImport
							},
							{
								id: 42,
								text: 'GAEB-Export',
								text$tr$: 'procurement.common.wizard.gaeb.export',
								type: 'item',
								showItem: true,
								fn: service.gaebExport
							},
							{
								id: 43,
								text: 'Renumber BoQ',
								text$tr$: 'procurement.common.wizard.renumber.boq',
								type: 'item',
								showItem: true,
								fn: service.renumberBoQ
							}
						]
					},
					{
						id: 5,
						text: 'Businesspartner Evaluation',
						text$tr$: 'businesspartner.evaluation.configDialog',
						groupIconClass: 'tlb-icons ico-rec-new',
						visible: false,
						subitems: [
							createBusinesspartnerEvaluation()
						]
					}
				]
			};

			service.active = function activate() {
				platformSidebarWizardConfigService.activateConfig(wizardID, wizards);
			};

			service.deactive = function deactivate() {
				platformSidebarWizardConfigService.deactivateConfig(wizardID);
			};
			service.replaceNeutralMaterail = function () {
				procurementCommonReplaceNeutralMaterialService.showReplaceNeutralMaterialWizardDialog(procurementContractHeaderDataService);
			};

			service.updateItemPrice = function () {
				procurementCommonUpdateItemPriceService.showUpdateItemPriceWizardDialog(procurementContractHeaderDataService);
			};

			service.editCallOffPrice = function () {
				var itemSel = procurementCommonPrcItemDataService.getService().getSelected();
				var isReadOnly = false;
				if(itemSel) {
					platformRuntimeDataService.readonly(itemSel, [{field: 'Price', readonly: isReadOnly}]);
					platformRuntimeDataService.readonly(itemSel, [{field: 'PriceOc', readonly: isReadOnly}]);
					platformRuntimeDataService.readonly(itemSel, [{field: 'PriceGross', readonly: isReadOnly}]);
					platformRuntimeDataService.readonly(itemSel, [{field: 'PriceGrossOc', readonly: isReadOnly}]);
					platformRuntimeDataService.readonly(itemSel, [{field: 'PriceUnit', readonly: isReadOnly}]);
					platformRuntimeDataService.readonly(itemSel, [{field: 'BasUomPriceUnitFk', readonly: isReadOnly}]);
					platformRuntimeDataService.readonly(itemSel, [{field: 'PrcPriceConditionFk', readonly: isReadOnly}]);
					platformRuntimeDataService.readonly(itemSel, [{field: 'MdcTaxCodeFk', readonly: isReadOnly}]);
				}

				var prcBoqMainService = $injector.get('prcBoqMainService');
				prcBoqMainService = prcBoqMainService.getService(procurementContractHeaderDataService);
				var boqSel = prcBoqMainService.getSelected();
				if(boqSel) {
					platformRuntimeDataService.readonly(boqSel, [{field: 'Price', readonly: isReadOnly}]);
					platformRuntimeDataService.readonly(boqSel, [{field: 'PriceOc', readonly: isReadOnly}]);
					platformRuntimeDataService.readonly(boqSel, [{field: 'Correction', readonly: isReadOnly}]);
					platformRuntimeDataService.readonly(boqSel, [{field: 'CorrectionOc', readonly: isReadOnly}]);
				}
			};

			service.generateItemDeliverySchedule = function () {
				procurementCommonGenerateDeliveryScheduleService.showGenerateDeliveryScheduleWizardDialog(procurementCommonPrcItemDataService, procurementContractHeaderDataService);
			};

			service.generatePaymentSchedule = function () {
				var totalDataService = procurementCommonTotalDataService.getService(procurementContractHeaderDataService);
				let entities = procurementContractHeaderDataService.getSelectedEntities();
				let bodyText;
				let modalOptions;
				let entityIds;
				if (entities.length && entities.length > 1) {
					if (!basicsLookupdataLookupDescriptorService.getData('PrcTotalKind')) {
						basicsLookupdataLookupDescriptorService.loadData('PrcTotalKind');
					}
					let haveNoDateEntities = _.filter(entities, function (p) {
						return !p.ValidTo || !p.ValidFrom;
					});
					let haveNoMainEntities = _.filter(entities, function (p) {
						return p.ContractHeaderFk;
					});
					if (haveNoDateEntities && haveNoDateEntities.length) {
						let codes = _.map(haveNoDateEntities, function (pa) {
							return pa.Code;
						});
						let codesStr = codes.join(',');
						bodyText = $translate.instant('procurement.common.wizard.generatePaymentSchedule.contractHaveNoValidDate',{'code' : codesStr});
					}
					else if (haveNoMainEntities && haveNoMainEntities.length) {
						bodyText = $translate.instant('procurement.common.wizard.generatePaymentSchedule.ThereIsRecordIsnotMainContract');
					}
					if (bodyText) {
						modalOptions = {
							headerText: $translate.instant('procurement.common.wizard.generatePaymentSchedule.wizard'),
							bodyText: bodyText,
							iconClass: 'ico-info'
						};
						return platformModalService.showDialog(modalOptions);
					}
					else {
						entityIds = _.map(entities, function (p) {
							return p.Id;
						});
						totalDataService.resetSameTotalsFromContractsCach();
						totalDataService.getSameTotalsFromContracts(entityIds, entities);
					}
				}
				var prcHeaderFks = [];
				_.forEach(entities, function (p) {
					prcHeaderFks.push(p.PrcHeaderFk);
				});
				$http.post(globals.webApiBaseUrl + 'procurement/common/prcpaymentschedule/getisdoneitems', prcHeaderFks).then(function (res) {
					var data = res.data;
					if (data && data.length) {
						bodyText = $translate.instant('procurement.common.wizard.generatePaymentSchedule.ThereIsRecordIsDone');
						modalOptions = {
							headerText: $translate.instant('procurement.common.wizard.generatePaymentSchedule.wizard'),
							bodyText: bodyText,
							iconClass: 'ico-info'
						};
						return platformModalService.showDialog(modalOptions);
					}
					else {
						procurementCommonGeneratePaymentScheduleService.showGeneratePaymentScheduleWizardDialog(totalDataService, procurementContractHeaderDataService);
					}
				});
			};

			service.changeProcurementConfiguration = function () {
				var parentValidationService = $injector.get('contractHeaderElementValidationService');
				ProcurementCommonChangeConfigurationService.execute(procurementContractHeaderDataService, parentValidationService);
			};

			service.createPES = function () {
				var pesWizardService = $injector.get('procurementPesWizardHelpService'),
					selectedEntities = angular.copy(procurementContractHeaderDataService.getSelectedEntities());

				/* _.each(selectedEntities, function (entity) {
				 var packageDto = _.find(basicsLookupdataLookupDescriptorService.getData('PrcPackage'), {Id: entity.PackageFk});
				 if (packageDto) {
				 entity.PrcStructureFk = packageDto.StructureFk;
				 }
				 }); */
				_.each(selectedEntities, function (entity) {
					if (entity.PrcHeaderEntity) {
						entity.PrcStructureFk = entity.PrcHeaderEntity.StructureFk;
					}
				});

				pesWizardService.createBatch(selectedEntities)
					.finally(function () {
						procurementContractHeaderDataService.showModuleHeaderInformation();
					});
			};

			service.maintainPaymentScheduleVersion = function () {
				prcCommonMaintainPaymentScheduleVersionService.maintainPaymentScheduleVersion(procurementContractHeaderDataService, moduleName);
			};

			service.updatePaymentScheduleDOC = function () {
				updatePaymentScheduleDOCService.updatePaymentScheduleDOC(procurementContractHeaderDataService);
			};

			// loads or updates translated strings
			var loadTranslations = function () {
				platformTranslateService.translateObject(wizards, ['text']);

			};

			// register translation changed event
			platformTranslateService.translationChanged.register(loadTranslations);

			// register a module - translation table will be reloaded if module isn't available yet
			if (!platformTranslateService.registerModule('procurement.contract')) {
				// if translation is already available, call loadTranslation directly
				loadTranslations();
			}

			service.createWicFromBoq = function copyBoqItemToWIC() {

				var conHeader = procurementContractHeaderDataService.getSelected();
				if (!conHeader) {
					platformModalService.showMsgBox('procurement.common.wizard.errorNoSelectOneContract', 'cloud.common.informationDialogHeader', 'info');
					return;
				}
				// check if existed boqItems of qtn_header.
				// show dialog.
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'procurement.common/partials/wizard/common-create-wic-from-boq.html',
					width: '700px',
					// height: '620px',
					// minHeight: '620px',
					resizeable: true,
					ConHeaderFk: conHeader.Id,
					CurrencyFk:conHeader.BasCurrencyFk,
					headerText: $translate.instant('procurement.common.createWicFromBoqWizardTitle')
				});
			};

			service.createWicFromContract = function createWicFromContract() {

				var conHeader = procurementContractHeaderDataService.getSelected();
				if (!conHeader) {
					platformModalService.showMsgBox('procurement.common.wizard.errorNoSelectOneContract', 'cloud.common.informationDialogHeader', 'info');
					return;
				}
				$http.get(globals.webApiBaseUrl + 'procurement/contract/header/canbeframework?conHeaderId=' + conHeader.Id).then(function (res) {
					if (res.data.Result === true) {
						// show dialog.
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'procurement.common/partials/wizard/common-create-wic-from-contract.html',
							width: '700px',
							resizeable: true,
							conHeader: conHeader,
							headerText: $translate.instant('procurement.contract.createWicCatalog'),
						}).then(function (res) {
							if (res) {
								basicsLookupdataLookupDescriptorService.loadData('ConHeader2BoqWicCatBoq').then(function (data) {
									basicsLookupdataLookupDescriptorService.removeData('ConHeader2BoqWicCatBoq');
									basicsLookupdataLookupDescriptorService.updateData('ConHeader2BoqWicCatBoq', data);
								});
							}
						});
					}
					else {
						platformModalService.showMsgBox(res.data.Message,  'cloud.common.informationDialogHeader', 'ico-info');
					}
				});
			};

			service.sendOrder2Sgtwo = function sendOrder2Sgtwo() {
				var conHeader = procurementContractHeaderDataService.getSelected();
				if (!conHeader) {
					platformModalService.showMsgBox('procurement.common.wizard.errorNoSelectOneContract', 'cloud.common.informationDialogHeader', 'info');
					return;
				}

				var modalOptions = {
					headerText: $translate.instant('procurement.contract.sgtwo.sendOrder'),
					bodyText: $translate.instant('procurement.contract.sgtwo.confirmSendOrder',{'Code': '#' + conHeader.Code}),
					showOkButton: true,
					showCancelButton: true,
					iconClass: 'ico-info'
				};

				platformDialogService.showDialog(modalOptions).then(function (result) {
					if (result) {
						$http.get(globals.webApiBaseUrl + 'procurement/contract/wizard/sendOrder2Sgtwo?contactId=' + conHeader.Id).then(function () {
							platformModalService.showMsgBox('procurement.contract.sgtwo.sendSgtwoSuccess', 'cloud.common.informationDialogHeader', 'ico-info');
						});
					}
				});
			};

			service.generateTransactions = function () {
				var header = procurementContractHeaderDataService.getSelected();

				if (!header) {
					platformModalService.showMsgBox('procurement.common.wizard.errorNoSelectOneContract', 'cloud.common.informationDialogHeader', 'info');
				} else if (header.IsFramework) {
					// #134445 - exclude framework contract
					platformModalService.showMsgBox('procurement.contract.wizard.infoFrameworkConNotSupported', 'cloud.common.informationDialogHeader', 'info');
				} else {
					$http.get(globals.webApiBaseUrl + 'procurement/contract/transaction/generate?mainItemId=' + header.Id).then(function (res) {
						if (res.data === 0) {
							platformModalService.showMsgBox('procurement.contract.noNewConTransactionGenerated', 'cloud.common.informationDialogHeader', 'info');
						}

						$injector.get('procurementContractTransactionDataService').load();
					});
				}
			};

			service.updatePackageBoq= function updatePackageBoq() {
				return procurementCommonUpdatePackageBoqService.showUpdatePackageBoqWizardDialog(procurementContractHeaderDataService);
			};

			service.addIndexToBoqStructure = function addIndexToBoqStructure() {
				procurementContractHeaderDataService.updateAndExecute(function () {
					boqMainWizardService.addIndexToBoqStructure($injector.get('prcBoqMainService').getService(procurementContractHeaderDataService));
				});
			};

			service.splitOverallDiscount = function splitOverallDiscount() {
				var splitOverallDiscountUrl = globals.webApiBaseUrl + 'procurement/contract/header/splitoveralldiscount';
				prcCommonSplitOverallDiscountService.splitOverallDiscount(procurementContractHeaderDataService, splitOverallDiscountUrl);
			};

			service.contractTerminate = function contractTerminate() {
				var selectedItem = procurementContractHeaderDataService.getSelected();
				if (selectedItem) {
					$http.get(globals.webApiBaseUrl + 'procurement/contract/wizard/getContractTotalAndDeliveredTotal?ContractId=' + selectedItem.Id).then(function (res) {
						var data = res.data;
						var itemQuantity = 0;
						var itemDelivered = 0;
						var boqQuantity = 0;
						var boqDelivered = 0;
						var gridId = 0;

						if (data.PrcItems && data.PrcItems.length) {
							_.forEach(data.PrcItems, function (i) {
								i.gridId = ++gridId;
								i.Type = 'Item';
								itemQuantity += i.Quantity;
								itemDelivered += i.QuantityDelivered;
								i.QuantityUnDelivered = i.Quantity - i.QuantityDelivered;
							});
						}

						if (data.PrcBoqs && data.PrcBoqs.length) {
							_.forEach(data.PrcBoqs, function (i) {
								i.gridId = ++gridId;
								i.Type = 'Boq';
								boqQuantity += i.Quantity;
								boqDelivered += i.QuantityDelivered;
								i.QuantityUnDelivered = i.Quantity - i.QuantityDelivered;
							});
						}

						if (itemQuantity <= itemDelivered && boqQuantity <= boqDelivered) {
							var msgBoxTitle = $translate.instant('procurement.contract.wizard.contractTermination');
							var msgBoxText = $translate.instant('procurement.contract.wizard.allContractsAreDelivered');
							return platformModalService.showMsgBox(msgBoxText, msgBoxTitle, 'info');
						}
						else {
							var defaultValue = {
								headerText: $translate.instant('procurement.contract.wizard.contractTermination'),
								data: data,
								item: selectedItem,
								dataService: procurementContractHeaderDataService,
								resizeable: true,
								height: 'auto',
								width: '360px',
								templateUrl: globals.appBaseUrl + 'procurement.contract/partials/prc-contract-contract-termination-dialog.html'
							};
							selectedItem.isContractTerminate = true;
							platformModalService.showDialog(defaultValue);
						}
					});
				}
				else {
					var message = $translate.instant('cloud.common.noCurrentSelection');
					platformModalService.showMsgBox(message,  'Info', 'ico-info');
				}
			};

			var mdcCatalogDomainSchema = null;
			var mdcCatalogDescriptionMaxLength;
			service.updateFrameworkMaterialCatalog = function updateFrameworkMaterialCatalog() {
				mdcCatalogDomainSchema = !mdcCatalogDomainSchema ? platformSchemaService.getSchemaFromCache( { typeName: 'MaterialCatalogDto', moduleSubModule: 'Basics.MaterialCatalog'} ) : mdcCatalogDomainSchema;
				mdcCatalogDescriptionMaxLength = !mdcCatalogDescriptionMaxLength ? (_.has(mdcCatalogDomainSchema, 'properties.DescriptionInfo.domainmaxlen') ? mdcCatalogDomainSchema.properties.DescriptionInfo.domainmaxlen : 252) : mdcCatalogDescriptionMaxLength;
				var selectedContract = procurementContractHeaderDataService.getSelected();
				if (selectedContract) {
					$http.get(globals.webApiBaseUrl + 'procurement/contract/header/canbeframework?conHeaderId=' + selectedContract.Id).then(function (res) {
						if (res.data.Result === true) {
							var prcItemService = procurementCommonPrcItemDataService.getService(procurementContractHeaderDataService);
							var prcItems = prcItemService.getList();
							if (prcItems && prcItems.length) {
								var defaultValue = {
									headerText: $translate.instant('procurement.contract.updateFrameworkMaterialCatalog.headerText'),
									data: {},
									item: selectedContract,
									dataService: procurementContractHeaderDataService,
									prcItemService: prcItemService,
									resizeable: true,
									height: 'auto',
									width: '350px',
									templateUrl: globals.appBaseUrl + 'procurement.contract/partials/update-framework-material-catalog.html',
									mdcCatalogDescriptionMaxLength: mdcCatalogDescriptionMaxLength
								};
								platformModalService.showDialog(defaultValue);
							}
							else {
								var message2 = $translate.instant('procurement.contract.updateFrameworkMaterialCatalog.noItemsExisted');
								platformModalService.showMsgBox(message2, 'cloud.common.informationDialogHeader', 'ico-info');
							}
						}
						else {
							platformModalService.showMsgBox(res.data.Message, 'cloud.common.informationDialogHeader', 'ico-info');
						}
					});
				}
				else {
					var message1 = $translate.instant('cloud.common.noCurrentSelection');
					platformModalService.showMsgBox(message1,  'cloud.common.informationDialogHeader', 'ico-info');
				}
			};
			service.selectPrcItemGroups = function selectPrcItemGroups() {
				var commonPrcItemService = procurementCommonPrcItemDataService.getService();
				procurementCommonSelectAlternateGroupService.showSelectAlternateGroupWizardDialog(commonPrcItemService);
			};

			service.createContract = function createContract() {
				var wzConfig = {
					title$tr$: 'procurement.contract.wizard.createContractTitle',
					steps: [{
						id: 'baseUpdateOption',
						disallowBack: false,
						disallowNext: false,
						canFinish: false
					}, {
						id: 'createContract',
						disallowBack: false,
						disallowNext: false,
						canFinish: true
					}]
				};
				let dialogOptions = {
					headerText: $translate.instant('procurement.contract.wizard.createContractTitle'),
					dataService: procurementContractHeaderDataService,
					resizeable: true,
					height: 'auto',
					width: '360px',
					templateUrl: globals.appBaseUrl + 'procurement.contract/partials/create-contract/create-contract-wizard.html',
					value: {
						wizard: wzConfig,
						wizardName: 'createContract'
					},
				};
				platformModalService.showDialog(dialogOptions);
			}

			service.materialItem = ()=>{
				procurementCommonDisableEnabledService.execute();
			}

			return service;
		}]);
})(angular);
