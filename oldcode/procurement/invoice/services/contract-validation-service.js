/**
 * Created by chi on 09.06.2014.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_,$, math */
	/**
	 * @ngdoc service
	 * @name reqHeaderElementValidationService
	 * @description provides validation methods for a ReqHeader
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').factory('procurementInvoiceContractValidationService',
		['$q', '$translate', 'validationService', 'procurementInvoiceContractDataService', 'basicsLookupdataLookupDataService', '$http',
			'procurementInvoiceHeaderDataService', 'procurementInvoiceCertificateDataService', 'platformDataValidationService',
			'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService', 'prcCommonCalculationHelper', '$injector', 'prcCommonItemCalculationHelperService', '$timeout',
			'prcGetIsCalculateOverGrossService', 'platformContextService',
			function ($q, $translate, validationService, dataService, lookupService, $http, parentService, procurementInvoiceCertificateDataService, platformDataValidationService,
				platformRuntimeDataService, basicsLookupdataLookupDescriptorService, prcCommonCalculationHelper, $injector, itemCalculationHelper, $timeout,
				prcGetIsCalculateOverGrossService, platformContextService) {

				var service = validationService.create('prcInvoiceContract', 'procurement/invoice/contract/schema');
				let roundingType = itemCalculationHelper.roundingType;
				let contractRoundingMethod = $injector.get('procurementCommonConstantValues').contractRoundingMethod;

				function resetTaxCode(taxCodeId, entity) {
					if (!taxCodeId) {
						lookupService.getItemByKey('ConHeaderView', entity.ConHeaderFk).then(function (response) {
							if (!angular.isObject(response)) {
								return;
							}

							if (!response.TaxCodeFk) {
								entity.TaxCodeFk = parentService.getSelected().TaxCodeFk;
							} else {
								entity.TaxCodeFk = response.TaxCodeFk;
							}

							dataService.fireItemModified(entity);
							dataService.recalcuteContract();
						});
					} else {
						dataService.recalcuteContract();
					}
				}

				function createErrorObject(transMsg, errorParam) {
					return {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: transMsg,
						error$tr$param$: errorParam
					};
				}

				function recalculateTotalValueAndContract(entity) {
					var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
					let constant = getContractRoundingMethod(entity);
					entity.TotalValue = itemCalculationHelper.getTotalValueForInv(entity, vatPercent, constant);
					entity.TotalValueOc = itemCalculationHelper.getTotalValueOcForInv(entity, vatPercent, constant);
					dataService.recalcuteContract();
				}

				function recalculateTotalValue(entity) {
					var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
					let constant = getContractRoundingMethod(entity);
					entity.TotalValue = itemCalculationHelper.getTotalValueForInv(entity, vatPercent, constant);
					entity.TotalValueOc = itemCalculationHelper.getTotalValueOcForInv(entity, vatPercent, constant);
				}

				function clearExtraFields(entity) {
					entity.MaterialCode = null;
					entity.MaterialExternalCode = null;
					entity.FurtherDescription = null;
					entity.Description = null;
					entity.OrderQuantity = null;
					entity.PrcItemJobCode = null;
					entity.PrcItemJobDescription = null;
					entity.Uom = null;
					entity.Price = 0;
					entity.PriceOc = 0;

					entity.PriceGross = 0;
					entity.PriceOcGross = 0;
					entity.PrcItemTotalGross = 0;
					entity.PrcItemTotalGrossOc = 0;
					entity.TotalValueGross = 0;
					entity.TotalValueGrossOc = 0;
					entity.DiscountSplit = 0;
					entity.DiscountSplitOc = 0;

					entity.ProvisionPercent = 0;
					entity.ProvisionTotal = 0;
					entity.LotNo = null;
					entity.ExpirationDate = null;
					entity.PrcStockTransactionTypeFk = null;
					entity.PrjStockFk = null;
					entity.PrjStockLocationFk = null;
					entity.PrcStockTransactionFk = null;

					entity.MaterialStockFk = null;
					entity.AlternativeQuantity = null;
					entity.AlternativeUomFk = null;

					recalculateTotalValueAndContract(entity);
					entity.TotalPrice = 0;
					entity.TotalPriceOc = 0;

					dataService.fireItemModified(entity);
				}

				function setExtraFieldsReadonly(entity, isReadonly) {
					platformRuntimeDataService.readonly(entity, [{field: 'ProvisionPercent', readonly: isReadonly},
						{field: 'ProvisionTotal', readonly: isReadonly},
						{field: 'LotNo', readonly: isReadonly},
						{field: 'ExpirationDate', readonly: isReadonly},
						{field: 'PrcStockTransactionTypeFk', readonly: isReadonly},
						{field: 'PrjStockFk', readonly: isReadonly},
						{field: 'PrjStockLocationFk', readonly: isReadonly},
						{field: 'PrcStockTransactionFk', readonly: isReadonly}
					]);
				}

				service.asyncValidateConHeaderFk = function validateConHeaderFk(entity, value, model) {
					var defer = $q.defer();
					var result = {apply: true, valid: true};
					entity.ConHeaderFk = value;
					dataService.updateReadOnly(entity);
					updateprjstockReadOnly(entity);

					if (value === 0 || value === null || value === -1) {
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: 'Contract'});
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

					if (value > 0) {
						lookupService.getItemByKey('ConHeaderView', value).then(function (response) {
							if (!angular.isObject(response)) {
								return;
							}

							entity.PrcHeaderId = response.PrcHeaderId;
							if (null === entity.TaxCodeFk) {
								entity.TaxCodeFk = response.TaxCodeFk;
							}
							parentService.onCopyInvGenerals.fire(null, {
								PrcHeaderId: response.PrcHeaderId,
								Code: response.Code,
								Description: response.Description
							});
							procurementInvoiceCertificateDataService.copyAndUpdateCertificates(response, value);
							dataService.fireItemModified(entity);
						});
					}
					// dataService.setBaseNChangeOrderPrcHeaderIdsByConHeaderId(value, true);
					defer.resolve(result);
					return defer.promise;
				};

				service.asyncValidateQuantity = function validateQuantity(entity, value) {
					var defer = $q.defer();
					var result = {apply: true, valid: true};
					var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
					var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					var exchangeRate = getParentExchangeRate();
					let constant = getContractRoundingMethod(entity);
					entity.Quantity = roundQuantity(entity, value);
					resetDiscountSplit(entity);
					if (isCalculateOverGross) {
						entity.TotalValueGrossOc = itemCalculationHelper.getTotalValueOcGrossForInv(entity, vatPercent, constant);
						entity.TotalValueGross = itemCalculationHelper.getTotalValueGrossForInv(entity, vatPercent, exchangeRate, constant);
						recalculateTotalValueAndContract(entity);
					} else {
						recalculateTotalValue(entity);
						entity.TotalValueGrossOc = itemCalculationHelper.getTotalValueOcGrossForInv(entity, vatPercent, constant);
						entity.TotalValueGross = itemCalculationHelper.getTotalValueGrossForInv(entity, vatPercent, exchangeRate, constant);
						dataService.recalcuteContract();
					}
					dataService.fireItemModified(entity);

					getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, value).then(function (invoiceItem) {
						if (invoiceItem) {
							entity.ProvisionTotal = round(entity, roundingType.ProvisionTotal, invoiceItem.ProvisionTotal);
							dataService.gridRefresh();
						}
					});
					entity.Percentage = 0;
					if (entity.OrderQuantity && value) {
						entity.Percentage = itemCalculationHelper.getPercentageForInv(value, entity.OrderQuantity);
					}

					entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, value, null);
					defer.resolve(result);
					return defer.promise;
				};

				function conversionQuantity(entity, uom, quantity, alterAtiveQuantity) {
					var uomItem = _.find(entity.Material2Uoms, {UomFk: uom}), value = 1;
					if (uomItem) {
						value = uomItem.Quantity;
					}
					if (!_.isNil(quantity)) {
						return roundAlternativeQuantity(entity, math.bignumber(quantity).mul(value));// entity.AlternativeQuantity
					}
					if (!_.isNil(alterAtiveQuantity)) {
						return value === 0 ? 0 : roundQuantity(entity, math.bignumber(alterAtiveQuantity).div(value));// entity.Quantity
					}
					return 0;
				}

				service.validatePercentage = function validatePercentage(entity, value) {
					entity.Quantity = math.bignumber(value).div(100).mul(entity.OrderQuantity).toNumber();
					if (!entity.PrcBoqFk) {
						entity.Quantity = roundQuantity(entity, entity.Quantity);
					}
					entity.Percentage = value;
					if (!value) {
						entity.Percentage = 0;
					}
					service.asyncValidateQuantity(entity, entity.Quantity);
				};

				service.asyncValidatePrcItemFk = function asyncValidatePrcItemFk(entity, value) { // todo livia
					entity.PrcItemFk = value;
					return dataService.readBasItemTypeFk(entity).then((result=>{
						if(!_.isNil(result.data)){
							let prctItem = result.data;
							if (prctItem.BasItemTypeFk === 7) {
								let defer = $q.defer();
								let result = {apply: true, valid: true};
								dataService.canReadonlyByPrcItemBasItemType(entity,true);
								defer.resolve(result);
								return defer.promise;
							}else{
								return validatePrcitemFk(entity,value);
							}
						}else{
							return validatePrcitemFk(entity,value);
						}
					}));
				};

				function validatePrcitemFk(entity,value) {
					let defer = $q.defer();
					let result = {apply: true, valid: true};
					dataService.updateReadOnly(entity);
					// updateprjstockReadOnly(entity);

					if (!value) {
						entity.PrcItemDiscountSplit = 0;
						entity.PrcItemDiscountSplitOc = 0;
						entity.PrcItemQuantity = 0;
						entity.Co2Project = null;
						entity.Co2ProjectTotal = null;
						entity.Co2Source = null;
						entity.Co2SourceTotal = null;
						clearExtraFields(entity);
						setExtraFieldsReadonly(entity, true);
						entity.OrderQuantity = 0;
						entity.Percentage = 0;
						defer.resolve(result);
						return defer.promise;
					}
					setExtraFieldsReadonly(entity, false);
					var prcItems = basicsLookupdataLookupDescriptorService.getData('PrcItemMergedLookup');
					if (!prcItems) {
						defer.resolve(result);
						return defer.promise;
					}

					let filter = {
						InvHeaderId: entity.InvHeaderFk,
						IsCanceled: false,
						ContractId: entity.ConHeaderFk,
						IncludeDeliveredCon: true
					};
					$http.post(globals.webApiBaseUrl + 'procurement/common/prcitem/getitems4create', filter).then(function (res) {
						var foundPrcItems = res.data;
						var response = _.find(foundPrcItems, {Id: value});
						if (!angular.isObject(response)) {
							return true;
						}
						var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(response.TaxCodeFk);
						var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
						var exchangeRate = getParentExchangeRate();
						let constant = getContractRoundingMethod(entity);
						entity.MaterialCode = response.MaterialCode;
						entity.MdcMaterialFk= response.MdcMaterialFk;
						entity.MaterialExternalCode = response.MaterialExternalCode;
						entity.FurtherDescription = response.PrcItemDescription2;
						/** @namespace response.PrcItemDescription */
						entity.Description = response.PrcItemDescription;
						entity.OrderQuantity = response.Quantity;
						entity.Uom = response.Uom;
						entity.PriceOc = itemCalculationHelper.getPriceByTotalPriceForInv(response.TotalPriceOc, response.PriceUnit, response.FactorPriceUnit, constant);
						entity.Price = itemCalculationHelper.getPriceByTotalPriceForInv(response.TotalPrice, response.PriceUnit, response.FactorPriceUnit, constant);
						entity.PriceGross = itemCalculationHelper.getPriceByTotalPriceForInv(response.TotalPriceGross, response.PriceUnit, response.FactorPriceUnit, constant);
						entity.PriceOcGross = itemCalculationHelper.getPriceByTotalPriceForInv(response.TotalPriceGrossOc, response.PriceUnit, response.FactorPriceUnit, constant);

						entity.PrcItemDiscountSplit = response.DiscountSplit;
						entity.PrcItemDiscountSplitOc = response.DiscountSplitOc;
						entity.PrcItemQuantity = response.Quantity;

						entity.AlternativeQuantity = 0;
						entity.AlternativeUomFk = response.AlternativeUomFk;
						entity.MaterialStockFk = response.MaterialStockFk;
						entity.Material2Uoms = response.Material2Uoms;
						entity.PrcItemJobCode = response.JobCode;
						entity.PrcItemJobDescription = response.JobDescription;
						entity.Co2Project = response.Co2Project;
						entity.Co2ProjectTotal = response.Co2ProjectTotal;
						entity.Co2Source = response.Co2Source;
						entity.Co2SourceTotal = response.Co2SourceTotal;

						entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, entity.Quantity, null);// entity.AlternativeQuantity

						resetDiscountSplit(entity);

						if (isCalculateOverGross) {
							entity.TotalValueGrossOc = itemCalculationHelper.getTotalValueOcGrossForInv(entity, vatPercent, constant);
							entity.TotalValueGross = itemCalculationHelper.getTotalValueGrossForInv(entity, vatPercent, exchangeRate, constant);
							recalculateTotalValueAndContract(entity);
						} else {
							recalculateTotalValue(entity);
							entity.TotalValueGrossOc = itemCalculationHelper.getTotalValueOcGrossForInv(entity, vatPercent, constant);
							entity.TotalValueGross = itemCalculationHelper.getTotalValueGrossForInv(entity, vatPercent, exchangeRate, constant);
							dataService.recalcuteContract();
						}
						entity.TotalPriceOc = round(entity, roundingType.Inv2Con_TotalPriceOc, response.TotalOc);// specific
						entity.TotalPrice = round(entity, roundingType.Inv2Con_TotalPrice, response.Total);// specific
						entity.PrcStructureFk = response.PrcStructureFk;
						entity.ControllingUnitFk = response.ControllingUnitFk;
						service.validateControllingUnitFk(entity, entity.ControllingUnitFk, 'ControllingUnitFk');
						service.asyncValidateControllingUnitFk(entity, entity.ControllingUnitFk, 'ControllingUnitFk');
						entity.PrcItemStatusFk = response.PrcItemStatusFk;
						entity.TaxCodeFk = response.TaxCodeFk;

						entity.BasUomPriceUnit = response.BasUomPriceUnit;

						entity.FactorPriceUnit = response.FactorPriceUnit;
						entity.OrderQuantityConverted = round(entity, roundingType.OrderQuantityConverted, math.bignumber(entity.OrderQuantity).mul(entity.FactorPriceUnit).toNumber());
						entity.Percentage = 0;
						if (entity.Quantity && entity.OrderQuantity) {
							entity.Percentage = itemCalculationHelper.getPercentageForInv(entity.Quantity, entity.OrderQuantity);
						}

						entity.PrcItemTotalGross = round(entity, roundingType.PrcItemTotalGross, response.TotalGross);
						entity.PrcItemTotalGrossOc = round(entity, roundingType.PrcItemTotalGrossOc, response.TotalGrossOc);

						// procurementInvoiceCertificateDataService.copyCertificatesFromMaterial(entity.InvHeaderFk, response.MdcMaterialFk);
						// copy certificate from material module.
						if (response.MdcMaterialFk > 0) {
							var options = {
								url: 'procurement/invoice/certificate/copycertificatesfrommaterial',
								dataService: procurementInvoiceCertificateDataService,
								parameter: {InvHeaderId: entity.InvHeaderFk, MdcMaterialId: response.MdcMaterialFk}
							};
							procurementInvoiceCertificateDataService.copyCertificatesFromOtherModule(options);
						}

						resetTaxCode(response.TaxCodeFk, entity);

						if (entity && entity.PrcItemFk) {
							$http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/creategrpset?mainItemId=' + entity.Id + '&prcItemFk=' + entity.PrcItemFk)
								.then(function (response) {
									var _entity = response.data;
									if (_entity) {
										var GrpSetDTLDataService = $injector.get('procurementInvGrpSetDTLByContractDataService');
										GrpSetDTLDataService.roadData(entity, _entity);
										GrpSetDTLDataService.gridRefresh();
									}
								});
						}
						dataService.fireItemModified(entity);
						updateprjstockReadOnly(entity);
						defer.resolve(result);
					});
					return defer.promise;
				}

				function checkIsAssetManagementReadonly(entity, isReadOnly) {
					if (entity.PrcBoqFk) {
						platformRuntimeDataService.readonly(entity, [{field: 'IsAssetManagement', readonly: true}]);
						return;
					}
					platformRuntimeDataService.readonly(entity, [{field: 'IsAssetManagement', readonly: isReadOnly}]);
				}

				service.validatePrcBoqFk = function validatePrcBoqFk(entity, value) {
					entity.PrcBoqFk = value;
					dataService.updateReadOnly(entity);
					updateprjstockReadOnly(entity);

					checkIsAssetManagementReadonly(entity);
					if (!value) {
						clearExtraFields(entity);
						return true;
					}

					// eslint-disable-next-line no-unused-vars
					var exchangeRate = parentService.getSelected().ExchangeRate;

					resetTaxCode(null, entity);

					entity.MaterialCode = null;
					// TODO: it may be wrong

					var data = {
						// BaseNChangeOrderPrcHeaderIds: dataService.getBaseNChangeOrderPrcHeaderIds(entity.ConHeaderFk),
						ConHeaderId: entity.ConHeaderFk,
						PrcBoqId: value
					};
					// $http.get(globals.webApiBaseUrl + 'procurement/common/boq/getboqrootitem?id=' + value).then(function (response) {
					$http.post(globals.webApiBaseUrl + 'procurement/common/boq/getmergedboqrootitem', data).then(function (response) {
						if (response && response.data && response.data.BoqItem) {
							let boqItemInfo = response.data;
							let boqItem = boqItemInfo.BoqItem;
							entity.Description = boqItem.BriefInfo.Translated;
							entity.OrderQuantity = 1;
							var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(response.TaxCodeFk);
							var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
							var exchangeRate = getParentExchangeRate();
							let finalPriceOc = boqItemInfo.MergedFinalPriceOc;
							let constant = getContractRoundingMethod(entity);
							entity.PriceOc = round(entity, roundingType.PriceOc, finalPriceOc);

							entity.Price = itemCalculationHelper.getUnitRateNonOcByOc(entity.PriceOc, exchangeRate, constant);
							entity.PriceGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(entity.Price, vatPercent, constant);
							entity.PriceOcGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(entity.PriceOc, vatPercent, constant);

							if (isCalculateOverGross) {
								entity.TotalValueGrossOc = itemCalculationHelper.getTotalValueOcGrossForInv(entity, vatPercent, constant);
								entity.TotalValueGross = itemCalculationHelper.getTotalValueGrossForInv(entity, vatPercent, exchangeRate, constant);
								recalculateTotalValueAndContract(entity);
							} else {
								recalculateTotalValue(entity);
								entity.TotalValueGrossOc = itemCalculationHelper.getTotalValueOcGrossForInv(entity, vatPercent, constant);
								entity.TotalValueGross = itemCalculationHelper.getTotalValueGrossForInv(entity, vatPercent, exchangeRate, constant);
								dataService.recalcuteContract();
							}
							entity.TotalPriceOc = round(entity, roundingType.Inv2Con_TotalPriceOc, finalPriceOc);// specific
							entity.TotalPrice = itemCalculationHelper.getAmountNonOcByOc(entity.TotalPriceOc, exchangeRate, constant, roundingType.Inv2Con_TotalPrice);// specific

							entity.PrcItemTotalGrossOc = itemCalculationHelper.getTotalGrossOcForInv(entity.PriceOc, entity.OrderQuantity, 0, 0, vatPercent, 1, 1, 0, constant);
							entity.PrcItemTotalGross = itemCalculationHelper.getTotalGrossForInv(entity.Price, entity.OrderQuantity, 0, 0, vatPercent, 1, 1, 0, entity.PrcItemTotalGrossOc, exchangeRate, constant);
							entity.DiscountSplit = round(entity, roundingType.DiscountSplit, boqItem.Discount);
							entity.DiscountSplitOc = round(entity, roundingType.DiscountSplitOc, boqItem.DiscountOc);

							dataService.fireItemModified(entity);
						}
					});

					/* $http.get(globals.webApiBaseUrl + 'procurement/common/boq/getboqitem?id=' + value).then(function (response) {
					 if (response && response.data) {

					 dataService.fireItemModified(entity);
					 }
					 }); */

					$http.get(globals.webApiBaseUrl + 'procurement/package/package/getprcboqpackage?id=' + value).then(function (response) {
						if (response && response.data) {
							entity.PrcStructureFk = response.data.StructureFk;

							dataService.fireItemModified(entity);
						}
					});

					$http.get(globals.webApiBaseUrl + 'basics/unit/getuom').then(function (response) {
						if (response && response.data) {
							entity.Uom = response.data.UoM;
							dataService.fireItemModified(entity);
						}
					});

					$http.get(globals.webApiBaseUrl + 'procurement/common/boq/getboq?id=' + value).then(function (response) {
						if (response && response.data) {
							entity.ControllingUnitFk = response.data.MdcControllingunitFk;
							dataService.fireItemModified(entity);
						}
					});

					return true;
				};

				service.validateTaxCodeFk = function validateTaxCodeFk(entity, value, model, options) {
					entity.TaxCodeFk = value;
					var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(value);
					var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					var onEntityCreated = !!(options && options.onEntityCreated);
					var exchangeRate = getParentExchangeRate();
					let constant = getContractRoundingMethod(entity);
					if (isCalculateOverGross && !onEntityCreated) {
						entity.Price = itemCalculationHelper.getUnitRatePreTaxByAfterTax(entity.PriceGross, vatPercent, constant);
						entity.PriceOc = itemCalculationHelper.getUnitRatePreTaxByAfterTax(entity.PriceOcGross, vatPercent, constant);
						entity.TotalPrice = itemCalculationHelper.getAmountAfterTaxByPreTax(entity.PrcItemTotalGross, vatPercent, constant, roundingType.Inv2Con_TotalPrice);// specific
						entity.TotalPriceOc = itemCalculationHelper.getAmountAfterTaxByPreTax(entity.PrcItemTotalGrossOc, vatPercent, constant, roundingType.Inv2Con_TotalPriceOc);// specific
						recalculateTotalValueAndContract(entity);
					} else {
						entity.PriceGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(entity.Price, vatPercent, constant);
						entity.PriceOcGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(entity.PriceOc, vatPercent, constant);
						if (entity.PrcItemFk) {
							var prcItem = dataService.getLookupValue(entity, 'PrcItemFk:PrcItemMergedLookup');
							if (prcItem) {
								entity.PriceGross = itemCalculationHelper.getPriceByTotalPriceForInv(prcItem.TotalPriceGross, prcItem.PriceUnit, prcItem.FactorPriceUnit, constant);
								entity.PriceOcGross = itemCalculationHelper.getPriceByTotalPriceForInv(prcItem.TotalPriceGrossOc, prcItem.PriceUnit, prcItem.FactorPriceUnit, constant);
							}
							entity.PrcItemTotalGrossOc = itemCalculationHelper.getTotalGrossOcForInv(entity.PriceOc, entity.OrderQuantity, 0, 0, vatPercent, 1, 1, entity.PrcItemDiscountSplitOc, constant);
							entity.PrcItemTotalGross = itemCalculationHelper.getTotalGrossForInv(entity.Price, entity.OrderQuantity, 0, 0, vatPercent, 1, 1, entity.PrcItemDiscountSplit, entity.PrcItemTotalGrossOc, exchangeRate, constant);
						} else {
							entity.PrcItemTotalGrossOc = itemCalculationHelper.getTotalGrossOcForInv(entity.PriceOc, entity.OrderQuantity, 0, 0, vatPercent, 1, 1, 0);
							entity.PrcItemTotalGross = itemCalculationHelper.getTotalGrossForInv(entity.Price, entity.OrderQuantity, 0, 0, vatPercent, 1, 1, 0, entity.PrcItemTotalGrossOc, exchangeRate, constant);
						}
						entity.TotalValueGrossOc = itemCalculationHelper.getTotalValueOcGrossForInv(entity, vatPercent, constant);
						entity.TotalValueGross = itemCalculationHelper.getTotalValueGrossForInv(entity, vatPercent, exchangeRate, constant);
						dataService.recalcuteContract();
					}
				};

				service.asyncValidatePrjStockFk = function asyncValidatePrjStockFk(entity, value, model, isupdate) {
					var defer = $q.defer();
					var result = {apply: true, valid: true};
					var result1 = {apply: true, valid: true};
					var result2 = {apply: true, valid: true};
					var projectstockview = basicsLookupdataLookupDescriptorService.getData('projectStockLookupDataService');
					var isReadonly = true;
					if (projectstockview === null || projectstockview === undefined) {
						if (value === null) {
							platformRuntimeDataService.readonly(entity, [{
								field: 'ProvisionPercent',
								readonly: true
							}, {field: 'ProvisionTotal', readonly: true}]);
						} else {
							getprovisionallowed(value).then(function (res) {
								if (res) {
									isReadonly = !res.data;
									platformRuntimeDataService.readonly(entity, [{
										field: 'ProvisionPercent',
										readonly: isReadonly
									}, {field: 'ProvisionTotal', readonly: isReadonly}]);
								}
							}
							);
						}
					} else {
						if (projectstockview && projectstockview[value] && projectstockview[value].IsProvisionAllowed) {
							isReadonly = false;
						}
						platformRuntimeDataService.readonly(entity, [{
							field: 'ProvisionPercent',
							readonly: isReadonly
						}, {field: 'ProvisionTotal', readonly: isReadonly}]);
					}

					if ((entity.PrjStockFk !== value && value) || (value && isupdate === true)) {
						getMaterial2Stock(entity.PrcItemFk, value, entity.Quantity).then(function (data) {
							if (data) {
								var invoiceItem = data;
								if (invoiceItem) {
									entity.PrjStockLocationFk = invoiceItem.PrjStockLocationFk;
									/** @namespace pesItem.IsInStock2Material */
									if (invoiceItem.IsInStock2Material) {
										entity.PrcStockTransactionTypeFk = 1;
										service.asyncValidatePrcStockTransactionTypeFk(entity, entity.PrcStockTransactionTypeFk, 'PrcStockTransactionTypeFk', false, true);
									}
									if (isReadonly) {
										entity.ProvisionPercent = 0;
										entity.ProvisionTotal = 0;
									} else {
										entity.ProvisionPercent = invoiceItem.ProvisionPercent;
										entity.ProvisionTotal = round(entity, roundingType.ProvisionTotal, invoiceItem.ProvisionTotal);
									}
									dataService.gridRefresh();
								}
								var IsLotManagement = data.IsLotManagement;
								if (IsLotManagement && (entity.LotNo === null || entity.LotNo === '')) {
									result.valid = false;
									var entityLotNo = $translate.instant('procurement.common.entityLotNo');
									result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: entityLotNo});
								}
								if (projectstockview === null || projectstockview === undefined) {
									getislocationmandatory(value).then(function (res) {
										if (res) {
											if (res.data && (entity.PrjStockLocationFk === null || entity.PrjStockLocationFk === '')) {
												result1.valid = false;
												var entityPrjStockLocation = $translate.instant('procurement.common.entityPrjStockLocation');
												result1.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: entityPrjStockLocation});
											}
										}
									});
								} else {
									if (projectstockview && projectstockview[value] && projectstockview[value].IsLocationMandatory && (entity.PrjStockLocationFk === null || entity.PrjStockLocationFk === '')) {
										result1.valid = false;
										var entityPrjStockLocation = $translate.instant('procurement.common.entityPrjStockLocation');
										result1.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: entityPrjStockLocation});
									}
								}
								if (entity.PrcStockTransactionTypeFk === null) {
									result2.valid = false;
									var entityPrcStockTransactionType = $translate.instant('procurement.common.entityPrcStockTransactionType');
									result2.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: entityPrcStockTransactionType});
								}
							}
							defer.resolve(true);
							platformRuntimeDataService.applyValidationResult(true, entity, model);
							platformDataValidationService.finishValidation(true, entity, value, model, service, dataService);
							platformRuntimeDataService.applyValidationResult(result, entity, 'LotNo');
							platformDataValidationService.finishValidation(result, entity, value, 'LotNo', service, dataService);
							platformRuntimeDataService.applyValidationResult(result1, entity, 'PrjStockLocationFk');
							platformDataValidationService.finishValidation(result1, entity, value, 'PrjStockLocationFk', service, dataService);
							platformRuntimeDataService.applyValidationResult(result2, entity, 'PrcStockTransactionTypeFk');
							platformDataValidationService.finishValidation(result2, entity, value, 'PrcStockTransactionTypeFk', service, dataService);
						});
					} else {
						dataService.selectprjstockReadOnly(entity).then(function (response) {
							if (response.data) {
								if ((response.data.PrjStockFk || response.data.PrjStockFk === 0) && value === null) {
									result.valid = false;
									var entityPrjStock = $translate.instant('procurement.common.entityPrjStock');
									result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: entityPrjStock});

								}
								defer.resolve(result);
								platformRuntimeDataService.applyValidationResult(result, entity, model);
								platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
								platformRuntimeDataService.applyValidationResult(true, entity, 'LotNo');
								platformDataValidationService.finishValidation(true, entity, value, 'LotNo', service, dataService);
								platformRuntimeDataService.applyValidationResult(true, entity, 'PrjStockLocationFk');
								platformDataValidationService.finishValidation(true, entity, value, 'PrjStockLocationFk', service, dataService);
								platformRuntimeDataService.applyValidationResult(true, entity, 'PrcStockTransactionTypeFk');
								platformDataValidationService.finishValidation(true, entity, value, 'PrcStockTransactionTypeFk', service, dataService);
								dataService.gridRefresh();
							}
						});
					}
					return defer.promise;
				};

				service.asyncValidateLotNo = function asyncValidateLotNo(entity, newValue) {
					var defer = $q.defer();
					var result = {apply: true, valid: true};
					if (entity.PrjStockFk !== null && newValue === '') {
						getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, entity.Quantity).then(function (invoiceItem) {
							if (invoiceItem) {
								var IsLotManagement = invoiceItem.IsLotManagement;
								if (IsLotManagement) {
									result.valid = false;
									var entityLotNo = $translate.instant('procurement.common.entityLotNo');
									result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: entityLotNo});
								}
								platformDataValidationService.finishValidation(result, entity, newValue, 'LotNo', service, dataService);
								defer.resolve(result);
							}
						});
					} else {
						platformDataValidationService.finishValidation(result, entity, newValue, 'LotNo', service, dataService);
						defer.resolve(true);
					}
					return defer.promise;
				};

				service.asyncValidateExpirationDate = function asyncValidateExpirationDate(entity, newValue) {
					var defer = $q.defer();
					var result = {apply: true, valid: true};
					if (entity.PrjStockFk !== null && newValue === '') {
						getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, entity.Quantity).then(function (invoiceItem) {
							if (invoiceItem) {
								var IsLotManagement = invoiceItem.IsLotManagement;
								if (IsLotManagement) {
									result.valid = false;
									var entityExpirationDate = $translate.instant('procurement.common.ExpirationDate');
									result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: entityExpirationDate});
								}
								platformDataValidationService.finishValidation(result, entity, newValue, 'ExpirationDate', service, dataService);
								defer.resolve(result);
							}
						});
					} else {
						platformDataValidationService.finishValidation(result, entity, newValue, 'ExpirationDate', service, dataService);
						defer.resolve(true);
					}
					return defer.promise;
				};

				service.asyncValidatePrcStockTransactionTypeFk = function validatePrcStockTransactionTypeFk(entity, value, model, isstock, isstock2material) {
					var defer = $q.defer();
					var result = {apply: true, valid: true};
					var fields = ['PrcStockTransactionFk'];
					setFieldReadOnly(entity, fields, true);
					if (!_.isNull(value)) {

						switch (value) {
							case 1: // Material Receipt
								if (isstock2material) {
									setFieldReadOnly(entity, fields, false);
									$timeout(dataService.gridRefresh, 0, false);
								} else {
									getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, entity.Quantity).then(function (item) {
										if (item) {
											/** @namespace item.IsInStock2Material */
											if (item.IsInStock2Material) {
												setFieldReadOnly(entity, fields, false);
											}
											$timeout(dataService.gridRefresh, 0, false);
										}
									});
								}
								entity.PrcStockTransactionFk = null;
								break;
							case 2: // Incidental Acquisition Expense
								setFieldReadOnly(entity, fields, false);
								if (_.isUndefined(entity.PrcStockTransactionFk) || _.isNull(entity.PrcStockTransactionFk)) {
									result.valid = false;
									result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('procurement.common.entityPrcStockTransaction')});
								}
								break;
							default:
								var transactionType = basicsLookupdataLookupDescriptorService.getData('PrcStocktransactiontype');
								var type = _.find(transactionType, {Id: value});
								/** @namespace type.IsDelta */
								if (type && type.IsDelta) {
									setFieldReadOnly(entity, fields, false);
									if (_.isUndefined(entity.PrcStockTransactionFk) || _.isNull(entity.PrcStockTransactionFk)) {
										result.valid = false;
										result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('procurement.common.entityPrcStockTransaction')});
									}
								}
								break;
						}
						setModelApplyValidationAndFinishValidation(result, entity, 'PrcStockTransactionFk', value);
						defer.resolve(true);
					} else {
						if (isstock) {
							setModelApplyValidationAndFinishValidation(result, entity, 'PrcStockTransactionFk', value);
							defer.resolve(true);
						} else {
							dataService.selectprjstockReadOnly(entity).then(function (response) {
								if (response.data) {
									if (response.data.PrcStockTransactionTypeFk && entity.PrjStockFk) {
										var entityPrcStockTransactionType = $translate.instant('procurement.common.entityPrcStockTransactionType');
										result.valid = false;
										result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: entityPrcStockTransactionType});
									}
									entity.PrcStockTransactionFk = null;
									setModelApplyValidationAndFinishValidation(result, entity, 'PrcStockTransactionFk', value);
									defer.resolve(true);
								}
							});
						}
					}
					return defer.promise;
				};

				service.validatePrcStockTransactionFk = function validatePrcStockTransactionFk(entity, value, model) {
					var result = {apply: true, valid: true};
					if (value === null && entity.PrcStockTransactionTypeFk === 2) {
						result.valid = false;
						var entityPrcStockTransaction = $translate.instant('procurement.common.entityPrcStockTransaction');
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: entityPrcStockTransaction});
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				service.validateControllingUnitFk = function validateControllingUnitFk(entity, value, model) {

					var result = {apply: true, valid: true};
					entity.ControllingUnitFk = value;
					updateprjstockReadOnly(entity);
					if (value === 0 || value === null) {
						// platformRuntimeDataService.readonly(entity, [{field: 'IsAssetManagement', readonly: false}]);
						checkIsAssetManagementReadonly(entity, false);
					} else {
						var controllingUnits = basicsLookupdataLookupDescriptorService.getData('ControllingUnit');
						if (controllingUnits) {
							var controllingUnit = _.find(controllingUnits, {Id: value});
							if (controllingUnit && controllingUnit.Isassetmanagement === false) {
								platformRuntimeDataService.readonly(entity, [{
									field: 'IsAssetManagement',
									readonly: true
								}]);
							} else {
								checkIsAssetManagementReadonly(entity, false);
								// platformRuntimeDataService.readonly(entity, [{field: 'IsAssetManagement', readonly: false}]);
							}
						}
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				// ControllingUnitFk
				service.asyncValidateControllingUnitFk = function (entity, value, model) {
					var defer = $q.defer();
					var result = {
						apply: true,
						valid: true
					};
					entity.ControllingUnitFk = value;
					updateprjstockReadOnly(entity);
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					if (null === value) {
						// platformRuntimeDataService.readonly(entity, [{field: 'IsAssetManagement', readonly: false}]);
						checkIsAssetManagementReadonly(entity, false);
						defer.resolve(true);
					} else {
						var ProjectFk = parentService.getSelected().ProjectFk;
						$http.get(globals.webApiBaseUrl + 'controlling/structure/validationControllingUnit?ControllingUnitFk=' + value + '&ProjectFk=' + ProjectFk).then(function (response) {
							if (response.data) {
								result = {
									apply: true,
									valid: false,
									error: $translate.instant('basics.common.error.controllingUnitError')
								};
								platformRuntimeDataService.applyValidationResult(result, entity, model);
								defer.resolve(result);
							} else {
								defer.resolve(true);
							}
						});
						asyncMarker.myPromise = defer.promise;
					}
					asyncMarker.myPromise = defer.promise.then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});
					return asyncMarker.myPromise;
				};

				service.validatePrjStockLocationFk = function validatePrjStockLocationFk(entity, value, model) {
					var result = {apply: true, valid: true};
					if (angular.isUndefined(value) || value === null || value === -1) {
						var projectstockview = basicsLookupdataLookupDescriptorService.getData('projectStockLookupDataService');
						if (projectstockview && projectstockview[entity.PrjStockFk] && projectstockview[entity.PrjStockFk].IsLocationMandatory) {
							result.valid = false;
							var entityPrjStockLocation = $translate.instant('procurement.common.entityPrjStockLocation');
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: entityPrjStockLocation});
						}
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				service.asyncValidatePrcStructureFk = function asyncValidatePrcStructureFk(entity, value, model) {
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					asyncMarker.myPromise = setPrcStructureFkAsync(entity, value).then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});
					return asyncMarker.myPromise;
				};

				function setPrcStructureFkAsync(entity, PrcStructureFk) {
					var validationResult = false;
					if (angular.isUndefined(PrcStructureFk) || PrcStructureFk === null || PrcStructureFk === -1) {
						let result = {apply: true, valid: true}; // jshint ignore:line
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: 'PrcStructureFk'});
						return $q.when(result);
					}
					var postData = $http.get(globals.webApiBaseUrl + 'basics/procurementstructure/taxcode/list?mainItemId=' + PrcStructureFk);
					return $q.all([postData]).then(function (response) {
						if (response[0].data.Main.length >= 1) {
							var loginCompanyFk = platformContextService.clientId;
							var ContextFk;
							if (loginCompanyFk) {
								var companies = basicsLookupdataLookupDescriptorService.getData('Company');
								let company = _.find(companies, {Id: loginCompanyFk});
								if (company) {
									ContextFk = company.ContextFk;
								}
							}
							for (let i = 0; i < response[0].data.Main.length; i++) {
								if (response[0].data.Main[i].MdcLedgerContextFk === ContextFk) {
									entity.MdcSalesTaxGroupFk = response[0].data.Main[i].MdcSalesTaxGroupFk;
									validationResult = true;
									return validationResult;
								}
							}
						}
						// https://rib-40.atlassian.net/browse/DEV-25221: fix validation issue of contract items, need to always returns a validation result in this function
						return true;
					});
				}

				service.validateTotalValue = function validateTotalValue(entity, value) {
					var exchangeRate = parentService.getSelected().ExchangeRate;
					var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
					let constant = getContractRoundingMethod(entity);
					var vp = (100 + vatPercent) / 100;
					entity.IsTotalEdited = true;
					entity.TotalValue = value;
					entity.TotalValueOc = itemCalculationHelper.getAmountOcByNonOc(entity.TotalValue, exchangeRate, constant);
					entity.DiscountSplit = 0;
					entity.DiscountSplitOc = 0;
					if (entity.Price !== 0) {
						if (entity.PrcItemFk) {
							var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
							if (isCalculateOverGross) {
								entity.Quantity = roundQuantity(entity, math.bignumber(entity.DiscountSplit).div(vp).add(entity.TotalValue).div(entity.Price));
							} else {
								entity.Quantity = roundQuantity(entity, math.bignumber(entity.DiscountSplit).add(entity.TotalValue).div(entity.Price));
							}
						} else {
							entity.Quantity = roundQuantity(entity, math.bignumber(entity.TotalValue).div(entity.Price));
						}
						entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, entity.Quantity, null);
					}

					entity.Percentage = 0;
					if (entity.OrderQuantity && entity.Quantity) {
						entity.Percentage = itemCalculationHelper.getPercentageForInv(entity.Quantity, entity.OrderQuantity, constant);
					}

					entity.TotalValueGross = itemCalculationHelper.getAmountAfterTaxByPreTax(entity.TotalValue, vatPercent, constant);
					entity.TotalValueGrossOc = itemCalculationHelper.getAmountAfterTaxByPreTax(entity.TotalValueOc, vatPercent, constant);

					dataService.fireItemModified(entity);
					dataService.recalcuteContract();

					getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, entity.Quantity).then(function (invoiceItem) {
						if (invoiceItem) {
							entity.ProvisionTotal = round(entity, roundingType.ProvisionTotal, invoiceItem.ProvisionTotal);
							dataService.gridRefresh();
						}
					});
				};

				service.validateTotalValueGross = function validateTotalValueGross(entity, value) {
					var exchangeRate = parentService.getSelected().ExchangeRate;
					var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
					let constant = getContractRoundingMethod(entity);
					var vp = (100 + vatPercent) / 100;
					entity.IsTotalEdited = true;
					entity.TotalValueGross = value;
					entity.TotalValueGrossOc = itemCalculationHelper.getAmountOcByNonOc(entity.TotalValueGross, exchangeRate, constant);
					entity.DiscountSplit = 0;
					entity.DiscountSplitOc = 0;
					if (entity.PriceGross !== 0) {
						if (entity.PrcItemFk) {
							var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
							if (isCalculateOverGross) {
								entity.Quantity = roundQuantity(entity, math.bignumber(entity.DiscountSplit).add(entity.TotalValueGross).div(entity.PriceGross));
							} else {
								entity.Quantity = roundQuantity(entity, math.bignumber(entity.DiscountSplit).mul(vp).add(entity.TotalValueGross).div(entity.PriceGross));
							}
						} else {
							entity.Quantity = roundQuantity(entity, math.bignumber(entity.TotalValueGross).div(entity.PriceGross));
						}
						entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, entity.Quantity, null);
					}

					entity.Percentage = 0;
					if (entity.OrderQuantity && entity.Quantity) {
						entity.Percentage = itemCalculationHelper.getPercentageForInv(entity.Quantity, entity.OrderQuantity, constant);
					}

					entity.TotalValue = itemCalculationHelper.getTotalValueForInv(entity, vatPercent, constant);
					entity.TotalValueOc = itemCalculationHelper.getTotalValueOcForInv(entity, vatPercent, constant);

					dataService.fireItemModified(entity);
					dataService.recalcuteContract();

					getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, entity.Quantity).then(function (invoiceItem) {
						if (invoiceItem) {
							entity.ProvisionTotal = round(entity, roundingType.ProvisionTotal, invoiceItem.ProvisionTotal);
							dataService.gridRefresh();
						}
					});
				};

				service.validateTotalValueOc = function validateTotalValueOc(entity, value) {
					var exchangeRate = parentService.getSelected().ExchangeRate;
					var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
					let constant = getContractRoundingMethod(entity);
					var vp = (100 + vatPercent) / 100;
					entity.IsTotalEdited = true;
					entity.TotalValueOc = value;
					entity.TotalValue = itemCalculationHelper.getAmountNonOcByOc(entity.TotalValueOc, exchangeRate, constant);
					entity.DiscountSplit = 0;
					entity.DiscountSplitOc = 0;
					if (entity.PriceOc !== 0) {
						if (entity.PrcItemFk) {
							var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
							if (isCalculateOverGross) {
								entity.Quantity = roundQuantity(entity, math.bignumber(entity.DiscountSplitOc).div(vp).add(entity.TotalValueOc).div(entity.PriceOc));
							} else {
								entity.Quantity = roundQuantity(entity, math.bignumber(entity.DiscountSplitOc).add(entity.TotalValueOc).div(entity.PriceOc));
							}
						} else {
							entity.Quantity = roundQuantity(entity, math.bignumber(entity.TotalValueOc).div(entity.PriceOc));
						}
						entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, entity.Quantity, null);
					}

					entity.Percentage = 0;
					if (entity.OrderQuantity && entity.Quantity) {
						entity.Percentage = itemCalculationHelper.getPercentageForInv(entity.Quantity, entity.OrderQuantity, constant);
					}

					entity.TotalValueGross = itemCalculationHelper.getAmountAfterTaxByPreTax(entity.TotalValue, vatPercent, constant);
					entity.TotalValueGrossOc = itemCalculationHelper.getAmountAfterTaxByPreTax(entity.TotalValueOc, vatPercent, constant);

					dataService.fireItemModified(entity);
					dataService.recalcuteContract();

					getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, entity.Quantity).then(function (invoiceItem) {
						if (invoiceItem) {
							entity.ProvisionTotal = round(entity, roundingType.ProvisionTotal, invoiceItem.ProvisionTotal);
							dataService.gridRefresh();
						}
					});
				};

				service.validateTotalValueGrossOc = function validateTotalValueGrossOc(entity, value) {
					var exchangeRate = parentService.getSelected().ExchangeRate;
					var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
					let constant = getContractRoundingMethod(entity);
					var vp = (100 + vatPercent) / 100;
					entity.IsTotalEdited = true;
					entity.TotalValueGrossOc = value;
					entity.TotalValueGross = itemCalculationHelper.getAmountNonOcByOc(entity.TotalValueGrossOc, exchangeRate, constant);
					entity.DiscountSplit = 0;
					entity.DiscountSplitOc = 0;
					if (entity.PriceOcGross !== 0) {
						if (entity.PrcItemFk) {
							var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
							if (isCalculateOverGross) {
								entity.Quantity = roundQuantity(entity, math.bignumber(entity.DiscountSplitOc).add(entity.TotalValueGrossOc).div(entity.PriceOcGross));
							} else {
								entity.Quantity = roundQuantity(entity, math.bignumber(entity.DiscountSplitOc).mul(vp).add(entity.TotalValueGrossOc).div(entity.PriceOcGross));
							}
						} else {
							entity.Quantity = roundQuantity(entity, math.bignumber(entity.TotalValueGrossOc).div(entity.PriceOcGross));
						}
						entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, entity.Quantity, null);
					}
					entity.Percentage = 0;
					if (entity.OrderQuantity && entity.Quantity) {
						entity.Percentage = itemCalculationHelper.getPercentageForInv(entity.Quantity, entity.OrderQuantity, constant);
					}

					entity.TotalValue = itemCalculationHelper.getTotalValueForInv(entity, vatPercent, constant);
					entity.TotalValueOc = itemCalculationHelper.getTotalValueOcForInv(entity, vatPercent, constant);

					dataService.fireItemModified(entity);
					dataService.recalcuteContract();

					getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, entity.Quantity).then(function (invoiceItem) {
						if (invoiceItem) {
							entity.ProvisionTotal = round(entity, roundingType.ProvisionTotal, invoiceItem.ProvisionTotal);
							dataService.gridRefresh();
						}
					});
				};

				service.validateIsAssetManagement = function validateIsAssetManagement(entity, value) {
					if (value === false) {
						entity.FixedAssetFk = null;
						platformRuntimeDataService.readonly(entity, [{field: 'FixedAssetFk', readonly: true}]);
					} else if (value === true) {
						platformRuntimeDataService.readonly(entity, [{field: 'FixedAssetFk', readonly: false}]);
					}
				};


				let materialCacheAndRequests = {};

				function getMaterial2Stock(prcItemId, projectStockId, quantity) {
					if (prcItemId === null || projectStockId === null) {
						return $q.resolve({
							IsInStock2Material: false,
							IsLotManagement: false,
							PrjStockLocationFk: null,
							ProvisionPercent: 0,
							ProvisionTotal: 0
						});
					}

					let cacheKey = 'MATERIAL_STOCK_' + prcItemId + ':::' + projectStockId + ':::' + quantity;
					let cacheEntry = materialCacheAndRequests[cacheKey];

					if (cacheEntry && cacheEntry.data) {
						return $q.resolve(cacheEntry.data);
					}

					if (cacheEntry && cacheEntry.promise) {
						return cacheEntry.promise;
					}

					let httpRequest = $http.get(globals.webApiBaseUrl + 'procurement/invoice/contract/getmaterial2projectstock', {
						params: {
							prcItemId: prcItemId,
							projectStockId: projectStockId,
							quantity: quantity
						}
					}).then(function (response) {
						let cacheItem = response.data;
						materialCacheAndRequests[cacheKey] = { data: cacheItem };
						return cacheItem;
					}, function (error) {
						delete materialCacheAndRequests[cacheKey];
						return $q.reject(error);
					});

					materialCacheAndRequests[cacheKey] = { promise: httpRequest };
					return httpRequest;
				}

				var _projectStockId1;
				var _locationmandatory;

				function getislocationmandatory(projectStockId) {
					var defer = $q.defer();
					if (projectStockId === _projectStockId1) {
						defer.resolve(_locationmandatory);
					} else {
						_projectStockId1 = projectStockId;
						$http.get(globals.webApiBaseUrl + 'project/stock/material/getislocationmandatory?projectStockId=' + projectStockId).then(function (response) {
							_locationmandatory = response;
							defer.resolve(_locationmandatory);
						}
						);
					}
					return defer.promise;
				}

				var _projectStockId2;
				var _provisionallowed;

				function getprovisionallowed(projectStockId) {
					var defer = $q.defer();
					if (projectStockId === _projectStockId2) {
						defer.resolve(_provisionallowed);
					} else {
						$http.get(globals.webApiBaseUrl + 'project/stock/material/getprovisionallowed?projectStockId=' + projectStockId).then(function (response) {
							_projectStockId2 = projectStockId;
							_provisionallowed = response;
							defer.resolve(_provisionallowed);
						}
						);
					}
					return defer.promise;
				}

				function updateprjstockReadOnly(entity) {
					dataService.selectprjstockReadOnly(entity).then(function (response) {
						if (response.data) {
							var item = response.data;
							var isstock = true;
							if (item.PrjStockFk !== null) {
								if (item.PrjStockFk === 0) {
									entity.PrjStockFk = null;
								} else {
									entity.PrjStockFk = item.PrjStockFk;
								}
								entity.PrcStockTransactionTypeFk = item.PrcStockTransactionTypeFk;
								isstock = false;
							} else {
								entity.PrjStockFk = null;
								entity.PrcStockTransactionTypeFk = null;
								entity.PrcStockTransactionFk = null;
								entity.PrjStockLocationFk = null;
								entity.ProvisionPercent = 0;
								entity.ProvisionTotal = 0;
								entity.LotNo = null;
								entity.ExpirationDate = null;
							}
							dataService.setPrjstockReadOnly(entity, isstock);
							service.asyncValidatePrjStockFk(entity, entity.PrjStockFk, 'PrjStockFk', true);
							service.asyncValidateLotNo(entity, entity.LotNo);
							service.asyncValidateExpirationDate(entity, entity.ExpirationDate);
							service.asyncValidatePrcStockTransactionTypeFk(entity, entity.PrcStockTransactionTypeFk, 'PrcStockTransactionTypeFk', isstock);
							dataService.gridRefresh();
						}
					}
					);
				}

				// noinspection JSUnusedLocalSymbols
				function onEntityCreated(e, item) {
					service.asyncValidateConHeaderFk(item, item.ConHeaderFk, 'ConHeaderFk');
					service.validateTaxCodeFk(item, item.TaxCodeFk, 'TaxCodeFk', {
						onEntityCreated: true
					});
				}

				function setFieldReadOnly(item, model, isReadOnly) {
					var properties = [];
					$.each(model, function (i) {
						properties.push({field: model[i], readonly: isReadOnly});
					});
					platformRuntimeDataService.readonly(item, properties);
				}

				function setModelApplyValidationAndFinishValidation(result, entity, model, value) {
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				}

				function resetDiscountSplit(entity) {
					if (entity.PrcItemFk) {
						if (entity.PrcItemQuantity !== 0 && entity.Quantity !== 0 && entity.PrcItemDiscountSplit !== 0) {
							entity.DiscountSplit = round(entity, roundingType.DiscountSplit, math.bignumber(entity.PrcItemDiscountSplit).div(entity.PrcItemQuantity).mul(entity.Quantity));
							entity.DiscountSplitOc = round(entity, roundingType.DiscountSplitOc, math.bignumber(entity.PrcItemDiscountSplitOc).div(entity.PrcItemQuantity).mul(entity.Quantity));
						} else {
							entity.DiscountSplit = 0;
							entity.DiscountSplitOc = 0;
						}
					}
				}

				function getParentExchangeRate() {
					var exchangeRate = 1;
					var parentSelected = parentService.getSelected();
					if (parentSelected && parentSelected.ExchangeRate) {
						exchangeRate = parentSelected.ExchangeRate;
					}
					return exchangeRate;
				}

				function getContractRoundingMethod(entity) {
					if (entity && entity.PrcBoqFk) {
						return contractRoundingMethod.ForBoq;
					}
					if (entity && entity.PrcItemFk) {
						return contractRoundingMethod.ForPrcItem;
					}
					return contractRoundingMethod.ForNull;
				}

				function round(entity, roundingField, value) {
					if (_.isNaN(value)) {
						return 0;
					}
					if (entity && entity.PrcBoqFk) {
						return prcCommonCalculationHelper.round(value, 2);
					}
					if (entity && entity.PrcItemFk) {
						return itemCalculationHelper.round(roundingField, value);
					}
					return prcCommonCalculationHelper.round(value, 3);
				}

				function roundAlternativeQuantity(entity, value) {
					if (entity && entity.PrcBoqFk) {
						return prcCommonCalculationHelper.round(value, 5);
					}
					if (entity && entity.PrcItemFk) {
						return itemCalculationHelper.round(roundingType.AlternativeQuantity, value);
					}
					return prcCommonCalculationHelper.round(value, 3);
				}

				function roundQuantity(entity, value) {
					if (entity && entity.PrcBoqFk) {
						return prcCommonCalculationHelper.round(value, 5);
					}
					if (entity && entity.PrcItemFk) {
						return itemCalculationHelper.round(roundingType.Quantity, value);
					}
					return prcCommonCalculationHelper.round(value, 3);
				}

				dataService.registerEntityCreated(onEntityCreated);

				return service;
			}
		]);

})(angular);
