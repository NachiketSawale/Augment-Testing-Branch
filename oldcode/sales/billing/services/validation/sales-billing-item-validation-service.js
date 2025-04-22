/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.billing';

	/**
	 * @ngdoc service
	 * @name salesBillingItemValidationService
	 * @description provides validation methods for billing item entities
	 */
	angular.module(moduleName).factory('salesBillingItemValidationService', ['globals', '$log', '$http', '_', '$injector', '$q', 'platformDataValidationService', 'salesBillingService', 'salesBillingItemService', 'salesCommonValidationServiceProvider','platformContextService','basicsLookupdataLookupDescriptorService',
		function (globals, $log, $http, _, $injector, $q, platformDataValidationService, salesBillingService, salesBillingItemService, salesCommonValidationServiceProvider,platformContextService,basicsLookupdataLookupDescriptorService) {
			var service = salesCommonValidationServiceProvider.getInstance(salesBillingItemService);

			salesBillingService.exchangeRateChanged.register(function (bilHeaderEntity, value) {
				var billItems = salesBillingItemService.getList();
				_.each(billItems, function (billItem) {
					if (value.ExchangeRate > 0) {
						billItem.Price = billItem.PriceOc / value.ExchangeRate;
					}
					calcAmount(billItem, billItem.Quantity, billItem.Price, billItem.PriceOc);
				});
				salesBillingItemService.markEntitiesAsModified(billItems);
			});

			function getExchangeRate() {
				return _.get(salesBillingService.getSelected(), 'ExchangeRate') || 1.0;
			}

			function getVatGroup() {
				return _.get(salesBillingService.getSelected(), 'VatGroupFk');
			}

			function getVatPercent(taxCodeId, vatGroupId) {
				// by tax code matrix?
				var taxCodeMatrix = null;
				if (vatGroupId > 0) {
					var taxCodeMatrixList = $injector.get('basicsLookupdataLookupDescriptorService').getData('Sales_TaxCodeMatrix');
					taxCodeMatrix = _.find(taxCodeMatrixList, {
						TaxCodeFk: taxCodeId,
						VatGroupFk: vatGroupId
					});
				}

				if (_.isObject(taxCodeMatrix)) {
					return taxCodeMatrix.VatPercent * 1.0;
				} else {
					var taxCodes = $injector.get('basicsLookupdataLookupDescriptorService').getData('TaxCode');
					var taxCode = _.find(taxCodes, {Id: taxCodeId}) || null;
					return taxCode === null ? 0 : taxCode.VatPercent * 1.0;
				}
			}

			function convertToHomeCurrency(price, currencyOfPrice) {
				var company = $injector.get('salesCommonContextService').getCompany();
				var homeCurrencyId = _.get(company, 'CurrencyFk');
				if (homeCurrencyId === currencyOfPrice) {
					return $q.when(price);
				} else {
					var companyId = _.get(company, 'Id');
					var salesCommonExchangerateService = $injector.get('salesCommonExchangerateService');
					return salesCommonExchangerateService.getExchangeRate(companyId, currencyOfPrice, _.get(salesBillingService.getSelected(), 'ProjectFk')).then(function (response) {
						var rate = response.data;
						return rate > 0 ? price / rate : 1;
					});
				}
			}

			function setCostCodeAsync(entity, costCodeId) {
				var validationResult = false;
				if (costCodeId > 0) {
					var service = $injector.get('basicsLookupdataLookupDescriptorService');
					var costCodeEntity = service.getLookupItem('costcode', costCodeId);
					if (costCodeEntity !== null) {
						entity.CostCodeFk = costCodeId;
						entity.PrcStructureFk = costCodeEntity.PrcStructureFk;
						entity.UomFk = costCodeEntity.UomFk;
						entity.Description1 = _.get(costCodeEntity, 'DescriptionInfo.Translated');
						var convertPromise = convertToHomeCurrency(costCodeEntity.DayWorkRate, costCodeEntity.CurrencyFk);
						convertPromise.then(function (convertedPrice) {
							entity.Price = convertedPrice;
							platformDataValidationService.ensureNoRelatedError(entity, 'CostCodeFk', ['Price'], service, salesBillingItemService);

							var exchangeRate = getExchangeRate();
							if (exchangeRate > 0) {
								entity.PriceOc = entity.Price * exchangeRate;
								platformDataValidationService.ensureNoRelatedError(entity, 'CostCodeFk', ['PriceOc'], service, salesBillingItemService);
							}
							calcAmount(entity, entity.Quantity, entity.Price, entity.PriceOc);
							validationResult = true;
						});
					}
					// TODO: handling also project cost codes!
				} else if (costCodeId === null) {
					entity.CostCodeFk = null;
				}
				updateReadOnly(entity);

				return $q.all([convertPromise]).then(function () {
					return validationResult;
				});
			}

			function setMaterialAsync(entity, materialId) {
				var validationResult = false;
				if (materialId > 0) {
					var service = $injector.get('basicsLookupdataLookupDescriptorService');
					var materialEntity = service.getLookupItem('MaterialCommodity', materialId);
					if (materialEntity !== null) {
						entity.MdcMaterialFk = materialId;
						entity.CostCodeFk = materialEntity.MdcCostCodeFk;
						if (materialEntity.MdcTaxCodeFk > 0) {
							entity.TaxCodeFk = materialEntity.MdcTaxCodeFk;
						}
						entity.PrcStructureFk = materialEntity.PrcStructureFk;
						// defect:126112 start
						$http.get(globals.webApiBaseUrl + 'basics/procurementstructure/taxcode/list?mainItemId=' + entity.PrcStructureFk).then((response)=>{
							if (response.data.Main.length >= 1) {
								var loginCompanyFk = platformContextService.clientId;
								var LedgerContextFk;
								if (loginCompanyFk) {
									var companies = basicsLookupdataLookupDescriptorService.getData('Company');
									let company = _.find(companies, {Id: loginCompanyFk});
									if (company) {
										LedgerContextFk = company.LedgerContextFk;
									}
								}
								for (let i = 0; i < response.data.Main.length; i++) {
									if(response.data.Main[i].MdcLedgerContextFk===LedgerContextFk){
										entity.MdcSalesTaxGroupFk = response.data.Main[i].MdcSalesTaxGroupFk;
										break;
									}
								}
							}
						});
						// defect:126112 end
						entity.UomFk = materialEntity.BasUomFk;
						entity.Description1 = _.get(materialEntity, 'DescriptionInfo.Translated');
						var convertPromise = convertToHomeCurrency(materialEntity.Cost, materialEntity.BasCurrencyFk);
						convertPromise.then(function (convertedPrice) {
							entity.Price = convertedPrice;
							platformDataValidationService.ensureNoRelatedError(entity, 'MdcMaterialFk', ['Price'], service, salesBillingItemService);

							var exchangeRate = getExchangeRate();
							if (exchangeRate > 0) {
								entity.PriceOc = entity.Price * exchangeRate;
								platformDataValidationService.ensureNoRelatedError(entity, 'MdcMaterialFk', ['PriceOc'], service, salesBillingItemService);
							}
							calcAmount(entity, entity.Quantity, entity.Price, entity.PriceOc);
							validationResult = true;
						});

						if (materialEntity.PrcPriceconditionFk) {
							entity.PrcPriceConditionFk = materialEntity.PrcPriceconditionFk;
							$injector.get('saleBillingItemPriceConditionService').reload(entity, materialEntity.PrcPriceconditionFk, true);
						}

					} else if (materialId === null) {
						entity.MdcMaterialFk = null;
					}
				}
				updateReadOnly(entity);
				salesBillingItemService.loadMaterialSpecification(true, materialId === null);

				return $q.all([convertPromise]).then(function () {
					return validationResult;
				});
			}

			function updateReadOnly(entity) {
				var platformRuntimeDataService = $injector.get('platformRuntimeDataService');

				var isCostCodeReadonly = false; // TODO:
				var isMaterialReadonly = false;
				if (entity.CostCodeFk !== null && entity.MdcMaterialFk === null) {
					isMaterialReadonly = true;
				} else if (entity.CostCodeFk === null && entity.MdcMaterialFk !== null) {
					isCostCodeReadonly = true;
				}

				platformRuntimeDataService.readonly(entity, [{field: 'CostCodeFk', readonly: isCostCodeReadonly}]);
				platformRuntimeDataService.readonly(entity, [{field: 'MdcMaterialFk', readonly: isMaterialReadonly}]);
			}

			function calcAmount(entity, quantity, price, priceOc, taxCodeFk, updateModel /* , updateValue */) {
				var vatGroupId = getVatGroup();
				var vatPercent = getVatPercent(taxCodeFk || entity.TaxCodeFk, vatGroupId);
				var isCalculateOverGross = salesBillingItemService.getIsCalculateOverGross();

				if (updateModel === 'PriceGross' || updateModel === 'PriceGrossOc') {
					price = entity.Price = entity.PriceGross / (100 + vatPercent) * 100;
					priceOc = entity.PriceOc = entity.PriceGrossOc / (100 + vatPercent) * 100;
				} else {
					if (updateModel === 'TaxCodeFk' && isCalculateOverGross) {
						price = entity.Price = entity.PriceGross * 100 / (100 + vatPercent);
						priceOc = entity.PriceOc = entity.PriceGrossOc * 100 / (100 + vatPercent);

					} else {
						entity.PriceGross = price * (100 + vatPercent) / 100;
						entity.PriceGrossOc = priceOc * (100 + vatPercent) / 100;
					}
				}

				entity.AmountNet = quantity * (price + entity.PriceExtra);
				entity.AmountNetOc = quantity * (priceOc + entity.PriceExtraOc);

				entity.AmountVat = (entity.AmountNet * vatPercent) / 100;
				entity.AmountGross = entity.AmountNet + entity.AmountVat;
				var exchangeRate = getExchangeRate();
				entity.AmountGrossOc = entity.AmountGross * exchangeRate;

				if (isCalculateOverGross) {
					entity.TotalPriceGross = entity.PriceGross + entity.PriceExtra * (100 + vatPercent) / 100;
					entity.TotalPriceGrossOc = entity.PriceGrossOc + entity.PriceExtraOc * (100 + vatPercent) / 100;

					entity.TotalGross = entity.TotalPriceGross * quantity;
					entity.TotalGrossOc = entity.TotalPriceGrossOc * quantity;

					entity.TotalPrice = entity.TotalPriceGross / (100 + vatPercent) * 100;
					entity.TotalPriceOc = entity.TotalPriceGrossOc / (100 + vatPercent) * 100;

					entity.Total = entity.TotalGross / (100 + vatPercent) * 100;
					entity.TotalOc = entity.TotalGrossOc / (100 + vatPercent) * 100;

				} else {
					entity.TotalPriceGross = (price + entity.PriceExtra) * (100 + vatPercent) / 100;
					entity.TotalPriceGrossOc = (priceOc + entity.PriceExtraOc) * (100 + vatPercent) / 100;

					entity.TotalGross = (price + entity.PriceExtra) * quantity * (100 + vatPercent) / 100;
					entity.TotalGrossOc = (priceOc + entity.PriceExtraOc) * quantity * (100 + vatPercent) / 100;

					entity.TotalPrice = (price + entity.PriceExtra);
					entity.TotalPriceOc = (priceOc + entity.PriceExtraOc);

					entity.Total = (price + entity.PriceExtra) * quantity;
					entity.TotalOc = (priceOc + entity.PriceExtraOc) * quantity;
				}
			}

			service.validateItemNo = function validateItemNo(entity, value) {
				var items = salesBillingItemService.getList();
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'ItemNo', items, service, salesBillingItemService);
			};

			service.asyncValidateCostCodeFk = function asyncValidateCostCodeFk(entity, value, model) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, salesBillingItemService);

				asyncMarker.myPromise = setCostCodeAsync(entity, value).then(function (response) {
					return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, salesBillingItemService);
				});

				return asyncMarker.myPromise;
			};

			service.asyncValidateMdcMaterialFk = function asyncValidateMdcMaterialFk(entity, value, model) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, salesBillingItemService);

				asyncMarker.myPromise = setMaterialAsync(entity, value).then(function (response) {
					return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, salesBillingItemService);
				});

				return asyncMarker.myPromise;
			};

			service.validateQuantity = function validateQuantity(entity, value, model) {
				value = value ? value : 0;
				calcAmount(entity, value, entity.Price, entity.PriceOc);
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingItemService);
			};

			service.validateTaxCodeFk = function validateTaxCodeFk(entity, value, model) {
				calcAmount(entity, entity.Quantity, entity.Price, entity.PriceOc, value, model);
				$injector.get('saleBillingItemPriceConditionService').recalculate(entity,entity.PrcPriceConditionFk );
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingItemService);
			};

			service.validateUomFk = function validateUomFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingItemService);
			};

			service.validatePrice = function validatePrice(entity, value, model) {
				value = value ? value : 0;
				var exchangeRate = getExchangeRate();
				if (exchangeRate > 0 && value !== null) {
					entity.PriceOc = value * exchangeRate;
					platformDataValidationService.ensureNoRelatedError(entity, model, ['PriceOc'], service, salesBillingItemService);
				}
				calcAmount(entity, entity.Quantity, value, entity.PriceOc, entity.TaxCodeFk, model);
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingItemService);
			};

			service.validatePriceOc = function validatePriceOc(entity, value, model) {
				value = value ? value : 0;
				// convert priceOc (bill currency) to company currency (price)
				var exchangeRate = getExchangeRate();
				if (exchangeRate > 0 && value !== null) {
					entity.Price = value / exchangeRate;
					platformDataValidationService.ensureNoRelatedError(entity, model, ['Price'], service, salesBillingItemService);
				}
				calcAmount(entity, entity.Quantity, entity.Price, value);
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingItemService);
			};

			service.validatePriceGross = function validatePriceGross(entity, value, model) {
				var exchangeRate = getExchangeRate();
				if (exchangeRate > 0 && value !== null) {
					entity.PriceGross = value;
					entity.PriceGrossOc = value * exchangeRate;
					platformDataValidationService.ensureNoRelatedError(entity, model, ['Price'], service, salesBillingItemService);
				}

				calcAmount(entity, entity.Quantity, entity.Price, entity.PriceOc, null, model, value);
				// return platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingItemService);
			};

			service.validatePriceGrossOc = function validatePriceGrossOc(entity, value, model) {

				var exchangeRate = getExchangeRate();
				if (exchangeRate > 0 && value !== null) {
					entity.PriceGrossOc = value;
					entity.PriceGross = value / exchangeRate;
					platformDataValidationService.ensureNoRelatedError(entity, model, ['Price'], service, salesBillingItemService);
				}
				calcAmount(entity, entity.Quantity, entity.Price, entity.PriceOc, null, model, value);
				// return platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingItemService);
			};

			service.calculateItem = function (item) {
				calcAmount(item, item.Quantity, item.Price, item.PriceOc);
			};

			service.validateSpecification = function validateSpecification(entity, value){
				salesBillingItemService.onSpecificationChanged.fire(value);
			};

			// defect:126112 start
			service.asyncValidatePrcStructureFk = function asyncValidatePrcStructureFk(entity, value, model) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, salesBillingItemService);
				asyncMarker.myPromise = setPrcStructureFkAsync(entity, value).then(function (response) {
					return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, salesBillingItemService);
				});
				return asyncMarker.myPromise;
			};

			function setPrcStructureFkAsync(entity, PrcStructureFk) {
				var validationResult = true;
				if (PrcStructureFk === null) {
					PrcStructureFk=-99999;
				}

				var postData = $http.get(globals.webApiBaseUrl + 'basics/procurementstructure/taxcode/list?mainItemId=' + PrcStructureFk);
				return $q.all([postData]).then(function (response) {
					if (response[0].data.Main.length >= 1) {
						var loginCompanyFk = platformContextService.clientId;
						var LedgerContextFk;
						if (loginCompanyFk) {
							var companies = basicsLookupdataLookupDescriptorService.getData('Company');
							let company = _.find(companies, {Id: loginCompanyFk});
							if (company) {
								LedgerContextFk = company.LedgerContextFk;
							}
						}
						for (let i = 0; i < response[0].data.Main.length; i++) {
							if (response[0].data.Main[i].MdcLedgerContextFk === LedgerContextFk) {
								entity.MdcSalesTaxGroupFk = response[0].data.Main[i].MdcSalesTaxGroupFk;
								return  validationResult;
							}
						}
					}
				});
			}
			// defect:126112 end


			return service;
		}
	]);
})();
