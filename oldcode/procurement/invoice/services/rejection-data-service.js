(function (angular) {
	'use strict';
	var moduleName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementInvoiceRejectionDataService',
		['platformDataServiceFactory', 'procurementInvoiceHeaderDataService',
			'basicsLookupdataLookupDescriptorService', 'procurementContextService',
			'procurementInvoiceRejectionReadonlyProcessor', 'invoiceHeaderElementValidationService', 'prcCommonCalculationHelper', 'basicsLookupdataLookupFilterService', 'platformContextService','basicsCommonReadDataInterceptor',
			'procurementCommonHelperService',
			function (dataServiceFactory, parentService, lookupDescriptorService,
				moduleContext, readonlyProcessor, invoiceHeaderValidationService, prcCommonCalculationHelper, basicsLookupdataLookupFilterService, platformContextService,readDataInterceptor, procurementCommonHelperService) {
				var serviceContainer;
				var service;
				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						dataProcessor: [readonlyProcessor],
						httpCreate: {route: globals.webApiBaseUrl + 'procurement/invoice/reject/'},
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/invoice/reject/',
							initReadData: function initReadData(readData) {
								readData.filter = '?mainItemId=' + parentService.getSelected().Id;
							}
						},
						actions: {
							delete: true,
							create: 'flat',
							canCreateCallBackFunc: function () {
								return !moduleContext.isReadOnly;
							},
							canDeleteCallBackFunc: function () {
								return !moduleContext.isReadOnly;
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
								},
								handleCreateSucceeded: function (newData) {
									newData.Quantity = 1;
								}
							}
						},
						entityRole: {
							node: {
								itemName: 'InvReject',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				service = serviceContainer.service;
				readDataInterceptor.init(service, serviceContainer.data);
				new procurementCommonHelperService.addAutoSaveHandlerFunctions(service, serviceContainer);
				function onModuleReadonlyStatusChange(key) {
					if (key !== moduleContext.moduleStatusKey) {
						return;
					}

					angular.forEach(service.getList(), function (item) {
						readonlyProcessor.processItem(item);
					});
				}

				moduleContext.moduleValueChanged.register(onModuleReadonlyStatusChange);

				// (e=>null, deletedItems=>all deleted items)
				// replace the logic of onDeleteDone, done by stone.
				var onEntityDeleted = function onEntityDeleted(/* e, deletedItems */) {
					service.recalcuteReject();
				};
				serviceContainer.service.registerEntityDeleted(onEntityDeleted);

				service.recalcuteReject = function recalcuteReject() {
					var amountTotalOc = 0, vatOc = 0;
					var lookUpItems = lookupDescriptorService.getData('TaxCode');
					_.forEach(service.getList(), function (item) {
						var lookUpItem = lookUpItems[item.TaxCodeFk];
						var vatPercent = 0;
						if (item.NetTotalOc !== 0) {
							amountTotalOc += item.NetTotalOc;
							if (lookUpItem) {
								vatPercent = service.getVatPercentWithTaxCodeMatrix(item.TaxCodeFk);
								vatOc += prcCommonCalculationHelper.round(item.NetTotalOc * vatPercent / 100);
							}
						} else {
							amountTotalOc += item.AmountTotalOc;
							if (lookUpItem) {
								vatPercent = service.getVatPercentWithTaxCodeMatrix(item.TaxCodeFk);
								vatOc += prcCommonCalculationHelper.round(item.AmountTotalOc * vatPercent / 100);
							}
						}
					});

					invoiceHeaderValidationService.recalcuteReject(amountTotalOc, vatOc);
				};

				// noinspection JSUnusedLocalSymbols
				function exchangeUpdated(e, args) {
					var exchangeRate = args.ExchangeRate;
					_.forEach(service.getList(), function (item) {
						item.AmountNet = prcCommonCalculationHelper.round(exchangeRate === 0 ? 0 : item.AmountNetOc / exchangeRate);
						item.AmountTotal = prcCommonCalculationHelper.round(exchangeRate === 0 ? 0 : item.AmountTotalOc / exchangeRate);
						item.PriceAskedFor = prcCommonCalculationHelper.round(exchangeRate === 0 ? 0 : item.PriceAskedForOc / exchangeRate);
						item.PriceConfirmed = prcCommonCalculationHelper.round(exchangeRate === 0 ? 0 : item.PriceConfirmedOc / exchangeRate);
						item.AskedForTotal = prcCommonCalculationHelper.round(exchangeRate === 0 ? 0 : item.AskedForTotalOc / exchangeRate);
						item.ConfirmedTotal = prcCommonCalculationHelper.round(exchangeRate === 0 ? 0 : item.ConfirmedTotalOc / exchangeRate);
						item.NetTotal = prcCommonCalculationHelper.round(exchangeRate === 0 ? 0 : item.NetTotalOc / exchangeRate);
						service.markItemAsModified(item);
					});
					service.recalcuteReject();
				}

				parentService.exchangeRateChangedEvent.register(exchangeUpdated);

				basicsLookupdataLookupFilterService.registerFilter([{
					key: 'procurement-invoice-rejection-rejection-filter',
					serverSide: true,
					fn: function () {
						var invoice = parentService.getSelected();
						return 'BusinessPartnerFk=' + invoice.BusinessPartnerFk + ' and CompanyFk=' + invoice.CompanyFk + ' and InvHeaderFk!= ' + invoice.Id;
					}
				}, {
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
				}]);

				service.getVatPercentWithTaxCodeMatrix = function getVatPercentWithTaxCodeMatrix(taxCodeFk, vatGroupFk) {
					return parentService.getVatPercentWithTaxCodeMatrix(taxCodeFk, vatGroupFk);
				};

				function vatGroupChanged() {
					service.recalcuteReject();
				}

				parentService.vatGroupChanged.register(vatGroupChanged);

				let onCompleteEntityCreated = function onCompleteEntityCreated(e, completeData) {
					/** @namespace completeData.InvRejects */
					service.setCreatedItems(completeData.InvRejects || []);
				};
				parentService.completeEntityCreateed.register(onCompleteEntityCreated);
				return service;
			}]);
})(angular);