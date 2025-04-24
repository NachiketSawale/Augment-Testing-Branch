/**
 * Created by chi on 09.06.2014.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals, _, math */
	/**
	 * @ngdoc service
	 * @name reqHeaderElementValidationService
	 * @description provides validation methods for a ReqHeader
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').factory('procurementInvoiceOtherValidationService',
		['validationService', 'procurementInvoiceOtherDataService', 'procurementInvoiceHeaderDataService', 'platformDataValidationService', 'platformRuntimeDataService',
			'basicsLookupdataLookupDescriptorService', 'prcCommonCalculationHelper', '$translate', '$q', '$http','platformContextService',
			'prcCommonItemCalculationHelperService',
			function (validationService, dataService, procurementInvoiceHeaderDataService, platformDataValidationService, platformRuntimeDataService, basicsLookupdataLookupDescriptorService,
				prcCommonCalculationHelper, $translate, $q, $http,platformContextService,
				itemCalculationHelper) {

				var service = validationService.create('prcInvoiceOther', 'procurement/invoice/other/schema');
				var parentItem, exchangeRate;

				function createErrorObject(transMsg, errorParam) {
					return {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: transMsg,
						error$tr$param$: errorParam
					};
				}

				service.validateQuantity = function validateQuantity(entity, value) {
					entity.Quantity = value;
					if (value > 0) {
						service.removeError(entity);
					}
					dataService.setTotalAndItsGross(entity);
					dataService.recalcuteOther();
					return true;
				};

				var doGetStructureData;
				service.validatePrcStructureFk = function validatePrcStructureFk(entity, value, model) {
					var result = true;
					if (value === 0 || value === null) {
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('cloud.common.entityStructure')});
					}

					const systemOptionPromise = $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/ispostingnarrativefrominvHeader');
					const prcStructurePromise = basicsLookupdataLookupDescriptorService.loadData('Prcstructure');
					const taxCodePromise = $http.get(globals.webApiBaseUrl + 'basics/procurementstructure/taxcode/getTaxCodeByStructure?structureId=' + value);

					$q.all([systemOptionPromise, prcStructurePromise, taxCodePromise]).then((responses) => {
						const useHeaderDescription = responses[0].data;
						const structureData = responses[1];
						const taxCodeFk = responses[2].data;

						if (_.isUndefined(entity.isAdd)) {
							if (taxCodeFk && structureData) {
								entity.TaxCodeFk = taxCodeFk;
								service.validateTaxCodeFk(entity, entity.TaxCodeFk);

								const found = [];
								doGetStructureData(structureData, value, found);

								if (found.length > 0) {
									entity.Description = useHeaderDescription ? procurementInvoiceHeaderDataService.getSelected().Description : found[0].DescriptionInfo.Translated || entity.Description;
								}

								dataService.markItemAsModified(entity);
							}
						} else {
							delete entity.isAdd;
						}
						dataService.refreshAccountInfo([entity]);
					});

					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					// defect:124735 start
					entity.PrcStructureFk = value;
					if(entity.PrcStructureFk) {
						var postData = $http.get(globals.webApiBaseUrl + 'basics/procurementstructure/taxcode/list?mainItemId=' + entity.PrcStructureFk);
						$q.all([postData]).then(function (response) {
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
										break;
									}
								}
							}
						});
					}
					// defect:124735 end

					return result;
				};
				service.validateControllingUnitFk = function (entity, value, model) {
					var result = true;
					if (value === 0 || value === null) {
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('procurement.invoice.EntityMdcControllingUnitFk')});
					}
					else {
						var controllingUnits = basicsLookupdataLookupDescriptorService.getData('ControllingUnit');
						if (controllingUnits) {
							var controllingUnit = _.find(controllingUnits, {Id: value});
							if (controllingUnit !== undefined) {
								if (controllingUnit.Isassetmanagement === false) {
									platformRuntimeDataService.readonly(entity, [{field: 'IsAssetManagement', readonly: true}]);
								}
								else {
									platformRuntimeDataService.readonly(entity, [{field: 'IsAssetManagement', readonly: false}]);
								}
							}
						}
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					dataService.refreshAccountInfo([entity]);
					return result;
				};
				service.asyncValidateControllingUnitFk = function (entity, value, model) {

					var defer = $q.defer();
					var result = {
						apply: true,
						valid: true
					};
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					if (null === value) {
						defer.resolve(true);
					}
					else {
						var ProjectFk = entity.ProjectFk?entity.ProjectFk:procurementInvoiceHeaderDataService.getSelected().ProjectFk;
						$http.get(globals.webApiBaseUrl + 'controlling/structure/validationControllingUnit?ControllingUnitFk=' + value + '&ProjectFk=' + ProjectFk).then(function (response) {
							if (response.data) {
								result = {
									apply: true,
									valid: false,
									error: $translate.instant('basics.common.error.controllingUnitError')
								};
								platformRuntimeDataService.applyValidationResult(result, entity, model);
								defer.resolve(result);
							}
							else {
								defer.resolve(true);
							}
						});
						asyncMarker.myPromise = defer.promise;
					}
					asyncMarker.myPromise = defer.promise.then(function (response) {
						const result = platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
						dataService.refreshAccountInfo([entity]);
						return result;
					});
					return asyncMarker.myPromise;
				};


				service.validateAmountNet = function validateAmountNet(entity, value, model) {
					setAmountNetAmountNetOcAndItsGross(entity, value, model);
					dataService.setTotalAndItsGross(entity);
					dataService.recalcuteOther();
					return true;
				};

				service.validateAmountNetOc = function validateAmountNetOc(entity, value, model) {
					setAmountNetAmountNetOcAndItsGross(entity, value, model);
					dataService.setTotalAndItsGross(entity);
					dataService.recalcuteOther();
					return true;
				};

				function resetExchangeRate() {
					parentItem = procurementInvoiceHeaderDataService.getSelected();
					exchangeRate = 0;
					if (parentItem && parentItem.Id) {
						exchangeRate = parentItem.ExchangeRate;
					}
				}

				function recalculateAmountUnitByAmountTotal(entity) {
					entity.AmountNet = prcCommonCalculationHelper.round(math.bignumber(entity.AmountTotal).div(entity.Quantity));
					entity.AmountNetOc = prcCommonCalculationHelper.round(math.bignumber(entity.AmountTotalOc).div(entity.Quantity));

					dataService.recalcuteOther();
				}

				function recalculateAmountUnitGrossByTotalGross(entity) {
					entity.AmountGross = prcCommonCalculationHelper.round(math.bignumber(entity.AmountTotalGross).div(entity.Quantity));
					entity.AmountGrossOc = prcCommonCalculationHelper.round(math.bignumber(entity.AmountTotalGrossOc).div(entity.Quantity));
				}

				function recalculateAmountUnitGrossByAmountUnit(entity) {
					var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
					entity.AmountGross = itemCalculationHelper.getAfterTaxByPreTax(entity.AmountNet, vatPercent);
					entity.AmountGrossOc = itemCalculationHelper.getOcByNonOc(entity.AmountGross, exchangeRate);
				}

				function recalculateAmountUnitByUnitGross(entity) {
					var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
					entity.AmountNet = itemCalculationHelper.getPreTaxByAfterTax(entity.AmountGross, vatPercent);
					entity.AmountNetOc = itemCalculationHelper.getOcByNonOc(entity.AmountNet, exchangeRate);
				}

				function recalculateAmountUnitTotalGrossByAmountTotal(entity) {
					var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
					entity.AmountTotalGross = itemCalculationHelper.getAfterTaxByPreTax(entity.AmountTotal, vatPercent);
					entity.AmountTotalGrossOc = itemCalculationHelper.getAfterTaxByPreTax(entity.AmountTotalOc, vatPercent);
				}

				function recalculateAmountTotalByAmountTotalGross(entity) {
					var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
					entity.AmountTotal = itemCalculationHelper.getPreTaxByAfterTax(entity.AmountTotalGross, vatPercent);
					entity.AmountTotalOc = itemCalculationHelper.getPreTaxByAfterTax(entity.AmountTotalGrossOc, vatPercent);
					dataService.recalcuteOther();
				}

				service.removeError = function (entity) {
					if (entity.__rt$data && entity.__rt$data.errors) {
						entity.__rt$data.errors = null;
					}
				};

				service.validateAmountGross = function validateAmountGross(entity, value, model) {
					var result = {
						apply: true,
						valid: true,
						error: null
					};
					setAmountNetAmountNetOcAndItsGross(entity, value, model);
					dataService.setTotalAndItsGross(entity);
					dataService.recalcuteOther();
					return platformRuntimeDataService.applyValidationResult(result, entity, model);
				};

				service.validateAmountGrossOc = function validateAmountGrossOc(entity, value, model) {
					var result = {
						apply: true,
						valid: true,
						error: null
					};
					setAmountNetAmountNetOcAndItsGross(entity, value, model);
					dataService.setTotalAndItsGross(entity);
					dataService.recalcuteOther();
					return platformRuntimeDataService.applyValidationResult(result, entity, model);
				};

				service.validateAmountTotal = function validateAmountTotal(entity, value, model) {
					return resetExchangeRateAndValidateQuantityThenCalculate(entity, value, model, function () {
						entity.AmountTotal = value;
						entity.AmountTotalOc = itemCalculationHelper.getOcByNonOc(entity.AmountTotal, exchangeRate);
						recalculateAmountUnitByAmountTotal(entity);
						recalculateAmountUnitGrossByAmountUnit(entity);
						recalculateAmountUnitTotalGrossByAmountTotal(entity);
						dataService.recalcuteOther();
					});
				};

				service.validateAmountTotalOc = function validateAmountTotal(entity, value, model) {
					return resetExchangeRateAndValidateQuantityThenCalculate(entity, value, model, function () {
						entity.AmountTotalOc = value;
						entity.AmountTotal = itemCalculationHelper.getNonOcByOc(entity.AmountTotalOc, exchangeRate);
						recalculateAmountUnitByAmountTotal(entity);
						recalculateAmountUnitGrossByAmountUnit(entity);
						recalculateAmountUnitTotalGrossByAmountTotal(entity);
						dataService.recalcuteOther();
					});
				};

				service.validateAmountTotalGross = function validateAmountTotalGross(entity, value, model) {
					return resetExchangeRateAndValidateQuantityThenCalculate(entity, value, model, function () {
						entity.AmountTotalGross = value;
						entity.AmountTotalGrossOc = itemCalculationHelper.getOcByNonOc(entity.AmountTotalGross, exchangeRate);
						recalculateAmountUnitGrossByTotalGross(entity);
						recalculateAmountUnitByUnitGross(entity);
						recalculateAmountTotalByAmountTotalGross(entity);
						dataService.recalcuteOther();
					});
				};

				service.validateAmountTotalGrossOc = function validateAmountTotalGrossOc(entity, value, model) {
					return resetExchangeRateAndValidateQuantityThenCalculate(entity, value, model, function () {
						entity.AmountTotalGrossOc = value;
						entity.AmountTotalGross = itemCalculationHelper.getNonOcByOc(entity.AmountTotalGrossOc, exchangeRate);
						recalculateAmountUnitGrossByTotalGross(entity);
						recalculateAmountUnitByUnitGross(entity);
						recalculateAmountTotalByAmountTotalGross(entity);
						dataService.recalcuteOther();
					});
				};

				function resetExchangeRateAndValidateQuantityThenCalculate(entity, value, model, calculateFunction) {
					resetExchangeRate();
					var result = {
						apply: true,
						valid: true,
						error: null
					};
					if (entity.Quantity <= 0 && value > 0) {
						result = {
							apply: true,
							valid: false,
							error: 'Quantity should be more than zero'
						};
					} else {
						calculateFunction(entity, value);
					}
					return platformRuntimeDataService.applyValidationResult(result, entity, model);
				}

				service.validateTaxCodeFk = function validateTaxCodeFk(entity, value) {
					entity.TaxCodeFk = value;
					dataService.calculationAfterVatpercentChange(entity);
					dataService.recalcuteOther();
					dataService.refreshAccountInfo([entity]);
					return true;
				};

				service.validateIsAssetManagement = function validateIsAssetManagement(entity,value) {
					if (value === false) {
						entity.FixedAssetFk = null;
						platformRuntimeDataService.readonly(entity, [{field: 'FixedAssetFk', readonly: true}]);
					} else if (value === true) {
						platformRuntimeDataService.readonly(entity, [{field: 'FixedAssetFk', readonly: false}]);
					}
					dataService.refreshAccountInfo([entity]);
				};

				doGetStructureData = function (structureData, Id, temp) {
					for (var i = 0; i < structureData.length; i++) {
						if (structureData[i].Id === Id) {
							temp.push(structureData[i]);
						}
						else {
							if (structureData[i].ChildItems) {
								doGetStructureData(structureData[i].ChildItems, Id, temp);
							}
						}
					}
				};

				// noinspection JSUnusedLocalSymbols
				function onEntityCreated(e, item) {
					service.validatePrcStructureFk(item, item.PrcStructureFk, 'PrcStructureFk');
					if (item.ControllingUnitFk === 0 || item.ControllingUnitFk === null) {
						service.validateControllingUnitFk(item, item.ControllingUnitFk, 'ControllingUnitFk');
					}
					else {
						service.asyncValidateControllingUnitFk(item, item.ControllingUnitFk, 'ControllingUnitFk');
					}
					service.validateTaxCodeFk(item, item.TaxCodeFk);
				}

				function setAmountNetAmountNetOcAndItsGross(entity, value, model) {
					resetExchangeRate();
					var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
					switch (model) {
						case 'AmountNet': {
							entity.AmountNet = value;
							entity.AmountNetOc = itemCalculationHelper.getOcByNonOc(value, exchangeRate);
							entity.AmountGross = itemCalculationHelper.getAfterTaxByPreTax(value, vatPercent);
							entity.AmountGrossOc = itemCalculationHelper.getAfterTaxByPreTax(entity.AmountNetOc, vatPercent);
							break;
						}
						case 'AmountNetOc': {
							entity.AmountNetOc = value;
							entity.AmountNet = itemCalculationHelper.getNonOcByOc(value, exchangeRate);
							entity.AmountGrossOc = itemCalculationHelper.getAfterTaxByPreTax(value, vatPercent);
							entity.AmountGross = itemCalculationHelper.getAfterTaxByPreTax(entity.AmountNet, vatPercent);
							break;
						}
						case 'AmountGross': {
							entity.AmountGross = value;
							entity.AmountGrossOc = itemCalculationHelper.getOcByNonOc(value, exchangeRate);
							entity.AmountNet = itemCalculationHelper.getPreTaxByAfterTax(value, vatPercent);
							entity.AmountNetOc = itemCalculationHelper.getPreTaxByAfterTax(entity.AmountGrossOc, vatPercent);
							break;
						}
						case 'AmountGrossOc': {
							entity.AmountGrossOc = value;
							entity.AmountGross = itemCalculationHelper.getNonOcByOc(value, exchangeRate);
							entity.AmountNetOc = itemCalculationHelper.getPreTaxByAfterTax(value, vatPercent);
							entity.AmountNet = itemCalculationHelper.getPreTaxByAfterTax(entity.AmountGross, vatPercent);
							break;
						}
						default: {
							break;
						}
					}
				}

				dataService.registerEntityCreated(onEntityCreated);

				return service;
			}
		]);

})(angular);
