(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/** @namespace response.data.quoteHeaders */
	/* jshint -W072 */
	angular.module(moduleName).factory('procurementRfqWizardService',
		['$http', '$translate', '$timeout', '$state', '$injector', '_', 'platformTranslateService',
			'platformModalService',
			'cloudDesktopSidebarService',
			'platformObjectHelper',
			'procurementRfqMainService',
			'procurementRfqBusinessPartnerService',
			'basicsLookupdataLookupDescriptorService',
			'basicsCommonChangeStatusService',
			'procurementRfqBusinessPartnerWizardMainService',
			'procurementRfqEmailFaxWizardService',
			'procurementRfqGetBidderWizardService',
			'documentProjectDocumentsStatusChangeService',
			'platformRuntimeDataService',
			'platformSidebarWizardConfigService',
			'procurementTxInterfaceWizardService',
			'platformModuleStateService',
			'platformDataServiceModificationTrackingExtension',
			'ProcurementCommonChangeConfigurationService',
			'procurementCommonCreateBusinessPartnerService',
			'procurementRfqRequisitionService',
			'basicsCommonChangeCodeService',
			'platformDialogService',
			'platformModuleNavigationService',
			function ($http, $translate, $timeout, $state, $injector, _, platformTranslateService, platformModalService,
				cloudDesktopSidebarService,
				platformObjectHelper,
				procurementRfqMainService,
				procurementRfqBusinessPartnerService,
				lookupDescriptorService,
				basicsCommonChangeStatusService,
				procurementRfqBusinessPartnerWizardMainService,
				emailFaxWizardService,
				getBidderWizardService,
				documentProjectDocumentsStatusChangeService,
				platformRuntimeDataService,
				platformSidebarWizardConfigService,
				procurementTxInterfaceWizardService,
				platformModuleStateService,
				platformDataServiceModificationTrackingExtension,
				ProcurementCommonChangeConfigurationService,
				createBusinessPartnerService,
				rfqRequisitionService, basicsCommonChangeCodeService, platformDialogService,
				platformModuleNavigationService) {

				var service = {};

				var wizardID = 'procurementRfqSidebarWizards';

				var getDisplay = function (entity) {
					var items = lookupDescriptorService.getData('BusinessPartner');
					if (items && items[entity.BusinessPartnerFk]) {
						return items[entity.BusinessPartnerFk].BusinessPartnerName1;
					}
				};

				function changeRfqStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							id: 11,
							groupId: 1,
							projectField: 'ProjectFk',
							mainService: procurementRfqMainService,
							statusField: 'RfqStatusFk',
							title: 'procurement.rfq.wizard.change.status',
							statusName: 'rfq',
							updateUrl: 'procurement/rfq/wizard/changerfqstatus'
						}
					);
				}

				function changeRfqCode() {
					return basicsCommonChangeCodeService.provideCodeChangeInstance({
						mainService: procurementRfqMainService,
						validationService: 'procurementRfqHeaderValidationService',
						title: 'procurement.rfq.wizard.change.code.headerText'
					});
				}

				function changeBiddersStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							showIcon: false,
							// statusDisplayField: 'Description',
							// isSimpleStatus: true, // if it is true, it means it will do not do more things like status history and status wirkflow and so on.
							id: 12,
							groupId: 1,
							mainService: procurementRfqMainService,
							dataService: procurementRfqBusinessPartnerService,
							statusField: 'RfqBusinesspartnerStatusFk',
							title: 'procurement.rfq.wizard.change.bpstatus',
							// statusLookupType: 'RfqBusinessPartnerStatus',
							updateUrl: 'procurement/rfq/wizard/changebidderstatus',
							statusName: 'rfqbidder',
							denyRefresh: true,
							getDisplay: getDisplay,
							handleSuccess: function (result) {
								if (result.changed) {
									var oldEntity = procurementRfqBusinessPartnerService.getItemById(result.entity.Id);
									if (oldEntity) {
										angular.extend(oldEntity, result.entity);
										procurementRfqBusinessPartnerService.gridRefresh();
									}
								}
							}
						}
					);
				}

				function changeStatusForProjectDocument() {
					return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(procurementRfqMainService, 'procurement.rfq');
				}

				let isApprovedBP = false;   // default
				function checkApprovedBP() {
					if(!isApprovedBP){
						let systemOptionDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
						systemOptionDataService.getParameterValueAsync(10021).then(function (val) {
							isApprovedBP = (val === '1');
						});
					}
				}
				checkApprovedBP();


				service.changeBillingSchema = function changeBillingSchema() {
					// save rfq header before open wizard.
					procurementRfqMainService.updateAndExecute(function createQuoteWizard() {
						var mainItem = procurementRfqMainService.getSelected();
						var mainItemCopy = angular.copy(mainItem);
						if (mainItemCopy && Object.getOwnPropertyNames(mainItemCopy).length > 0) {
							var lookupOptions = {
								filterKey: 'prc-rfq-billing-schema-filter',
								showClearButton: true
							};
							var oldBillingSchemaId = mainItemCopy.BillingSchemaFk;
							platformModalService.showDialog({
								lookupOptions: lookupOptions,
								currentItem: mainItemCopy,
								headerTextKey: $translate.instant('procurement.rfq.wizard.changeBillingSchema'),
								bodyTemplateUrl: globals.appBaseUrl + 'procurement.rfq/partials/rfq-change-billing-schema-wizard.html',
								showCancelButton: true,
								showOkButton: true,
								iconClass: 'ico-info'
							}).then(function (dialogResult) {
								if (dialogResult.ok) {
									var quoteHeaderDataService = $injector.get('procurementQuoteHeaderDataService');
									var qtnBillingSchemaService = $injector.get('procurementQuoteBillingSchemaDataService');
									var selected = quoteHeaderDataService.getSelected();
									$http.get(globals.webApiBaseUrl + 'procurement/quote/header/changeBillingSchema', {
										params: {
											rfqHeaderId: mainItemCopy.Id,
											billingSchemaId: mainItemCopy.BillingSchemaFk || -1,
											selectedQtnId: selected ? selected.Id : -1
										}
									}).then(function (response) {

										angular.extend(mainItem, response.data.rfqHeader);
										// refresh RFQ
										procurementRfqMainService.gridRefresh();

										// check QTN cache List, whether existed qtnHeaders whose BillingSchema have changed.
										// if changed, update the field BillingSchemaFk
										if (response.data && response.data.quoteHeaders) {
											var list = quoteHeaderDataService.getList();
											_.forEach(response.data.quoteHeaders, function (header) {
												var qtnTemp = _.find(list, {Id: header.Id});
												if (qtnTemp) {
													angular.extend(qtnTemp, header);
												}
											});
											quoteHeaderDataService.gridRefresh();
										}

										// if the selected QTN is include in the changed BillingSchema qtnHeaders,
										// reload the BillingSchema container
										if (response.data && !!response.data.selectedQuote) {
											qtnBillingSchemaService.doReadData();
										}
									}, function () {
										mainItem.BillingSchemaFk = oldBillingSchemaId;
									});
								}
							});
						} else {
							return platformModalService.showDialog({
								headerTextKey: $translate.instant('procurement.rfq.wizard.create.quote.title'),
								bodyTextKey: $translate.instant('procurement.rfq.wizard.create.quote.selected'),
								iconClass: 'ico-info'
							});
						}
					});
				};

				service.changeRfqStatus = changeRfqStatus().fn;

				service.changeRfqCode = changeRfqCode().fn;

				service.changeBiddersStatus = changeBiddersStatus().fn;

				service.changeStatusForProjectDocument = changeStatusForProjectDocument().fn;

				service.enhanceBidderSearch = function findBidderConcise() {
					procurementRfqMainService.updateAndExecute(procurementRfqBusinessPartnerWizardMainService.execute);
				};

				service.findBidderFull = function findBidderFull() {
					const options = {
						isApprovedBP: isApprovedBP
					}
					procurementRfqMainService.updateAndExecute(function () {
						getBidderWizardService.showBizPartnerPortalDialog(options);
					});
				};

				service.sendEmail = function sendEmail(options) {
					procurementRfqMainService.updateAndExecute(function () {
						emailFaxWizardService.showEmailDialog(options);
					});
				};

				service.sendFax = function sendFax() {
					procurementRfqMainService.updateAndExecute(emailFaxWizardService.showFaxDialog);
				};

				service.quoteHeaderIds = null;

				service.createQuote = function createQuote() {
					// save rfq header before open wizard.
					procurementRfqMainService.updateAndExecute(function createQuoteWizard() {

						var mainItem = procurementRfqMainService.getSelected();
						if (mainItem && Object.getOwnPropertyNames(mainItem).length > 0) {
							$http.post(globals.webApiBaseUrl + 'procurement/rfq/header/cancreatequote', {Value: mainItem.Id}).then(function (response) {
								if (response.data) {
									let request = {
										MainItemIds: [mainItem.Id],
										ModuleName: 'procurement.rfq'
									};
									$http.post(globals.webApiBaseUrl + 'procurement/common/wizard/hascontracteddata', request)
										.then(function (response) {
											let hasContractItem = response ? response.data : false;
											$injector.get('procurementQuoteHeaderDataService').createItem(function (quoteItem) {
												quoteItem.RfqHeaderFk = mainItem.Id;
												quoteItem.ProjectFk = mainItem.ProjectFk;
												quoteItem.hasBaseQtnHeaderFk = function () {
													return !!mainItem.RfqHeaderFk;
												};
											}, function (quoteResponse) {
												// if the rfqHeader has created QTN, then readonly the BillingSchemaFk field
												if (quoteResponse && quoteResponse[0].QuoteHeader && quoteResponse[0].QuoteHeader.QuoteVersion === 1) {
													procurementRfqMainService.billingSchemaReadonly(quoteResponse[0].QuoteHeader.RfqHeaderFk);
												}

												var quoteHeaderIds = [];
												_.forEach(quoteResponse, function (quote) {
													quoteHeaderIds.push(platformObjectHelper.getValue(quote, 'QuoteHeader.Id', []));
												});
												service.quoteHeaderIds = quoteHeaderIds;
												let quoteHeaderCodes = [];
												_.forEach(quoteResponse, function (quote) {
													quoteHeaderCodes.push(platformObjectHelper.getValue(quote, 'QuoteHeader.Code', []));
												});
												platformDialogService.showDialog({
													templateUrl: globals.appBaseUrl + 'procurement.rfq/partials/create-contract-wizard-dialog.html',
													width: '600px',
													resizeable: true,
													newId: quoteHeaderIds,
													newCode: quoteHeaderCodes
												});
											}, true, false, hasContractItem, true);
										});
								} else {
									service.showMessage('procurement.rfq.wizard.create.quote.noneed');
								}
							});
						} else {
							service.showMessage('procurement.rfq.wizard.create.quote.selected');
						}

						service.goModule = function goModule() {
							const idsStr = service.quoteHeaderIds.join(',');
							platformModuleNavigationService.navigate({
								moduleName: 'procurement.quote',
								registerService: 'procurementQuoteHeaderDataService'
							}, {FromGoToBtn: true, Ids: idsStr}, 'Ids');
						};
					});
				};
				service.publishRfQ = function publishRfQ() {

					// save rfq header before open wizard.
					procurementRfqMainService.updateAndExecute(function publishRfQWizard() {

						var mainItem = procurementRfqMainService.getSelected();
						if (mainItem && Object.getOwnPropertyNames(mainItem).length > 0) {
							procurementTxInterfaceWizardService.showPublishRfQWizard(mainItem);
						} else {
							service.showMessage('procurement.rfq.wizard.create.quote.selected');
						}
					});

				};

				service.showMessage = function(message) {
					return platformModalService.showDialog({
						headerTextKey: $translate.instant('procurement.rfq.wizard.create.quote.title'),
						bodyTextKey: $translate.instant(message),
						iconClass: 'ico-info'
					});
				}

				/**
				 * @ngdoc
				 * @name procurementRfqWizardService
				 * @function
				 *
				 * @description
				 *
				 */
				service.importBidderQuote = function importBidderQuote() {

					// save outstanding changes before open wizard
					procurementRfqMainService.updateAndExecute(function importBidderQuoteWizard() {

						var mainItem = procurementRfqMainService.getSelected();
						if (mainItem && Object.getOwnPropertyNames(mainItem).length > 0) {
							procurementTxInterfaceWizardService.showImportBidderQuotesWizard(mainItem);
						} else {
							service.showMessage('procurement.rfq.wizard.create.quote.selected');
						}
					});
				};

				service.importBusinessPartner = function importBusinessPartner() {
					var mainItem = procurementRfqMainService.getSelected();
					if (mainItem && mainItem.Id) {
						if (mainItem.RfqStatus.IsCanceled === true || mainItem.RfqStatus.IsReadonly === true) {
							showMessage('procurement.rfq.importBp.notAllowed');
						} else {
							platformModalService.showDialog({
								currentItem: mainItem,
								templateUrl: globals.appBaseUrl + 'procurement.rfq/partials/import-businesspartner-wizard.html',
								backdrop: false
							}).then(function (dialogResult) {
								if (dialogResult.ok) {
									procurementRfqBusinessPartnerService.load().then(function (/* data */) {
										var modState = platformModuleStateService.state(angular.module(moduleName));
										var parentState = platformDataServiceModificationTrackingExtension.tryGetPath(modState.modifications, procurementRfqMainService);
										if (parentState) {
											parentState.RfqBusinessPartnerToSave = [];
										}
									});
								}
							});
						}

					} else {
						showMessage('procurement.rfq.importBp.mustSelectRfq');
					}

					function showMessage(message) {
						return platformModalService.showDialog({
							headerTextKey: $translate.instant('procurement.rfq.importBp.title'),
							bodyTextKey: $translate.instant(message),
							iconClass: 'ico-info'
						});
					}

				};

				service.getDialogRfqList = function getDialogRfqList() {
					var biddersUrl = globals.webApiBaseUrl + 'procurement/rfq/wizard/dialogrfqlist';
					return $http.get(biddersUrl);
				};

				service.getDialogBidders = function getDialogBidders(rfqHeaderId) {
					var biddersUrl = globals.webApiBaseUrl + 'procurement/rfq/businesspartner/getlist';
					var postData = {filter: '', Value: rfqHeaderId};
					return $http.post(biddersUrl, postData);
				};

				service.copyBidders = function getDialogBidders(options) {
					var biddersUrl = globals.webApiBaseUrl + 'procurement/rfq/wizard/importbizpartner';
					return $http.post(biddersUrl, options);
				};

				service.createBusinessPartner = function createBusinessPartner() {
					createBusinessPartnerService.createBusinessPartner(rfqRequisitionService);
				};

				service.sendRfqToSGTWO = function sendRfqToSGTWO() {
					var selectedRfqBP = procurementRfqBusinessPartnerService.getSelected();
					if (selectedRfqBP === null) {
						platformModalService.showMsgBox('procurement.rfq.bidder.noBidderSelected',
							'procurement.rfq.bidder.warning');
						return;
					}

					if (selectedRfqBP.PrcCommunicationChannelFk !== 8) {  // not SGTWO API
						platformModalService.showMsgBox('procurement.rfq.bidder.notSGTWOAPIBidder', 'procurement.rfq.bidder.warning');
						return;
					}

					var biddersUrl = globals.webApiBaseUrl + 'procurement/rfq/wizard/sendrfqtosgtwo';
					var postData = {RfqBidderId: selectedRfqBP.Id};
					$http.post(biddersUrl, postData).then(function (result) {
						if (result !== null) {
							platformModalService.showMsgBox('procurement.rfq.bidder.sendSGTWOSuccess', 'cloud.common.informationDialogHeader', 'ico-info');
							procurementRfqMainService.refresh();
						}
					});
				};

				// todo: remove wizards config - comes from database!

				var wizards = {
					showImages: true,
					showTitles: true,
					showSelected: true,
					cssClass: 'sidebarWizard',
					items: [
						{
							id: 1,
							text: 'Change Status Wizard',
							text$tr$: 'procurement.common.wizard.group.status',
							groupIconClass: 'sidebar-icons ico-wiz-change-status',
							visible: true,
							subitems: [
								changeRfqStatus(),
								changeBiddersStatus(),
								changeStatusForProjectDocument()
							]
						},
						{
							id: 2,
							text: 'Find Bidder Wizard',
							text$tr$: 'procurement.rfq.wizard.groupCreate',
							groupIconClass: 'sidebar-icons ico-wiz-change-status',
							visible: false,
							subitems: [
								{
									id: 21,
									groupId: 2,
									text: 'Find Bidder (Concise)',
									text$tr$: 'procurement.rfq.wizard.headerText',
									type: 'item',
									showItem: true,
									cssClass: 'md rw',
									fn: service.enhanceBidderSearch
								},
								{
									id: 22,
									groupId: 2,
									text: 'Find Bidder (Full Function)',
									text$tr$: 'procurement.rfq.wizard.getBusinessPartner',
									type: 'item',
									showItem: true,
									cssClass: 'md rw',
									fn: service.findBidderFull
								}
							]
						},
						{
							id: 3,
							text: 'Send Request Wizard',
							text$tr$: 'procurement.common.wizard.group.send',
							groupIconClass: 'control-icons ico-send-email',
							visible: false,
							subitems: [
								{
									id: 31,
									groupId: 3,
									text: 'Send Email',
									text$tr$: 'procurement.common.wizard.item.sendEmail',
									type: 'item',
									showItem: true,
									cssClass: 'md rw panel-heading',
									fn: service.sendEmail
								},
								{
									id: 32,
									groupId: 3,
									text: 'Send Fax',
									text$tr$: 'procurement.common.wizard.item.sendFax',
									type: 'item',
									showItem: true,
									cssClass: 'md rw',
									fn: service.sendFax
								}
							]
						},
						{
							id: 4,
							text: 'Create Wizard',
							text$tr$: 'procurement.common.wizard.group.create',
							groupIconClass: 'sidebar-icons ico-wiz-change-status',
							visible: false,
							subitems: [
								{
									id: 41,
									groupId: 4,
									text: 'Create Quote',
									text$tr$: 'procurement.rfq.wizard.create.quote.title',
									type: 'item',
									showItem: true,
									cssClass: 'md rw',
									fn: service.createQuote
								},
								{
									id: 42,
									groupId: 4,
									text: 'Create Business Partner',
									type: 'item',
									showItem: true,
									cssClass: 'md rw',
									fn: service.createBusinessPartner
								}
							]
						},
						{
							id: 5,
							text: 'Billing Schema',
							text$tr$: 'procurement.common.wizard.group.billingSchema',
							groupIconClass: 'sidebar-icons ico-wiz-change-status',
							visible: false,
							subitems: [
								{
									id: 51,
									groupId: 5,
									text: 'Change Billing Schema',
									text$tr$: 'procurement.rfq.wizard.create.quote.changeBillingSchema',
									type: 'item',
									showItem: true,
									cssClass: 'md rw',
									fn: service.changeBillingSchema
								}
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

				service.changeProcurementConfiguration = function () {
					var parentValidationService = $injector.get('procurementRfqHeaderValidationService');
					ProcurementCommonChangeConfigurationService.execute(procurementRfqMainService, parentValidationService);
				};

				// loads or updates translated strings
				var loadTranslations = function () {
					platformTranslateService.translateObject(wizards, ['text']);

				};

				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule(moduleName)) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}
				return service;
			}]);
})(angular);
