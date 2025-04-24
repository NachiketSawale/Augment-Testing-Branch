(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_, math */
	var moduleName = 'procurement.invoice';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementInvoiceOtherDataService',
		['platformDataServiceFactory', 'procurementInvoiceHeaderDataService',
			'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService',
			'procurementContextService', 'procurementInvoiceOtherReadonlyProcessor', 'invoiceHeaderElementValidationService','basicsCommonMandatoryProcessor',
			'prcCommonCalculationHelper', 'platformRuntimeDataService', 'prcGetIsCalculateOverGrossService','platformContextService',
			'prcCommonItemCalculationHelperService', '$http','basicsCommonReadDataInterceptor', 'procurementCommonHelperService',
			function (dataServiceFactory, parentService, lookupDescriptorService,
				basicsLookupdataLookupFilterService, moduleContext, readonlyProcessor, invoiceHeaderValidationService,basicsCommonMandatoryProcessor,
				prcCommonCalculationHelper, platformRuntimeDataService, prcGetIsCalculateOverGrossService,platformContextService,
				itemCalculationHelper, $http,readDataInterceptor, procurementCommonHelperService) {

				var serviceContainer;
				var service;
				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						dataProcessor: [readonlyProcessor],
						serviceName: 'procurementInvoiceOtherDataService',
						httpCreate: {route: globals.webApiBaseUrl + 'procurement/invoice/other/'},
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/invoice/other/',
							initReadData: function initReadData(readData) {
								readData.filter = '?mainItemId=' + parentService.getSelected().Id;
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									lookupDescriptorService.attachData(readData);
									var items = serviceContainer.data.handleReadSucceeded(readData.Main, data, true);
									if (items.length > 0) {
										service.setSelected(items[0]);
									}
									return items;
								},
								initCreationData: function (creationData) {
									creationData.mainItemId = parentService.getSelected().Id;
									creationData.headerBillingSchemaFk = parentService.getSelected().BillingSchemaFk;
									creationData.headerCompanyDeferalTypeFk = parentService.getSelected().CompanyDeferalTypeFk;
								},
								handleCreateSucceeded:function(item){
									var parentSelected = parentService.getSelected();
									if(parentSelected){
										item.PrcStructureFk = parentSelected.PrcStructureFk;
										item.ControllingUnitFk = parentSelected.ControllingUnitFk;
										item.TaxCodeFk = parentSelected.TaxCodeFk;
									}
									item.Quantity = 1;
									item.isAdd = true;
									item.AmountNet = round(math.bignumber(parentSelected.AmountNetBalance).div(item.Quantity));
									item.AmountNetOc = round(math.bignumber(parentSelected.AmountNetBalanceOc).div(item.Quantity));
									item.AmountGross = round(math.bignumber(parentSelected.AmountGrossBalance).div(item.Quantity));
									item.AmountGrossOc = round(math.bignumber(parentSelected.AmountGrossBalanceOc).div(item.Quantity));
									setTotalAndItsGross(item);
									return item;
								}
							}
						},
						actions: {
							delete: true,
							create: 'flat',
							canCreateCallBackFunc: function () {
								var rightByStatus = parentService.haveRightByStatus('InvStatusCreateRightToOther');
								var editRightByStatus = parentService.haveRightByStatus('InvStatusEditRightToOther');
								if (rightByStatus.hasDescriptor || (editRightByStatus && editRightByStatus.hasDescriptor)) {
									return true;
								}
								return !moduleContext.isReadOnly && rightByStatus.right;
							},
							canDeleteCallBackFunc: function () {
								var rightByStatus = parentService.haveRightByStatus('InvStatusDeleteRightToOther');
								var editRightByStatus = parentService.haveRightByStatus('InvStatusEditRightToOther');
								if (rightByStatus.hasDescriptor || (editRightByStatus && editRightByStatus.hasDescriptor)) {
									return true;
								}
								return !moduleContext.isReadOnly && rightByStatus.right;
							}
						},
						entityRole: {
							node: {
								itemName: 'InvOther',
								parentService: parentService,
								doesRequireLoadAlways:true
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				service = serviceContainer.service;
				new procurementCommonHelperService.addAutoSaveHandlerFunctions(service, serviceContainer);

				readDataInterceptor.init(service, serviceContainer.data);

				var filters = [
					{
						key: 'prc-invoice-procurement-structure-filter',
						fn: function (dataItem) {
							return dataItem.PrcStructureTypeFk === 1;
						}
					},{
						key: 'saleTaxCodeByLedgerContext-filter',
						serverSide: false,
						fn: function (item) {
							var loginCompanyFk = platformContextService.clientId;
							var LedgerContextFk;
							if (loginCompanyFk) {
								var companies = lookupDescriptorService.getData('Company');
								let company = _.find(companies, {Id: loginCompanyFk});
								if (company) {
									LedgerContextFk = company.LedgerContextFk;
								}
							}
							return (item.LedgerContextFk === LedgerContextFk) && item.IsLive;
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(filters);

				function onModuleReadonlyStatusChange(key) {
					if (key !== moduleContext.moduleStatusKey) {
						return;
					}

					angular.forEach(service.getList(), function (item) {
						readonlyProcessor.processItem(item);
					});
				}

				moduleContext.moduleValueChanged.register(onModuleReadonlyStatusChange);

				function setTotalAndItsGross(item) {
					var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					var vatPercent = service.getVatPercentWithTaxCodeMatrix(item.TaxCodeFk);
					var parentItem = parentService.getSelected();
					var exchangeRate = 0;
					if (parentItem && parentItem.Id) {
						exchangeRate = parentItem.ExchangeRate;
					}
					if (isOverGross) {
						item.AmountTotalGrossOc = round(math.bignumber(item.Quantity).mul(item.AmountGrossOc));
						item.AmountTotalGross = itemCalculationHelper.getNonOcByOc(item.AmountTotalGrossOc, exchangeRate);
						item.AmountTotalOc = itemCalculationHelper.getPreTaxByAfterTax(item.AmountTotalGrossOc, vatPercent);
						item.AmountTotal = itemCalculationHelper.getPreTaxByAfterTax(item.AmountTotalGross, vatPercent);
					}
					else {
						item.AmountTotalOc = round(math.bignumber(item.AmountNetOc).mul(item.Quantity));
						item.AmountTotal = itemCalculationHelper.getNonOcByOc(item.AmountTotalOc, exchangeRate);
						item.AmountTotalGrossOc = itemCalculationHelper.getAfterTaxByPreTax(item.AmountTotalOc, vatPercent);
						item.AmountTotalGross = itemCalculationHelper.getAfterTaxByPreTax(item.AmountTotal, vatPercent);
					}
				}

				function calculationAfterVatpercentChange(item) {
					var parentItem = parentService.getSelected();
					var exchangeRate = 0;
					var vatPercent = service.getVatPercentWithTaxCodeMatrix(item.TaxCodeFk);
					var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					if (parentItem && parentItem.Id) {
						exchangeRate = parentItem.ExchangeRate;
					}

					if (isOverGross) {
						item.AmountNet = itemCalculationHelper.getPreTaxByAfterTax(item.AmountGross, vatPercent);
						item.AmountNetOc = itemCalculationHelper.getPreTaxByAfterTax(item.AmountGrossOc, vatPercent);
						item.AmountTotal = round(math.bignumber(item.AmountNet).mul(item.Quantity));
						item.AmountTotalOc = round(math.bignumber(item.AmountNetOc).mul(item.Quantity));
					}
					else {
						item.AmountGross = itemCalculationHelper.getAfterTaxByPreTax(item.AmountNet, vatPercent);
						item.AmountGrossOc = itemCalculationHelper.getOcByNonOc(item.AmountGross, exchangeRate);
						item.AmountTotalGross = round(math.bignumber(item.Quantity).mul(item.AmountGross));
						item.AmountTotalGrossOc = round(math.bignumber(item.Quantity).mul(item.AmountGrossOc));
					}

				}

				/* var baseOnDeleteDone = serviceContainer.data.onDeleteDone;
				serviceContainer.data.onDeleteDone = function onDeleteDoneInList() {
					baseOnDeleteDone.apply(serviceContainer.data, arguments);
					service.recalcuteOther();
				}; */

				// (e=>null, deletedItems=>all deleted items)
				// replace the logic of onDeleteDone, done by stone.
				var onEntityDeleted = function onEntityDeleted(/* e, deletedItems */) {
					service.recalcuteOther();
				};
				serviceContainer.service.registerEntityDeleted(onEntityDeleted);

				service.recalcuteOther = function recalcuteOther() { // jshint ignore:line
					var amountTotal = 0, amountTotalOc = 0, amountTotalGross = 0, amountTotalGrossOc = 0;
					_.forEach(service.getList(), function (item) {
						amountTotalGrossOc = round(math.bignumber(amountTotalGrossOc).add(item.AmountTotalGrossOc));
						amountTotalGross = round(math.bignumber(amountTotalGross).add(item.AmountTotalGross));
						amountTotalOc = round(math.bignumber(amountTotalOc).add(item.AmountTotalOc));
						amountTotal = round(math.bignumber(amountTotal).add(item.AmountTotal));
					});

					invoiceHeaderValidationService.recalcuteOther(amountTotalOc, amountTotal, amountTotalGrossOc, amountTotalGross);
				};

				service.getVatPercentWithTaxCodeMatrix = function getVatPercentWithTaxCodeMatrix(taxCodeFk, vatGroupFk) {
					return parentService.getVatPercentWithTaxCodeMatrix(taxCodeFk, vatGroupFk);
				};

				service.calculationAfterVatpercentChange = calculationAfterVatpercentChange;

				service.setTotalAndItsGross = setTotalAndItsGross;

				// noinspection JSUnusedLocalSymbols
				function exchangeUpdated(e, args) {
					var exchangeRate = args.ExchangeRate;
					_.forEach(service.getList(), function (item) {
						item.AmountNet = itemCalculationHelper.getNonOcByOc(item.AmountNetOc, exchangeRate);
						item.AmountTotal = itemCalculationHelper.getNonOcByOc(item.AmountTotalOc, exchangeRate);
						item.AmountGross = itemCalculationHelper.getNonOcByOc(item.AmountGrossOc, exchangeRate);
						item.AmountTotalGross = itemCalculationHelper.getNonOcByOc(item.AmountTotalGrossOc, exchangeRate);
						service.markItemAsModified(item);
					});
					service.recalcuteOther();
				}
				parentService.exchangeRateChangedEvent.register(exchangeUpdated);

				function billingSchemaChanged(e, invHeader) {
					let billingSchemas = lookupDescriptorService.getData('PrcConfig2BSchema');
					let parentItem = parentService.getSelected() || invHeader;
					let currentLists = service.getList();
					if (parentItem !== null && parentItem.BillingSchemaFk) {
						let billingSchema = _.find(billingSchemas, {Id: parentItem.BillingSchemaFk});
						let isChanined = false;
						if (billingSchema && billingSchema.IsChained) {
							isChanined = true;
						}
						currentLists.forEach(function(item) {
							platformRuntimeDataService.readonly(item, [
								{field: 'BasCompanyDeferalTypeFk', readonly: isChanined},
								{field: 'DateDeferalStart', readonly: isChanined}
							]);
							if (isChanined && (item.BasCompanyDeferalTypeFk !== null || item.DateDeferalStart !== null)) {
								item.BasCompanyDeferalTypeFk = null;
								item.DateDeferalStart = null;
								service.markItemAsModified(item);
							}
						});
					}
				}
				parentService.BillingSchemaChanged.register(billingSchemaChanged);

				function vatGroupChanged() {
					var list = service.getList();
					if (list && list.length) {
						_.forEach(list, function (item) {
							calculationAfterVatpercentChange(item);
							serviceContainer.service.gridRefresh();
						});
						serviceContainer.service.markEntitiesAsModified(list);
					}
					service.recalcuteOther();
				}
				parentService.vatGroupChanged.register(vatGroupChanged);

				function round(value) {
					return prcCommonCalculationHelper.round(value);
				}

				/* serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'InvOtherDto',
					moduleSubModule: 'Procurement.Invoice',
					validationService: 'procurementInvoiceOtherValidationService',
					mustValidateFields: true
				}); */

				service.refreshAccountInfo = function (items) {
					let dtos = [];

					if (items) {
						dtos = items;
					} else {
						dtos = service.getList();
					}

					if (dtos.length) {
						dtos = dtos.filter(item => {
							if (!item.PrcStructureFk || item.PrcStructureFk < 0) {
								item.Account = null;
								item.AccountDesc = null;
								return false;
							}
							return true;
						});

						if (dtos.length) {
							$http.post(globals.webApiBaseUrl + 'procurement/invoice/other/refreshaccount', {
								Dtos: dtos
							}).then(res => {
								res.data.Dtos.forEach(item => {
									const target = _.find(dtos, {
										Id: item.Id
									});

									if (target) {
										target.Account = item.Account;
										target.AccountDesc = item.AccountDesc;
									}
								});
								service.gridRefresh();
							});
						} else {
							service.gridRefresh();
						}
					}
				};

				parentService.onUpdateSucceeded.register(()=> {
					service.refreshAccountInfo();
				});

				let onCompleteEntityCreated = function onCompleteEntityCreated(e, completeData) {
					/** @namespace completeData.InvOthers */
					service.setCreatedItems(completeData.InvOthers || []);
				};

				parentService.completeEntityCreateed.register(onCompleteEntityCreated);
				return service;
			}]);
})();