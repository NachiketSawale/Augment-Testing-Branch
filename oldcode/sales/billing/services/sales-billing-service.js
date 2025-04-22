/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */

(function () {
	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBillingService
	 * @function
	 *
	 * @description
	 * salesBillingService is the data service for billing (main entity) functionality.
	 */
	salesBillingModule.factory('salesBillingService',
		['_', '$log', '$http', '$injector', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension', 'salesCommonReadonlyStatusProcessor', 'SalesCommonReadonlyProcessor', 'salesCommonBlobsHelperService', 'salesBillingFilterService', 'PlatformMessenger', 'basicsCommonMandatoryProcessor', 'platformModalService', 'platformPermissionService', 'permissions', 'platformRuntimeDataService', '$translate', 'salesCommonBusinesspartnerSubsidiaryCustomerService', 'salesCommonProjectChangeStatusProcessor', 'sidebarDefaultOptions', 'basicsLookupdataLookupFilterService', 'salesCommonExchangerateService', 'salesBillingCreationInitialDialogService', 'platformDataServiceConfiguredCreateExtension', 'platformDataServiceActionExtension','salesCommonGeneralsServiceFactory', 'cloudDesktopSidebarService',
			function (_, $log, $http, $injector, platformDataServiceFactory, ServiceDataProcessDatesExtension, salesCommonReadonlyStatusProcessor, SalesCommonReadonlyProcessor, salesCommonBlobsHelperService, salesBillingFilterService, PlatformMessenger, basicsCommonMandatoryProcessor, platformModalService, platformPermissionService, permissions, platformRuntimeDataService, $translate, salesCommonBusinesspartnerSubsidiaryCustomerService, salesCommonProjectChangeStatusProcessor, sidebarDefaultOptions, basicsLookupdataLookupFilterService, salesCommonExchangerateService, salesBillingCreationInitialDialogService, platformDataServiceConfiguredCreateExtension, platformDataServiceActionExtension, salesCommonGeneralsServiceFactory, cloudDesktopSidebarService) {

				var isLoadByNavigation = false,
					naviBillingHeaderId = null,
					characteristicColumn = '',
					navInfo = {field: null, value: null},
					billCreationData = null;

				var containerGuid = '39608924dc884afea59fe04cb1434543';
				var containerInformationService = $injector.get('salesBillingContainerInformationService');

				var companyCategoryList = null;

				// The instance of the main service - to be filled with functionality below
				var salesBillingHeaderServiceOptions = {
					flatRootItem: {
						module: salesBillingModule,
						serviceName: 'salesBillingService',
						entityNameTranslationID: 'sales.billing.containerTitleBills',
						entityInformation: { module: 'Sales.Bid', entity: 'BilHeader', specialTreatmentService: salesBillingCreationInitialDialogService},
						httpCreate: {route: globals.webApiBaseUrl + 'sales/billing/'},
						httpRead: {
							route: globals.webApiBaseUrl + 'sales/billing/', endRead: 'listfiltered',
							usePostForRead: true,
							extendSearchFilter: function extendSearchFilter(filterRequest) {
								if (isLoadByNavigation) {
									if (navInfo.field) {
										if (navInfo.field === 'OrdHeaderFk') {
											filterRequest.furtherFilters = [{
												Token: 'BIL_HEADER_ORDHEADERFK',
												Value: navInfo.value
											}];
										}
									} else {
										filterRequest.furtherFilters = [{Token: 'BIL_HEADER_ID', Value: naviBillingHeaderId}];
									}
									isLoadByNavigation = false;
									navInfo = {field: null, value: null};
								}
							}
						},
						httpUpdate: {route: globals.webApiBaseUrl + 'sales/billing/'},
						httpDelete: {route: globals.webApiBaseUrl + 'sales/billing/'},
						entityRole: {
							root: {
								codeField: 'BillNo',
								descField: 'Description',
								itemName: 'BilHeader',
								moduleName: 'cloud.desktop.moduleDisplayNameBilling',
								showProjectHeader: {
									getProject: function (entity) {
										if (entity && entity.ProjectFk) {
											return $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('Project', entity.ProjectFk);
										}
									}
								},
								handleUpdateDone: function (updateData, response, data) {
									salesCommonBlobsHelperService.handleBlobsUpdateDone('BilClobsToSave', updateData, response, data);
									$injector.get('salesBillingHeaderFormattedTextDataService').load();
									$injector.get('salesBillingHeaderTextDataService').load();
									service.onUpdateSucceeded.fire({updateData: updateData, response: response});
									loadAboutGroupSet(response);

									// set the cost group
									if (response.BoqItemToSave && response.BoqItemToSave.length > 0) {
										var qtoDetailsToSave = _.map(response.BoqItemToSave, 'QtoDetailToSave');
										var isQtoDetailChange = false;
										_.each(qtoDetailsToSave, function (qtoDetailToSave) {
											_.each(qtoDetailToSave, function (item) {
												if (item.QtoDetail) {
													isQtoDetailChange = true;
													if (item.CostGroupToSave && item.CostGroupToSave.length > 0) {
														$injector.get('basicsCostGroupAssignmentService')
															.attachCostGroupValueToEntity([item.QtoDetail], item.CostGroupToSave, function identityGetter(entity) {
																return {Id: entity.MainItemId};
															},
															'QtoDetail2CostGroups'
															);
													}
												}
											});
										});

										let boqService = $injector.get('salesBillingBoqStructureService');
										if (isQtoDetailChange) {
											// set the boq split quantity
											_.each(response.BoqItemToSave, function (boqItemToSave) {
												if (boqItemToSave.BoqSplitQuantityToSave && boqItemToSave.BoqSplitQuantityToSave.length > 0) {
													var items = _.map(boqItemToSave.BoqSplitQuantityToSave, 'BoqSplitQuantity');
													$injector.get('boqMainSplitQuantityServiceFactory').getService(boqService, 'sales.billing').synBoqSplitQuantity(items);
												}
											});
										}
										if (updateData.BoqItemToSave && updateData.BoqItemToSave.length > 0) {
											_.each(updateData.BoqItemToSave, function (boqItemToSave) {
												if (boqItemToSave.EstLineItemToSave && boqItemToSave.EstLineItemToSave.length > 0) {
													var lineItems = boqItemToSave.EstLineItemToSave;
													var lineItemService = $injector.get('salesBillingEstimateLineItemDataService');
													lineItemService.syncLineItems(lineItems);
												}
											});
										}

										// recalculate boqItem
										_.each(response.BoqItemToSave, function (boqItemToSave) {
											if (boqItemToSave.BoqItem) {
												boqService.initInstalledValues(boqItemToSave.BoqItem);
											}
										});
									}

									let salesBillingBoqStructureService = $injector.get('salesBillingBoqStructureService');
									let _dynamicUserDefinedColumnService = salesBillingBoqStructureService.getDynamicUserDefinedColumnsService();
									if (_dynamicUserDefinedColumnService && _.isFunction(_dynamicUserDefinedColumnService.update)) {
										_dynamicUserDefinedColumnService.update();
									}

									service.fireAmountNetValueChanged(response.BilHeader);
								}
							}
						},
						actions: {
							delete: {}, create: 'flat',
							canDeleteCallBackFunc: function (item) {
								var lookupService = $injector.get('salesBillingStatusLookupDataService');
								var readonlyStatusItems = _.filter(lookupService.getListSync('salesBillingStatusLookupDataService'), {IsReadOnly: true});
								// delete action disabled when item is in a read only status
								return !_.some(readonlyStatusItems, {Id: item.BilStatusFk});
							}
						},
						translation: {
							uid: 'salesBillingService',
							title: 'sales.billing.containerTitleBills',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
							dtoScheme: {
								typeName: 'BilHeaderDto',
								moduleSubModule: 'Sales.Billing'
							}
						},
						entitySelection: {},
						dataProcessor: [
							salesCommonProjectChangeStatusProcessor,
							new ServiceDataProcessDatesExtension([
								'BillDate', 'DatePosted', 'PerformedFrom', 'PerformedTo', 'CancellationDate', 'DateEffective', 'DateDiscount', 'DateNetpayable',
								'UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05'
							]),
							new salesCommonReadonlyStatusProcessor({
								typeName: 'BilHeaderDto',
								moduleSubModule: 'Sales.Billing',
								statusDataServiceName: 'salesBillingStatusLookupDataService',
								uiStandardService: 'salesBillingConfigurationService',
								statusField: 'BilStatusFk'
							}),
							new SalesCommonReadonlyProcessor(),
							{   // handle lump sum
								processItem: function (item) {
									var isLumpsum = service.isLumpsum(item);
									platformRuntimeDataService.readonly(item, [{
										field: 'AmountNet',
										readonly: !isLumpsum
									}]);
								}
							},
							{   // handle ProgressInvoiceNo
								processItem: function (item) {
									// ProgressInvoiceNo is int (not int?) => so if 0 we will not display // TODO:
									if (item.ProgressInvoiceNo === 0) {
										item.ProgressInvoiceNo = -1;
									}
								}
							}
						],
						presenter: {
							list: {
								handleCreateSucceeded: function (item) {
									$injector.get('salesBillingSchemaService').copyBillingSchemas(item, undefined, true);

									// var isProgress = service.isProgressType(item); // TODO: remove?
									// TODO: we need to call the dates processors. they are not called automatically for creation?!
									var datesProcessor = new ServiceDataProcessDatesExtension(['BillDate', 'DateEffective']);
									datesProcessor.processItem(item);
									service.calcPaymentTermDates(item, item.PaymentTermFk);
									checkCurrency(item);
									checkContractRelationAndDiverseDebitorsAllowed(item);

									// defect:126111 start
									if (item.OrdHeaderFk !== '' && item.OrdHeaderFk !== null) {
										platformRuntimeDataService.readonly(item, [{
											field: 'BasSalesTaxMethodFk',
											readonly: true
										}]);
									}
									// defect:126111 end
									// add additional parameters (From configurable dialog) to the item
									if (service.isConfigurableDialog()) {
										item.ControllingUnitFk = billCreationData.ControllingUnitFk;
										item.InvoiceTypeFk = billCreationData.InvoiceTypeFk;
										item.BankFk = billCreationData.BankFk;
										item.PerformedTo = billCreationData.PerformedTo;
										item.PerformedFrom = billCreationData.PerformedFrom;
										item.BillingSchemaFk = billCreationData.BillingSchemaFk;
										item.ReferenceStructured = billCreationData.ReferenceStructured;
										item.BookingText = billCreationData.BookingText;
										item.RelatedBillHeaderFk = billCreationData.RelatedBillHeaderFk;
										item.ObjUnitFk = billCreationData.ObjUnitFk;
										item.OrdConditionFk = billCreationData.OrdConditionFk;
										item.PrcStructureFk = billCreationData.PrcStructureFk;
										item.ContactFk = billCreationData.ContactFk;
										item.BusinesspartnerBilltoFk = billCreationData.BusinesspartnerBilltoFk;
										item.ContactBilltoFk = billCreationData.ContactBilltoFk;
										item.SubsidiaryBilltoFk = billCreationData.SubsidiaryBilltoFk;
										item.CustomerBilltoFk = billCreationData.CustomerBilltoFk;
										item.DateNetpayable = billCreationData.DateNetpayable;
										item.DateDiscount = billCreationData.DateDiscount;
										item.PaymentTermFk = billCreationData.PaymentTermFk;
										item.Remark = billCreationData.Remark;
										item.CommentText = billCreationData.CommentText;
										item.UserDefined1 = billCreationData.UserDefined1;
										item.UserDefined2 = billCreationData.UserDefined2;
										item.UserDefined3 = billCreationData.UserDefined3;
										item.UserDefined4 = billCreationData.UserDefined4;
										item.UserDefined5 = billCreationData.UserDefined5;
										item.UserDefinedDate01 = billCreationData.UserDefinedDate01;
										item.UserDefinedDate02 = billCreationData.UserDefinedDate02;
										item.UserDefinedDate03 = billCreationData.UserDefinedDate03;
										item.UserDefinedDate04 = billCreationData.UserDefinedDate04;
										item.UserDefinedDate05 = billCreationData.UserDefinedDate05;
									}
									var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 68, containerGuid.toUpperCase(), containerInformationService);
									characterColumnService.appendCharacteristicCols(item);
								},
								incorporateDataRead: function (readData, data) {
									var dtos = readData.dtos;
									_.forEach(dtos, function (dto) {
										checkCurrency(dto);
										checkIsWipOrder(dto);
										checkContractRelationAndDiverseDebitorsAllowed(dto);
										service.checkBilStatus(dto);
									});
									var result = serviceContainer.data.handleReadSucceeded(readData, data);

									var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 68, containerGuid.toUpperCase(), containerInformationService);
									characterColumnService.appendCharacteristicCols(readData.dtos);

									return result;
								}
							}
						},
						sidebarSearch: {
							options: angular.extend(angular.copy(sidebarDefaultOptions), {
								moduleName: moduleName,
								enhancedSearchVersion: '2.0',
								pinningOptions: {
									isActive: true,
									showPinningContext: [{token: 'project.main', show: true}],
									setContextCallback: setCurrentPinningContext
								}
							})
						},
						sidebarWatchList: {active: true},
						filterByViewer: true
					}
				};

				function checkCurrency(dto) {
					if (dto.OrdHeaderFk) {
						var result = $injector.get('salesBillingValidationService').checkCurrency(dto, dto.CurrencyFk);
						if (result.valid) {
							platformRuntimeDataService.readonly(dto, [{
								field: 'CurrencyFk',
								readonly: true
							}]);
						} else {
							platformRuntimeDataService.applyValidationResult(result, dto, 'CurrencyFk');
						}
					}
				}

				// defect:126111 start
				function checkIsWipOrder(dto) {
					var result = $injector.get('salesBillingValidationService').checkIsWipOrder(dto);
					if (result.readonly) {
						platformRuntimeDataService.readonly(dto, [{
							field: 'BasSalesTaxMethodFk',
							readonly: true
						}]);
					}
				}
				// defect:126111 end

				function checkContractRelationAndDiverseDebitorsAllowed(dto) {
					var fields = [{field: 'BusinesspartnerFk', readonly: true}, {field: 'SubsidiaryFk', readonly: true}];
					if (dto.IsContractRelated && !dto.IsDiverseDebitorsAllowed) {
						platformRuntimeDataService.readonly(dto, fields);
						if (dto.CustomerFk && dto.CustomerFk > 0) {
							platformRuntimeDataService.readonly(dto, [{field: 'CustomerFk', readonly: true}]);
						}
					}
				}

				var serviceContainer = platformDataServiceFactory.createNewComplete(salesBillingHeaderServiceOptions),
					service = serviceContainer.service;

				// return company categories based on rubric category from company module (if available)
				service.getCompanyCategoryList = function getCompanyCategoryList() {

					var bidRubricId = service.getRubricId();
					companyCategoryList = $injector.get('salesCommonContextService').getCompanyCategoryListByRubric(bidRubricId);
					return companyCategoryList || [];
				};

				service.getRubricId = function getRubricId() {
					return $injector.get('salesCommonRubric').Billing;
				};

				// functionality for dynamic characteristic configuration
				serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
					characteristicColumn = colName;
				};
				serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
					return characteristicColumn;
				};

				service.checkBilStatus = function (dto) {
					if (dto && dto.BilStatusFk) {
						var bilStatus = $injector.get('salesBillingStatusLookupDataService').getListSync({lookupType: 'salesBillingStatusLookupDataService'}).find(x => x.Id === dto.BilStatusFk);
						if (bilStatus.IsStorno === true) {
							platformRuntimeDataService.readonly(dto, [{
								field: 'IsCanceled',
								readonly: true
							}]);
						}
					}
				};

				serviceContainer.data.clearContentBase = serviceContainer.data.clearContent;
				serviceContainer.data.clearContent = function () {
					serviceContainer.data.clearContentBase(serviceContainer.data);
					var lineItemService = $injector.get('salesBillingEstimateLineItemGcDataService');
					lineItemService.clearContentLI(true);
				};

				// validation processor for new entities
				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'BilHeaderDto',
					moduleSubModule: 'Sales.Billing',
					validationService: 'salesBillingValidationService',
					mustValidateFields: ['TaxCodeFk', 'BusinesspartnerFk', 'CustomerFk', 'VatGroupFk']
				});

				// TODO: rename
				service.callHttpCreate = function callHttpCreate(creationData, optBoqPostData) {
					billCreationData = creationData;
					serviceContainer.data.doCallHTTPCreate(creationData, serviceContainer.data, serviceContainer.data.onCreateSucceeded).then(function (billEntity) {
						const requestData = {
							billId: billEntity.Id,
							contractId: billEntity.OrdHeaderFk
						};
						if (!_.isNull(requestData.contractId)) {
							service.updateAndExecute(function () {
								$http.post(globals.webApiBaseUrl + 'sales/billing/generals/takeoverfromcontract', requestData).then(function () {
									var generalsService = salesCommonGeneralsServiceFactory.getServiceContainer(moduleName);
									generalsService.salesCommonGeneralsService.read().then(function () {
										service.gridRefresh();
									});
								});
							});
						}
						// boq take over data available?
						if (_.isObject(optBoqPostData) && !_.isEmpty(optBoqPostData)) {
							service.updateAndExecute(function () {
								$injector.get('salesCommonCopyBoqService').takeOverBoQs(optBoqPostData, billEntity.Id);
							});

						} else {
							// TODO: auto create boq option
						}
					});
				};

				// override create item (show "create a bill" dialog instead)
				service.createItem = function createBill() {
					var dialogService = $injector.get('salesCommonCreateDialogService');
					if (platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(serviceContainer.data)) {
						var conf = platformDataServiceConfiguredCreateExtension.getServiceConfiguredCreateSettings(serviceContainer.data);
						platformDataServiceConfiguredCreateExtension.createDialogConfigFromConf(serviceContainer.data, conf).then(function (configuredCreateLayout) {
							service.configuredCreateLayout = configuredCreateLayout;
							dialogService.showDialog();
						});
					} else {
						dialogService.showDialog();
					}
					// TODO: not removed yet, old dialog
					// var dialogService = $injector.get('salesBillingCreateBillDialogService');
					// dialogService.resetToDefault();
					// dialogService.showDialog(function (creationData) {
					// service.callHttpCreate(creationData);
					// });
				};

				// configured create function
				service.configuredCreate = function (creationData, optBoqPostData) {
					platformDataServiceActionExtension.createConfiguredItem(creationData, serviceContainer.data).then(function(billEntity) {
						// boq take over data available?
						if (_.isObject(optBoqPostData) && !_.isEmpty(optBoqPostData)) {
							service.updateAndExecute(function () {
								$injector.get('salesCommonCopyBoqService').takeOverBoQs(optBoqPostData, billEntity.Id);
							});
						}
					});
				};

				// check if configurable dialog is activated
				service.isConfigurableDialog = function () {
					return platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(serviceContainer.data);
				};

				var originalDeleteItem = service.deleteItem;

				// override delete item
				service.deleteItem = function deleteBill(billEntity) {
					var postData = {
						mainItemId: billEntity.Id,
						moduleIdentifer: 'sales.billing',
						projectId: billEntity.ProjectFk,
						headerId: 0
					};
					return $http.get(globals.webApiBaseUrl + 'basics/common/dependent/gettotalcount?mainItemId=' + billEntity.Id + '&moduleIdentifer=sales.billing' + '&projectId=' + billEntity.ProjectFk + '&headerId=' + 0, billEntity).then(function (response) {
						var countCannotDelete = response.data;

						if (countCannotDelete > 0) {
							$http.get(globals.webApiBaseUrl + 'sales/billing/isQtoLineWithReadonlyFlagsExist?bilHeaderId=' + billEntity.Id).then(function (response) {
								var modalOptions = { headerTextKey: 'sales.billing.confirmDeleteTitle', bodyTextKey: 'sales.billing.confirmDeleteHeader', iconClass: 'ico-warning', width: '800px' };
								if (response.data) {
									modalOptions = { headerTextKey: 'sales.billing.confirmDeleteTitleForBillWithQto', bodyTextKey: 'sales.billing.confirmDeleteHeaderForBillWithQto', iconClass: 'ico-warning', width: '800px' };
								}
								modalOptions.mainItemId = postData.mainItemId;
								modalOptions.headerId = postData.headerId;
								modalOptions.moduleIdentifer = postData.moduleIdentifer;
								modalOptions.prjectId = postData.projectId;
								return $injector.get('basicsCommonDependentService').showDependentDialog(modalOptions).then(result => {
									if (result && result.yes) {
										// enable option to delete Bil created from QTO -> WIP
										billEntity.IsConfirmToDeleteBillWithQto = true;
										return originalDeleteItem(billEntity);
									}
								});
							});
						} else {
							return originalDeleteItem(billEntity);
						}
					});

					// old dialog
					/* var platformDeleteSelectionDialogService = $injector.get('platformDeleteSelectionDialogService');
					platformDeleteSelectionDialogService.showDialog().then(result => {
						if (result.yes) {
							return serviceContainer.data.deleteItem(billEntity, serviceContainer.data);
						}
					}); */
				};

				salesCommonBusinesspartnerSubsidiaryCustomerService.registerFilters();

				// TODO: check if the same behaviour like reloadBillingSchemas
				service.recalculateBillingSchema = function recalculateBillingSchema() {
					$injector.get('salesBillingSchemaService').recalculateBillingSchema();
				};

				service.reloadBillingSchemas = function reloadBillingSchemas() {
					service.BillingSchemaFkChanged.fire();
				};

				service.BillingSchemaFkChanged = new PlatformMessenger();
				service.onUpdateSucceeded = new PlatformMessenger();
				service.onRecalculationItemsAndBoQ = new PlatformMessenger();
				service.onVatGroupChanged = new PlatformMessenger();

				function setBilHeader(item, triggerField) {
					isLoadByNavigation = true;
					if (triggerField === 'BillingHeaderCode' || triggerField === 'BilHeaderFk') {
						item = {Id: item.BilHeaderFk};
						naviBillingHeaderId = item.Id;
					} else if (triggerField === 'ContractId') {
						navInfo.value = _.get(item, 'Id');
						navInfo.field = 'OrdHeaderFk';
					} else if (triggerField === 'OrdHeaderFk' && _.has(item, triggerField)) {
						navInfo.value = _.get(item, triggerField);
						navInfo.field = 'OrdHeaderFk';
					} else if (triggerField === 'Ids' && typeof item.Ids === 'string') {
						const ids = item.Ids.split(',').map(e => parseInt(e));
						cloudDesktopSidebarService.filterSearchFromPKeys(ids);
					} else {
						naviBillingHeaderId = item.Id ? item.Id : null;
					}
					service.load().then(function (d) {
						item = _.find(d, {Id: item.Id});
						if (item) {
							service.setSelected(item);
						}
					});
				}

				service.createDeepCopy = function createDeepCopy() {
					var selectedBill = service.getSelected();
					var message = $translate.instant('sales.billing.noBillHeaderSelected');
					if (!$injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedBill, 'sales.billing.billSelectionMissing', message)) {
						return;
					}

					var salesBillingCopyBillDialogService = $injector.get('salesBillingCopyBillDialogService');
					salesBillingCopyBillDialogService.showDeepCopyDialog(selectedBill).then(function (result) {
						if (result.success && _.isFunction(_.get(result, 'data.getCopyIdentifiers'))) {
							var copyOptions = {
								entityId: selectedBill.Id,
								creationData: _.get(result, 'data'),
								copyIdentifiers: result.data.getCopyIdentifiers()
							};

							$http.post(globals.webApiBaseUrl + 'sales/billing/deepcopy', copyOptions).then(
								function (response) {
									serviceContainer.data.handleOnCreateSucceeded(response.data.BilHeader, serviceContainer.data);
								},
								function (/* error */) {
								});
						}
					});
				};

				service.setBilHeader = setBilHeader;

				// pinning context (project, bill)
				function setBillToPinningContext(billItem, dataService) {
					return $injector.get('salesCommonUtilsService').setRelatedProjectToPinningContext(billItem, dataService);
				}

				function setCurrentPinningContext(dataService) {
					var currentBillItem = dataService.getSelected();
					if (currentBillItem && angular.isNumber(currentBillItem.ProjectFk)) {
						setBillToPinningContext(currentBillItem, dataService);
					}
				}

				salesCommonExchangerateService.extendByExchangeRateLogic(service);

				// TODO: should be handled by boq now (see #104649)
				// service.exchangeRateChanged.register(function (entity, value) {
				//  service.recalculateAmounts(entity, value);
				// });

				service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData) {
					// if clobs/blobs are to delete, we need to prepare header entity
					// TODO: set all blobs/clobs properties to null
					if (updateData.BilIndirectCostsBalancingConfigToSave && updateData.BilIndirectCostsBalancingConfigToSave.length > 0) {
						$injector.get('salesBillingIndirectBalancingService').updateIndirectCostsBalancingConfig();
					}
					// the cost group to save
					if (updateData.BoqItemToSave && updateData.BoqItemToSave.length > 0) {
						var qtoDetailsToSave = _.map(updateData.BoqItemToSave, 'QtoDetailToSave');
						_.each(qtoDetailsToSave, function (qtoDetailToSave) {
							_.each(qtoDetailToSave, function (item) {
								if (item.QtoDetail) {
									if (item.QtoDetail.CostGroupsToCopy && item.QtoDetail.IsCopy) {
										item.CostGroupToSave = item.QtoDetail.CostGroupsToCopy;
									}
								}
							});
						});
					}

					// Bill2WipToDelete
					if (updateData.Bill2WipToDelete && updateData.Bill2WipToDelete.length > 0) {
						var Bill2Wip = _.map(updateData.Bill2WipToDelete, function (item) {
							return {
								BilHeaderFk: service.getSelected().Id,
								WipHeaderFk: item.Id
							};
						});
						updateData.Bill2WipToDelete = Bill2Wip;
					}

					// handling date issue of boq root item (see 135014, 135620) // TODO: check why UpdatedAt is not correct / to remove next lines
					_.each(_.get(updateData, 'BilBoqCompositeToSave'), (compositeItem) => {
						if (_.has(compositeItem, 'BoqRootItem.UpdatedAt')) {
							delete compositeItem.BoqRootItem.UpdatedAt;
						}
					});
				};

				// TODO: to be removed?
				/*

				var originalDeleteItem = serviceContainer.data.deleteItem;
				serviceContainer.data.deleteItem = function deleteItem(entity, data) {
					var entities = [];
					entities.push(entity);

					var deleteFunc = function (entities, data) {
						var entity = entities;
						if (angular.isArray(entities) && entities.length > 0)
							entity = entities[0];

						originalDeleteItem(entity, data);
					};

					return originalDeleteEntities(entities, data, deleteFunc);
				};

				var originalDeleteEntities = serviceContainer.data.deleteEntities;
				serviceContainer.data.deleteEntities = function deleteEntities(entities, data) {
					return deleteEntities(entities, data, originalDeleteEntities);
				};

				 function deleteEntities(entities, data, deleteFunc) {
					if (angular.isArray(entities) && entities.length > 0) {
						var postData = {BillIds: _.map(entities, 'Id')};
						var notDelBillIds = [], notDelBillIdsForPS = [], billIdsWithQuantities = [];
						return $http.post(globals.webApiBaseUrl + 'sales/billing/candelete', postData).then(function (response) {
							if (response && response.data) {
								notDelBillIds = response.data.notDelbillIds;
								notDelBillIdsForPS = response.data.notDelBillIdsForPS;
								billIdsWithQuantities = response.data.billIdsWithQuantities;
								var notDelBillCodes = [];

								var quantityBillCodes = [];
								var hasQuantitiesRecorded = false;
								if (angular.isArray(billIdsWithQuantities) && billIdsWithQuantities.length > 0) {
									_.forEach(entities, function (entity) {
										var qtyBillId = _.find(billIdsWithQuantities, function (item) {
											if (item === entity.Id) {
												return item;
											}
										});
										var notDelBillId = _.find(notDelBillIds, function (item) {
											if (item === entity.Id) {
												return item;
											}
										});

										if (qtyBillId && !notDelBillId) {
											hasQuantitiesRecorded = true;
											quantityBillCodes.push(entity.BillNo + '-' + entity.DescriptionInfo.Translated);
										}
									});
								}

								if (angular.isArray(notDelBillIds) && notDelBillIds.length > 0) {
									_.forEach(entities, function (entity) {
										for (var i = 0; i < notDelBillIds.length; ++i) {
											if (entity.Id === notDelBillIds[i]) {
												notDelBillCodes.push(entity.BillNo + '-' + entity.DescriptionInfo.Translated);
												break;
											}
										}
									});

									var notDelBillCodeCount = notDelBillCodes.length;
									if (notDelBillCodeCount > 0) {
										notDelBillCodes = _.join(notDelBillCodes, ', ');
										quantityBillCodes = _.join(quantityBillCodes, ', ');
										var errorMsg = '';
										if (hasQuantitiesRecorded) {
											errorMsg = $translate.instant('sales.billing.WarningOfDeleteBill2', {codes: notDelBillCodes, qtyCodes: quantityBillCodes}) + '\n';
										} else {
											errorMsg = $translate.instant('sales.billing.WarningOfDeleteBill', {codes: notDelBillCodes}) + '\n';
										}
										if (notDelBillCodeCount !== entities.length) {
											return platformModalService.showYesNoDialog(errorMsg, 'estimate.assemblies.dialog.confirmAssemblyDelete', 'no');
										} else {
											return platformModalService.showMsgBox(errorMsg, 'basics.customize.message');
										}
									}
								} else if (angular.isArray(notDelBillIdsForPS) && notDelBillIdsForPS.length > 0) {
									_.forEach(entities, function (entity) {
										for (var i = 0; i < notDelBillIdsForPS.length; ++i) {
											if (entity.Id === notDelBillIdsForPS[i]) {
												entity.IsReferencedByOrdPaymentSchedule = true;
												notDelBillCodes.push(entity.BillNo + '-' + entity.DescriptionInfo.Translated);
												break;
											}
										}
									});

									notDelBillCodes = _.join(notDelBillCodes, ', ');
									quantityBillCodes = _.join(quantityBillCodes, ', ');
									let warningMsg;
									if (hasQuantitiesRecorded) {
										warningMsg = $translate.instant('sales.billing.paymentScheduleReference2', {codes: notDelBillCodes, qtyCodes: quantityBillCodes}) + '\n';
									} else {
										warningMsg = $translate.instant('sales.billing.paymentScheduleReference', {codes: notDelBillCodes}) + '\n';
									}
									return platformModalService.showYesNoDialog(warningMsg, 'basics.customize.message', 'no');
								} else if (angular.isArray(billIdsWithQuantities) && billIdsWithQuantities.length > 0) {
									quantityBillCodes = _.join(quantityBillCodes, ', ');
									let warningMsg = $translate.instant('sales.billing.quantitiesRecordedMessage', {qtyCodes: quantityBillCodes}) + '\n';
									return platformModalService.showYesNoDialog(warningMsg, 'basics.customize.message', 'no');
								} else {
									return deleteFunc(entities, data);
								}
							}
						}).then(function (result) {
							if (result && result.yes) {
								var filteredEntities = _.filter(entities, function (entity) {
									return _.indexOf(notDelBillIds, entity.Id) === -1;
								});
								return deleteFunc(filteredEntities, data);
							}
						});
					}
				} */

				function loadAboutGroupSet(response) {
					/** @namespace updateData.BilTransactionToSave */
					if (response && response.BilTransactionToSave && _.find(response.BilTransactionToSave, function (o) {
						/** @namespace o.BilTransaction */
						return o.BilTransaction !== null;
					})) {
						var transactionDataService = $injector.get('salesBillingTransactionService');
						var selectedItem = transactionDataService.getSelected();
						transactionDataService.load().then(function (d) {
							if (selectedItem && selectedItem.Id) {
								var item = _.find(d, {Id: selectedItem.Id});
								if (item) {
									transactionDataService.setSelected(item);
								}
							}
						});
					}
				}

				salesBillingFilterService.registerBillingFilters();

				/**
				 * get module state
				 * @param item target item, default to current selected item
				 * @returns IsReadonly {Isreadonly:true|false}
				 */
				service.getItemStatus = function getItemStatus(item) {
					var state, bilStatuses, parentItem = item || service.getSelected();
					bilStatuses = $injector.get('salesBillingStatusLookupDataService').getListSync('salesBillingStatusLookupDataService');
					if (parentItem && parentItem.Id) {
						state = _.find(bilStatuses, {Id: parentItem.BilStatusFk});
					} else {
						state = {IsReadOnly: true};
					}
					return state;
				};

				service.recalculateAmounts = function recalculateAmounts(entity, exchangeRateData, taxCodeId) {
					var exchangeRate = _.get(exchangeRateData, 'ExchangeRate') || entity.ExchangeRate;
					var lookupDataService = $injector.get('basicsLookupdataLookupDataService');
					lookupDataService.getItemByKey('TaxCode', taxCodeId || entity.TaxCodeFk).then(function (value) {
						entity.AmountGross = (1 + (value.VatPercent / 100)) * entity.AmountNet;

						if (exchangeRate !== null && exchangeRate !== 0) {
							entity.AmountNetOc = entity.AmountNet * exchangeRate;
							entity.AmountGrossOc = entity.AmountGross * exchangeRate;
						}
						service.markItemAsModified(entity);
					});
				};

				service.isLumpsum = function isLumpsum(item) {
					var invoiceTypeId = item.InvoiceTypeFk;
					var billInvoiceTypeLookupOptions = $injector.get('salesBillingInvoiceTypeLookupOptions');
					var invoiceTypeItem = $injector.get('basicsLookupdataSimpleLookupService').getItemByIdSync(invoiceTypeId, billInvoiceTypeLookupOptions);

					if (_.isUndefined(invoiceTypeItem.Islumpsum)) $log.warn('IsLumpsum undefined! (See salesBillingService:isLumpsum.)');
					return invoiceTypeItem.Islumpsum;
				};

				service.isProgressType = function isProgressType(item) {
					var billTypeId = item.TypeFk;
					var billTypeLookupOptions = $injector.get('salesBillingBillTypeLookupOptions');
					var billTypeItem = $injector.get('basicsLookupdataSimpleLookupService').getItemByIdSync(billTypeId, billTypeLookupOptions);

					if (_.isUndefined(billTypeItem.Isprogress)) $log.warn('Isprogress undefined! (See salesBillingService:isProgressType.)');
					return billTypeItem.Isprogress;
				};

				service.calcPaymentTermDates = function calcPaymentTermDates(entity, paymentTermId, billDate, dateEffective) {
					billDate = billDate || entity.BillDate;
					dateEffective = dateEffective || entity.DateEffective;
					if (paymentTermId === 0 || paymentTermId === null) $log.warn('Passed PaymentTerm is 0 or null!');
					var basicsLookupdataLookupDataService = $injector.get('basicsLookupdataLookupDataService');
					basicsLookupdataLookupDataService.getItemByKey('PaymentTerm', paymentTermId).then(function (paymentTerm) {
						if (_.isObject(paymentTerm)) {
							// for the moment we re-use the procurements calculation service
							var paymentTermCalculationService = $injector.get('paymentTermCalculationService');
							var resultHeader = paymentTermCalculationService.calculateDate(paymentTerm.IsDateInvoiced ?
								{DateInvoiced: billDate} : {DateReceived: dateEffective}, paymentTerm);

							if (_.isUndefined(resultHeader.dateDiscount) || _.isUndefined(resultHeader.dateNetPayable)) {
								$log.warn('Isprogress undefined! (See salesBillingValidationService:calcPaymentTermDates.)');
							}
							entity.DateDiscount = resultHeader.dateDiscount;
							entity.DateNetpayable = resultHeader.dateNetPayable;
						} else {
							$log.warn('PaymentTerm is not available for passed id (' + paymentTermId + ')');
						}
					});
				};

				service.updateAmounts = function (amountNet, amountNetOc, amountGross, amountGrossOc) {
					var selectedBill = service.getSelected();
					selectedBill.AmountNet = amountNet;
					selectedBill.AmountNetOc = amountNetOc;
					selectedBill.AmountGross = amountGross;
					selectedBill.AmountGrossOc = amountGrossOc;

					// prevent from mark as modified if boq data is not modified
					// so we check the module state
					var state = $injector.get('platformModuleStateService').state(service.getModule());
					if (!_.isEmpty(_.get(state, 'modifications.BoqItemToSave')) ||
						!_.isEmpty(_.get(state, 'modifications.BoqItemToDelete')) ||
						!_.isEmpty(_.get(state, 'modifications.BilBoqCompositeToDelete'))
					) {
						service.markItemAsModified(selectedBill);
					}
				};

				service.updateHeader = function updateHeader(billHeader) {
					var data = serviceContainer.data;
					var dataEntity = data.getItemById(billHeader.Id, data);
					data.mergeItemAfterSuccessfullUpdate(dataEntity, billHeader, true, data);
				};

				service.checkItemIsReadOnly = function (item) {
					return $injector.get('salesCommonStatusHelperService').checkIsReadOnly('salesBillingStatusLookupDataService', 'BilStatusFk', item);
				};

				service.cellChange = function (entity, field) {
					if (field === 'VatGroupFk' || field === 'TaxCodeFk') {
						var myDialogOptions = {
							headerTextKey: 'sales.common.Warning',
							bodyTextKey: 'sales.common.changeBpdVatGroupFk',
							showYesButton: true,
							showNoButton: true,
							iconClass: 'ico-question'
						};
						if (field === 'VatGroupFk') {
							service.onVatGroupChanged.fire({VatGroupFk: entity[field]});
						}
						var platformModalService = $injector.get('platformModalService');
						platformModalService.showDialog(myDialogOptions).then(function (result) {
							if (result.yes) {
								service.markItemAsModified(entity);
								service.update().then(function () {
									var selected = service.getSelected();
									$http.get(globals.webApiBaseUrl + 'sales/billing/RecalculationBoQ?billingHeaderId=' + entity.Id + '&vatGroupFk=' + entity.VatGroupFk + '&defaultTaxCodeFk=' + entity.TaxCodeFk + '&updateModel=' + field).then(function (res) {
										if (res.data) {
											var list = service.getList();
											var currentItemIndex = _.findIndex(list, {Id: res.data.Id});
											if ((currentItemIndex || currentItemIndex === 0) && currentItemIndex > -1) {
												list.splice(currentItemIndex, 1, res.data);
												serviceContainer.data.itemList = list;
												serviceContainer.data.selectedItem = null;
												service.gridRefresh();
												service.setSelected(res.data);
												service.onUpdateSucceeded.fire({
													updateData: {
														EntitiesCount: 1,
														MainItemId: res.data.Id,
														BidHeader: selected
													},
													response: res.data
												});
											}
										}
										service.onRecalculationItemsAndBoQ.fire();
									});
								});
							}
						});

					}

				};

				service.syncLineItems = function (items) {
					serviceContainer.data.updatedLineItems = items;
				};
				
				service.registerSelectionChanged(function (e, item) {
					if (item) {
						$injector.get('salesCommonFunctionalRoleService').handleFunctionalRole(item.OrdHeaderFk);

						var containerGUIDs = [ // TODO: make more generic!
							'1614ed65978741289965a4595a2becbd', // Characteristic      // checked
							'024a6871ea284639b80307eef7af32be', // Generals            // checked
							'9715b5644bb84661985187e09ae646ac', // Billing Schema      // checked
							'eb36fda6b4de4965b4e98ec012d0506b', // Bill Item           // checked
							'd9cb8c6e6cdb44daa4ef02f6f64fe750', // Payment             // checked
							'2d5e03e10f484ba687aede096c618680',  // UserForm            // checked
							'65294188ea2f4aeea7f1243ecf096434',// boq structure
							'03e13f5f6c6e44a8ae8cd897814887ac'  // boq list
							// 'c34718f7f1b446aba797b056a0b1dde0'// Document            // checked (see #107271)
						];
						// TODO: reset to previous value!
						var permission = (item.IsBilled || item.IsReadOnly || platformRuntimeDataService.isReadonly(item)) ? permissions.read : false;
						// #see 106021 and 116385
						platformPermissionService.restrict(containerGUIDs, permission);
					}
				});

				service.getDefaultListForCreatedPerSection = function getDefaultListForCreatedPerSection(newBill, sectionId) {
					return $injector.get('salesCommonUtilsService').getCharacteristicsDefaultListForCreatedPerSection(newBill, sectionId);
				};

				var filters = [
					{
						key: 'sales-billing-contact-by-bizpartner-server-filter',
						serverSide: true,
						serverKey: 'business-partner-contact-filter-by-simple-business-partner',
						fn: function (entity) {
							return {
								BusinessPartnerFk: entity.BusinesspartnerFk
							};
						}
					}
				];
				basicsLookupdataLookupFilterService.registerFilter(filters);

				// TODO: refactor
				service.addNewBill = function addNewBill(newBill) {
					return serviceContainer.data.handleOnCreateSucceeded(newBill, serviceContainer.data);
				};

				serviceContainer.data.handleOnCreateSucceeded = function handleOnCreateSucceeded(newItem, data) {
					return $injector.get('salesCommonUtilsService').handleOnCreateSucceededInListSetToTop(newItem, data, service);
				};

				var onAmountNetValueChanged = new PlatformMessenger();

				service.registerAmountNetValueChanged = function registerPropertyChanged(func) {
					onAmountNetValueChanged.register(func);
				};
				service.unregisterAmountNetValueChanged = function unregisterPropertyChanged(func) {
					onAmountNetValueChanged.unregister(func);
				};

				service.fireAmountNetValueChanged = function firePropertyChanged(entity) {
					onAmountNetValueChanged.fire(null, entity);
				};

				service.changeSalesConfigOrType = function changeSalesConfigOrType(TypeFk,RubricCategoryFk,ConfigurationFk,OrdHeaderFk,PrjChangeFk,item) {
					if (TypeFk > 0 &&RubricCategoryFk > 0 && ConfigurationFk > 0 && _.isObject(item)) {
						item.TypeFk = TypeFk;
						item.RubricCategoryFk = RubricCategoryFk;
						item.ConfigurationFk = ConfigurationFk;
						_.each(service.getDataProcessor(), function (proc) {
							proc.processItem(item);
						});
						service.markItemAsModified(item);
					}
				};

				// TODO: If refactoring is needed DEV-37214
				service.getSelectedProjectId = function getSelectedProjectId() {
					let item = service.getSelected(); return item ? item.ProjectFk : 0;
				};

				return service;
			}]);
})();
