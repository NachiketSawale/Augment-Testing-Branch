(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	/* jshint -W072 */
	/* global moment */
	angular.module('procurement.pes').factory('procurementPesWizardService',
		['platformTranslateService',
			'platformSidebarWizardConfigService',
			'$translate',
			'$injector',
			'$http',
			'$q',
			'globals',
			'cloudDesktopSidebarService',
			'platformSidebarWizardCommonTasksService',
			'platformModalService',
			'basicsCommonChangeStatusService',
			'procurementPesHeaderService',
			'platformStatusIconService',
			'procurementPesItemService',
			'documentProjectDocumentsStatusChangeService',
			'platformModalFormConfigService',
			'boqMainSplitUrbService',
			'prcBoqMainService',
			'procurementContextService',
			'procurementPesWizardCreateCOContractForNewService',
			'procurementPesBoqService',
			'procurementPesSelfbillingDataService',
			'procurementPesPlantQuantityWizardService',
			'procurementInvoiceNumberGenerationSettingsService',
			'basicsCommonChangeCodeService',
			'ProcurementCommonChangeConfigurationService',
			'boqMainExportOptionsService',
			'boqMainImportOptionsService',
			'basicsExportService',
			'basicsImportService',
			'platformModuleNavigationService',
			'_',
			'platformDialogService',
			'contractHeaderPurchaseOrdersDataService',
			'basicsLookupdataLookupDescriptorService',
			'itemImportOptionsService',
			'basicsWorkflowWizardContextService',
			'procurementItemProjectChangeService',
			function (platformTranslateService,
				platformSidebarWizardConfigService,
				$translate,
				$injector,
				$http,
				$q,
				globals,
				cloudDesktopSidebarService,
				platformSidebarWizardCommonTasksService,
				platformModalService,
				basicsCommonChangeStatusService,
				procurementPesHeaderService,
				platformStatusIconService,
				procurementPesItemService,
				documentProjectDocumentsStatusChangeService,
				platformModalFormConfigService,
				boqMainSplitUrbService,
				prcBoqMainService,
				procurementContextService,
				procurementPesWizardCreateCOContractForNewService,
				procurementPesBoqService,
				procurementPesSelfbillingDataService,
				procurementPesPlantQuantityWizardService,
				procurementInvoiceNumberGenerationSettingsService,
				basicsCommonChangeCodeService,
				ProcurementCommonChangeConfigurationService,
				boqMainExportOptionsService,
				boqMainImportOptionsService,
				basicsExportService,
				basicsImportService,
				platformModuleNavigationService,
				_,
				platformDialogService,
				contractHeaderPurchaseOrdersDataService,
				basicsLookupdataLookupDescriptorService,
				itemImportOptionsService,
				basicsWorkflowWizardContextService,
				procurementItemProjectChangeService) {

				var service = {};

				var wizardID = 'procurementPesSidebarWizards';
				let confirmUpdateContractItemTaxCodeDialogId = $injector.get('platformCreateUuid')();

				// set context values
				procurementContextService.setLeadingService(procurementPesHeaderService);
				procurementContextService.setMainService(procurementPesBoqService);

				function changePesStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							projectField: 'ProjectFk',
							mainService: procurementPesHeaderService,
							statusField: 'PesStatusFk',
							title: 'procurement.pes.wizard.change.statusTitle',
							statusName: 'pes',
							updateUrl: 'procurement/pes/wizard/changestatus',
							id: 11,
							handleSuccess: function (result) {
								// check if the status change has to trigger an quantity transfer to plantManagement
								if (result.changed === true) {
									var pesHeader = procurementPesHeaderService.getItemById(result.entity.Id);
									if (pesHeader && pesHeader.Id) {
										$http.post(globals.webApiBaseUrl + 'procurement/pes/header/getPesItemsForPlantTransfer', {LastHeaderId: pesHeader.Id}).then(function (result) {
											if (result.data && !_.isEmpty(result.data)) {
												// show plant wizard
												procurementPesPlantQuantityWizardService.updatePlantQuantity(result.data);
											}
										});
									}
									// refresh the entity to show updated status
									var updatedPesHeader = result.entity;
									pesHeader.PesStatusFk = updatedPesHeader.PesStatusFk;
									procurementPesHeaderService.setSelected({}).then(function () {
										procurementPesHeaderService.setSelected(pesHeader);
										procurementPesHeaderService.refreshSelectedEntities();
									});
								}
							}
						}
					);
				}

				function updateQuantity() {
					var selectedItem = procurementPesHeaderService.getSelected(),
						title = 'procurement.pes.wizard.updatePesIQ',
						msg = $translate.instant('procurement.pes.wizard.noCurrentSelection');

					if (platformSidebarWizardCommonTasksService.assertSelection(selectedItem, title, msg)) {
						var pesQtyUpdateConfig = {
							title: $translate.instant(title),
							dataItem: {
								IsSchedule: true
							},
							formConfiguration: {
								fid: 'procurement.pes.wizard.updatePesIQ',
								version: '0.1.1',
								showGrouping: false,
								groups: [
									{
										gid: 'baseGroup',
										attributes: ['schedule', 'updateLineItem']
									}
								],
								'overloads': {},
								rows: [
									{
										gid: 'baseGroup',
										rid: 'Schedule',
										label$tr$: 'procurement.pes.wizard.schedule',
										type: 'boolean',
										model: 'IsSchedule',
										sortOrder: 1
									},
									{
										gid: 'baseGroup',
										rid: 'updateLineItem',
										label$tr$: 'procurement.pes.wizard.updateLineItem',
										type: 'boolean',
										model: 'IsUpdateLineItem',
										sortOrder: 2
									}
								]
							},
							handleOK: function handleOK(result) {
								if (result && result.ok && result.data) {
									var selectedHeader = procurementPesHeaderService.getSelected();
									var pesHeaders = procurementPesHeaderService.getSelectedEntities();
									var postData = {
										'PesHeaderIds': pesHeaders ? _.map(pesHeaders, 'Id') : [],
										'IsSchedule': result.data.IsSchedule,
										'IsUpdateLineItem': result.data.IsUpdateLineItem
									};
									$http.post(globals.webApiBaseUrl + 'procurement/common/prcitemassignment/updatepesestimatefromschedule', postData).then(function () {
										procurementPesHeaderService.refresh().then(function () {
											procurementPesHeaderService.setSelected({}).then(function () {
												procurementPesHeaderService.setSelected(selectedHeader);
												platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('procurement.pes.wizard.updatedQuantity');
											});
										});
									});
								}
							}
						};
						platformTranslateService.translateFormConfig(pesQtyUpdateConfig.formConfiguration);
						pesQtyUpdateConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
						platformModalFormConfigService.showDialog(pesQtyUpdateConfig);
					}
				}

				function changeStatusForProjectDocument() {
					return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(procurementPesHeaderService, 'procurement.pes');
				}

				function changePesCode() {
					return basicsCommonChangeCodeService.provideCodeChangeInstance({
						mainService: procurementPesHeaderService,
						validationService: 'procurementPesHeaderValidationService',
						title: 'procurement.pes.wizard.change.code.headerText'
					});
				}

				function changeSelfBillingStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							showIcon: true,
							mainService: procurementPesHeaderService,
							dataService: procurementPesSelfbillingDataService,
							statusField: 'SbhStatusFk',
							title: 'procurement.pes.wizard.selfBilling.changeSelfBillingStatus',
							updateUrl: 'procurement/pes/wizard/changeselfbillingstatus',
							statusName: 'SbhStatus',
							handleSuccess: function (result) {
								if (result.changed) {
									var oldEntity = procurementPesSelfbillingDataService.getItemById(result.entity.Id);
									if (oldEntity) {
										_.each(procurementPesSelfbillingDataService.getDataProcessor(), function (processor) {
											processor.processItem(result.entity);
										});
										angular.extend(oldEntity, result.entity);
										procurementPesSelfbillingDataService.setSelected({}).then(function () {
											procurementPesSelfbillingDataService.setSelected(oldEntity);
											procurementPesSelfbillingDataService.gridRefresh();
										});
									}
								}
							}
						}
					);
				}

				function changeProjectChangeStatus() {
					let procurementPesEnhanceBoqMainService = $injector.get('procurementPesEnhanceBoqMainService');
					prcBoqMainService = prcBoqMainService.getService(procurementContextService.getMainService(), procurementPesEnhanceBoqMainService);
					return $injector.get('boqMainWizardService').changeProjectChangeStatus(procurementPesHeaderService, prcBoqMainService);
				}

				function changeItemProjectChangeStatus() {
					var prcItemPrjChangeService = procurementItemProjectChangeService.getService(procurementPesHeaderService, procurementPesItemService);
					return prcItemPrjChangeService.changeProjectChangeStatus('pesitemprojectchange');
				}
				service.changeProjectChangeStatus = changeProjectChangeStatus().fn;

				service.changeItemProjectChangeStatus = changeItemProjectChangeStatus().fn;

				service.changePesStatus = changePesStatus().fn;

				service.changeStatusForProjectDocument = changeStatusForProjectDocument().fn;

				service.changeSelfBillingStatus = changeSelfBillingStatus().fn;

				service.changePesCode = changePesCode().fn;

				service.pesItemExcelImport = function pesItemExcelImport() {
					var headerEntity = procurementPesHeaderService.getSelected();
					if (!headerEntity) {
						platformModalService.showMsgBox($translate.instant('procurement.pes.wizard.noCurrentSelection'), 'Info', 'ico-info');
						return;
					}
					var options = itemImportOptionsService.getImportOptions();
					options.ImportDescriptor.MainId = headerEntity.Id;
					basicsImportService.showImportDialog(options);
				};

				service.editItemPrice = function editItemPrice() {
					var items = procurementPesItemService.getSelectedEntities();
					if (items && items.length) {
						_.forEach(items, function (item) {
							procurementPesItemService.priceReadOnly(item, false);
							item.enableEditPrice = true;
						});
					}
					platformModalService.showMsgBox('procurement.pes.wizard.alreadyEditItemPrice', 'procurement.pes.wizard.editItemPrice', 'ico-info');
				};

				service.createTransaction = function () {
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'procurement.pes/templates/create-accrual-transaction-dialog.html',
						controller: 'procurementPesCreateAccrualTransactionController'
					});
				};

				service.splitUrbItems = function splitUrbItems() {

					procurementPesHeaderService.updateAndExecute(function () {
						var boqHeaderService = $injector.get('procurementPesBoqService');
						var boqStructureService = prcBoqMainService.getService(procurementContextService.getMainService());
						var params = {};
						params.boqHeaderService = boqHeaderService;
						params.boqStructureService = boqStructureService;
						boqMainSplitUrbService.showDialog(params);
					});
				};

				// change status of boq (in procurement contract module)
				function changeBoqHeaderStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							statusName: 'boq',
							mainService: procurementPesHeaderService,
							// prcBoqService returns a composite object, entity is { BoqHeader: {...} }
							getDataService: function () {
								return {
									getSelected: function () {
										return _.get(procurementPesBoqService.getSelected(), 'BoqHeader');
									},
									gridRefresh: function () {
										procurementPesBoqService.gridRefresh();
									},
									getSelectedEntities: function () {
										const list = procurementPesBoqService.getSelectedEntities();
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

				service.updateBoq = function updateBoq() {
					var selectedHeader = basicsWorkflowWizardContextService.getContext().entity;
					selectedHeader = selectedHeader ? selectedHeader : procurementPesHeaderService.getSelected();
					if (selectedHeader) {
						return procurementPesHeaderService.updateAndExecute(function () {
							var headerData = {
								Module: 'procurement.pes',
								HeaderId: selectedHeader.Id,
								ExchangeRate: selectedHeader.ExchangeRate
							};
							var projectId = selectedHeader.ProjectFk;
							return $injector.get('boqMainWizardService').updateBoq($injector.get('prcBoqMainService').getService(procurementPesHeaderService), projectId, procurementPesHeaderService, headerData);
						});
					}
				};

				service.boqExcelExport = function (wizardParameter) {
					procurementPesHeaderService.updateAndExecute(function () {
						var boqMainService = $injector.get('prcBoqMainService').getService(procurementPesHeaderService);
						var options = boqMainExportOptionsService.getExportOptions(boqMainService);
						options.MainContainer.Id = '7';
						options.wizardParameter = wizardParameter;
						basicsExportService.showExportDialog(options);
					});
				};

				service.boqExcelImport = function (wizardParameter) {
					procurementPesHeaderService.updateAndExecute(function () {
						var boqMainService = $injector.get('prcBoqMainService').getService(procurementPesHeaderService);
						var options = boqMainImportOptionsService.getImportOptions(boqMainService);
						options.wizardParameter = wizardParameter;
						basicsImportService.showImportDialog(options);
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
							text: 'Groupname',
							text$tr$: 'procurement.pes.wizard.header',
							groupIconClass: 'sidebar-icons ico-wiz-change-status',
							visible: true,
							subitems: [
								changePesStatus(),
								changeStatusForProjectDocument(),
								changeSelfBillingStatus(),
								{
									id: 12,
									text: 'Edit Item Price',
									text$tr$: 'procurement.pes.wizard.editItemPrice',
									type: 'item',
									showItem: true,
									fn: service.editItemPrice
								}
							]
						}
					]
				};

				service.updateQuantity = updateQuantity;

				service.active = function activate() {
					platformSidebarWizardConfigService.activateConfig(wizardID, wizards);
				};

				service.deactive = function deactivate() {
					platformSidebarWizardConfigService.deactivateConfig(wizardID);
				};
				// loads or updates translated strings
				var loadTranslations = function () {
					platformTranslateService.translateObject(wizards, ['text']);

				};

				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule('procurement.pes')) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				service.updateEstimate = function updateEstimate() {

					var selectedPes = procurementPesHeaderService.getSelected();
					if (!selectedPes || selectedPes.Id <= 0) {
						platformModalService.showMsgBox($translate.instant('procurement.pes.wizard.selectedPes'), $translate.instant('procurement.package.updateEstimate'));
						return;
					}

					$injector.get('prcCommonUpdateEstimatePrcStructureDataSerivce').setProcurementMainData(selectedPes.Id, null, 'pes');

					let requestData = {
						headerId: selectedPes.Id,
						sourceType: 'pes',
						qtnHeaderIds:null
					};

					$http.post(globals.webApiBaseUrl + 'procurement/common/option/getIsHasPrcItemAndPrcBoq', requestData).then(function (response) {
						let prcCommonUpdateEstimateService = $injector.get('prcCommonUpdateEstimateService');
						prcCommonUpdateEstimateService.setIsHasPrcItem(response.data.isHasPrcItem);
						prcCommonUpdateEstimateService.setIsHasPrcBoq(response.data.isHasPrcBoq);

						platformModalService.showDialog({
							headerTextKey: 'procurement.package.updateEstimate',
							templateUrl: globals.appBaseUrl + 'procurement.common/templates/update-estimate-dialog.html',
							controller: 'procurementPesUpdateEstimateWizardController',
							resizeable: true,
							width: '700px'
						});
					});
				};

				service.createChangeOrderContract = createChangeOrderContract;

				service.createInvoice = createInvoice;

				loadInvoiceNumberGeneration();
				service.updateTaxCode4Contract = updateTaxCode4Contract;
				service.createDeltaPes = createDeltaPes;
				service.generateTransactions = generateTransactions;
				service.changeProcurementConfiguration = changeProcurementConfiguration;
				service.goModule = goModule;

				return service;

				// ///////////////////////

				function createChangeOrderContract() {
					var selectedPes = basicsWorkflowWizardContextService.getContext().entity;
					selectedPes = selectedPes ? selectedPes : procurementPesHeaderService.getSelected();
					if (!selectedPes || !selectedPes.Id) {
						platformModalService.showMsgBox($translate.instant('procurement.pes.wizard.selectedPes'), $translate.instant('procurement.package.updateEstimate'));
						return;
					}

					// initialize some necessary translation first, to avoid active cell destroy
					// platformgrid.directive.js destroy()
					$injector.get('changeMainTranslationService');

					var isLinkFrameworkContract = false;
					var pesContractCode = '';

					return procurementPesWizardCreateCOContractForNewService.getChangeOrderContractsByPesId(selectedPes.Id)
						.then(function (response) {
							if (response.data.contract) {
								isLinkFrameworkContract = contractHeaderPurchaseOrdersDataService.isFrameworkByWicNMdcCatalog(response.data.contract);
								pesContractCode = response.data.contract.Code;
							}
							if (!response || !response.data || !response.data.changeHeader) {
								platformModalService.showMsgBox($translate.instant('procurement.pes.createCOContractWizard.noNewItemsFound'), $translate.instant('procurement.pes.createCOContractWizard.dialogTitle'));
								return null;
							} else {
								return response.data;
							}
						})
						.then(function (responseData) {
							if (!responseData) {
								return;
							}
							let headerText = isLinkFrameworkContract ? $translate.instant('procurement.pes.createCOContractWizard.dialogTitleForFWContract') : $translate.instant('procurement.pes.createCOContractWizard.dialogTitle');
							var controllerOptions = {
								pesHeaderId: selectedPes.Id,
								changeOrderContracts: responseData.changeOrderContracts,
								changeHeader: responseData.changeHeader,
								changeShowItems: responseData.changeShowItems,
								headerText: headerText,
								dataService: procurementPesHeaderService,
								isLinkFrameworkContract: isLinkFrameworkContract,
								pesContractCode: pesContractCode,
								withDefaultStatus: responseData.createCOContractWithDefaultStatus
							};
							var modalOptions = {
								templateUrl: globals.appBaseUrl + 'procurement.pes/partials/procurement-pes-wizard-create-co-contract-for-new-dialog.html',
								controller: 'procurementPesWizardCreateCOContractForNewDialogController',
								resizeable: true,
								width: '800px',
								resolve: {
									controllerOptions: function () {
										return controllerOptions;
									}
								}
							};

							return platformModalService.showDialog(modalOptions).then(function (result) {
								if (result) {
									if (result.isSuccess) {
										if (angular.isArray(result.newCOContracts)) {
											let contractCodes = [];
											let contractIds = [];
											_.forEach(result.newCOContracts, function (contract) {
												let display = contract.Code;
												// if (contract.Description) {
												// display += ' ' + contract.Description;
												// }
												contractCodes.push(display);
												contractIds.push(contract.Id);
											});
											var contractList = contractCodes.join(',');
											/* let modalOptions = {
												bodyTextKey: $translate.instant('procurement.pes.createCOContractWizard.createCOContractsSuccessful', {contracts: contractList}),
												headerTextKey: $translate.instant('procurement.pes.createCOContractWizard.dialogTitle'),
												windowClass: 'msgbox',
												defaultButton: 'ok',
												customButtons: [
													{
														id: 'goToContract',
														cssClass: 'navigator-button tlb-icons ico-goto',
														disabled: false,
														caption: '',
														autoClose: true,
														fn: function () {
															platformModuleNavigationService.navigate({
																moduleName: 'procurement.contract'
															}, contractIds, '');
														}
													}
												]
											}; */
											basicsWorkflowWizardContextService.setResult(contractIds);
											platformDialogService.showDialog({
												templateUrl: globals.appBaseUrl + 'procurement.pes/partials/procurement-pes-wizard-create-co-contract-dialog.html',
												width: '600px',
												resizeable: true,
												contractList: contractList,
												contractIds: contractIds,
												isLinkFrameworkContract: isLinkFrameworkContract
											});
											/* platformModalService.showDialog(modalOptions)
												.then(function () {
													procurementPesItemService.loadSubItemList();
													procurementPesBoqService.loadSubItemList();
											}); */
											procurementPesHeaderService.onUpdateNavigationItemNeeded.fire();
										} else {
											platformModalService.showMsgBox($translate.instant('procurement.pes.createCOContractWizard.failToCreate'), $translate.instant('procurement.pes.createCOContractWizard.dialogTitle'));
										}
									} else {
										platformModalService.showMsgBox($translate.instant('procurement.pes.createCOContractWizard.failToCreate'), $translate.instant('procurement.pes.createCOContractWizard.dialogTitle'));
									}
								}
							});
						});
				}

				function createInvoice() {
					var selectedPesEntities = procurementPesHeaderService.getSelectedEntities();
					if (selectedPesEntities.length === 0) {
						return;
					}
					var pesStatuses = basicsLookupdataLookupDescriptorService.getData('PesStatus');
					var pes = _.filter(selectedPesEntities, function (entity) {
						var pesStatus = pesStatuses[entity.PesStatusFk];
						return pesStatus ? (pesStatus.IsAccepted && !pesStatus.IsCanceled && !pesStatus.IsVirtual && !pesStatus.IsInvoiced) : false;
					});
					if (pes.length === 0) {
						platformModalService.showMsgBox('procurement.pes.wizard.createInvoiceStatusNotAllow', 'procurement.pes.wizard.createInvoiceFail', 'warning');
						return;
					}
					if (pes.length < selectedPesEntities.length) {
						platformModalService.showMsgBox('procurement.pes.wizard.createInvoiceStatusPassedAllow', 'procurement.pes.wizard.createInvoiceFail', 'warning').then(function () {
							createInv(pes);
						});
					} else {
						createInv(pes);
					}
				}

				function createInv(pes) {
					var pesIds = pes.map(function (o) {
						return o.Id;
					});

					let createInvData = {
						Pes: pes,
						PesIds: pesIds.join(','),
						ConHeaderFk: pes[0].ConHeaderFk,
						ProjectFk: pes.ProjectFk,
						InvoiceNo: '',
						InvoiceCode: '',
						DateInvoiced: moment(),
						InvoiceCodeReadonly: true
					};
					let pesConfigurationFks = _.map(pes, function(p) {
						return p.PrcConfigurationFk;
					});
					$q.all([
						$http.post(globals.webApiBaseUrl + 'procurement/invoice/header/getConifForCreateInvFromPes', pesConfigurationFks),
						basicsLookupdataLookupDescriptorService.loadData('InvType')]
					).then(
						function (response) {
							if (!_.isEmpty(response[0].data)) {
								createInvData.pesConfig2InvConfig = response[0].data;
								let invTypesGrp = _.groupBy(response[1], 'RubricCategoryFk');
								_.forEach(createInvData.pesConfig2InvConfig, function (c) {
									c.InvoiceCode = procurementInvoiceNumberGenerationSettingsService.provideNumberDefaultText(c.RubricCategoryFk
										, '');
									c.InvoiceCodeReadonly = procurementInvoiceNumberGenerationSettingsService.hasToGenerateForRubricCategory(c.RubricCategoryFk
									);
									c.InvTypeFk = null;
									let sameRbTypes = invTypesGrp[c.RubricCategoryFk];
									if (sameRbTypes && sameRbTypes.length) {
										let defaultType = _.find(sameRbTypes, {IsDefault: true});
										c.InvTypeFk = defaultType ? defaultType.Id : (_.orderBy(sameRbTypes, 'Id'))[0].Id;
									}
								});
								procurementPesHeaderService.updateAndExecute(function () {
									platformModalService.showDialog({
										currentItem: createInvData,
										templateUrl: globals.appBaseUrl + 'procurement.pes/partials/procurement-pes-wizard-create-invoice-dialog.html',
										backdrop: false,
										showCancelButton: true,
										showOkButton: true,
										width: '620px',
										dataProcessor: createInvoiceByPes
									}).then(function () {
									});
								});
							} else {
								platformModalService.showMsgBox('procurement.pes.wizard.createInvoiceMissConfiguration', 'procurement.pes.wizard.createInvoiceFail', 'warning');
							}
						});
				}

				function createInvoiceByPes(param) {
					var url = globals.webApiBaseUrl + 'procurement/invoice/header/createByPes';
					var params = {
						InvHeadersCreateFromPesParameter: param
					};
					return $http.post(url, params);
				}

				function loadInvoiceNumberGeneration() {
					procurementInvoiceNumberGenerationSettingsService.assertLoaded();
				}

				function updateTaxCode4Contract() {
					var selectedPes = procurementPesHeaderService.getSelected();
					if (!selectedPes) {
						platformModalService.showMsgBox('procurement.common.noSelectedPesHeader', 'procurement.common.updateTaxCodeOfContractItemTitle');
						return;
					}
					procurementPesHeaderService.update().then(function () {
						// generally, if pes items were from contract, then pesHeader.ConHeaderFk would have value(greater then zero)
						if (!selectedPes.ConHeaderFk || selectedPes.ConHeaderFk < 0) {
							platformModalService.showMsgBox('procurement.common.noContractItemFound', 'procurement.common.updateTaxCodeOfContractItemTitle', 'info');
							return;
						}
						procurementPesHeaderService.checkItemsBeforeUpdateTaxCode(selectedPes).then(function (res) {
							if (!res.data) {
								platformModalService.showMsgBox('procurement.common.noContractItemFound', 'procurement.common.updateTaxCodeOfContractItemTitle', 'info');
								return;
							}
							var modalOptions = {
								headerText: $translate.instant('procurement.common.updateTaxCodeOfContractItemTitle'),
								bodyText: $translate.instant('procurement.common.confirmUpdateContractItemTaxCode'),
								showYesButton: true, showNoButton: true,
								iconClass: 'ico-question',
								id: confirmUpdateContractItemTaxCodeDialogId,
								dontShowAgain: true
							};
							$injector.get('procurementContextService').showDialogAndAgain(modalOptions).then(function (result) {
								if (result && result.yes) {
									procurementPesHeaderService.updateTaxCodeOfContractItem(selectedPes).then(function () {

										platformModalService.showMsgBox('procurement.common.updateContractTaxCodeSuccessfully', 'procurement.common.updateTaxCodeOfContractItemTitle', 'info');
									});
								}
							});
						});
					});
				}

				function createDeltaPes() {

					var createDeltaPesWizardService = $injector.get('procurementPesCreateDeltaPesWizardService');

					createDeltaPesWizardService.executeWizard();
				}

				function generateTransactions() {
					var header = procurementPesHeaderService.getSelected();

					if (!header) {
						platformModalService.showMsgBox('procurement.common.noSelectedPesHeader', 'procurement.common.updateTaxCodeOfContractItemTitle');
					} else {
						$http.get(globals.webApiBaseUrl + 'procurement/pes/pestransaction/generate?mainItemId=' + header.Id).then(function (res) {
							if (res.data === 0) {
								platformModalService.showMsgBox('procurement.pes.noNewPesTransactionGenerated', 'cloud.common.informationDialogHeader', 'info');
							}

							$injector.get('procurementPesTransactionDataService').load();
						});
					}
				}

				function changeProcurementConfiguration() {
					var parentValidationService = $injector.get('procurementPesHeaderValidationService');
					ProcurementCommonChangeConfigurationService.execute(procurementPesHeaderService, parentValidationService);
				}

				function goModule(contractIds) {
					platformModuleNavigationService.navigate({
						moduleName: 'procurement.contract'
					}, contractIds, '');
				}
			}]);
})(angular);
