/**
 * Created by lta on 6/6/2016.
 */
// jshint -W072
// jshint +W098
(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular,console */
	angular.module(moduleName).factory('procurementQuoteWizardsService', [
		'_', 'globals', '$log', 'platformTranslateService', '$document',
		'platformModalService', 'platformDialogService', 'basicsCommonChangeStatusService',
		'procurementQuoteHeaderDataService', 'procurementQuoteRequisitionDataService',
		'platformStatusIconService', '$http', '$translate', '$injector', 'documentProjectDocumentsStatusChangeService',
		'platformSidebarWizardConfigService', 'procurementQuoteUpdateMaterialService', 'procurementQuoteInsertMaterialService', 'procurementQuoteTotalDataService',
		'procurementCommonItemQuantityValidationFlagService', 'procurementQuoteTranslationService', 'procurementContractTranslationService',
		'boqMainGaebImportService',
		'boqMainGaebExportService',
		'businessPartnerCertificateRequiredCreateService', 'businesspartnerCertificateCertificateContainerServiceFactory',
		'boqMainExportOptionsService',
		'basicsExportService',
		'boqMainImportOptionsService',
		'basicsImportService',
		'basicsCommonFileDownloadService',
		'procurementQtnExcelImportWizardService', 'procurementCommonImportMaterialService',
		'boqMainElementValidationService',
		'procurementCommonPrcBoqService',
		'platformRuntimeDataService',
		'boqMainWizardService',
		'procurementCommonReplaceNeutralMaterialService',
		'procurementCommonUpdateItemPriceService',
		'prcCommonItemExportOptionsService', 'basicsCommonChangeCodeService', 'procurementCommonUpdatePackageBoqService',
		'prcCommonSplitOverallDiscountService',
		'procurementCommonSelectAlternateGroupService',
		'ProcurementCommonChangeConfigurationService',
		'procurementContextService',
		'basicsLookupdataLookupDescriptorService',
		'procurementQuoteCopyNewBoqItemWizardService',
		'procurementQuoteCopyMaterialNewItemWizardService',
		'platformGridAPI',
		'mainViewService',
		'ProcurementCommonDisableEnabledService',
		function (_, globals, $log, platformTranslateService, $document,
			platformModalService, platformDialogService, basicsCommonChangeStatusService,
			procurementQuoteHeaderDataService, procurementQuoteRequisitionDataService,
			platformStatusIconService, $http, $translate, $injector, documentProjectDocumentsStatusChangeService,
			platformSidebarWizardConfigService, procurementQuoteUpdateMaterialService, procurementQuoteInsertMaterialService, procurementQuoteTotalDataService,
			procurementCommonItemQuantityValidationFlagService, procurementQuoteTranslationService, procurementContractTranslationService,
			boqMainGaebImportService,
			boqMainGaebExportService,
			certificateRequiredCreateService, businesspartnerCertificateCertificateContainerServiceFactory,
			boqMainExportOptionsService,
			basicsExportService,
			boqMainImportOptionsService,
			basicsImportService,
			basicsCommonFileDownloadService,
			procurementQtnExcelImportWizardService, procurementCommonImportMaterialService,
			boqMainValidationService,
			procurementCommonPrcBoqService,
			platformRuntimeDataService,
			boqMainWizardService,
			procurementCommonReplaceNeutralMaterialService,
			procurementCommonUpdateItemPriceService,
			prcCommonItemExportOptionsService,
			basicsCommonChangeCodeService, procurementCommonUpdatePackageBoqService,
			prcCommonSplitOverallDiscountService,
			procurementCommonSelectAlternateGroupService,
			changeConfigurationService,
			procurementContextService,
			basicsLookupdataLookupDescriptorService,
			quoteCopyNewBoqItemWizardService,
			quoteCopyMaterialNewItemWizardService,
			platformGridAPI,
			mainViewService,
			procurementCommonDisableEnabledService) {

			var service = {};
			var wizardID = 'procurementQuoteSidebarWizards';
			var certificateContainerServiceFactory = null;

			function changeQuoteStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						projectField: 'ProjectFk',
						mainService: procurementQuoteHeaderDataService,
						statusField: 'StatusFk',
						title: 'procurement.quote.wizard.change.statusTitle',
						statusName: 'quote',
						updateUrl: procurementQuoteHeaderDataService.getUrl('changestatus').replace(globals.webApiBaseUrl, ''),
						id: 11
					}
				);
			}

			function changeQuoteCode() {
				return basicsCommonChangeCodeService.provideCodeChangeInstance({
					mainService: procurementQuoteHeaderDataService,
					validationService: 'procurementQuoteHeaderValidationService',
					title: 'procurement.quote.wizard.change.code.headerText'
				});
			}

			function changeStatusForProjectDocument() {
				return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(procurementQuoteHeaderDataService, moduleName);
			}

			function removeItemQuantityValidation() {
				procurementCommonItemQuantityValidationFlagService.validateOrNot = false;
			}

			function validateAndUpdateItemQuantity() {
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'procurement.quote/partials/procurement-quote-validate-and-update-item-quantity.html',
					backdrop: false
				}).then(function (result) {
					if (result.ok === true) {
						$injector.get('procurementCommonPrcItemDataService').getService().load();
					}
				});
			}

			service.changeQuoteStatus = changeQuoteStatus().fn;

			service.changeQuoteCode = changeQuoteCode().fn;

			service.changeStatusForProjectDocument = changeStatusForProjectDocument().fn;

			service.increaseVersion = function increaseVersion() {
				var headers = procurementQuoteHeaderDataService.getSelectedEntities();
				var newHeaders = [];
				if (headers.length > 0) {
					var invalidHeaders = [];
					for (var i = 0; i < headers.length; i++) {
						if (headers[i].IsIdealBidder) {
							invalidHeaders.push(headers[i]);
							continue;
						}
						if (newHeaders.length < 1) {
							newHeaders.push(headers[i]);
						} else {
							var isExist = false;
							for (var j = 0; j < newHeaders.length; j++) {
								if ((newHeaders[j].RfqHeaderFk === headers[i].RfqHeaderFk) && (newHeaders[j].BusinessPartnerFk === headers[i].BusinessPartnerFk)) {
									isExist = true;
									break;
								}
							}
							if (!isExist) {
								newHeaders.push(headers[i]);
							}
						}
					}

					if (invalidHeaders.length > 0) {
						var invalidCodes = _.map(invalidHeaders, function (header) {
							return header.Code;
						});
						var invalidCode = invalidCodes.join(',');
						var bodyText = $translate.instant('procurement.quote.wizard.increase.error.idealBidderSelected', {invalidQuoteCodes: invalidCode});
						platformModalService.showMsgBox(bodyText, '', 'info');
						if (invalidHeaders.length === headers.length) {
							return;
						}
					}

					procurementQuoteHeaderDataService.updateAndExecute(function () {
						$http.post(procurementQuoteHeaderDataService.getUrl('increaseversion'), newHeaders).then(function (res) {
							var list = procurementQuoteHeaderDataService.getList();
							for (var i = 0; i < newHeaders.length; i++) {
								var header = newHeaders[i];
								list.splice(list.indexOf(header) + 1, 0, res.data[i]);
							}

							procurementQuoteHeaderDataService.gridRefresh();
							procurementQuoteHeaderDataService.setSelected(res.data[0]);

						});
					});
				}
			};

			service.createContract = function createContract() {
				var headerItem = procurementQuoteHeaderDataService.getSelected();

				if (!headerItem || angular.isUndefined(headerItem.Id)) {
					return;
				}
				let request = {
					MainItemIds: [headerItem.Id],
					ModuleName: 'procurement.quote'
				};
				$http.post(globals.webApiBaseUrl + 'procurement/common/wizard/hascontracteddata', request)
					.then(function (response) {
						let hasContractItem = response ? response.data : false;
						let isShowFilter = 0;
						let prcBoqMainService = $injector.get('prcBoqMainService').getService();
						_.forEach(prcBoqMainService.getList(), function (boq) {
							if(boq.ExQtnIsEvaluated) {
								isShowFilter = 1;
							}
						});
						if(!isShowFilter) {
							let procurementCommonPrcItemDataService = $injector.get('procurementCommonPrcItemDataService').getService();
							_.forEach(procurementCommonPrcItemDataService.getList(), function (item) {
								if(item.ExQtnIsEvaluated) {
									isShowFilter = 1;
								}
							});
						}
						createContractByHeader(headerItem, hasContractItem, isShowFilter);
					});
			};

			function createContractByHeader(headerItem, hasContractItem, isFilterEvaluated) {
				// todo stone if is change order use the new logic.
				procurementQuoteHeaderDataService.canCreateContract(headerItem.Id).then(function (response) {
					var contracts = response.data.contracts;
					var hasContracts = contracts && contracts.length > 0;
					if (!hasContracts) {
						checkIsChangeOrderOnQtnNCreateContract(headerItem, hasContracts, isFilterEvaluated);
					} else if (hasContracts) {
						// add a view to show contracts.
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'procurement.common/partials/prc-common-show-contract-view.html',
							width: '800px',
							resizeable: true,
							headerText: $translate.instant('procurement.quote.wizard.create.contract.dialog.title'),
							contracts: contracts,
							OKButtonText: $translate.instant('procurement.common.createBtn'),
							bodyText: headerItem.IsIdealBidder ? $translate.instant('procurement.common.createdContracts4IdealQtn') : $translate.instant('procurement.common.hasContractWhetherStillCreate'),
							okCallback: checkIsChangeOrderOnQtnNCreateContract,
							hasContractItem: hasContractItem,
							showFilterEvaluated: hasContracts,
							isFilterEvaluated: isFilterEvaluated
						});
					} else {
						platformModalService.showMsgBox('procurement.common.canNotCreateContractDueToOrdered', 'procurement.quote.wizard.create.contract.dialog.title', 'info');
					}
				});
			}

			/*
			* it is for the wizard 'create contract'.
			* **/
			function checkIsChangeOrderOnQtnNCreateContract(headerItem, hasContractItem, isFilterEvaluated) {
				if (!headerItem) {
					headerItem = procurementQuoteHeaderDataService.getSelected();
				}
				procurementQuoteHeaderDataService.isChangeOrder(headerItem.Id).then(function (response) {
					var isChangeOrder = response.data;
					if (isChangeOrder) {
						if (headerItem && headerItem.Id > 0) {
							platformModalService.showDialog({
								qtnHeaderId: headerItem.Id,
								templateUrl: globals.appBaseUrl + 'procurement.quote/partials/create-merge-contract-wizard-view.html',
								backdrop: false,
								width: '940px',
								resizeable: true,
								hasContractItem: hasContractItem
							});
						}
					} else {
						procurementQuoteHeaderDataService.updateAndExecute(function () {
							if (headerItem.BusinessPartnerFk) {
								platformModalService.showDialog({
									templateUrl: globals.appBaseUrl + 'procurement.quote/partials/create-contract-wizard-view.html',
									backdrop: false,
									hasContractItem: hasContractItem,
									showFilterEvaluated: !hasContractItem,
									isFilterEvaluated: isFilterEvaluated
								});
							}
						});
					}
				});
			}

			service.createRequests = service.createRequests = function createRequests() {
				var header = procurementQuoteHeaderDataService.getSelected();
				var reqHeaderEntity = procurementQuoteRequisitionDataService.getSelected();

				if (!header || !reqHeaderEntity || angular.isUndefined(header.Id) || angular.isUndefined(reqHeaderEntity.Id)) {
					return;
				}

				header.PrcHeaderId = reqHeaderEntity.PrcHeaderFk;
				procurementQuoteHeaderDataService.updateAndExecute(function () {
					platformModalService.showDialog({
						currentItem: header,
						templateUrl: globals.appBaseUrl + 'businesspartner.certificate/partials/required-certificates-create-wizard.html',
						backdrop: false,
						showCancelButton: true,
						showOkButton: true,
						dataProcessor: certificateRequiredCreateService.updateCertificatesByQuote,
						formRows: [
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
							certificateContainerServiceFactory = businesspartnerCertificateCertificateContainerServiceFactory.getContainerService('procurement.quote', procurementQuoteHeaderDataService, procurementContractTranslationService);
						}
						certificateContainerServiceFactory.data.callRefresh();
					});
				});
			};

			service.insertMaterial = function insertMaterial() {
				var headerItem = procurementQuoteRequisitionDataService.getSelected();

				procurementQuoteHeaderDataService.updateAndExecute(function () {

					if (headerItem) {
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'procurement.contract/partials/insert-material-dialog.html',
							backdrop: false
						}).then(function (result) {
							if (result) {
								var prcHeaderFK = headerItem.PrcHeaderFk;
								procurementQuoteInsertMaterialService.insertMaterial(prcHeaderFK, result.materialcatalogfk,
									result.materialgroupfk, result.materialdiscountgroupfk)
									.then(function () {
										platformModalService.showMsgBox($translate.instant('procurement.common.wizard.insertMaterial.insertMaterialSucceed'),
											$translate.instant('procurement.common.wizard.insertMaterial.insertMaterialTitle'), 'ico-info');
									}, function (error) {
										console.error(error);
									});
							}
						});
					}
				});
			};

			service.updateMaterial = function updateMaterial() {
				procurementQuoteHeaderDataService.updateAndExecute(procurementQuoteUpdateMaterialService.execute);
			};
			service.replaceNeutralMaterail = function () {
				procurementCommonReplaceNeutralMaterialService.showReplaceNeutralMaterialWizardDialog(procurementQuoteHeaderDataService);
			};

			service.exportMaterial = function () {
				procurementQuoteHeaderDataService.updateAndExecute(function () {

					var headerItem = procurementQuoteRequisitionDataService.getSelected();

					if (!headerItem) {
						return;
					}

					$http.get(globals.webApiBaseUrl + 'procurement/common/wizard/exportmaterial?objectFk=' + headerItem.QtnHeaderFk + '&ProjectFk=' + headerItem.ProjectFk + '&CurrencyFk=' + headerItem.CurrencyFk + '&moduleName=' + moduleName + '&subObjectFk=' + 0).then(
						function (response) {
							if (response.data?.FileName) {
								basicsCommonFileDownloadService.download(null, {FileName: response.data.FileName, Path: response.data.path});
							}
						}
					);
				});
			};

			service.importMaterial = function () {
				procurementQuoteHeaderDataService.updateAndExecute(function () {
					procurementCommonImportMaterialService.execute(procurementQuoteHeaderDataService, procurementQuoteRequisitionDataService, moduleName);
				});
			};

			service.qtoExcelImport = function qtoExcelImport() {
				var headerEntity = procurementQuoteHeaderDataService.getSelected();
				var reqHeaderEntity = procurementQuoteRequisitionDataService.getSelected();

				if (!headerEntity || !reqHeaderEntity || angular.isUndefined(headerEntity.Id) || angular.isUndefined(reqHeaderEntity.Id)) {
					platformModalService.showMsgBox($translate.instant('procurement.quote.selectedQuote'), 'Info', 'ico-info');
					return;
				}

				var statusItem = procurementQuoteHeaderDataService.getValueByLookup('QuoteStatus', headerEntity.StatusFk);
				if (statusItem?.IsReadonly) {
					platformModalService.showMsgBox($translate.instant('procurement.quote.quoteStatusIsReadonly'), 'Info', 'ico-info');
					return true;
				}

				headerEntity.PrcHeaderId = reqHeaderEntity.PrcHeaderFk;
				procurementQuoteHeaderDataService.updateAndExecute(function () {
					var prcItemImportOptionsService = $injector.get('prcCommonItemImportOptionsService');
					var config = {};
					if (statusItem?.IsProtected) {
						config.IsProtected = true;
					}
					var quoteHeader = procurementQuoteHeaderDataService.getSelected();
					if (quoteHeader && procurementQuoteRequisitionDataService.itemList.length > 1) {
						config.isShowReqSelection = true;
					}

					var options = prcItemImportOptionsService.getImportOptions(moduleName, config);
					options.ExcelProfileContexts = ['MatBidder'];
					options.preprocessor = addPreProcessor(options);

					var prcHeaderFk = reqHeaderEntity ? reqHeaderEntity.PrcHeaderFk : null;
					options.ImportDescriptor.CustomSettings = {
						PrcHeaderFk: prcHeaderFk,
						IsImportPriceAfterTax: options.isOverGross ? options.isOverGross : false,
						BpdVatGroupFk: reqHeaderEntity.BpdVatGroupFk,
						HeaderTaxCodeFk: reqHeaderEntity.TaxCodeFk
					};
					basicsImportService.showImportDialog(options);
				});
			};

			service.qtoItemExcelExport = function qtoItemExcelExport(wizardParameter) {
				procurementQuoteHeaderDataService.updateAndExecute(function () {
					let headerEntity = procurementQuoteRequisitionDataService.getSelected();
					if (!headerEntity) {
						return;
					}
					let options = prcCommonItemExportOptionsService.getExportOptions(procurementQuoteRequisitionDataService);
					options.MainContainer.GridId = '274da208b3da47988366d48f38707de1';
					options.MainContainer.uuid = '274da208b3da47988366d48f38707de1';
					options.MainContainer.id = 'procurement.quote.item.grid';
					options.wizardParameter = wizardParameter;
					options.uiStandardServiceName = 'procurementCommonItemUIStandardService';
					basicsExportService.showExportDialog(options);
				});
			};

			function addPreProcessor(importOptions) {
				return function () {
					var s = procurementQuoteHeaderDataService.getSelected();
					if (s) {
						if (procurementQuoteRequisitionDataService.itemList.length === 1) {
							_.forEach(procurementQuoteRequisitionDataService.itemList, function (item) {
								item.IsSelected = true;
							});
						} else {
							_.forEach(procurementQuoteRequisitionDataService.itemList, function (item) {
								var readonlystatus = procurementQuoteRequisitionDataService.getEditorMode() === 0;
								item.IsSelected = readonlystatus;
								platformRuntimeDataService.readonly(item, [{
									field: 'IsSelected',
									readonly: readonlystatus
								}]);
							});
						}
						importOptions.ImportDescriptor.CustomSettings.GridData = procurementQuoteRequisitionDataService.itemList;
						importOptions.ImportDescriptor.CustomSettings.Quote = s.Code;
						return true;
					} else {
						return {cancel: true, msg: $translate.instant('procurement.quote.importQuote.mustSelectQuote')};
					}
				};
			}

			// update Estimate
			service.updateEstimate = function updateEstimate() {

				var header = procurementQuoteHeaderDataService.getSelected();
				if (!header || header.Id <= 0) {
					platformModalService.showMsgBox($translate.instant('procurement.quote.selectedQuote'), $translate.instant('procurement.package.updateEstimate'));
					return;
				}

				$injector.get('prcCommonUpdateEstimatePrcStructureDataSerivce').setProcurementMainData(header.Id, null, 'quote');

				let requestData = {
					headerId: header.Id,
					sourceType: 'quote',
					qtnHeaderIds:null
				};

				$http.post(globals.webApiBaseUrl + 'procurement/common/option/getIsHasPrcItemAndPrcBoq', requestData).then(function (response) {
					let prcCommonUpdateEstimateService = $injector.get('prcCommonUpdateEstimateService');
					prcCommonUpdateEstimateService.setIsHasPrcItem(response.data.isHasPrcItem);
					prcCommonUpdateEstimateService.setIsHasPrcBoq(response.data.isHasPrcBoq);

					platformModalService.showDialog({
						headerTextKey: 'procurement.package.updateEstimate',
						templateUrl: globals.appBaseUrl + 'procurement.common/templates/update-estimate-dialog.html',
						controller: 'procurementQuoteUpdateEstimateWizardController',
						resizeable: true,
						width: '700px'
					});
				});
			};

			// update package
			service.updatePackage = function updatePackage() {
				var reqRequisitions = procurementQuoteRequisitionDataService.getList();
				var reqHeaderIds = _.map(reqRequisitions, 'ReqHeaderFk');
				var headerItem = procurementQuoteRequisitionDataService.getSelected();
				var modalOptions = {
					headerTextKey: 'procurement.quote.wizard.update.package.title',
					actionButtonText: $translate.instant('cloud.common.ok'),
					cancelButtonText: $translate.instant('cloud.common.cancel'),
					showOkButton: true,
					showCancelButton: true,
					templateUrl: globals.appBaseUrl + 'procurement.quote/partials/quote-update-package.html',
					model: {
						updatePackage: 1
					}
				};

				if (headerItem) {
					platformModalService.showDialog(modalOptions).then(function (result) {
						if (result > 0) {
							var qtnHeaderFk = headerItem.QtnHeaderFk;
							var projectFk = headerItem.ProjectFk;
							$http.post(globals.webApiBaseUrl + 'procurement/quote/header/updatePackage', {UpdateType: result, ProjectFk: projectFk, QtnHeaderFk: qtnHeaderFk, ReqHeaderIds: reqHeaderIds})
								.then(function (response) {
									if (response.data) {
										platformModalService.showMsgBox('procurement.quote.wizard.update.package.dialog.updatePackageSucceed', 'procurement.quote.wizard.update.package.dialog.title', 'info');
									} else {
										platformModalService.showMsgBox('procurement.quote.wizard.update.package.dialog.updatePackageFailed', 'procurement.quote.wizard.update.package.dialog.title', 'info');
									}
								});
						}
					});
				}
			};

			service.gaebImport = function gaebImport(wizardParameter) {
				procurementQuoteHeaderDataService.updateAndExecute(function () {
					var prcBoqMainService = $injector.get('prcBoqMainService');
					prcBoqMainService = prcBoqMainService.getService(procurementQuoteHeaderDataService);
					var options = {};
					options.boqMainService = prcBoqMainService;
					options.wizardParameter = wizardParameter;

					var result = boqMainGaebImportService.showImportDialog(options);
					if (result) {
						procurementQuoteTotalDataService.isTotalDirtyChange();
					}
				});
			};

			service.createAndImportBoqs = function gaebImport(wizardParameter) {

				procurementQuoteHeaderDataService.updateAndExecute(function () {

					var prcBoqMainService = $injector.get('prcBoqMainService');
					var boqMainService = prcBoqMainService.getService(procurementQuoteHeaderDataService);
					var prcBoqService = procurementCommonPrcBoqService.getService(procurementQuoteHeaderDataService, boqMainService);

					var selectedHeader = procurementQuoteHeaderDataService.getSelected();
					if (selectedHeader) {
						var options = {};
						options.boqRootItem = null; // will be created by boqMainGaebImportService
						options.projectId = procurementQuoteHeaderDataService.ProjectFk;
						options.boqMainService = null;
						options.mainService = procurementQuoteHeaderDataService;
						options.createItemService = prcBoqService;
						options.wizardParameter = wizardParameter;
						boqMainGaebImportService.showImportMultipleFilesDialog(options);
					}
				});
			};

			service.gaebExport = function gaebExport(wizardParameter) {
				procurementQuoteHeaderDataService.updateAndExecute(function () {

					var prcBoqMainService = $injector.get('prcBoqMainService');
					prcBoqMainService = prcBoqMainService.getService(procurementQuoteHeaderDataService);
					var options = {};
					options.boqMainService = prcBoqMainService;
					options.wizardParameter = wizardParameter;
					boqMainGaebExportService.appendBidderInfo(options, procurementQuoteHeaderDataService);
					boqMainGaebExportService.showDialog(options);
				});
			};

			service.importOenOnlv = function importOenOnlv() {
				procurementQuoteHeaderDataService.updateAndExecute(function () {
					boqMainWizardService.importOenOnlv($injector.get('prcBoqMainService').getService(procurementQuoteHeaderDataService));
				});
			};

			service.exportOenOnlv = function exportOenOnlv() {
				procurementQuoteHeaderDataService.updateAndExecute(function () {
					boqMainWizardService.exportOenOnlv($injector.get('prcBoqMainService').getService(procurementQuoteHeaderDataService));
				});
			};

			service.importCrbSia = function importCrbSia() {
				procurementQuoteHeaderDataService.updateAndExecute(function () {
					boqMainWizardService.importCrbSia($injector.get('prcBoqMainService').getService(procurementQuoteHeaderDataService));
				});
			};

			service.exportCrbSia = function exportCrbSia() {
				procurementQuoteHeaderDataService.updateAndExecute(function () {
					boqMainWizardService.exportCrbSia($injector.get('prcBoqMainService').getService(procurementQuoteHeaderDataService));
				});
			};

			service.splitBoqDiscount = function splitBoqDiscount() {
				var quoteHeader = procurementQuoteHeaderDataService.getSelected();

				if (quoteHeader) {
					var quoteStatus = procurementQuoteHeaderDataService.getValueByLookup('QuoteStatus', quoteHeader.StatusFk);
					if (quoteStatus?.IsReadonly) {
						platformDialogService.showInfoBox('procurement.quote.quoteStatusIsReadonly');
						return true;
					}
				}

				procurementQuoteHeaderDataService.updateAndExecute(function () {
					boqMainWizardService.splitDiscount($injector.get('prcBoqMainService').getService(procurementQuoteHeaderDataService));
				});
			};

			service.BoqExcelExport = function BoqExcelExport(wizardParameter) {
				procurementQuoteHeaderDataService.updateAndExecute(function () {
					var boqMainService = $injector.get('prcBoqMainService');
					boqMainService = boqMainService.getService(procurementQuoteHeaderDataService);
					var options = boqMainExportOptionsService.getExportOptions(boqMainService);
					options.MainContainer.Id = 'procurement.quote.boqStructure';
					options.wizardParameter = wizardParameter;
					basicsExportService.showExportDialog(options);
				});
			};

			service.BoqExcelImport = function BoqExcelImport(wizardParameter) {
				procurementQuoteHeaderDataService.updateAndExecute(function () {
					var boqMainService = $injector.get('prcBoqMainService');
					boqMainService = boqMainService.getService(procurementQuoteHeaderDataService);
					var options = boqMainImportOptionsService.getImportOptions(boqMainService);
					boqMainImportOptionsService.setRibExcelMappingNames(options.ImportDescriptor.Fields);
					options.wizardParameter = wizardParameter;
					basicsImportService.showImportDialog(options);
				});
			};

			service.selectGroups = function selectGroups() {
				procurementQuoteHeaderDataService.updateAndExecute(function() {
					boqMainWizardService.selectGroups($injector.get('prcBoqMainService').getService(procurementQuoteHeaderDataService));
				});
			};

			service.selectPrcItemGroups = function selectPrcItemGroups() {
				var itemService = $injector.get('procurementCommonPrcItemDataService');
				var requisitionService = $injector.get('procurementQuoteRequisitionDataService');
				var commonPrcItemService = itemService.getService(requisitionService);
				procurementCommonSelectAlternateGroupService.showSelectAlternateGroupWizardDialog(commonPrcItemService);
			};

			service.scanBoq = function scanBoq() {
				procurementQuoteHeaderDataService.updateAndExecute(function () {
					var prcBoqMainService = $injector.get('prcBoqMainService');
					prcBoqMainService = prcBoqMainService.getService(procurementQuoteHeaderDataService);
					var params = {};
					params.ContinueButton = false;
					boqMainValidationService.scanBoqAndShowResult(prcBoqMainService.getRootBoqItem(), 'x84', params);
				});
			};

			service.updateBoq = function updateBoq() {
				var selectedHeader = procurementQuoteHeaderDataService.getSelected();
				if (selectedHeader) {
					procurementQuoteHeaderDataService.updateAndExecute(function () {
						var headerData = {
							Module: 'procurement.quote',
							HeaderId: selectedHeader.Id,
							ExchangeRate: selectedHeader.ExchangeRate
						};
						var projectId = selectedHeader.ProjectFk;
						boqMainWizardService.updateBoq($injector.get('prcBoqMainService').getService(procurementQuoteHeaderDataService), projectId, procurementQuoteHeaderDataService, headerData);
					});
				}
			};

			// change status of boq (in procurement quote module)
			function changeBoqHeaderStatus() {
				var prcBoqMainService = $injector.get('prcBoqMainService');
				// By masking the following getService calls into this function contruct we delay calling the getService functions
				// which makes sure the underlying mainService information is set into the so called moduleContext.
				var getMyPrcBoqMainService = function () {
					return prcBoqMainService.getService(procurementQuoteHeaderDataService);
				};
				var getPrcBoqService = function () {
					return procurementCommonPrcBoqService.getService(procurementQuoteHeaderDataService, getMyPrcBoqMainService());
				};
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						statusName: 'boq',
						mainService: procurementQuoteHeaderDataService,
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

			service.removeItemQuantityValidation = removeItemQuantityValidation;

			service.validateAndUpdateItemQuantity = validateAndUpdateItemQuantity;

			var wizardConfig = {
				showImages: true,
				showTitles: true,
				showSelected: true,
				cssClass: 'sidebarWizard',
				items: [
					{
						id: 1,
						text: 'Quote - GroupName',
						text$tr$: 'procurement.quote.wizard.header',
						groupIconClass: 'sidebar-icons ico-wiz-change-status',
						visible: true,
						subitems: [
							changeQuoteStatus(),
							changeStatusForProjectDocument(),
							{
								id: 12,
								text: 'Increase Version',
								text$tr$: 'procurement.quote.wizard.increase.version',
								type: 'item',
								showItem: true,
								fn: service.increaseVersion
							},
							{
								id: 13,
								text: 'Create Contract',
								text$tr$: 'procurement.quote.wizard.create.contract.title',
								type: 'item',
								showItem: true,
								fn: service.createContract
							}
						]
					},
					{
						id: 2,
						text: 'BoQ Wizard',
						text$tr$: 'procurement.common.wizard.boq.wizard',
						groupIconClass: 'sidebar-icons ico-wiz-gaeb-ex',
						subitems: [
							{
								id: 21,
								text: 'GAEB-Import',
								text$tr$: 'procurement.common.wizard.gaeb.import',
								type: 'item',
								showItem: true,
								fn: service.gaebImport
							}
						]
					},
					{
						id: 3,
						text: 'Certificates Wizard',
						text$tr$: 'businesspartner.certificate.wizard.certificateWizard.wizardCaption',
						groupIconClass: 'sidebar-icons ico-wiz-change-status',
						visible: false,
						subitems: [
							{
								id: 31,
								text: 'Create Requests',
								text$tr$: 'businesspartner.certificate.wizard.certificateWizard.caption',
								type: 'item',
								showItem: true,
								fn: service.createRequests
							}
						]
					}
				]
			};

			service.activate = function activate() {
				platformSidebarWizardConfigService.activateConfig(wizardID, wizardConfig);
			};

			service.deactivate = function deactivate() {
				platformSidebarWizardConfigService.deactivateConfig(wizardID);
			};
			// add by jack
			service.createQuoteByMaterials = function CreateQuoteByMaterials() {

				$injector.get('procurementQuoteHeaderDataService').createItem(null, null, null, true);
			};
			// loads or updates translated strings
			var loadTranslations = function () {
				// load translation ids and convert result to object
				platformTranslateService.translateObject(wizardConfig, ['text']);
			};

			// register translation changed event
			platformTranslateService.translationChanged.register(loadTranslations);

			// register a module - translation table will be reloaded if module isn't available yet
			if (!platformTranslateService.registerModule(moduleName)) {
				// if translation is already available, call loadTranslation directly
				loadTranslations();
			}

			service.copyNewBoqItem = function () {
				return procurementQuoteHeaderDataService.updateAndExecute(function () {
					const parentItem = procurementQuoteHeaderDataService.getSelected();
					return service.doCopyNewBoqItem({
						Id: parentItem.Id,
						RfqHeaderFk: parentItem.RfqHeaderFk,
						IsIdealBidder: parentItem.IsIdealBidder
					}).then(result => {
						if (result?.copied) {
							quoteCopyNewBoqItemWizardService.loadHeader();
						}
						return result;
					});
				});
			};

			service.doCopyNewBoqItem = function (copyOptions) {
				const titleMessage = 'procurement.quote.wizard.copyNewBoqItem.copyNewBoqItemTitle';
				const iconClass = 'info';

				if (!copyOptions.Id) {
					return platformModalService.showMsgBox('procurement.quote.wizard.copyNewBoqItem.selectOneQuoteFirst', titleMessage, iconClass); // todo livia bug_88936;
				}
				if (copyOptions.IsIdealBidder === true) {
					return platformModalService.showMsgBox('procurement.quote.wizard.copyNewBoqItem.IdealQuoteNotCopy', titleMessage, iconClass);
				}
				return $http.post(globals.webApiBaseUrl + 'procurement/quote/header/wizard/copynewboqitem/getnewboqitem', {
					RfqHeaderFk: copyOptions.RfqHeaderFk,// it exists in quoteHeader
					QtnHeaderFk: copyOptions.Id
				}).then(function (response) {
					if (!response?.data?.length) {
						return platformModalService.showMsgBox('procurement.quote.wizard.copyNewBoqItem.noBoqItemNeedToCopy', titleMessage, iconClass);
					}
					return platformModalService.showDialog({
						headerTextKey: $translate.instant(''),
						width: 880,
						resizeable: true,
						windowClass: 'form-modal-dialog',
						templateUrl: globals.appBaseUrl + 'procurement.quote/partials/quote-copy-new-boq-item-wizard.html',
						copyOptions: copyOptions,
						gridDatas: response.data
					});
				});
			};

			service.copyMaterialItem = function (){
				return procurementQuoteHeaderDataService.updateAndExecute(function () {
					const parentItem = procurementQuoteHeaderDataService.getSelected();
					return service.doCopyMaterialItem({
						RfqHeaderFk: parentItem.RfqHeaderFk
					}).then(result => {
						if (result?.copied) {
							quoteCopyMaterialNewItemWizardService.loadHeader();
						}
						return result;
					});
				});
			};

			service.doCopyMaterialItem = function (copyOptions) { // Copy New Material Item
				const titleMessage = 'procurement.quote.wizard.copyNewMaterialItem.title';

				if (!copyOptions.RfqHeaderFk) {
					return platformModalService.showMsgBox('procurement.quote.wizard.copyNewBoqItem.selectOneQuoteFirst', titleMessage, 'info');
				}

				return $http.post(globals.webApiBaseUrl + 'procurement/quote/header/wizard/copynewmaterialitem/getnewmaterialitem', {
					RfqHeaderFk: copyOptions.RfqHeaderFk// it exists in quoteHeader
				}).then(function (response) {
					if (!response?.data?.length) {
						return platformModalService.showMsgBox('procurement.quote.wizard.copyNewMaterialItem.noItemNeedToCopy', titleMessage, 'info');
					}

					return platformModalService.showDialog({
						headerTextKey: $translate.instant(''),
						width: 880,
						resizeable: true,
						windowClass: 'form-modal-dialog',
						templateUrl: globals.appBaseUrl + 'procurement.quote/partials/quote-copy-new-material-item-wizard.html',
						copyOptions: copyOptions,
						gridDatas: response.data
					});
				});
			};

			service.updateItemPrice = function () {
				procurementCommonUpdateItemPriceService.showUpdateItemPriceWizardDialog(procurementQuoteHeaderDataService);
			};

			service.updateBoqPriceFromWic = function () {
				var updatePriceService = $injector.get('procurementQuoteUpdateBoqPriceFromWicWizard');
				procurementQuoteHeaderDataService.updateAndExecute(updatePriceService.updateBoqPriceFromWicWizard);
			};

			service.createWicFromBoq = function copyBoqItemToWIC() {

				var qtnHeader = procurementQuoteHeaderDataService.getSelected();
				if (!qtnHeader) {

					platformModalService.showMsgBox('procurement.common.wizard.errorNoSelectOneQuote', 'cloud.common.informationDialogHeader', 'info');
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
					QtnHeaderFk: qtnHeader.Id,
					CurrencyFk: qtnHeader.CurrencyFk,
					headerText: $translate.instant('procurement.common.createWicFromBoqWizardTitle')
				});
			};

			service.updatePackageBoq = function updatePackageBoq() {
				procurementCommonUpdatePackageBoqService.showUpdatePackageBoqWizardDialog(procurementQuoteHeaderDataService);
			};

			service.splitOverallDiscount = function splitOverallDiscount() {
				var splitOverallDiscountUrl = globals.webApiBaseUrl + 'procurement/quote/header/splitoveralldiscount';
				prcCommonSplitOverallDiscountService.splitOverallDiscount(procurementQuoteHeaderDataService, splitOverallDiscountUrl);
			};

			service.changeProcurementConfiguration = function () {
				let parentValidationService = $injector.get('procurementQuoteHeaderValidationService');
				changeConfigurationService.execute(procurementQuoteHeaderDataService, parentValidationService);
			};

			service.createContact = createContact;

			function createContact() {
				let qtnHeader = procurementQuoteHeaderDataService.getSelected();
				if (!qtnHeader) {
					platformModalService.showMsgBox('procurement.common.wizard.errorNoSelectOneQuote', 'procurement.quote.wizard.createContact.title', 'info');
					return;
				}

				$http.post(globals.webApiBaseUrl + 'businesspartner/contact/createcontact', {
					mainItemId: qtnHeader.BusinessPartnerFk
				}).then(function (response) {
					if (!response?.data) {
						platformModalService.showMsgBox('procurement.quote.wizard.createContact.failToCreateContact', 'procurement.quote.wizard.createContact.title', 'error');
						return;
					}
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'procurement.quote/partials/create-contact-wizard.html',
						width: '700px',
						resizeable: true,
						newContact: response.data
					}).then(function (response) {
						if (!response?.data) {
							return;
						}
						let newContact = response.data;
						basicsLookupdataLookupDescriptorService.addData('contact', [newContact]);
						let prcContactServiceFactory = $injector.get('procurementCommonContactDataService');
						let dataService = prcContactServiceFactory.getService(procurementContextService.getMainService());
						let prcContactValidationServiceFactory = $injector.get('procurementCommonContactValidationService');
						let prcContactValidationService = prcContactValidationServiceFactory(dataService);
						dataService.createItem().then(function (newData) {
							newData.BpdContactFk = newContact.Id;
							prcContactValidationService.validateEntity(newData);
						});
					});
				}, function () {

				});
			}
			service.materialItem = ()=>{
				procurementCommonDisableEnabledService.execute();
			}

			return service;

		}
	]);
})(angular);
