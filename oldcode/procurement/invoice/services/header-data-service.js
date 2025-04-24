(function (angular) {
	'use strict';
	// jshint -W072
	// jshint -W074
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_, math */
	var moduleName = 'procurement.invoice';

	/**
	 * @ngdoc service
	 * @name procurementInvoiceHeaderDataService
	 * @function
	 * @requireds procurementInvoiceHeaderDataService
	 *
	 * @description Provide invoice header data service
	 */

	angular.module(moduleName).factory('procurementInvoiceHeaderDataService',
		['platformDataServiceFactory', 'platformContextService', 'PlatformMessenger', 'basicsLookupdataLookupDataService',
			'basicsLookupdataLookupDescriptorService', 'procurementContextService',
			'procurementInvoiceHeaderFilterService', 'procurementInvoiceHeaderReadOnlyProcessor',
			'platformDataServiceProcessDatesBySchemeExtension', 'basicsLookupdataLookupOptionService',
			'platformModalService', 'basicsCommonMandatoryProcessor', 'cloudDesktopSidebarService',
			'platformDataValidationService', 'platformModuleStateService', '$http', 'ServiceDataProcessDatesExtension', '$translate',
			'$injector', '$timeout', 'platformRuntimeDataService', '$q', 'procurementInvoiceNumberGenerationSettingsService', 'platformDataServiceModificationTrackingExtension', 'procurementCommonCharacteristicDataService', 'prcCommonCalculationHelper', 'prcCommonGetVatPercent',
			'platformGridAPI', 'basicsCommonCharacteristicService', 'prcCommonDomainMaxlengthHelper', 'basicsCommonInquiryHelperService', 'correctInvoiceType', 'platformDataServiceDataProcessorExtension','procurementCommonOverrideHeaderInfoService',
			function (dataServiceFactory, platformContextService, PlatformMessenger, lookupDataService,
				basicsLookupdataLookupDescriptorService, moduleContext, filterService,
				readOnlyProcessor, platformDataServiceProcessDatesBySchemeExtension, lookupOptionService,
				platformModalService, basicsCommonMandatoryProcessor, cloudDesktopSidebarService,
				platformDataValidationService, platformModuleStateService, $http, ServiceDataProcessDatesExtension, $translate,
				$injector, $timeout, platformRuntimeDataService, $q, procurementInvoiceNumberGenerationSettingsService, platformDataServiceModificationTrackingExtension, procurementCommonCharacteristicDataService, prcCommonCalculationHelper, prcCommonGetVatPercent,
				platformGridAPI, basicsCommonCharacteristicService, prcCommonDomainMaxlengthHelper, basicsCommonInquiryHelperService, correctInvoiceType, platformDataServiceDataProcessorExtension,procurementCommonOverrideHeaderInfoService) {
				var characteristicColumn = '';
				var service = {};
				var self = this;
				var serviceContainer;
				// set filter parameter for this module
				var sidebarSearchOptions = {
					moduleName: moduleName,  // required for filter initialization
					enhancedSearchEnabled: true,
					pattern: '',
					pageSize: 100,
					useCurrentClient: null,
					includeNonActiveItems: null,
					showOptions: true,
					showProjectContext: false, // TODO: rei remove it
					pinningOptions: {
						isActive: true, showPinningContext: [{token: 'project.main', show: true}],
						setContextCallback: cloudDesktopSidebarService.setCurrentProjectToPinnningContext
					},
					withExecutionHints: false,
					enhancedSearchVersion: '2.0',
					includeDateSearch: true
				};

				var currentViewItems = [];

				// var baseNchangeOrderPrcHeaderIds = [];

				function setReadonly(item) {
					if (!item || !item.Id) {
						return;
					}

					var arrAuth = ['Code', 'ProgressId', 'PrcConfigurationFk', 'InvTypeFk', 'CompanyDeferalTypeFk', 'Description', 'BillingSchemaFk', 'BusinessPartnerFk',
						'SubsidiaryFk', 'SupplierFk', 'DateInvoiced', 'DateDelivered', 'DateDeliveredFrom', 'Reference', 'CurrencyFk', 'AmountNet', 'AmountGross', 'AmountNetOc',
						'AmountGrossOc', 'TaxCodeFk', 'DateDeferalStart', 'TotalPerformedNet', 'TotalPerformedGross', 'ReferenceStructured', 'BankFk',
						'BasAccassignBusinessFk', 'BasAccassignControlFk', 'BasAccassignAccountFk', 'BasAccassignConTypeFk', 'SalesTaxMethodFk'];
					var invStatus = _.find(basicsLookupdataLookupDescriptorService.getData('invstatus'), {Id: item.InvStatusFk});
					var invType = _.find(basicsLookupdataLookupDescriptorService.getData('invtype'), {Id: item.InvTypeFk});
					var statusWithEditRight = true;
					var invStatusEditRight = basicsLookupdataLookupDescriptorService.getData('InvStatusEditRight');
					if (invStatusEditRight) {
						statusWithEditRight = _.find(invStatusEditRight, {Id: item.InvStatusFk});
					}
					var fields = [];

					if (
						(!statusWithEditRight && invStatus.IsReadOnly) ||
						(statusWithEditRight && !statusWithEditRight.HasAccessRightDescriptor && invStatus.IsReadOnly) ||
						(item.IsProtectedAllFields && !statusWithEditRight)
					) {
						readOnlyProcessor.setRowReadOnly(item, true);
						platformRuntimeDataService.readonly(item, [{field: 'Remark', readonly: false}]);
					} else {
						_.each(arrAuth, function (model) {

							var editable = readOnlyProcessor.getCellEditable(item, model);

							// invStatus&&
							if (arrAuth.indexOf(model) !== -1 && !statusWithEditRight) {
								// if (item.Version !== 0) {
								editable = false;
								// }
							}
							if (model === 'CompanyDeferalTypeFk' || model === 'DateDeferalStart') {
								editable = !(invType && invType.IsProgress);
							}
							fields.push({field: model, readonly: !editable});
						});
						platformRuntimeDataService.readonly(item, fields);
					}

					if (invStatus.FrmAccessrightdescriptor2Fk) {
						var pesEditRight = basicsLookupdataLookupDescriptorService.getData('InvStatusEditRightToPes');
						var pesEditRightStatus = _.find(pesEditRight, {Id: item.InvStatusFk});
						if (!pesEditRightStatus) {
							platformRuntimeDataService.readonly(item, [{field: 'PesHeaderFk', readonly: true}]);
						} else if (pesEditRightStatus && pesEditRightStatus.HasAccessRightDescriptorToPes) {
							platformRuntimeDataService.readonly(item, [{field: 'PesHeaderFk', readonly: false}]);
						}
					}

				}

				var onReadSucceeded = function onReadSucceeded(readData, data) {

					basicsLookupdataLookupDescriptorService.attachData(readData);
					basicsLookupdataLookupDescriptorService.loadData('BasAccassignAccType');

					_.forEach(readData.Main, function (item) {
						setReadonly(item);
					});

					var result = {
						FilterResult: readData.FilterResult,
						dtos: readData.Main || []
					};
					var dataRead = serviceContainer.data.handleReadSucceeded(result, data);
					if (service !== null && service !== undefined) {
						if (service.currentSelectItem) {
							var item = _.find(readData.Main, {Id: service.currentSelectItem.Id});
							service.currentSelectItem = null;
							if (item) {
								service.setSelected();
								$timeout(function () {
									service.setSelected(item);
								}, 200);
							} else {
								service.goToFirst(data);
							}
						} else {
							service.goToFirst(data);
						}
					}
					// handle characterist
					var gridContainerGuid = 'da419bc1b8ee4a2299cf1dde81cf1884';
					var exist = platformGridAPI.grids.exist(gridContainerGuid);
					if (exist) {
						var containerInfoService = $injector.get('procurementContractContainerInformationService');
						var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 47, gridContainerGuid, containerInfoService);

						characterColumnService.appendCharacteristicCols(readData.dtos);
					}
					return dataRead;
				};
				var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					{
						typeName: 'InvHeaderDto',
						moduleSubModule: 'Procurement.Invoice'
					}
				);
				var initialDialogService = $injector.get('invoiceCreationInitialDialogService');
				var serviceOptions = {
					flatRootItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementInvoiceHeaderDataService',
						entityInformation: {module: 'Procurement.Invoice', entity: 'InvHeader', specialTreatmentService: initialDialogService},
						entityNameTranslationID: 'procurement.invoice.title.header',
						httpCreate: {
							route: globals.webApiBaseUrl + 'procurement/invoice/header/',
							endCreate: 'create/createinv'
						},
						httpDelete: {
							route: globals.webApiBaseUrl + 'procurement/invoice/header/',
							endDelete: 'deleteinv'
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'procurement/invoice/header/',
							endUpdate: 'updateinv'
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/invoice/header/',
							endRead: 'listinv',
							usePostForRead: true,
							extendSearchFilter: function (readData) {
								// To have the focus still on the same main entity as before
								// To have the same main entities loaded
								if (currentViewItems.length) {
									readData.PageNumber = null;
									readData.PageSize = null;
									readData.Pattern = null;
									readData.PKeys = currentViewItems.map(function (item) {
										return item.Id;
									});
									currentViewItems = [];
								}
							}
						},
						dataProcessor: [{processItem: processItem}, readOnlyProcessor, new ServiceDataProcessDatesExtension(['DateInvoiced', 'DateReceived', 'DatePosted', 'DateNetPayable',
							'DateDelivered', 'DateDeliveredFrom', 'DateDiscount', 'ContractOrderDate', 'UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'DateDeferalStart'])],
						actions: {
							delete: true, create: 'flat',
							canDeleteCallBackFunc: function (item) {
								if (item && !_.isEmpty(item)) {
									if (item.Version === 0) {
										return true;
									} else {
										return !moduleContext.isReadOnly;
									}
								}
								return true;
							}
						},
						entityRole: {
							root: {
								itemName: 'InvHeaders',
								moduleName: 'cloud.desktop.moduleDisplayNameInvoice',
								addToLastObject: true,
								lastObjectModuleName: moduleName,
								responseDataEntitiesPropertyName: 'Main',
								handleUpdateDone: function (updateData, response, data) {
									if (!response.InvHeaders && response.InvHeader) {
										response.InvHeaders = [];
										response.InvHeaders.push(response.InvHeader);
									}
									/** @namespace response.StocktransactionSaveError */
									if (response.StocktransactionSaveError) {
										platformModalService.showMsgBox($translate.instant('procurement.common.stocktransactionSaveErrorMessage'), $translate.instant('procurement.invoice.moduleName'), 'ico-error');
									} else {
										data.handleOnUpdateSucceeded(updateData, response, data, true);
										/** @namespace response.UpdatedLookup */
										basicsLookupdataLookupDescriptorService.attachData(response.UpdatedLookup);
										if (response.UpdatedLookup.ConHeaderView) {
											lookupOptionService.updateDisplayData('prc-invoice-con-header-conheaderfk');
											service.refreshContractItems.fire(response.UpdatedLookup.ConHeaderView);
										}
										/** @namespace response.UpdatedLookup.InvoicePes */
										if (response.UpdatedLookup.InvoicePes) {
											lookupOptionService.updateDisplayData('prc-invoice-pes-header-pesheaderfk');
											service.refreshPes.fire();
										}
										/** @namespace response.UpdatedLookup.InvHeaderChained */
										if (response.UpdatedLookup.InvHeaderChained) {
											angular.forEach(response.UpdatedLookup.InvHeaderChained, function (chainedItem) {
												var headItem = _.find(service.getList(), {Id: chainedItem.Id});
												if (headItem) {
													headItem.InvStatusFk = chainedItem.InvStatusFk;
													/** @namespace chainedItem.VersionNo */
													headItem.Version = chainedItem.VersionNo;
													readOnlyProcessor.processItem(headItem);
												}
											});
											service.refreshChainedInvoice.fire();
											service.gridRefresh();
										}
										/** @namespace response.InvHeader */
										angular.forEach(response.InvHeaders, function (invHeader) {
											service.fireAmountNetValueChanged(invHeader);
										});
										service.refreshChild.fire();
									}
									service.onUpdateSucceeded.fire({updateData: updateData, response: response});
									var procurementInvoiceAccountAssignmentDataService = $injector.get('procurementInvoiceAccountAssignmentGetDataService');
									procurementInvoiceAccountAssignmentDataService.load();

									loadAboutGroupSet(response);
									showMesssage(response);
									service.showModuleHeaderInformation();
								},
								showProjectHeader: {
									getProject: function (entity) {
										if (!entity || !entity.ProjectFk) {
											return null;
										}
										return basicsLookupdataLookupDescriptorService.getLookupItem('Project', entity.ProjectFk);
									}
								}
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var selected = service.getSelected();
									if (!self.isCreateBlankItem && selected) {
										creationData.PreviousInvHeader = selected;
									}
									creationData.ProjectFk = moduleContext.loginProject;
									self.isCreateBlankItem = false;
								},
								incorporateDataRead: onReadSucceeded,
								handleCreateSucceeded: function (newData) {
									if (newData.InvTypeFk !== null && newData.InvTypeFk !== undefined) {
										var invTypes = [];
										lookupDataService.getList('InvType').then(function (data) {
											if (data) {
												invTypes = data;
												var TypeItem = _.find(invTypes, {Id: newData.InvTypeFk});
												if (TypeItem) {
													// newData.Description = TypeItem.Abbreviation;
													newData.Description = service.getDescription(newData);
													var invoiceHeaderValidationService = $injector.get('invoiceHeaderElementValidationService');
													if (newData.ConHeaderFk) {
														$http.get(globals.webApiBaseUrl + 'procurement/contract/conheaderlookup/getitembykey?id=' + newData.ConHeaderFk).then(function (response) {
															invoiceHeaderValidationService.updatePaymentTermFkAndRelatedProperties(newData, response.data);
														});
													} else {
														$http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration/getConfigHeaderById?configurationFk=' + newData.PrcConfigurationFk).then(function (response) {
															invoiceHeaderValidationService.initPaymentTermFkWhenInvoiceIsNewlyCreteated(newData, response.data);
														});
													}
												}
											}
										});
									}
									// handle characterist
									var gridContainerGuid = 'da419bc1b8ee4a2299cf1dde81cf1884';
									// invoice characteristic1 SectionId = 21;
									// invoice characteristic2 SectionId = 47;
									// configuration characteristic1 SectionId = 32;
									// configuration characteristic2 SectionId = 55;
									// structure characteristic1 SectionId = 9;
									// structure characteristic2 SectionId = 54;
									basicsCommonCharacteristicService.onEntityCreated(serviceContainer.service, newData, 21, 47, 32, 55, 9, 54);
									var exist = platformGridAPI.grids.exist('gridContainerGuid');
									if (exist) {
										var containerInfoService = $injector.get('procurementInvoiceContainerInformationService');
										var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 47, gridContainerGuid, containerInfoService);
										characterColumnService.appendDefaultCharacteristicCols(newData);
									}

									return newData;
								}
							}
						},
						sidebarSearch: {options: sidebarSearchOptions},
						sidebarWatchList: {active: true},  // @11.12.2015 enable watchlist support for this module
						entitySelection: {supportsMultiSelection: true},
						sidebarInquiry: {
							options: {
								active: true,
								moduleName: moduleName,
								getSelectedItemsFn: getSelectedItems,
								getResultsSetFn: getResultsSet
							}
						},
						filterByViewer: true
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);

				service = serviceContainer.service;
				service.currentSelectItem = null;

				serviceContainer.data.doPrepareDelete = function doPrepareDelete(deleteParams) {
					deleteParams.entity = deleteParams.entities[0];
					deleteParams.entities = null;
				};

				service.SetAccountAssignReadOnlyByIsInvAccountChangeable = function SetAccountAssignReadOnlyByIsInvAccountChangeable(entity) {
					if (entity && entity.ConHeaderFk && entity.IsInvAccountChangeable) {
						var accassignFiled = ['BasAccassignBusinessFk', 'BasAccassignControlFk', 'BasAccassignAccountFk', 'BasAccassignConTypeFk'];
						_.map(accassignFiled, function (item) {
							platformRuntimeDataService.readonly(entity, [{field: item, readonly: false}]);
						});
						var procurementInvoiceAccountAssignmentDataService = $injector.get('procurementInvoiceAccountAssignmentGetDataService');
						procurementInvoiceAccountAssignmentDataService.updateTools(entity.ConHeaderFk);
					}
				};

				var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
				serviceContainer.data.onCreateSucceeded = function (newData, data, creationData) {
					if (newData && newData.BillingSchemas && newData.BillingSchemas.length && newData.BillingSchemas.length > 0) {
						basicsLookupdataLookupDescriptorService.addData('InvBillingSchemas', newData.BillingSchemas);
					}

					procurementInvoiceNumberGenerationSettingsService.assertLoaded().then(function () {
						platformRuntimeDataService.readonly(newData, [{
							field: 'Code',
							readonly: procurementInvoiceNumberGenerationSettingsService.hasToGenerateForRubricCategory(newData.RubricCategoryFk)
						}]);
						newData.Code = procurementInvoiceNumberGenerationSettingsService.provideNumberDefaultText(newData.RubricCategoryFk, newData.Code);
						var currentItem = serviceContainer.service.getSelected();
						var result = {apply: true, valid: true};
						if (newData.Code === '') {
							result.valid = false;
							result.error = $translate.instant('cloud.common.generatenNumberFailed', {fieldName: 'Code'});
						}
						platformDataValidationService.finishValidation(result, currentItem, currentItem.Code, 'Code', service, service);
						platformRuntimeDataService.applyValidationResult(result, currentItem, 'Code');
						service.fireItemModified(currentItem);
						platformRuntimeDataService.readonly(newData, [{field: 'BankFk', readonly: true}]);

					});

					return onCreateSucceeded.call(serviceContainer.data, newData, data, creationData).then(function () {
						// var sourceHeaderId = service.getConfigurationFk(newData.InvHeader);
						// var  onEntityParentCreatedForPrcModule = procurementCommonCharacteristicDataService.createMethod(service.targetSectionId,sourceHeaderId,service.isSavedImmediately,update);
						// onEntityParentCreatedForPrcModule(null,newData.InvHeader);
						service.markCurrentItemAsModified();

						service.completeEntityCreateed.fire(null, newData);
					});
				};

				var confirmDeleteDialogHelper = $injector.get('prcCommonConfirmDeleteDialogHelperService');
				confirmDeleteDialogHelper.attachConfirmDeleteDialog(serviceContainer);

				basicsCommonCharacteristicService.unregisterCreateAll(serviceContainer.service, 21, 47);

				service.getDefaultListForCreated = function getDefaultListForCreated(targetSectionId, configrationSectionId, structureSectionId, newData) {
					var deferred = $q.defer();
					var sourceHeaderId = newData.Version === 0 ? newData.PrcConfigurationFk : service.getConfigurationFk();
					if (!sourceHeaderId) {
						sourceHeaderId = newData.PrcConfigurationFk;
					}
					procurementCommonCharacteristicDataService.getDefaultListForCreated(targetSectionId, sourceHeaderId, configrationSectionId, structureSectionId, newData).then(function (defaultItem) {
						if (defaultItem) {
							deferred.resolve(defaultItem);
						}
					});
					return deferred.promise;
				};

				// filters register and un-register, it will call by the invoice-module.js
				service.registerFilters = filterService.registerFilters;
				service.unRegisterFilters = filterService.unRegisterFilters;

				// reload items in billing schema container.
				service.reloadBillingSchemas = function reloadBillingSchemas() {
					return service.BillingSchemaChanged.fire();
				};

				service.getSelectedProjectId = function getSelectedProjectId() {
					var item = service.getSelected();
					if (item && angular.isDefined(item.Id)) {
						return item.ProjectFk;
					}
					return -1;
				};

				/**
				 * To have the focus still on the same main entity as before
				 * To have the same main entities loaded
				 */
				service.refreshView = function () {
					currentViewItems = angular.copy(service.getList());
					service.refresh();
				};

				service.getDescription = function getDescription(entity, model, value) {

					var billingSchemaFk = entity.BillingSchemaFk;
					var billSchemas = basicsLookupdataLookupDescriptorService.getData('PrcConfig2BSchema');
					var billSchema = _.find(billSchemas, {Id: billingSchemaFk});

					var BusinessPartnerFk = entity.BusinessPartnerFk;
					var ProgressId = entity.ProgressId;
					if (model === 'BusinessPartnerFk') {
						BusinessPartnerFk = value;
					} else if (model === 'ProgressId') {
						ProgressId = value;
					}
					var description = '';
					var invTypes = basicsLookupdataLookupDescriptorService.getData('InvType');
					var businessPartners = basicsLookupdataLookupDescriptorService.getData('BusinessPartner');
					var typeItem = _.find(invTypes, {Id: entity.InvTypeFk});

					if (typeItem && billSchema && billSchema.IsChained && ProgressId > 0) {
						if (typeItem && typeItem.IsProgress) {
							description = ProgressId + '.';
						}
						if (typeItem) {
							if (typeItem.Abbreviation2) {
								description += ' ' + typeItem.Abbreviation2;
							}
							if (typeItem.Abbreviation) {
								description += ' ' + typeItem.Abbreviation;
							}
						}
					} else {
						if (typeItem) {
							description += typeItem.Abbreviation;
						}
					}
					var partnerItem = null;
					if (null !== BusinessPartnerFk) {
						partnerItem = _.find(businessPartners, {Id: BusinessPartnerFk});
					}
					if (partnerItem && partnerItem.BusinessPartnerName1) {
						description += ' ' + partnerItem.BusinessPartnerName1;
					}
					const descriptionLength = prcCommonDomainMaxlengthHelper.get('Procurement.Invoice', 'InvHeaderDto', 'Description');
					description = description.substr(0, descriptionLength);

					return description;
				};

				service.getDescriptionAsync = function (entity, overloads) {
					var data = _.clone(entity);
					if (overloads) {
						data = _.merge(data, overloads);
					}
					if(_.isNil(data.Code)){
						data.Code = 'IsEmpty';
					}
					return $http.post(globals.webApiBaseUrl + 'procurement/invoice/header/narrative', data).then(function (res) {
						return res.data;
					});
				};

				service.getRightbyInvStatus = function getInvStatus() {
					$http.get(globals.webApiBaseUrl + 'procurement/invoice/header/getInvStatus').then(function (result) {
						var invoiceData = result.data;
						basicsLookupdataLookupDescriptorService.attachData(invoiceData);
					});
				};

				// characteristic item readonly
				service.setDataReadOnly = function (items) {
					_.forEach(items, function (item) {
						platformRuntimeDataService.readonly(item, true);
					});
				};

				/**
				 * get module state
				 * @param item target item, default to current selected item
				 * @returns IsReadonly {Isreadonly:true|false}
				 */
				service.getItemStatus = function getItemStatus(item) {
					var state, invStatuses, parentItem = item || service.getSelected();
					invStatuses = basicsLookupdataLookupDescriptorService.getData('invstatus');
					if (parentItem && parentItem.Id) {
						state = _.find(invStatuses, {Id: parentItem.InvStatusFk});
					} else {
						state = {IsReadOnly: true};
					}
					return state;
				};

				var readonlyStatus, itemStatus;
				var onSelectionChanged = function onSelectionChanged() {
					var currentItem = service.getSelected();
					if (currentItem && currentItem.Id) {
						moduleContext.exchangeRate = currentItem.ExchangeRate;
						itemStatus = service.getItemStatus(currentItem);
						if (itemStatus) {
							readonlyStatus = itemStatus.IsReadOnly;
						} else {
							readonlyStatus = false;
						}
						moduleContext.setModuleStatus({IsReadonly: readonlyStatus});
					} else {
						moduleContext.setModuleStatus({IsReadonly: true});
					}
					setReadonly(currentItem);
					service.SetAccountAssignReadOnlyByIsInvAccountChangeable(currentItem);

					// setBaseNChangeOrderPrcHeaderIdsByConHeaderId(currentItem ? currentItem.ConHeaderFk : 0, true);
					procurementCommonOverrideHeaderInfoService.updateModuleHeaderInfo(service,'cloud.desktop.moduleDisplayNameInvoice');
				};

				service.registerSelectionChanged(onSelectionChanged);

				service.onItemStatusChanged = function onItemStatusChanged(item) {
					dateProcessor.processItem(item);
					readonlyStatus = readOnlyProcessor.processItem(item);
					service.fireItemModified(item);
					moduleContext.setModuleStatus({IsReadonly: readonlyStatus});
				};

				service.updateReadOnly = function (item) {
					readOnlyProcessor.processItem(item);
				};

				service.refreshPes = new PlatformMessenger();
				service.refreshContractItems = new PlatformMessenger();
				service.refreshChainedInvoice = new PlatformMessenger();
				service.onCopyInvGenerals = new PlatformMessenger();
				service.autoCreateChainedInvoice = new PlatformMessenger();
				service.autoDeleteChainedInvoice = new PlatformMessenger();
				service.autoCreateInvoiceToPES = new PlatformMessenger();
				service.BillingSchemaChanged = new PlatformMessenger();
				service.completeEntityCreateed = new PlatformMessenger();
				service.exchangeRateChangedEvent = new PlatformMessenger();
				service.refreshChild = new PlatformMessenger();
				service.onUpdateSucceeded = new PlatformMessenger();
				service.onChainInvoiceChange = new PlatformMessenger();
				service.vatGroupChanged = new PlatformMessenger();
				service.clearContractEntity = new PlatformMessenger();
				service.clearPesEntity = new PlatformMessenger();
				service.updateRejectionRemark = new PlatformMessenger();
				service.updateToolsEvent = new PlatformMessenger();

				service.onChainInvoiceChange.register(function (sumGrossChainInvoices, sumNetChainInvoices) {
					var entity = service.getSelected();
					entity.TotalPerformedGross = prcCommonCalculationHelper.round(entity.AmountGross + sumGrossChainInvoices);
					entity.TotalPerformedNet = prcCommonCalculationHelper.round(entity.AmountNet + sumNetChainInvoices);
					service.fireAmountNetValueChanged(entity);
					var invoiceHeaderValidationService = $injector.get('invoiceHeaderElementValidationService');
					invoiceHeaderValidationService.recalculateAmountBalance(entity);
					service.fireItemModified(entity);
				});

				var onAmountNetValueChanged = new PlatformMessenger();

				service.registerAmountNetValueChanged = function registerPropertyChanged(func) {
					onAmountNetValueChanged.register(func);
				};
				service.unregisterAmountNetValueChanged = function unregisterPropertyChanged(func) {
					onAmountNetValueChanged.unregister(func);
				};
				service.fireAmountNetValueChanged = function firePropertyChanged(entity) {
					onAmountNetValueChanged.fire(null, {entity: entity});
				};

				service.createBlankItem = function createBlankItem() {
					self.isCreateBlankItem = true;
					service.createItem();
				};

				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'InvHeaderDto',
					moduleSubModule: 'Procurement.Invoice',
					validationService: 'invoiceHeaderElementValidationService',
					mustValidateFields: ['BusinessPartnerFk', 'Reference', 'BillingSchemaFk', 'PaymentHint', 'ReferenceStructured', 'PrcStructureFk', 'ControllingUnitFk', 'BpdVatGroupFk', 'PesHeaderFk']
				});

				basicsLookupdataLookupDescriptorService.loadData(['InvStatus', 'InvType', 'companydeferaltype', 'PrcConfig2BSchema', 'TaxCode']);

				serviceContainer.service.clearUpValidationIssues = clearUpValidationIssues;
				serviceContainer.service.registerValidationIssuesClearUp = registerValidationIssuesClearUp;
				serviceContainer.service.unregisterValidationIssuesClearUp = unregisterValidationIssuesClearUp;

				var validationIssuesClearUp;

				function clearUpValidationIssues() {
					if (platformDataValidationService.hasErrors(serviceContainer.service)) {
						var modState = platformModuleStateService.state(serviceContainer.service.getModule());
						modState.validation.issues = [];
					}
					validationIssuesClearUp.fire();
				}

				validationIssuesClearUp = new PlatformMessenger();
				serviceContainer.service.validationIssuesClearUp = validationIssuesClearUp;

				function registerValidationIssuesClearUp(handler) {
					if (angular.isFunction(handler)) {
						validationIssuesClearUp.register(handler);
					}
				}

				function unregisterValidationIssuesClearUp(handler) {
					if (angular.isFunction(handler)) {
						validationIssuesClearUp.unregister(handler);
					}
				}

				service.readAndSelectHdr = function (entity, triggerField) {

					if (entity && (triggerField === 'Id' || triggerField === 'InvHeaderFk')) {
						var keys = [];
						if (angular.isObject(entity)) {
							keys.push(entity[triggerField]);
						}
						if (angular.isString(entity)) {
							keys.push(parseInt(entity));
						}
						cloudDesktopSidebarService.filterSearchFromPKeys(keys);
					} else if (triggerField === 'PesNavBtn') {
						// from pes navigate button
						// item is pes entity.
						$http.post(serviceContainer.data.httpReadRoute + 'navigation',
							{From: 'PesNavBtn', PesId: entity.Id}).then(function (response) {
							cloudDesktopSidebarService.filterSearchFromPKeys(response.data);
						});
					} else if (triggerField === 'ContractNavBtn') {
						// from contract navigate button
						// item is contract entity.
						$http.post(serviceContainer.data.httpReadRoute + 'navigation',
							{From: 'ContractNavBtn', ConId: entity.Id}).then(function (response) {
							cloudDesktopSidebarService.filterSearchFromPKeys(response.data);
						});
					} else if (triggerField === 'CreateFromPes') {
						if (entity && entity.length > 0) {
							var ids = _.map(entity, function (v) {
								return v.InvHeader.Id;
							});
							cloudDesktopSidebarService.filterSearchFromPKeys(ids);
						}
					} else if (triggerField === 'Ids' && entity.FromGoToBtn) {
						var idsForGoToBtn = entity.Ids.split(',');
						cloudDesktopSidebarService.filterSearchFromPKeys(idsForGoToBtn);
					} else if (entity && triggerField === 'Code' && angular.isObject(entity)) {
						$http.get(globals.webApiBaseUrl + 'procurement/invoice/header/getHeaderById?id=' + entity.Id).then(function (result) {
							var invoiceHr = result.data;
							service.setList([invoiceHr]);
							service.setSelected(invoiceHr);
						});
					} else {
						$http.get(globals.webApiBaseUrl + 'procurement/invoice/header/getHeaderById?id=' + entity).then(function (result) {
							var invoiceHr = result.data;
							service.setList([invoiceHr]);
							service.setSelected(invoiceHr);
						});
					}
				};
				service.getConfigurationFk = function getConfigurationFk() {
					if (service.getSelected()) {
						return service.getSelected().PrcConfigurationFk;
					}
				};

				service.haveRightByStatus = function haveRightByStatus(key) {
					var pItem = service.getSelected();
					var servicesData = basicsLookupdataLookupDescriptorService.getData(key);
					var right = pItem ? _.find(servicesData, {Id: pItem.InvStatusFk}) : null;
					var descriptorString = 'HasAccessRightDescriptor';
					var keyArray = key.split('To');
					if (keyArray[1]) {
						descriptorString += 'To' + keyArray[1];
					}
					var result = {
						right: true,
						hasDescriptor: false
					};
					if (!right) {
						result.right = false;
					}
					if (right && right[descriptorString]) {
						result.hasDescriptor = true;
					}
					return result;
				};

				service.onReadSucceeded = function (readData) {
					onReadSucceeded(readData, serviceContainer.data);
				};

				service.updateReconciliation = function () {
					const childrenService = service.getChildServices();
					if (!Array.isArray(childrenService) || !childrenService.length) {
						return service.update();
					}

					const invoicePesService = _.find(childrenService, s => s.getServiceName() === 'procurementInvoicePESDataService');
					if (!invoicePesService) {
						return service.update();
					}

					const uiInvPesList = invoicePesService.getList();
					if (!Array.isArray(uiInvPesList) || !uiInvPesList.length) {
						return service.update();
					}

					const invHeader = service.getSelected();
					return invoicePesService.getDataByHttp(invHeader.Id).then(function (response) {
						const dbInvPesList = response.data.Main;
						const calculatePesValues = (list) => {
							let amountNetPesOc = 0;
							let amountVatPesOc = 0;
							let amountNetPes = 0;
							let amountVatPes = 0;
							list.forEach(p => {
								amountNetPesOc += prcCommonCalculationHelper.round(p.PesValueOc);
								amountVatPesOc += prcCommonCalculationHelper.round(p.PesVatOc);
								amountNetPes += prcCommonCalculationHelper.round(invHeader.ExchangeRate === 0 ? 0 : (math.bignumber(p.PesValueOc).div(invHeader.ExchangeRate)));
								amountVatPes += prcCommonCalculationHelper.round(invHeader.ExchangeRate === 0 ? 0 : (math.bignumber(p.PesVatOc).div(invHeader.ExchangeRate)));
							});
							return {amountNetPesOc, amountVatPesOc, amountNetPes, amountVatPes};
						};
						const {
							amountNetPesOc,
							amountVatPesOc,
							amountNetPes,
							amountVatPes
						} = calculatePesValues(dbInvPesList);

						const needUpdate = invHeader.AmountNetPesOc !== amountNetPesOc ||
							invHeader.AmountNetPes !== amountNetPes ||
							invHeader.AmountVatPesOc !== amountVatPesOc ||
							invHeader.AmountVatPes !== amountVatPes;

						if (needUpdate) {
							const invoiceHeaderValidationService = $injector.get('invoiceHeaderElementValidationService');
							const pesValueOc = dbInvPesList.reduce((sum, item) => sum + item.PesValueOc, 0);
							const pesVatOc = dbInvPesList.reduce((sum, item) => sum + item.PesVatOc, 0);
							invoiceHeaderValidationService.recalculateFromPes(pesValueOc, pesVatOc);
						}
						return service.update().finally(() => invoicePesService.load());
					});
				};


				// service.setBaseNChangeOrderPrcHeaderIdsByConHeaderId = setBaseNChangeOrderPrcHeaderIdsByConHeaderId;
				// service.getBaseNChangeOrderPrcHeaderIds = getBaseNChangeOrderPrcHeaderIds;

				/**
				 * this function will be called from Sidebar Inquiry container when user presses the "AddSelectedItems" Button
				 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
				 */
				function getSelectedItems() {
					var resultSet = service.getSelected();
					if (resultSet === null || resultSet === undefined) {
						return;
					}
					return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
				}

				/**
				 * this function will be called from Sidebar Inquiry container when user presses the "AddAllItems" Button
				 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
				 */
				function getResultsSet() {
					let resultSet = platformGridAPI.rows.getRows('da419bc1b8ee4a2299cf1dde81cf1884');
					return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
				}

				function createInquiryResultSet(resultSet) {
					var defNoName = $translate.instant('businesspartner.main.inquiry.noname');
					var defNoSubSidDesc = $translate.instant('businesspartner.main.inquiry.nosubsidiarydesc');
					var resultArr = [];
					_.forEach(resultSet, function (item) {
						if (item && item.Id) { // check for valid object
							resultArr.push({
								id: item.Id,
								name: item.Code === '' ? defNoName : item.Code,
								description: item.Description === '' ? defNoSubSidDesc : item.Description
							});
						}
					});

					return resultArr;
				}

				service.isProcurementModule = true;
				service.targetSectionId = 21;
				service.isSavedImmediately = false;

				service.getVatPercentWithTaxCodeMatrix = function getVatPercentWithTaxCodeMatrix(taxCodeFk, vatGroupFk) {
					var item = service.getSelected();
					vatGroupFk = (vatGroupFk === undefined && item) ? item.BpdVatGroupFk : vatGroupFk;
					return prcCommonGetVatPercent.getVatPercent(taxCodeFk, vatGroupFk);
				};

				service.wizardIsActivate = function () {
					var status = basicsLookupdataLookupDescriptorService.getData('invstatus');
					var parentItem = service.getSelected();
					var IsActivate = true;
					if (parentItem) {
						var oneStatus = _.find(status, {Id: parentItem.InvStatusFk});
						var IsLive = oneStatus.Islive;
						if (IsActivate) {
							IsActivate = IsLive;
						}
					}
					if (!IsActivate) {
						var headerTextKey = $translate.instant('procurement.invoice.wizard.isActivateCaption');
						var bodyText = $translate.instant('procurement.invoice.wizard.isActiveMessage');
						var modalOptions = {
							headerTextKey: headerTextKey,
							bodyTextKey: bodyText,
							showOkButton: true,
							showCancelButton: false,
							defaultButton: 'ok',
							iconClass: 'ico-question'
						};
						platformModalService.showDialog(modalOptions);
					}
					return IsActivate;
				};

				function loadAboutGroupSet(response) {
					/** @namespace updateData.InvOtherToSave */
					if (response && response.InvOtherToSave && _.find(response.InvOtherToSave, function (o) {
						/** @namespace o.InvOther */
						return o.InvOther !== null;
					})) {
						var otherDataService = $injector.get('procurementInvoiceOtherDataService');
						otherDataService.reLoadWithUnSavedEntities();
					}
					/** @namespace updateData.InvContractToSave */
					if (response && response.InvContractToSave && _.find(response.InvContractToSave, function (o) {
						/** @namespace o.InvContract */
						return o.InvContract !== null;
					})) {
						var contractDataService = $injector.get('procurementInvoiceContractDataService');
						contractDataService.reLoadWithUnSavedEntities();
					}
					/** @namespace updateData.InvTransactionToSave */
					if (response && response.InvTransactionToSave && _.find(response.InvTransactionToSave, function (o) {
						/** @namespace o.InvTransaction */
						return o.InvTransaction !== null;
					})) {
						var transactionDataService = $injector.get('procurementInvoiceTransactionDataService');
						transactionDataService.reLoadWithUnSavedEntities();
					}
					/** @namespace updateData.InvRejectToSave */
					if (response && response.InvRejectToSave && _.find(response.InvRejectToSave, function (o) {
						/** @namespace o.InvReject */
						return o.InvReject !== null;
					})) {
						var rejectionDataService = $injector.get('procurementInvoiceRejectionDataService');
						rejectionDataService.reLoadWithUnSavedEntities();
					}
				}

				function showMesssage(response) {
					/** @namespace response.CalculateErrorMesssage */
					if (response.CalculateErrorMesssage) {
						if (response.CalculateErrorMesssage === '1') {
							platformModalService.showMsgBox('procurement.invoice.error.billingSchemaErrorStatusMiss', 'procurement.invoice.error.errorMessage', 'warning');
						} else {
							platformModalService.showMsgBox(response.CalculateErrorMesssage, 'procurement.invoice.error.billingSchemaCalculateErrorTitle', 'warning');
						}

					}
					/** @namespace response.NotEqualWarn */
					if (response.NotEqualWarn) {
						platformModalService.showMsgBox($translate.instant('procurement.common.notEqualWarnMessage'), $translate.instant('procurement.invoice.moduleName'), 'warning');
					}
				}

				function processItem(item) {
					setCallOffMainContractCodeAndDes(item);
				}

				function setCallOffMainContractCodeAndDes(item) {
					if (item.ConHeaderFk) {
						var conHeader = _.find(basicsLookupdataLookupDescriptorService.getData('ConHeaderView'), {Id: item.ConHeaderFk});
						if (conHeader) {
							if (conHeader.ConHeaderFk !== null && conHeader.ProjectChangeFk === null) {
								var mainContract = _.find(basicsLookupdataLookupDescriptorService.getData('ConHeaderView'), {Id: conHeader.ConHeaderFk});
								if (mainContract) {
									item.CallOffMainContractFk = mainContract.Id;
									item.CallOffMainContract = mainContract.Code;
									item.CallOffMainContractDes = mainContract.Description;
								}
							}
						}
					}
				}

				serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
					characteristicColumn = colName;
				};
				serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
					return characteristicColumn;
				};
				service.clearDataSelectedItem = function () {
					serviceContainer.data.selectedItem = null;
				};

				basicsCommonInquiryHelperService.registerEnableInspector('da419bc1b8ee4a2299cf1dde81cf1884', service);

				service.correctInvoice = function(type) {
					const selectedItem = service.getSelected();
					const config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: selectedItem.PrcConfigurationFk});
					const code = procurementInvoiceNumberGenerationSettingsService.provideNumberDefaultText(config.RubricCategoryFk, '');
					const autoGenerateCode = procurementInvoiceNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk);

					platformModalService.showDialog({
						code: code,
						type: type,
						list: service.getList(),
						selectedItem: selectedItem,
						autoGenerateCode: autoGenerateCode,
						headerTextKey: type === correctInvoiceType.Correct ? $translate.instant('procurement.invoice.toolbarCorrectInvoiceCorrect') : $translate.instant('procurement.invoice.toolbarCorrectInvoiceCancel'),
						templateUrl: globals.appBaseUrl + 'procurement.invoice/partials/invoice-header-correct-dialog.html'
					}).then(function(result) {
						if (result.ok) {
							let needUpdateEntities = [];
							if (result.updateEntities && result.updateEntities.length) {
								const list = service.getList();
								needUpdateEntities = list.filter(function(e) {
									return !!result.updateEntities.find(function (i) {
										return i.Id === e.Id;
									});
								})
							}
							if (needUpdateEntities.length) {
								service.setSelected(null, needUpdateEntities);
								service.refreshSelectedEntities().then(function() {
									insertAndSelectAItem(result.item);
								})
							}
							else {
								insertAndSelectAItem(result.item);
							}
						}
					});
				};

				function insertAndSelectAItem(item) {
					platformDataServiceDataProcessorExtension.doProcessItem(item, serviceContainer.data);
					serviceContainer.data.itemList.push(item);
					serviceContainer.data.listLoaded.fire();
					service.setSelected(item);
				}

				service.cellChange = function (entity, field) {
					if (field === 'BpdVatGroupFk') {
						service.vatGroupChanged.fire();
					}
				};

				return service;

			}]);
	// businesspartnerCertificateActualCertificateListController

	angular.module(moduleName).factory('procurementInvoiceCertificateActualDataService', ['businesspartnerCertificateCertificateContainerServiceFactory', 'procurementInvoiceHeaderDataService',
		function (dataServiceFactory, parentService) {
			return dataServiceFactory.getDataService(moduleName, parentService);
		}]);

	angular.module(moduleName).constant('correctInvoiceType', {
		Correct: 'Correct',
		Cancel: 'Cancel'
	});
})(angular);