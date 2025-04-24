(function (angular) {
	'use strict';

	let moduleName = 'businesspartner.main';

	/* jshint -W072 */
	angular.module(moduleName).factory('businesspartnerMainWizardService',
		['$http', '$translate', '$timeout', '$state', '$injector', '_',
			'platformSidebarWizardConfigService',
			'platformTranslateService', 'platformModalService', 'cloudDesktopSidebarService', 'basicsCommonChangeStatusService',
			'businesspartnerMainHeaderDataService', 'platformRuntimeDataService', 'businessPartnerCertificateRequiredCreateService',
			'businesspartnerCertificateCertificateContainerServiceFactory', 'businesspartnerMainTranslationService',
			'platformSidebarWizardCommonTasksService', 'businesspartnerMainSupplierDataService', 'businesspartnerMainCustomerDataService',
			'businesspartnerMainBeserveService', 'documentProjectDocumentsStatusChangeService',
			'basicsCharacteristicBulkEditorService',
			'businesspartnerContactPortalUserManagementService', 'businessPartnerMainContactUIStandardService', 'businesspartnerMainContactDataService', 'procurementContextService',
			'businesspartnerMainBankDataService', 'platformContextService', 'basicsLookupdataLookupDescriptorService',
			'commonBusinessPartnerEvaluationServiceCache', 'businesspartnerMainSubsidiaryDataService', 'globals',
			'basicsCommonAddressGeoLocationConvertService',
			'basicsCommonChangeCodeService',
			function ($http, $translate, $timeout, $state, $injector, _,
				platformSidebarWizardConfigService,
				platformTranslateService, platformModalService, cloudDesktopSidebarService, basicsCommonChangeStatusService,
				businesspartnerMainHeaderDataService, platformRuntimeDataService, requriedCertificatesCreateService,
				businesspartnerCertificateCertificateContainerServiceFactory, businesspartnerMainTranslationService,
				platformSidebarWizardCommonTasksService, businesspartnerMainSupplierDataService, businesspartnerMainCustomerDataService,
				businesspartnerMainBeserveService, documentProjectDocumentsStatusChangeService,
				basicsCharacteristicBulkEditorService,
				businesspartnerContactPortalUserManagementService, businessPartnerMainContactUIStandardService, businesspartnerMainContactDataService, moduleContext,
				businesspartnerMainBankDataService, platformContextService, LookupDescriptorService,
				evaluationServiceCache, businesspartnerMainSubsidiaryDataService, globals,
				basicsCommonAddressGeoLocationConvertService,
				basicsCommonChangeCodeService) {

				let service = {};

				let certificateDataService = businesspartnerCertificateCertificateContainerServiceFactory.getDataService('businesspartner.main', businesspartnerMainHeaderDataService);

				// let wizardID = 'businesspartnerMainWizards';
				function disableContactRecord() {
					return platformSidebarWizardCommonTasksService.provideDisableInstance(businesspartnerMainContactDataService, 'Disable Record',
						'cloud.common.disableRecord', 'FirstName', 'businesspartner.contact.disableDone', 'businesspartner.contact.alreadyDisabled',
						'firstName');
				}

				function disableRecord() {
					return platformSidebarWizardCommonTasksService.provideDisableInstance(businesspartnerMainHeaderDataService, 'Disable Record', 'cloud.common.disableRecord', 'Code',
						'businesspartner.main.disableDone', 'businesspartner.main.alreadyDisabled', 'code', 11);
				}

				function enableRecord() {
					return platformSidebarWizardCommonTasksService.provideEnableInstance(businesspartnerMainHeaderDataService, 'Enable Record', 'cloud.common.enableRecord', 'Code',
						'businesspartner.main.enableDone', 'businesspartner.main.alreadyEnabled', 'code', 12);
				}

				function changeBusinessPartnerStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							projectField: '',
							statusName: 'businesspartner',
							mainService: businesspartnerMainHeaderDataService,
							guid: '882FA2CD388A48A6959A57EFA46BF0D8',
							statusField: 'BusinessPartnerStatusFk',
							codeField: 'BusinessPartnerName1',
							descField: 'BusinessPartnerName2',
							title: 'businesspartner.main.statusTitle',
							updateUrl: 'businesspartner/main/businesspartnermain/changestatus',
							id: 13
						}
					);
				}

				function changeBusinessPartnerStatus2() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							projectField: 'ProjectFk',
							statusName: 'businesspartner2',
							mainService: businesspartnerMainHeaderDataService,
							guid: 'E223080E105242DAA26AC5D82F74EC51',
							statusField: 'BusinessPartnerStatus2Fk',
							codeField: 'BusinessPartnerName1',
							descField: 'BusinessPartnerName2',
							title: 'businesspartner.main.status2Title',
							updateUrl: 'businesspartner/main/businesspartnermain/change2status',
							id: 14
						}
					);
				}

				function changeSubsidiaryStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							checkAccessRight: true,
							/* isSimpleStatus: true, */
							projectField: 'ProjectFk',
							statusName: 'subsidiary',
							mainService: businesspartnerMainHeaderDataService,
							dataService: businesspartnerMainSubsidiaryDataService,
							guid: 'e90013d33ed04a1a8c3d904f1a78a1c4',
							statusField: 'SubsidiaryStatusFk',
							// codeField: 'BusinessPartnerName1',
							// descField: 'BusinessPartnerName2',
							title: 'businesspartner.main.subsidiaryStatusTitle',
							updateUrl: 'businesspartner/main/businesspartnermain/changesubsidiarystatus',
							id: 19

						}
					);
				}

				function changeEvaluationStatus() {
					let businessPartnerBusinessPartnerEvaluation = evaluationServiceCache.getService(evaluationServiceCache.serviceTypes.EVALUATION_DATA, '953895e120714ab4b6d7283c2fc50e14');
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							// isSimpleStatus: true,
							projectField: 'ProjectFk',
							statusName: 'evaluation',// 'EvaluationStatus',
							guid: '68ea49dabf0940308445a6e61b00dd2b',
							mainService: businesspartnerMainHeaderDataService,
							dataService: businessPartnerBusinessPartnerEvaluation,
							statusField: 'EvalStatusFk',
							// pKey1Field: 'PId',
							// codeField: 'BusinessPartnerName1',
							// descField: 'BusinessPartnerName2',
							title: 'businesspartner.main.evaluationStatusTitle',
							updateUrl: 'businesspartner/main/businesspartnermain/changeevaluationstatus',
							id: 18,
							handleSuccess: function (result) {
								if (result.changed) {
									businessPartnerBusinessPartnerEvaluation.clearContent();
									businessPartnerBusinessPartnerEvaluation.refresh();
								}
							}
						}
					);
				}

				function changeSupplierStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							projectField: 'ProjectFk',
							statusName: 'supplier',
							guid: '7BC7BEA27BAC4CD7AFE34B0225815820',
							validateCanChangeStatus: true,
							mainService: businesspartnerMainHeaderDataService,
							dataService: businesspartnerMainSupplierDataService,
							statusField: 'SupplierStatusFk',
							title: 'businesspartner.main.supplierStatusTitle',
							updateUrl: 'businesspartner/main/businesspartnermain/changesupplierstatus',
							id: 15,
							handleSuccess: function (result) {
								if (result.changed) {
									let oldEntity = businesspartnerMainSupplierDataService.getItemById(result.entity.Id);
									if (oldEntity) {
										// SubledgerContextFk is not the own column to the table supplier.
										let SubledgerContextFk = oldEntity.SubledgerContextFk;
										angular.extend(oldEntity, result.entity);
										oldEntity.SubledgerContextFk = SubledgerContextFk;
										businesspartnerMainSupplierDataService.gridRefresh();
									}
								}
							}
						}
					);
				}

				function changeCustomerStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							projectField: 'ProjectFk',
							statusName: 'customer',
							guid: '630721CEFE87445D997B70BF88141489',
							validateCanChangeStatus: true,
							mainService: businesspartnerMainHeaderDataService,
							dataService: businesspartnerMainCustomerDataService,
							statusField: 'CustomerStatusFk',
							title: 'businesspartner.main.customerStatusTitle',
							updateUrl: 'businesspartner/main/businesspartnermain/changecustomerstatus',
							id: 16,
							handleSuccess: function (result) {
								if (result.changed) {
									let oldEntity = businesspartnerMainCustomerDataService.getItemById(result.entity.Id);
									if (oldEntity) {
										let subledgerContextFk = oldEntity.SubledgerContextFk;
										angular.extend(oldEntity, result.entity);
										oldEntity.SubledgerContextFk = subledgerContextFk;
										businesspartnerMainCustomerDataService.gridRefresh();
									}
								}
							}
						}
					);
				}

				function changeCertificateStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							projectField: 'ProjectFk',
							statusName: 'certificate',
							guid: '538325604B524F328FDF436FB14F1FC8',
							mainService: businesspartnerMainHeaderDataService,
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
									let item = result.entity;
									let oldEntity = certificateDataService.getItemById(item.Id);
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

				function changeStatusForProjectDocument() {
					return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(businesspartnerMainHeaderDataService, 'businesspartner.main');
				}

				function changeBpdBankStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							// projectField: 'ProjectFk',
							statusName: 'bpdbank',
							guid: '8c8066ad189742d8b5cd1f65f1891615',
							mainService: businesspartnerMainHeaderDataService,
							dataService: businesspartnerMainBankDataService,
							statusField: 'BpdBankStatusFk',
							title: 'businesspartner.main.changeBankStatusTitle',
							updateUrl: 'businesspartner/main/businesspartnermain/changebanktatus',
							id: 15,
							handleSuccess: function (result) {
								if (result.changed) {
									let oldEntity = businesspartnerMainBankDataService.getItemById(result.entity.Id);
									if (oldEntity) {
										angular.extend(oldEntity, result.entity);
										let currencyCompanyId = platformContextService.clientId;
										let status = LookupDescriptorService.getLookupItem('bpdbankstatus', oldEntity.BpdBankStatusFk);
										let isReadOnly = false;
										if (!!oldEntity.CompanyFk && oldEntity.CompanyFk !== currencyCompanyId || (!!status && status.IsReadonly)) {
											isReadOnly = true;
										}
										businesspartnerMainBankDataService.setReadonly([oldEntity], isReadOnly);
										businesspartnerMainBankDataService.gridRefresh();
									}
								}
							}
						}
					);
				}
				service.disableContactRecord = disableContactRecord().fn;
				service.changeSubsidiaryStatus = changeSubsidiaryStatus().fn;

				service.disableRecord = disableRecord().fn;

				service.enableRecord = enableRecord().fn;

				service.changeBusinessPartnerStatus = changeBusinessPartnerStatus().fn;

				service.changeBusinessPartnerStatus2 = changeBusinessPartnerStatus2().fn;

				service.changeEvaluationStatus = changeEvaluationStatus().fn;

				service.changeSupplierStatus = changeSupplierStatus().fn;

				service.changeCustomerStatus = changeCustomerStatus().fn;

				service.changeCertificateStatus = changeCertificateStatus().fn;

				service.changeStatusForProjectDocument = changeStatusForProjectDocument().fn;

				service.changeBpdBankStatus = changeBpdBankStatus().fn;

				service.createRequests = function createRequests() {
					let selectedItem = businesspartnerMainHeaderDataService.getSelected();
					if (!selectedItem) {
						platformModalService.showMsgBox($translate.instant('businesspartner.main.businessPartnerMustSelect'), 'Warning', 'warning');
						return;
					}
					businesspartnerMainHeaderDataService.updateAndExecute(function () {
						platformModalService.showDialog({
							currentItem: businesspartnerMainHeaderDataService.getSelected(),
							templateUrl: globals.appBaseUrl + 'businesspartner.certificate/partials/required-certificates-create-wizard.html',
							backdrop: false,
							showCancelButton: true,
							showOkButton: true,
							dataProcessor: requriedCertificatesCreateService.updateCertificatesByBusinessPartner,
							formRows: [
								{
									'label$tr$': 'cloud.common.entityBusinessPartner',
									'model': 'dataItem.Id',
									'readonly': true,
									'type': 'directive',
									'directive': 'business-partner-main-business-partner-dialog'
								}]
						}).then(function () {
							certificateDataService.callRefresh();
						});
					});
				};

				service.importBusinessPartner = function importBusinessPartner() {
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'businesspartner.main/templates/import-business-partner.html',
						backdrop: false
					}).then(function () {
					});
				};

				service.importBusinessPartnerContacts = function importBusinessPartnerContacts() {
					let currentItem = businesspartnerMainHeaderDataService.getSelected();
					if (!currentItem) {
						platformModalService.showMsgBox('businesspartner.main.importContact.mustSelectBp',
							'businesspartner.main.importContact.title', 'ico-info');
						return;
					}

					platformModalService.showDialog({
						currentItem: businesspartnerMainHeaderDataService.getSelected(),
						templateUrl: globals.appBaseUrl + 'businesspartner.main/templates/import-business-partner-contact.html',
						backdrop: false
					}).then(function () {
					});
				};

				service.setCharacteristics = function setCharacteristics(userParams, wizardParams) {
					wizardParams = wizardParams || {};
					wizardParams.parentService = businesspartnerMainHeaderDataService;
					wizardParams.sectionId = 2;
					wizardParams.moduleName = moduleName;
					basicsCharacteristicBulkEditorService.showEditor(userParams, wizardParams);
				};

				service.synContacts2ExService = function synContacts2ExService() {
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'businesspartner.main/templates/synchronize-contacts2-exchange-server.html',
						backdrop: false,
						resizeable: true
						/* showCancelButton: true,
						showOkButton: true, */
					}).then(function () {

					});
				};

				service.reactivateOrInactivatePortalUser = reactivateOrInactivatePortalUser;
				service.maintainingOrphanedPortalRequest = maintainingOrphanedPortalRequest;

				service.convertAddressGeoCoordinate = function () {
					let selectedBps = businesspartnerMainHeaderDataService.getSelectedEntities();

					if (!selectedBps || selectedBps.length < 1) {
						return platformModalService.showMsgBox('businesspartner.main.importContact.mustSelectBp',
							'basics.common.geographicLocationInfo.title', 'ico-info');
					}

					let ids = _.map(selectedBps, 'Id');

					businesspartnerMainHeaderDataService.getBusinessPartnerAddresses(ids)
						.then(function (bpAddresses) {
							basicsCommonAddressGeoLocationConvertService.showDialog({
								custom: {
									data: bpAddresses,
									additionalColumns: [
										{
											id: 'bpname',
											field: 'bpName',
											name: 'BP Name',
											name$tr$: 'businesspartner.main.name1',
											formatter: 'description',
											width: 120
										},
										{
											id: 'subsidiary',
											field: 'subsidiaryDescription',
											name: 'Subsidiary Description',
											name$tr$: 'cloud.common.entitySubsidiaryDescription',
											formatter: 'description',
											width: 120
										}
									]
								},
								okCallback: function () {
									businesspartnerMainHeaderDataService.refresh();
								}
							});
						});
				};

				service.checkVatNo = checkVatNo;
				service.changeBpCode=changeBpCode;
				service.udpatePrcStructureFromQtnAndContract = udpatePrcStructureFromQtnAndContract;
				service.changeCustomerCode = changeCustomerCode().fn;
				service.changeSupplierCode = changeSupplierCode().fn;
				return service;

				// /////////////
				function reactivateOrInactivatePortalUser() {
					businesspartnerContactPortalUserManagementService
						.reactivateOrInactivatePortalUser(businesspartnerMainContactDataService, businessPartnerMainContactUIStandardService)
						.then(function (run) {
							if (run) {
								platformModalService.showMsgBox('businesspartner.contact.reOrInactivatePortalUserSucInfo', 'cloud.common.informationDialogHeader', 'ico-info');
								businesspartnerMainContactDataService.loadSubItemsList();
							}
						});
				}

				function maintainingOrphanedPortalRequest() {
					businesspartnerContactPortalUserManagementService.maintainingOrphanedPortalRequest();
				}

				function checkVatNo() {
					let currentItem = businesspartnerMainHeaderDataService.getSelected();
					if (currentItem) {
						$http.get(globals.webApiBaseUrl + 'businesspartner/main/businesspartnermain/checkbpvatno?vatNo=' + (currentItem.VatNo || ''))
							.then(function (response) {
								if (!response?.data) {
									platformModalService.showMsgBox('businesspartner.main.checkVatWizard.unknownIssue', 'businesspartner.main.checkVatWizard.title', 'ico-info');
								}
								let result = response.data;
								platformModalService.showMsgBox(result.Response || '', 'businesspartner.main.checkVatWizard.title', 'ico-info');
							})
							.catch(_.noop);
					}
				}
				function changeBpCode() {
					let currentItem = businesspartnerMainHeaderDataService.getSelected();
					// judge is had rubic CATEGORY?
					if (!currentItem.RubricCategoryFk/* ===undefined||currentItem.RubricCategoryFk===null||currentItem.RubricCategoryFk===0 */)
					{
						platformModalService.showMsgBox('businesspartner.main.changeBpCode.noRubricCategory', 'businesspartner.main.changeBpCode.title', 'ico-warning');
						return;
					}
					// can not use in create data
					if (currentItem.Version===0)
					{
						platformModalService.showMsgBox('businesspartner.main.changeBpCode.zeroVersion', 'businesspartner.main.changeBpCode.title', 'ico-warning');
						return;
					}
					if (currentItem) {
						$http.post(globals.webApiBaseUrl + 'businesspartner/main/businesspartnermain/generatebpcode',currentItem)
							.then(function (response) {
								if (!response?.data) {
									platformModalService.showMsgBox('businesspartner.main.changeBpCode.unknownIssue', 'businesspartner.main.changeBpCode.title', 'ico-warning');
									return;
								}
								// let result = response.data;
								// eslint-disable-next-line no-unused-vars
								platformModalService.showMsgBox('businesspartner.main.changeBpCode.successChange', 'businesspartner.main.changeBpCode.title', 'ico-info')
									.then(function () {
										businesspartnerMainHeaderDataService.refreshSelectedEntities();});
								/* return; */
							})
							.catch(_.noop);
					}
				}

				function udpatePrcStructureFromQtnAndContract() {
					let selectedItems = businesspartnerMainSubsidiaryDataService.getSelectedEntities();
					if (!angular.isArray(selectedItems) || selectedItems.length === 0) {
						platformModalService.showMsgBox('businesspartner.main.updatePrcStructureWizard.error.selectOneBp', 'businesspartner.main.updatePrcStructureWizard.title', 'ico-info');
						return;
					}

					let modalOptions = {
						subpIds: _.map(selectedItems, 'Id'),
						headerTextKey: 'businesspartner.main.updatePrcStructureWizard.title',
						templateUrl: 'businesspartner.main/partials/update-prc-structure-from-quote-and-contract-dialog.html',
						width: '800px'
					};
					platformModalService.showDialog(modalOptions);
				}

				function changeCustomerCode() {
					let changeInstance = basicsCommonChangeCodeService.provideCodeChangeInstance({
						mainService: businesspartnerMainHeaderDataService,
						executionService: businesspartnerMainCustomerDataService,
						validationService: 'businesspartnerMainCustomerValidationService',
						title: 'businesspartner.main.changeCode.customerTitle'
					});

					let originalFunc = changeInstance.fn;

					return {
						fn: function () {
							let currentItem = businesspartnerMainCustomerDataService.getSelected();
							if (!currentItem) {
								platformModalService.showMsgBox('businesspartner.main.changeCode.selectAtLeastOneCustomer', 'businesspartner.main.changeCode.customerTitle', 'ico-warning');
								return;
							}
							businesspartnerMainHeaderDataService.update()
								.then(function () {
									if (!businesspartnerMainCustomerDataService.isItemEditable4WizardChangeCode(currentItem)) {
										return;
									}
									originalFunc();
								})
								.catch(_.noop);
						}
					};
				}

				function changeSupplierCode() {
					let changeInstance = basicsCommonChangeCodeService.provideCodeChangeInstance({
						mainService: businesspartnerMainHeaderDataService,
						executionService: businesspartnerMainSupplierDataService,
						validationService: 'businesspartnerMainSupplierValidationService',
						title: 'businesspartner.main.changeCode.supplierTitle'
					});

					let originalFunc = changeInstance.fn;

					return {
						fn: function () {
							let currentItem = businesspartnerMainSupplierDataService.getSelected();
							if (!currentItem) {
								platformModalService.showMsgBox('businesspartner.main.changeCode.selectAtLeastOneSupplier', 'businesspartner.main.changeCode.supplierTitle', 'ico-warning');
								return;
							}
							businesspartnerMainHeaderDataService.update()
								.then(function () {
									if (!businesspartnerMainSupplierDataService.isItemEditable4WizardChangeCode(currentItem)) {
										return;
									}
									originalFunc();
								})
								.catch(_.noop);
						}
					};
				}
			}]);
})(angular);