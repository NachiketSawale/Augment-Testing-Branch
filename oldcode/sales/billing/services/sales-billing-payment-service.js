/**
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
	 * @name salesBillingPaymentService
	 * @function
	 *
	 * @description
	 * salesBillingPaymentService data service for handling billing payment entities
	 */
	salesBillingModule.factory('salesBillingPaymentService',
		['_', 'salesBillingService', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension', 'PlatformMessenger', 'salesBillingPaymentReadonlyProcessor', 'basicsLookupdataLookupFilterService', 'salesCommonContextService', 'salesCommonExchangerateService', '$http', 'prcCommonCalculationHelper', 'platformRuntimeDataService', '$injector',
			function (_, salesBillingService, platformDataServiceFactory, ServiceDataProcessDatesExtension, PlatformMessenger, salesBillingPaymentReadonlyProcessor, LookupFilterService, salesCommonContextService, salesCommonExchangerateService, $http, prcCommonCalculationHelper, platformRuntimeDataService, $injector) {

				var dateProcessor = new ServiceDataProcessDatesExtension(['PaymentDate', 'PostingDate']);
				var salesBillingPaymentServiceOption = {
					flatLeafItem: {
						module: salesBillingModule,
						serviceName: 'salesBillingPaymentService',
						httpCreate: {route: globals.webApiBaseUrl + 'sales/billing/payment/', endCreate: 'create'},
						httpRead: {
							route: globals.webApiBaseUrl + 'sales/billing/payment/',
							endRead: 'listByParent',
							usePostForRead: true,
							initReadData: function (readData) {
								readData.PKey1 = _.get(salesBillingService.getSelected(), 'Id');
							}
						},
						httpUpdate: {route: globals.webApiBaseUrl + 'sales/billing/', endUpdate: 'update'},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.PKey1 = _.get(salesBillingService.getSelected(), 'Id');
								},
								handleCreateSucceeded: function (item) {
									item.AmountNet = 0;
									item.DiscountAmountNet = 0;
									item.AmountNetOc = 0;
									item.DiscountAmountNetOc = 0;
								}
							}
						},
						dataProcessor: [dateProcessor, salesBillingPaymentReadonlyProcessor], // TODO: add image processor
						entityRole: {
							leaf: {itemName: 'BilPayment', parentService: salesBillingService}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(salesBillingPaymentServiceOption);
				var service = serviceContainer.service;

				var oldDeleteDone = serviceContainer.data.onDeleteDone;
				serviceContainer.data.onDeleteDone = onDeleteDoneInList;

				function onDeleteDoneInList(deleteParams, data, response) {
					service.firePaymentsDelete(angular.copy(deleteParams.entities));
					oldDeleteDone(deleteParams, data, response);
				}

				var onPaymentsAmountTotalUpdate = new PlatformMessenger();
				var onPaymentsDiscountAmountTotalUpdate = new PlatformMessenger();
				var onPaymentsDelete = new PlatformMessenger();

				// AmountVat update
				service.registerPaymentsAmountTotalUpdate = function registerPaymentsAmountTotalUpdate(func) {
					onPaymentsAmountTotalUpdate.register(func);
				};
				service.unregisterPaymentsAmountTotalUpdate = function unregisterPaymentsAmountTotalUpdate(func) {
					onPaymentsAmountTotalUpdate.unregister(func);
				};
				service.firePaymentsAmountTotalUpdate = function(item){
					onPaymentsAmountTotalUpdate.fire(null, item);
				};

				// DiscountAmount update
				service.registerPaymentsDiscountAmountTotalUpdate = function registerPaymentsDiscountAmountTotalUpdate(func) {
					onPaymentsDiscountAmountTotalUpdate.register(func);
				};
				service.unregisterPaymentsDiscountAmountTotalUpdate = function unregisterPaymentsDiscountAmountTotalUpdate(func) {
					onPaymentsDiscountAmountTotalUpdate.unregister(func);
				};
				service.firePaymentsDiscountAmountTotalUpdate = function(item){
					onPaymentsDiscountAmountTotalUpdate.fire(null, item);
				};

				// delete payments
				service.registerPaymentsDelete = function registerPaymentsDelete(func){
					onPaymentsDelete.register(func);
				};
				service.unregisterPaymentsDelete = function unregisterPaymentsDelete(func){
					onPaymentsDelete.unregister(func);
				};
				service.firePaymentsDelete = function(items){
					onPaymentsDelete.fire(null, items);
				};

				var company = salesCommonContextService.getCompany();
				var companyId = _.get(company, 'Id');
				var filters = [{
					key: 'bas-currency-conversion-filter-in-billing',
					serverSide: true,
					serverKey: 'bas-currency-conversion-filter',
					fn: function () {
						return {companyFk: companyId};
					}
				}];
				LookupFilterService.registerFilter(filters);

				salesCommonExchangerateService.extendByExchangeRateLogic(service);
				service.updateExchangeRateRequest = function updateExchangeRateRequest(entity, options, url) {
					var newCurrency = options.NewCurrencyId ? options.NewCurrencyId : entity.CurrencyFk;
					var params = {
						RemainNet: options.RemainNet,
						NewRate: options.NewRate,
						NewCurrencyId: newCurrency,
						Entity: entity
					};
					if (entity.Version === 0) {
						var rate = options.NewRate;
						if (options.RemainNet) {
							entity.AmountNetOc = prcCommonCalculationHelper.round(entity.AmountNet * rate);
							entity.AmountVatOc = prcCommonCalculationHelper.round(entity.AmountVat * rate);
							entity.AmountOc = prcCommonCalculationHelper.round(entity.Amount * rate);
							entity.DiscountAmountOc = prcCommonCalculationHelper.round(entity.DiscountAmount * rate);
							entity.DiscountAmountNetOc = prcCommonCalculationHelper.round(entity.DiscountAmountNet * rate);
							entity.DiscountAmountVatOc = prcCommonCalculationHelper.round(entity.DiscountAmountVat * rate);
						}
						else {
							entity.AmountNet = prcCommonCalculationHelper.round(entity.AmountNetOc / rate);
							entity.AmountVat = prcCommonCalculationHelper.round(entity.AmountVatOc / rate);
							entity.Amount = prcCommonCalculationHelper.round(entity.AmountOc / rate);
							entity.DiscountAmount = prcCommonCalculationHelper.round(entity.DiscountAmountOc / rate);
							entity.DiscountAmountNet = prcCommonCalculationHelper.round(entity.DiscountAmountNetOc / rate);
							entity.DiscountAmountVat = prcCommonCalculationHelper.round(entity.DiscountAmountVatOc / rate);
						}
						entity.ExchangeRate = rate;
						entity.CurrencyFk = newCurrency;
						setTimeout(function () {
							service.markItemAsModified(entity);
							salesBillingPaymentReadonlyProcessor.processItem(entity);
							service.gridRefresh();
						});
					}
					else {
						$http.post(url, params)
							.then(function (result) {
								if (result.data) {
									var updatedEntity = result.data;
									var selectedItem = _.find(service.getList(), {Id: updatedEntity.Id});
									if (selectedItem) {
										angular.extend(selectedItem, updatedEntity);
										dateProcessor.processItem(selectedItem);
										service.setSelected({}).then(function(){
											service.setSelected(selectedItem);
											salesBillingPaymentReadonlyProcessor.processItem(selectedItem);
											service.gridRefresh();
										});
									}
								}
							});
					}
				};

				function getVatPercent(entity, taxCodeId, vatGroupFK) {
					var taxCodeMatrix = null;
					if (vatGroupFK > 0) {
						var taxCodeMatrixList = $injector.get('basicsLookupdataLookupDescriptorService').getData('Sales_TaxCodeMatrix');
						taxCodeMatrix = _.find(taxCodeMatrixList, {
							TaxCodeFk: taxCodeId,
							VatGroupFk: vatGroupFK
						});
					}

					if (_.isObject(taxCodeMatrix) && taxCodeMatrix !== null) {
						return taxCodeMatrix.VatPercent * 1.0;
					} else {
						var taxCodes = $injector.get('basicsLookupdataLookupDescriptorService').getData('TaxCode');
						var taxCode = _.find(taxCodes, {Id: taxCodeId}) || null;
						return taxCode === null ? 0 : taxCode.VatPercent * 1.0;
					}
				}

				function getExchangeRate(item) {
					if (item.CurrencyFk) {
						return item.ExchangeRate;
					}
					var parentSelected = salesBillingService.getSelected();
					return parentSelected.ExchangeRate;
				}

				function fellowHeaderVatGroupChanged(param) {
					var payments = service.getList();
					_.forEach(payments, function(entity) {
						var rate = getExchangeRate(entity);
						var vatPercent = getVatPercent(entity, entity['TaxCodeFk'], param.VatGroupFk);
						entity.AmountVat = entity.AmountNet * (vatPercent / 100);
						entity.Amount = entity.AmountNet + entity.AmountVat;
						entity.AmountVatOc = entity.AmountVat * rate;
						entity.AmountOc = entity.Amount * rate;

						entity.DiscountAmountVat = entity.DiscountAmountNet * (vatPercent / 100);
						entity.DiscountAmount = entity.DiscountAmountNet + entity.DiscountAmountVat;
						entity.DiscountAmountVatOc = entity.DiscountAmountVat * rate;
						entity.DiscountAmountOc = entity.DiscountAmount * rate;
						service.markItemAsModified(entity);
					});
				}
				salesBillingService.onVatGroupChanged.register(fellowHeaderVatGroupChanged);

				return service;
			}]);
})();
