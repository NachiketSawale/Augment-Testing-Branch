/**
 * Created by wuj on 11/23/2015.
 */
// jshint -W072
// jshint +W098
// eslint-disable-next-line no-redeclare
/* global angular,globals,_ */

angular.module('procurement.invoice').factory('procurementInvoiceWizardsService',
	['$q', '$translate', 'platformSidebarWizardConfigService', '$injector', 'platformTranslateService', 'cloudDesktopSidebarService',
		'procurementInvoiceHeaderDataService', 'platformModalService', 'basicsCommonChangeStatusService',
		'businessPartnerCertificateRequiredCreateService', 'documentProjectDocumentsStatusChangeService', 'procurementInvoiceWizardImportService',
		'$http', 'basicsCommonChangeCodeService','procurementInvoiceValidationDataService', 'platformDialogService', 'platformLongTextDialogService', 'businesspartnerCertificateCertificateContainerServiceFactory', 'procurementInvoiceTranslationService', 'basicsLookupdataLookupDescriptorService', 'platformDialogService',
		function ($q, $translate, platformSidebarWizardConfigService, $injector, platformTranslateService, cloudDesktopSidebarService,
			headerDataService, platformModalService, changeStatusService,
			requiredCertificatesCreateService, documentProjectDocumentsStatusChangeService, procurementInvoiceWizardImportService,
			$http, basicsCommonChangeCodeService, invoiceValidationDataService, platformDialogService, platformLongTextDialogService, businesspartnerCertificateCertificateContainerServiceFactory, procurementInvoiceTranslationService, basicsLookupdataLookupDescriptorService, dialogService) {
			'use strict';

			var service = {};
			var wizardID = 'procurementInvoiceSidebarWizards';

			function changeInvoiceStatus() {
				return changeStatusService.provideStatusChangeInstance(
					{
						mainService: headerDataService,
						statusField: 'InvStatusFk',
						projectField: 'ProjectFk',
						title: 'procurement.invoice.wizard.change.status.headerText',
						statusName: 'invoice',
						updateUrl: 'procurement/invoice/header/changestatus',
						id: 11
					}
				);
			}

			function changeInvoiceCode(){
				return basicsCommonChangeCodeService.provideCodeChangeInstance({
					mainService:headerDataService,
					validationService:'invoiceHeaderElementValidationService',
					title: 'procurement.invoice.wizard.change.code.headerText'
				});
			}

			function documentProjectDocumentsStatusChange() {
				return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(headerDataService, 'procurement.invoice');
			}

			function businessPartnerEvaluation() {
				return $injector.get('commonBusinessPartnerEvaluationScreenModalService').getWizards(function (/* businessPartnerEvaluationService */) {
					var defer = $q.defer();
					var header = headerDataService.getSelected();
					if (header && (header.BusinessPartnerFk || header.BusinessPartnerFk === 0)) {
						$injector.get('basicsLookupdataLookupDataService').getItemByKey('conheader', header.ConHeaderFk).then(function (con) {
							$injector.get('basicsLookupdataLookupDataService').getSearchList('quote', 'Code="' + (con && con.CodeQuotation) + '"').then(function (qtns) {
								defer.resolve({
									create: {
										businessPartnerId: header.BusinessPartnerFk,
										evaluationMotiveId: 4,
										projectFk: header.ProjectFk,
										qtnHeaderFk: qtns && qtns.items && qtns.items[0] && qtns.items[0].Id,
										conHeaderFk: header.ConHeaderFk,
										invHeaderFk: header.Id,
										canSave: true,
										saveImmediately: true,
										saveCallbackFun: function () {
										}
									}
								});
							});
						});
						return defer.promise;
					}
				}, '91825912027045fdbfb1eb6701be16b2', 'businessPartnerEvaluationAdaptorService');
			}

			var certificateContainerServiceFactory = null;
			service.createRequests = function createRequests() {
				var invoice = headerDataService.getSelected();
				if (!invoice || !invoice.Id) {
					return;
				}
				headerDataService.updateAndExecute(function () {
					platformModalService.showDialog({
						currentItem: invoice,
						templateUrl: globals.appBaseUrl + 'businesspartner.certificate/partials/required-certificates-create-wizard.html',
						backdrop: false,
						showCancelButton: true,
						showOkButton: true,
						dataProcessor: requiredCertificatesCreateService.updateCertificatesByInvoice,
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
						if (!certificateContainerServiceFactory) {
							certificateContainerServiceFactory = businesspartnerCertificateCertificateContainerServiceFactory.getContainerService('procurement.invoice', headerDataService, procurementInvoiceTranslationService);
						}
						certificateContainerServiceFactory.data.callRefresh();
					});
				});
			};

			service.importInvoice = function importInvoice(param) {
				var workflowParam = param || {TemplateId: null, Context: ''};
				headerDataService.updateAndExecute(function () {
					procurementInvoiceWizardImportService.execute(workflowParam);
				});
			};

			service.importXInvoice = function importXInvoice() {
				var fileElement;

				function startImport(file) {
					var fileReader = new FileReader();
					fileReader.onload = function(e) {
						var request = { FileName: file.name, FileContent: { Content: e.target.result.split(',')[1] } };
						return $http.post(globals.webApiBaseUrl + 'procurement/invoice/importxinvoice', request)
							.then(function(response) {
								if (response.data) {
									if (response.data.InvHeader) {
										headerDataService.refresh();

										var infoText = response.data.InvHeader.Code + ', ' + $translate.instant('procurement.invoice.wizard.invoice.import.xInvoiceImportSucceeded');
										if (response.data.Warnings && response.data.Warnings.length) {
											platformLongTextDialogService.showDialog(
												{
													headerText: infoText,
													codeMode: true,
													hidePager: true,
													dataSource: new function() {
														platformLongTextDialogService.LongTextDataSource.call(this);
														this.current = response.data.Warnings.join('\n');
													}
												});
										}
										else {
											platformDialogService.showDialog({ headerText$tr$:'cloud.common.infoBoxHeader', iconClass:'info', showOkButton:true, bodyText:infoText });
										}
									}
									else if (response.data.ErrorMessage) {
										platformDialogService.showErrorBox(response.data.ErrorMessage, 'cloud.common.errorMessage');
									}
									else if (response.data.ErrorLogPath) {
										window.open(response.data.ErrorLogPath);
									}
								}
							});
					};
					fileReader.readAsDataURL(file);
				}

				headerDataService.updateAndExecute(function() {
					fileElement = angular.element('<input type="file"/>');
					fileElement.attr('accept', '.xml');
					fileElement.change(function() {
						startImport(this.files[0]);
					});
					fileElement.click();
				});
			};

			service.changeProcurementConfiguration = function changeProcurementConfiguration() {
				headerDataService.updateAndExecute(function () {
					var strTitle = '';
					var strBody = '';
					var invoice = headerDataService.getSelected();
					if (!invoice || !invoice.Id) {
						strTitle = 'procurement.invoice.errorTip.noRecordSelectedTitle';
						strBody = 'procurement.invoice.errorTip.noRecordSelectedBody';
						dialogService.showMsgBox(strBody, strTitle, 'info');
					} else {
						var statusFk = invoice.InvStatusFk;
						$http.get(globals.webApiBaseUrl + 'procurement/invoice/status/isStatusReadonly?invStatusId=' + statusFk).then(
							function (response) {
								var isReadOnly = response.data;
								var invStatusEditRight = basicsLookupdataLookupDescriptorService.getData('InvStatusEditRight');
								var statusWithEditRight = true;
								if (invStatusEditRight) {
									statusWithEditRight = _.find(invStatusEditRight, {Id: statusFk});
								}
								if (
									isReadOnly === true &&
									statusWithEditRight &&
									!statusWithEditRight.HasFrmAccessRightDescriptor
								) {
									strTitle = 'procurement.invoice.errorTip.recordIsReadOnlyTitle';
									strBody = 'procurement.invoice.errorTip.recordIsReadOnlyBody';
									dialogService.showMsgBox(strBody, strTitle, 'info');
								}
								else if (!statusWithEditRight) {
									strTitle = 'procurement.invoice.errorTip.recordIsNoAccessTitle';
									strBody = 'procurement.invoice.errorTip.noAccessChangeConfiguration';
									dialogService.showMsgBox(strBody, strTitle, 'info');
								} else {
									platformModalService.showDialog({
										currentItem: angular.copy(invoice),
										currentInvoice:invoice,
										templateUrl: globals.appBaseUrl + 'procurement.invoice/templates/change-procurement-configuration.html'
									});
								}
							}
						);
					}
				}
				);
			};

			function makeTransactionDialog() {
				var state = {
					loadingInfo: 'Generating Transaction',
					isLoading: true
				};

				var myDialogOptions = {
					templateUrl: globals.appBaseUrl + 'procurement.invoice/templates/transaction-dialog.html',
					controller: ['$scope',
						function ($scope) {
							$scope.state = state;
						}
					]
				};

				platformDialogService.showDialog(myDialogOptions);

				return state;
			}

			service.prepareTransaction = function () {
				var invoice = headerDataService.getSelected();

				if (!invoice || !invoice.Id) {
					showMsgBox('selectedOne', null, 'selected');
					return;
				}

				var invoices = headerDataService.getSelectedEntities();
				var invoiceIds = invoices.map(function (item) {
					return item.Id;
				});

				var state = makeTransactionDialog();

				headerDataService.updateAndExecute(function () {
					$http.post(globals.webApiBaseUrl + 'procurement/invoice/transaction/prepare', {
						MainItemIds: invoiceIds
					}).then(function () {
						headerDataService.refreshSelectedEntities();
					}).finally(function () {
						state.isLoading = false;
						state.loadingInfo = 'Finish Generating Transaction';
					});
				});
			};

			service.prepareTransactionForAll = function () {
				var invoice = headerDataService.getList();
				if (!invoice || invoice.length <= 0) {
					showMsgBox('noRecord');
					return;
				}
				var searchFilter = cloudDesktopSidebarService.getFilterRequestParams();

				var state = makeTransactionDialog();

				headerDataService.updateAndExecute(function () {
					$http.post(globals.webApiBaseUrl + 'procurement/invoice/transaction/prepareforall', searchFilter).then(function (res) {
						if (!angular.isUndefined(res.data) && res.data.length > 0) {
							showMsgBox('taskWait');
							invoiceValidationDataService.addJob(res.data);
							invoiceValidationDataService.updateAll();
						} else {
							showMsgBox('taskFail', res.data);
						}

					}).finally(function () {
						state.isLoading = false;
						state.loadingInfo = 'Finish Generating Transaction';
					});
				});
			};

			service.createAccrualTransaction=function(){
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'procurement.invoice/templates/create-accrual-transaction-dialog.html',
					controller: 'procurementInvoiceCreateAccrualTransactionController'
				});
			};

			service.createInterCompanyBill = function () {
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'procurement.common/templates/wizard/create-inter-company-dialog.html',
					controller: 'procurementInvoiceCreateInterCompanyBillController',
					width: '900px',
					resizeable: true
				});
			};

			service.forwardPeriousTotals = function () {
				var invoice = headerDataService.getSelected();

				if (!invoice || !invoice.Id) {
					showMsgBox('selectedOne', null, 'selected');
					return;
				}
				headerDataService.updateAndExecute(function () {
					$http.get(globals.webApiBaseUrl + 'procurement/invoice/header/forwardperioustotals?mainItemId=' + invoice.Id).then(function () {
						headerDataService.currentSelectItem = invoice;
						headerDataService.refreshView();
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


				dialogService.showMsgBox(strBody, strTitle, 'info');
			}

			service.changeInvoiceStatus = changeInvoiceStatus().fn;
			service.changeInvoiceCode=changeInvoiceCode().fn;
			service.documentProjectDocumentsStatusChange = documentProjectDocumentsStatusChange().fn;
			service.businessPartnerEvaluation = businessPartnerEvaluation().fn;

			var wizardConfig = {
				showImages: true,
				showTitles: true,
				showSelected: true,
				items: [
					{
						id: 1,
						text: 'Change Status Wizard',
						text$tr$: 'procurement.common.wizard.change.status.wizard',
						groupIconClass: 'sidebar-icons ico-wiz-change-status',
						visible: true,
						subitems: [
							changeInvoiceStatus(),
							documentProjectDocumentsStatusChange()
						]
					}, {
						id: 2,
						text: 'Certificate Create Wizard',
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
						text: 'Businesspartner Evaluation',
						text$tr$: 'businesspartner.evaluation.configDialog',
						groupIconClass: 'tlb-icons ico-rec-new',
						visible: false,
						subitems: [
							businessPartnerEvaluation()
						]
					},
					{
						id: 4,
						text: 'Invoice Import Wizard',
						text$tr$: 'procurement.invoice.wizard.invoice.import.headerText',
						groupIconClass: 'sidebar-icons ico-wiz-change-status',
						visible: false,
						subitems: [
							{
								id: 41,
								text: 'Invoice Import',
								text$tr$: 'procurement.invoice.wizard.invoice.import.itemText',
								type: 'item',
								showItem: true,
								fn: service.importInvoice
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

			// loads or updates translated strings
			var loadTranslations = function () {
				// load translation ids and convert result to object
				platformTranslateService.translateObject(wizardConfig, ['text']);
			};

			// register translation changed event
			platformTranslateService.translationChanged.register(loadTranslations);


			// register a module - translation table will be reloaded if module isn't available yet  //todo:delete unnecessary procurement.package
			if (!platformTranslateService.registerModule(['businesspartner.certificate', 'procurement.invoice', 'procurement.common', 'procurement.package'])) {
				// if translation is already available, call loadTranslation directly
				loadTranslations();
			}

			return service;

			// loadTranslations();

		}]);

