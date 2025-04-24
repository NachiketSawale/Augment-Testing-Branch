(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* global globals, _, math, $ */
	var moduleName = 'procurement.pes';

	angular.module(moduleName).factory('procurementPesItemValidationService',
		['$q', '$http', '$translate', '$timeout', 'basicsLookupdataLookupDescriptorService', 'platformDataValidationService', 'platformRuntimeDataService',
			'$injector', 'procurementContextService', 'prcCommonCalculationHelper', 'prcCommonItemCalculationHelperService',
			'prcGetIsCalculateOverGrossService', 'platformContextService','procurementItemProjectChangeService',
			/* jshint -W072 */
			function ($q, $http, $translate, $timeout, basicsLookupdataLookupDescriptorService, platformDataValidationService, platformRuntimeDataService,
					  $injector, moduleContext, prcCommonCalculationHelper, itemCalculationHelper,
					  prcGetIsCalculateOverGrossService, platformContextService,procurementItemProjectChangeService) {
				return function (dataService) {
					var service = {};
					var priceConditionDataService;
					var _pesItem;
					var _projectStockId1;
					var _locationmandatory;
					var _projectStockId2;
					var _provisionallowed;
					let roundingType = itemCalculationHelper.roundingType;

					service.validateUomFk = function validateUomFk(entity, value, model) {
						var result = {apply: true, valid: true};
						if (angular.isUndefined(value) || value === null || value === -1) {
							result.valid = false;
							var uom = $translate.instant('cloud.common.entityUoM');
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: uom});
						}

						var readonly = (!!entity.MdcMaterialFk || !!entity.PrcItemFk);
						platformRuntimeDataService.readonly(entity, [{field: model, readonly: readonly}]);

						if (!entity.MdcMaterialFk) {// When BAS_UOM_FK is changed and MdcMaterialFk is null, AlternativeUomFk is updated to the same value
							entity.AlternativeUomFk = value;
						}

						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
						$timeout(dataService.gridRefresh, 0, false);
						return result;
					};
					service.validateAlternativeUomFk = function validateAlternativeUomFk(entity, value, model) {
						platformRuntimeDataService.readonly(entity, [{field: model, readonly: !entity.Material2Uoms}]);

						entity.AlternativeQuantity = conversionQuantity(entity, value, entity.Quantity, null);
						return true;
					};

					service.asyncValidateConHeaderFk = function validateConHeaderFk(entity, value) {
						var defer = $q.defer();
						var result = {apply: true, valid: true};
						if (entity.ConHeaderFk !== value && value) {  // when the contract change, change the relative message in PES Header and PES BoQ
							dataService.changeHeaderConHeader(value, entity);
						}

						entity.ConHeaderFk = value;
						dataService.updateprjstockReadOnly(entity);

						var conheaders = basicsLookupdataLookupDescriptorService.getData('conheaderview');
						if (conheaders && conheaders[value]) {
							entity.ProjectFk = conheaders[value].ProjectFk;
							entity.PrcPackageFk = conheaders[value].PrcPackageFk;
						}
						dataService.updateDeliveredAndRemainingQuantity(-entity.Quantity, entity.PrcItemFk);
						dataService.updateByPrcItem(entity, null);
						dataService.setReadonly(entity);
						dataService.updateRootRow();
						// if (!value) {
						//     dataService.parentService().setBaseNChangeOrderPrcHeaderIdsByConHeaderId(value, true);
						// }
						defer.resolve(result);
						return defer.promise;
					};

					service.sourceData = {
						PrjStockFk: null,
						PrcStockTransactionTypeFk: null,
						PrcStockTransactionFk: null,
						PrjStockLocationFk: null,
						ProvisionPercent: 0,
						ProvisonTotal: 0,
						LotNo: null,
						ExpirationDate: null
					};

					service.saveSourceData = function saveSourceData(entity) {
						service.sourceData.PrjStockFk = entity.PrjStockFk;
						service.sourceData.PrcStockTransactionTypeFk = entity.PrcStockTransactionTypeFk;
						service.sourceData.PrcStockTransactionFk = entity.PrcStockTransactionFk;
						service.sourceData.PrjStockLocationFk = entity.PrjStockLocationFk;
						service.sourceData.ProvisonTotal = entity.ProvisonTotal;
						service.sourceData.LotNo = entity.LotNo;
						service.sourceData.ExpirationDate = entity.ExpirationDate;

					};

					service.restoreSourceData = function restoreSourceData(entity, sourceData) {
						entity.PrjStockFk = sourceData.PrjStockFk;
						entity.PrcStockTransactionTypeFk = sourceData.PrcStockTransactionTypeFk;
						entity.PrcStockTransactionFk = sourceData.PrcStockTransactionFk;
						entity.PrjStockLocationFk = sourceData.PrjStockLocationFk;
						entity.ProvisonTotal = sourceData.ProvisonTotal;
						entity.LotNo = sourceData.LotNo;
						entity.ExpirationDate = sourceData.ExpirationDate;
					};

					service.asyncValidatePrcItemFk = function validatePrcItemFk(entity, value) {
						return validatePrcItemLogic(entity, value, false);
					};

					service.validatePrcItemForCopy = function validatePrcItemForCopy(entity, value) {
						service.saveSourceData(entity);
						return validatePrcItemLogic(entity, value, true);
					};

					function validatePrcItemLogic(entity, value, isCopy) {
						var defer = $q.defer();
						var result = {apply: true, valid: true};
						if (value === null || angular.isUndefined(value) || value === -1) {
							entity.PrcItemFk = null;
							entity.MdcMaterialFk = null;
							entity.Co2Project = null;
							entity.Co2ProjectTotal = null;
							entity.Co2Source = null;
							entity.Co2SourceTotal = null;
							if (entity.itemSpecification) {
								entity.itemSpecification.Content = '';
								if (!entity.BlobSpecificationToSave) {
									entity.BlobSpecificationToSave = {};
								}
								entity.BlobSpecificationToSave.Id = entity.BasBlobsSpecificationFk;
								entity.BlobSpecificationToSave.Content = '';
							}
							dataService.updateprjstockReadOnly(entity);
							dataService.updateByPrcItem(entity, null);
							// platformRuntimeDataService.readonly(entity, [{field: 'UomFk', readonly: false}]);
							dataService.setReadonlyByPrcItemFk(entity, false);
							reloadPriceCondition(entity, null);
							reloadDeliverySchedule(null);
							defer.resolve(result);
							return defer.promise;
						}
						// /* var prcItems = */basicsLookupdataLookupDescriptorService.getData('PrcItemMergedLookup');
						// var mainItemId = null;
						var filter = {
							IsCanceled: false,
							// IsDelivered: false,
							// prcHeaderIds: dataService.parentService().getBaseNChangeOrderPrcHeaderIds(entity.ConHeaderFk),
							ContractId: entity.ConHeaderFk,
							PesHeaderId: entity.PesHeaderFk,
							IncludeDeliveredCon: true
							// PrcHeaderFk: currentItem.PrcHeaderId
						};
						if (entity && value) {
							$http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/copyprcitemblobid?prcItemFk=' + value)
								.then(function (response) {
									if (response.data !== 0 && response.data) {
										entity.BasBlobsSpecificationFk = response.data;
										dataService.loadItemSpecificationById(entity.BasBlobsSpecificationFk, false, entity);
									}
								});
						}
						// update cost group by prcitem
						if (entity && entity.PrcItemFk !== value) {
							if (entity.Version !== 0) {
								$http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/getcostgroup?prcItemFk=' + value)
									.then(function (response) {
										if (response !== null && response.data !== null && response.data !== 0) {
											_.forEach(response.data, function (costGroup) {
												var costGroupName = 'costgroup_' + costGroup.CostGroupCatFk;
												// eslint-disable-next-line no-prototype-builtins
												if (entity.hasOwnProperty(costGroupName)) {
													if (entity[costGroupName] !== costGroup.CostGroupFk) {
														entity[costGroupName] = costGroup.CostGroupFk;
														if (!_.isNil(dataService.costGroupService)) {
															var costGroupCol = {};
															costGroupCol.field = costGroupName;
															costGroupCol.costGroupCatId = costGroup.CostGroupCatFk;
															dataService.costGroupService.createCostGroup2Save(entity, costGroupCol);
														}
														dataService.markItemAsModified(entity);
													}
												}
											});
										}
									});
							} else {
								$http.get(globals.webApiBaseUrl + 'procurement/pes/item/getcostgroupbyprcitem' + '?prcItemFk=' + value + '&pesHeaderId=' + entity.PesHeaderFk + '&pesItemFk=' + entity.Id).then(function (response) {
									$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
										var responseData = response.data;
										responseData.dtos = [];
										responseData.dtos.push(entity);
										// responseData.CostGroupCats.isForDetail = true;
										basicsCostGroupAssignmentService.process(responseData, dataService, {
											mainDataName: 'dtos',
											attachDataName: 'PesItem2CostGroups', // name of MainItem2CostGroup
											dataLookupType: 'PesItem2CostGroups',// name of MainItem2CostGroup
											identityGetter: function identityGetter(entity) {
												return {
													Id: entity.MainItemId
												};
											}
										});
									}]);
								});
							}

						}
						const pesHeader = dataService.parentService().getSelected();
						Promise.all([
							$http.post(globals.webApiBaseUrl + 'procurement/common/prcitem/getitems4create', filter),
							$http.get(globals.webApiBaseUrl + 'procurement/pes/item/getQuantityContracted?prcConfigurationFk=' + pesHeader.PrcConfigurationFk + '&prcItemFkOfPes=' + value),
						]).then(function (allResponse) {
							const response = allResponse[0];
							const quantityContract = allResponse[1].data;

							if (!response.data || response.data.length === 0) {
								defer.resolve(result);
								return defer.promise;
							}
							var prcItems = response.data;
							if (prcItems && prcItems.length > 0) {
								var prcItem = _.find(prcItems, {Id: value});
								dataService.updateDeliveredAndRemainingQuantity(-entity.Quantity, entity.PrcItemFk);
								if (prcItem) {
									dataService.updateDeliveredAndRemainingQuantity(entity.Quantity, value);
									entity.PrcItemFk = value;
									entity.Material2Uoms = prcItem.Material2Uoms;
									entity.Co2Project = prcItem.Co2Project;
									entity.Co2ProjectTotal = prcItem.Co2ProjectTotal;
									entity.Co2Source = prcItem.Co2Source;
									entity.Co2SourceTotal = prcItem.Co2SourceTotal;
									dataService.updateprjstockReadOnly(entity);
									if(prcItem.PrjChangeFk !== null){
										entity.PrjChangeFk = prcItem.PrjChangeFk;
										dataService.markItemAsModified(entity);
									}
									if(prcItem.PrjChangeStatusFk !== null){
										entity.PrjChangeStatusFk = prcItem.PrjChangeStatusFk;
										dataService.markItemAsModified(entity);
									}
								}

								if (entity && entity.PrcItemFk) {
									$http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/creategrpset?mainItemId=' + entity.Id + '&prcItemFk=' + entity.PrcItemFk)
										.then(function (response) {
											$injector.get('procurementPesItemPriceConditionDataService').canDataReadonly();
											var groupSetData = response.data;
											if (_.isEmpty(groupSetData)) {
												return;
											}
											var GrpSetDTLDataService = $injector.get('procurementPesGrpSetDTLDataService');
											GrpSetDTLDataService.roadData(entity, groupSetData);
											GrpSetDTLDataService.gridRefresh();
										});
								}
								// platformRuntimeDataService.readonly(entity, [{field: 'UomFk', readonly: true}]);
								if (isCopy) {
									if (prcItem) {
										entity.QuantityContracted = quantityContract;
										entity.PrcItemFactorPriceUnit = prcItem.FactorPriceUnit;
										dataService.calcDeliveredAndRemaining(entity);
										dataService.calculateForCopy(entity);
										service.restoreSourceData(entity, service.sourceData);
									}
									if (entity.PrjStockFk) {
										dataService.updatePrjStockReadOnlyForCopy(entity, false);
									} else {
										dataService.updateprjstockReadOnly(entity);
									}
								} else {
									dataService.updateByPrcItem(entity, prcItem, quantityContract);
									entity.PrcItemDiscountSplit = prcItem.DiscountSplit;
									entity.PrcItemDiscountSplitOc = prcItem.DiscountSplitOc;
									entity.PrcItemQuantity = prcItem.Quantity;
									if (prcItem) {
										dataService.setInputWhichField({PriceGrossOc: true, TotalPrice: true});
										reloadPriceCondition(entity, prcItem.PrcPriceConditionFk, true).then(function () {
											dataService.setInputWhichField({});
										});
									}
									dataService.updateprjstockReadOnly(entity);
								}

								reloadDeliverySchedule(entity.PrcItemFk);
								dataService.setReadonlyByPrcItemFk(entity, true);
								dataService.priceReadOnly(entity, true);
								dataService.canReadonlyByPrcItemBasItemType(entity);

								defer.resolve(result);
								return defer.promise;
								// });
								// mainItemId = prcItem.PrcHeaderFk;
							}
						});
						// if (mainItemId) {
						//     $http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/list?MainItemId=' + mainItemId).then(function (response) {
						//         var foundPrcItem = _.find(response.data.Main, {Id: value});
						//         dataService.updateByPrcItem(entity, foundPrcItem);
						//         platformRuntimeDataService.readonly(entity, [{field: 'UomFk', readonly: true}]);
						//         dataService.priceReadOnly(entity, true);
						//         dataService.updateprjstockReadOnly(entity);
						//         if(foundPrcItem){
						//             reloadPriceCondition(entity, foundPrcItem.PrcPriceConditionFk, true);
						//         }
						//         defer.resolve(result);
						//     });
						// }
						// defer.resolve(result);
						return defer.promise;
					}

					service.asyncValidateItemNo = function validateItemNo(entity, value, model) {
						var result = platformDataValidationService.isMandatory(value, model);
						var defer = $q.defer();
						if (!result.valid) {
							result.valid = true;
							defer.resolve(result);
							return defer.promise;
						}
						$http.get(globals.webApiBaseUrl + 'procurement/pes/item/isitemnounique?id=' + entity.Id + '&&pesHeaderFk=' + entity.PesHeaderFk + '&&itemNo=' + value)
							.then(function (response) {
								if (!response.data) {
									result.apply = true;
									result.valid = false;
									result.error = $translate.instant('basics.common.validation.uniqueValueErrorMessage', {object: model});
									defer.resolve(result);
								} else {
									if (dataService.getList().length > 0) {
										result = platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id, false);
									}
									if (!result.valid) {
										result.apply = true;
									}
									defer.resolve(result);
								}
							});
						return defer.promise;
					};


					service.asyncValidatePercentageQuantity = function asyncValidatePercentageQuantity(entity, value) {
						let defer = $q.defer();
						var newQuantityValue;
						if (value === '' || value === null || value === 0 || !entity.QuantityContracted || entity.QuantityContracted === 0) {
							newQuantityValue = 0;
						} else {
							newQuantityValue = math.bignumber(value).mul(entity.QuantityContracted).div(100).toNumber();
						}
						validateQuantityLogic(entity, newQuantityValue).then(function () {
							entity.Quantity = newQuantityValue;
							entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, newQuantityValue, null);
							defer.resolve(true);
						});
						return defer.promise;
					};


					service.asyncValidateQuantity = function asyncValidateQuantity(entity, value, field, formatterOptions, forBulkConfig, noConversion) {
						let defer = $q.defer();
						let originalValue = entity[field];
						if (value === '' || value === null) {
							value = 0;
						}
						if (value !== 0 && entity.QuantityContracted && entity.QuantityContracted !== 0) {
							entity.PercentageQuantity = math.bignumber(value).mul(100).div(entity.QuantityContracted).div(100).toNumber();
						} else {
							entity.PercentageQuantity = 0;
						}
						validateQuantityLogic(entity, value).then(function () {
							updateBudgetFixedUnitAndTotalByQuantity(entity, value);
							if (!noConversion) {
								entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, value, null);
							}
							entity[field] = originalValue;
							defer.resolve(true);
						});
						return defer.promise;
					};

					service.asyncValidateAlternativeQuantity = function asyncValidateAlternativeQuantity(entity, value) {
						let defer = $q.defer();
						var quantity = conversionQuantity(entity, entity.AlternativeUomFk, null, value);
						service.asyncValidateQuantity(entity, quantity, 'Quantity', undefined, false,true).then(function (result) {
							entity.Quantity = quantity;
							defer.resolve(result);
						});
						return defer.promise;
					};

					function validateQuantityLogic(entity, value) {
						let defer = $q.defer();
						let promises = [];
						var diff = math.bignumber(value).sub(entity.Quantity).toNumber();
						entity.Quantity = value;
						if (entity.PrcItemFk) {
							entity.markModifyQuantityOfItemWithPrcItem = true;
							dataService.updateDeliveredAndRemainingQuantity(diff, entity.PrcItemFk, true);
						} else {
							dataService.updateItemDeliveredAndRemainingQuantity(entity, diff);
						}
						dataService.calcPesItemQty(entity);
						_.forEach(dataService.getList(), function (item) {
							if (item.PrcItemFk === entity.PrcItemFk) {
								if (!item || !diff) {
									return;
								}
								item.QuantityRemainingConverted = entity.QuantityRemainingConverted;
								item.QuantityDeliveredConverted = entity.QuantityDeliveredConverted;

								dataService.markItemAsModified(item);
							}
						});
						entity.QuantityConverted = math.bignumber(value).mul(entity.PrcItemFactorPriceUnit).toNumber();

						if (value && entity.PrcItemQuantity !== 0) {
							entity.DiscountSplit = round(roundingType.DiscountSplit, math.bignumber(value).div(entity.PrcItemQuantity).mul(entity.PrcItemDiscountSplit));
							entity.DiscountSplitOc = round(roundingType.DiscountSplitOc, math.bignumber(value).div(entity.PrcItemQuantity).mul(entity.PrcItemDiscountSplitOc));
						} else {
							entity.DiscountSplit = 0;
							entity.DiscountSplitOc = 0;
						}

						promises.push(getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, value, entity.MdcMaterialFk).then(function (pesItem) {
							if (pesItem) {
								entity.ProvisonTotal = round(roundingType.ProvisonTotal, pesItem.ProvisonTotal);
								$timeout(dataService.gridRefresh, 0, false);
							}
						}));
						// Don't set value to entity[model].
						// entity.Quantity = value;
						if (!entity.haventLoadPrcieCondition) {
							var dontReCalcuPricGrossOc = true;
							promises.push(resetExtraAndCalculateTotal(entity, dontReCalcuPricGrossOc));
						}
						$q.all(promises).then(function () {
							defer.resolve(true);
						});
						return defer.promise;
					}

					service.asyncValidatePrice = function asyncValidatePrice(entity, value, model) {
						let defer = $q.defer();
						var result = {apply: true, valid: true};
						let originalValue = entity[model];
						if (value === null) {
							return result;
						}
						if (value === '') {
							value = 0;
						}
						setPricePriceOcPriceGrossPriceGrossOc(entity, value, model);
						entity[model] = value;
						inputPriceAndThenCalculate(entity).then(function () {
							entity[model] = originalValue;
							defer.resolve(result);
						});
						return defer.promise;
					};

					service.asyncValidatePriceOc = function asyncValidatePriceOc(entity, value, model) {
						let defer = $q.defer();
						var result = {apply: true, valid: true};
						let originalValue = entity[model];
						if (value === null) {
							return result;
						}
						if (value === '') {
							value = 0;
						}
						setPricePriceOcPriceGrossPriceGrossOc(entity, value, model);
						entity[model] = value;
						inputPriceAndThenCalculate(entity).then(function () {
							entity[model] = originalValue;
							defer.resolve(result);
						});
						return defer.promise;
					};

					service.asyncValidatePriceGross = function asyncValidatePriceGross(entity, value, model) {
						let defer = $q.defer();
						var result = {apply: true, valid: true};
						let originalValue = entity[model];
						if (value === null) {
							return result;
						}
						if (value === '') {
							value = 0;
						}
						setPricePriceOcPriceGrossPriceGrossOc(entity, value, model);
						entity[model] = value;
						inputPriceAndThenCalculate(entity).then(function () {
							entity[model] = originalValue;
							defer.resolve(result);
						});

						return defer.promise;
					};

					service.asyncValidatePriceGrossOc = function asyncValidatePriceGrossOc(entity, value, model) {
						let defer = $q.defer();
						var result = {apply: true, valid: true};
						let originalValue = entity[model];
						if (value === null) {
							return result;
						}
						if (value === '') {
							value = 0;
						}
						setPricePriceOcPriceGrossPriceGrossOc(entity, value, model);
						entity[model] = value;
						inputPriceAndThenCalculate(entity).then(function () {
							entity[model] = originalValue;
							defer.resolve(result);
						});

						return defer.promise;
					};

					service.validatePrcPackageFk = function validatePrcPackageFk(entity, value) {
						var packages = basicsLookupdataLookupDescriptorService.getData('PrcPackage');
						if (packages && packages[value]) {
							var packageItem = packages[value];
							entity.ProjectFk = packageItem.ProjectFk;
							entity.PrcStructureFk = packageItem.StructureFk;
							var structureResult = service.validatePrcStructureFk(entity, entity.PrcStructureFk, 'PrcStructureFk');
							platformRuntimeDataService.applyValidationResult(structureResult, entity, 'PrcStructureFk');
						}

						return {apply: true, valid: true};
					};

					service.validateControllingUnitFk = function validateControllingUnitFk(entity, value, model) {
						var result = {apply: true, valid: true};
						if (angular.isUndefined(value) || value === null || value === -1) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
							platformRuntimeDataService.readonly(entity, [{
								field: 'IsAssetManagement',
								readonly: false
							}]);
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
									platformRuntimeDataService.readonly(entity, [{
										field: 'IsAssetManagement',
										readonly: false
									}]);
								}
								dataService.markItemAsModified(entity);
							}
						}
						entity.ControllingUnitFk = value;
						dataService.updateprjstockReadOnly(entity);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
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
						if (null === value) {
							defer.resolve(result);
						} else {
							var ProjectFk = entity.ProjectFk;
							$http.get(globals.webApiBaseUrl + 'controlling/structure/validationControllingUnit?ControllingUnitFk=' + value + '&ProjectFk=' + ProjectFk).then(function (response) {
								if (response.data) {
									result = {
										apply: true,
										valid: false,
										error: $translate.instant('basics.common.error.controllingUnitError')
									};
									defer.resolve(result);
									platformRuntimeDataService.applyValidationResult(result, entity, model);
									platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
								} else {
									defer.resolve(result);
								}
							});
						}
						return defer.promise;
					};

					service.validatePrcStructureFk = function validatePrcStructureFk(entity, value, model) {
						var result = {apply: true, valid: true};
						if (angular.isUndefined(value) || value === null || value === -1) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
						}
						entity.PrcStructureFk = value;
						if (_.isNil(entity.MdcTaxCodeFk)) {
							basicsLookupdataLookupDescriptorService.getItemByKey('prcstructure', value).then(function (response) {
								if (!angular.isObject(response)) {
									return result;
								}
								if (!_.isNil(response.TaxCodeFk) && response.TaxCodeFk) {
									entity.MdcTaxCodeFk = response.TaxCodeFk;
									dataService.calculateTotalAndVatAndGross(entity);
									dataService.fireItemModified(entity);
								}
							});
						}
						dataService.updateprjstockReadOnly(entity);
						var validationResult = angular.copy(result);
						platformRuntimeDataService.applyValidationResult(validationResult, entity, model);
						platformDataValidationService.finishValidation(validationResult, entity, value, model, service, dataService);
						return result;
					};

					// defect:124735 start
					service.asyncValidatePrcStructureFk = function asyncValidatePrcStructureFk(entity, value, model) {
						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
						asyncMarker.myPromise = setPrcStructureFkAsync(entity, value).then(function (response) {
							return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
						});
						return asyncMarker.myPromise;
					};

					function setPrcStructureFkAsync(entity, PrcStructureFk) {
						// eslint-disable-next-line no-unused-vars
						if (angular.isUndefined(PrcStructureFk) || PrcStructureFk === null || PrcStructureFk === -1) {
							let result = {apply: true, valid: true};
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: 'PrcStructureFk'});
							return $q.when(result);
						}
						if (entity.isCreate4Contract) {
							// if create pes from contract  wizard ,the MdcSalesTaxGroupFk  does not change.
							let result = {apply: true, valid: true};
							return $q.when(result);
						}

						return $q.when($http.get(globals.webApiBaseUrl + 'basics/procurementstructure/taxcode/list?mainItemId=' + PrcStructureFk).then((response) => {
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
									if (response.data.Main[i].MdcLedgerContextFk === LedgerContextFk) {
										entity.MdcSalesTaxGroupFk = response.data.Main[i].MdcSalesTaxGroupFk;
										break;
									}
								}
							}

							return {valid: true, apply: true};
						}));
					}

					// defect:124735 end

					service.validateIsAssetManagement = function validateIsAssetManagement(entity, value) {
						if (value === false) {
							entity.FixedAssetFk = null;
							platformRuntimeDataService.readonly(entity, [{field: 'FixedAssetFk', readonly: true}]);
						} else if (value === true) {
							platformRuntimeDataService.readonly(entity, [{field: 'FixedAssetFk', readonly: false}]);
						}
					};

					service.asyncValidatePrjStockFk = function asyncValidatePrjStockFk(entity, value, model, isupdate) {
						var defer = $q.defer();
						var result = {apply: true, valid: true};
						var result1 = {apply: true, valid: true};
						var result2 = {apply: true, valid: true};
						var projectstockview = basicsLookupdataLookupDescriptorService.getData('projectStockLookupDataService');
						var isReadonly = true;
						if (!projectstockview || _.isEmpty(projectstockview) || !projectstockview[value]) {
							if (value === null) {
								platformRuntimeDataService.readonly(entity, [{
									field: 'ProvisionPercent',
									readonly: true
								}, {field: 'ProvisonTotal', readonly: true}]);
							} else {
								getprovisionallowed(value).then(function (res) {
									if (res) {
										isReadonly = !res.data;
										platformRuntimeDataService.readonly(entity, [{
											field: 'ProvisionPercent',
											readonly: isReadonly
										}, {field: 'ProvisonTotal', readonly: isReadonly}]);
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
							}, {field: 'ProvisonTotal', readonly: isReadonly}]);
						}

						if ((entity.PrjStockFk !== value && value) || (value && isupdate)) {
							getMaterial2Stock(entity.PrcItemFk, value, entity.Quantity, entity.MdcMaterialFk).then(function (data) {
								if (data) {
									var pesItem = data;
									if (pesItem) {

										if (!entity.isCreate4Contract) {
											// if create pes from contract  wizard ,the PrjStockLocationFk  does not change.
											entity.PrjStockLocationFk = pesItem.PrjStockLocationFk;
										}

										/** @namespace pesItem.IsInStock2Material */
										if (pesItem.IsInStock2Material) {
											entity.PrcStockTransactionTypeFk = dataService.getDefaultprcStockTranType();
											service.asyncValidatePrcStockTransactionTypeFk(entity, entity.PrcStockTransactionTypeFk, 'PrcStockTransactionTypeFk', false, true);
										}
										if (isReadonly) {
											entity.ProvisionPercent = 0;
											entity.ProvisonTotal = 0;
										} else {
											entity.ProvisionPercent = pesItem.ProvisionPercent;
											entity.ProvisonTotal = pesItem.ProvisonTotal;
										}
										$timeout(dataService.gridRefresh, 0, false);
									}
									var IsLotManagement = data.IsLotManagement;
									if (IsLotManagement && (entity.LotNo === null || entity.LotNo === '')) {
										result.valid = false;
										var entityLotNo = $translate.instant('procurement.common.entityLotNo');
										result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: entityLotNo});
									}
									if (!projectstockview || _.isEmpty(projectstockview) || !projectstockview[value]) {
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
								if (typeof isupdate === 'object' && isupdate !== null) {
									entity.PrjStockFk = value;//From modifying values
								}
								if (response.data) {
									const noEntityStock = !entity.PrjStockFk;
									const noResponseStock = !response.data.PrjStockFk || response.data.PrjStockFk === 0;
									const hasValidTransactionType = !!response.data.PrcStockTransactionTypeFk;
									if (noEntityStock && noResponseStock && hasValidTransactionType) {
										result.valid = false;
										const entityPrjStock = $translate.instant('procurement.common.entityPrjStock');
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
									$timeout(dataService.gridRefresh, 0, false);
								}
							});
						}
						return defer.promise;
					};

					service.asyncValidateLotNo = function asyncValidateLotNo(entity, newValue) {
						var defer = $q.defer();
						var result = {apply: true, valid: true};
						if (entity.PrjStockFk !== null && newValue === '') {
							getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, entity.Quantity, entity.MdcMaterialFk).then(function (pesItem) {
								if (pesItem) {
									var IsLotManagement = pesItem.IsLotManagement;
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
							defer.resolve(result);
						}
						return defer.promise;
					};

					service.asyncValidateExpirationDate = function asyncValidateExpirationDate(entity, newValue) {
						var defer = $q.defer();
						var result = {apply: true, valid: true};
						if (entity.PrjStockFk !== null && newValue === '') {
							getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, entity.Quantity, entity.MdcMaterialFk).then(function (pesItem) {
								if (pesItem) {
									var IsLotManagement = pesItem.IsLotManagement;
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

					service.asyncValidatePrcStockTransactionTypeFk = function validatePrcStockTransactionTypeFk(entity, value, model, isstock, isstock2material,prcItem) {
						var defer = $q.defer();
						var result = {apply: true, valid: true};
						var fields = ['PrcStockTransactionFk'];
						if(prcItem){
							if(prcItem.BasItemTypeFk === 7){
								setFieldReadOnly(entity, fields, true);
								setModelApplyValidationAndFinishValidation(result, entity, 'PrcStockTransactionFk', value);
								setModelApplyValidationAndFinishValidation(result, entity, model, value);
								defer.resolve(true);
								return defer.promise;
							}
						}
						setFieldReadOnly(entity, fields, true);
						if (!_.isNull(value)) {

							switch (value) {
								case 1: // Material Receipt
									if (isstock2material) {
										setFieldReadOnly(entity, fields, false);
										$timeout(dataService.gridRefresh, 0, false);
									} else {
										getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, entity.Quantity, entity.MdcMaterialFk).then(function (item) {
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
							setModelApplyValidationAndFinishValidation(result, entity, model, value);
							defer.resolve(true);
						} else {
							if (isstock) {
								setModelApplyValidationAndFinishValidation(result, entity, 'PrcStockTransactionFk', value);
								setModelApplyValidationAndFinishValidation(result, entity, model, value);
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
										setModelApplyValidationAndFinishValidation(result, entity, model, value);
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
						if (_.isNull(value)) {
							switch (entity.PrcStockTransactionTypeFk) {
								case 2: // Incidental Acquisition Expense
									result.valid = false;
									result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('procurement.common.entityPrcStockTransaction')});
									break;
								default:
									var transactionType = basicsLookupdataLookupDescriptorService.getData('PrcStocktransactiontype');
									var type = _.find(transactionType, {Id: entity.PrcStockTransactionTypeFk});
									/** @namespace type.IsDelta */
									if (type && type.IsDelta) {
										result.valid = false;
										result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('procurement.common.entityPrcStockTransaction')});
									}
									break;
							}
						}
						setModelApplyValidationAndFinishValidation(result, entity, model, value);
						return result;
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

					service.asyncValidateMdcMaterialFk = function validateMdcMaterialFk(entity, value) {
						var defer = $q.defer();
						var result = {apply: true, valid: true};

						if (entity.PrcItemFk !== null && entity.PrcItemFk > 0) {
							defer.resolve(result);
							return defer.promise;
						} else {
							if (value === null || value < 1) {

								updateItemByMaterial(entity, null, defer);
							} else {
								var materials = basicsLookupdataLookupDescriptorService.getData('MaterialCommodity') || [];
								var material = _.find(materials, {Id: value});
								if (material) {
									updateItemByMaterial(entity, material, defer);
								} else {
									$http.get(globals.webApiBaseUrl + 'basics/material/commoditysearch/getcommoditybyid?materialId=' + value).then(function (res) {
										if (res && res.data) {

											updateItemByMaterial(entity, res.data);
										}
										defer.resolve(result);
									});
								}
							}
						}
						return defer.promise;
					};

					service.validateMdcTaxCodeFk = function validateMdcTaxCodeFk(entity, value) {

						entity.MdcTaxCodeFk = value;
						var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
						if (isCalculateOverGross) {
							dataService.setNetValuesAfterChangeVatPrecent([entity]);
						} else {
							dataService.calculateTotalAndVatAndGross(entity);
						}

						return true;
					};

					service.validateTotalGross = function validateTotalGross(entity, value, model, createmandator) {
						if (createmandator === true) {
							return true;
						}
						var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
						if (!isOverGross) {
							return true;
						}
						if (value === null) {
							value = 0;
						}
						var result = {apply: true, valid: true};
						if (entity.Quantity) {
							var headerItem = dataService.parentService().getSelected();
							var rate = (headerItem && headerItem.ExchangeRate) ? headerItem.ExchangeRate : 1;
							var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.MdcTaxCodeFk);
							var pricUnitAndFactor = getPriceUnitAndFactorFromPrcItemOrMaterial(entity);
							var priceUnit = pricUnitAndFactor.priceUnit;
							var factor = pricUnitAndFactor.factor;
							var oldTotal = entity.Total;
							var oldTotalOc = entity.TotalOc;
							entity.TotalGross = value;
							entity.Total = itemCalculationHelper.getTotal(entity, vatPercent);
							entity.TotalGrossOc = itemCalculationHelper.getTotalGrossOcByTotalGross(entity, rate);
							entity.TotalOc = itemCalculationHelper.getTotalOcByTotalGrossOc(entity, vatPercent);
							entity.TotalPriceGross = itemCalculationHelper.getTotalPriceGrossByTotalGross(entity, priceUnit, factor);
							entity.PrcPriceConditionFk = null;
							entity.PriceExtra = 0;
							entity.PriceExtraOc = 0;
							entity.PriceGross = itemCalculationHelper.getPriceGrossByTotalPriceGross(entity, vatPercent);
							entity.TotalPrice = itemCalculationHelper.getTotalPrice(entity, vatPercent);
							entity.Price = itemCalculationHelper.getPrice(entity, vatPercent);
							entity.TotalPriceGrossOc = itemCalculationHelper.getTotalPriceOCGrossByTotalGrossOc(entity, priceUnit, factor);
							entity.PriceGrossOc = itemCalculationHelper.getPriceGrossOcByTotalPriceGrossOc(entity, vatPercent);
							entity.TotalPriceOc = itemCalculationHelper.getTotalPriceOc(entity, vatPercent);
							entity.PriceOc = itemCalculationHelper.getPriceOc(entity, vatPercent);
							dataService.setVat(entity);
							dataService.calculateDeliveredTotal(entity, oldTotal, oldTotalOc);
						} else {
							entity[model] = 0;
							result.valid = true;
							result.apply = false;
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						return result;
					};

					service.validateTotalGrossOc = function validateTotalGrossOc(entity, value, model, createmandator) {
						if (createmandator === true) {
							return true;
						}
						var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
						if (!isOverGross) {
							return true;
						}
						if (value === null) {
							value = 0;
						}
						var result = {apply: true, valid: true};
						if (entity.Quantity) {
							var headerItem = dataService.parentService().getSelected();
							var rate = (headerItem && headerItem.ExchangeRate) ? headerItem.ExchangeRate : 1;
							var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.MdcTaxCodeFk);
							var pricUnitAndFactor = getPriceUnitAndFactorFromPrcItemOrMaterial(entity);
							var priceUnit = pricUnitAndFactor.priceUnit;
							var factor = pricUnitAndFactor.factor;
							var oldTotal = entity.Total;
							var oldTotalOc = entity.TotalOc;
							entity.TotalGrossOc = value;
							entity.TotalOc = itemCalculationHelper.getTotalOcByTotalGrossOc(entity, vatPercent);
							entity.TotalGross = itemCalculationHelper.getTotalGrossByTotalGrossOc(entity, rate);
							entity.Total = itemCalculationHelper.getTotal(entity, vatPercent);
							entity.TotalPriceGrossOc = itemCalculationHelper.getTotalPriceOCGrossByTotalGrossOc(entity, priceUnit, factor);
							entity.PrcPriceConditionFk = null;
							entity.PriceExtra = 0;
							entity.PriceExtraOc = 0;
							entity.PriceGrossOc = itemCalculationHelper.getPriceGrossOcByTotalPriceGrossOc(entity, vatPercent);
							entity.TotalPriceOc = itemCalculationHelper.getTotalPriceOc(entity, vatPercent);
							entity.PriceOc = itemCalculationHelper.getPriceOc(entity, vatPercent);
							entity.TotalPriceGross = itemCalculationHelper.getTotalPriceGrossByTotalGross(entity, priceUnit, factor);
							entity.PriceGross = itemCalculationHelper.getPriceGrossByTotalPriceGross(entity, vatPercent);
							entity.TotalPrice = itemCalculationHelper.getTotalPrice(entity, vatPercent);
							entity.Price = itemCalculationHelper.getPrice(entity, vatPercent);
							dataService.setVat(entity);
							dataService.calculateDeliveredTotal(entity, oldTotal, oldTotalOc);
						} else {
							entity[model] = 0;
							result.valid = true;
							result.apply = false;
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						return result;
					};

					service.validatePrjChangeFk = function validatePrjChangeFk(entity, value) {
						entity.PrjChangeFk = value;
						var prcItemPrjChangeService = procurementItemProjectChangeService.getService(dataService.parentService(), dataService);
						prcItemPrjChangeService.UpdateChangedInfo(entity);
						return true;
					};

					function updateBudgetFixedUnitAndTotalByQuantity(entity, quantity) {
						if (entity.BudgetFixedTotal) {
							return true;
						}
						if (entity.BudgetFixedUnit) {
							entity.BudgetTotal = round(roundingType.BudgetTotal, math.bignumber(quantity).mul(entity.BudgetPerUnit));
						}
					}

					function getPriceUnitAndFactorFromPrcItemOrMaterial(entity) {
						var result = {
							priceUnit: 1,
							factor: 1
						};
						if (entity.PrcItemFk !== null) {
							var prcItems = basicsLookupdataLookupDescriptorService.getData('PrcItemMergedLookup');
							var prcItem = _.filter(prcItems, function (item) {
								return item.Id === entity.PrcItemFk;
							});
							if (prcItem.length > 0) {
								var _prcItem = prcItem[0];
								if (_prcItem.PriceUnit !== 0) {
									result.priceUnit = _prcItem.PriceUnit;
									result.factor = _prcItem.FactorPriceUnit;
								}
							}
						} else if (entity.MdcMaterialFk !== null) {
							var materials = basicsLookupdataLookupDescriptorService.getData('MaterialCommodity') || [];
							var material = _.find(materials, {Id: entity.MdcMaterialFk});
							if (material && material.FactorPriceUnit !== null) {
								result.priceUnit = material.PriceUnit;
								result.factor = material.FactorPriceUnit;
							}
						}
						return result;
					}

					function reloadPriceCondition(entity, value, isCopyFromPrcItem, isFromMaterial,basicPrcItemId = null) {
						getPriceConditionService();
						if (_.isFunction(priceConditionDataService.unwatchEntityAction)) {
							priceConditionDataService.unwatchEntityAction();
						}
						return priceConditionDataService.reload(entity, value, isFromMaterial, isCopyFromPrcItem,basicPrcItemId).finally(resetWatchDataAction);
					}

					function resetWatchDataAction() {
						if (_.isFunction(priceConditionDataService.watchEntityAction)) {
							priceConditionDataService.watchEntityAction();
						}
					}

					let materialCacheAndRequests = {};

					function getMaterial2Stock(prcItemId, projectStockId, quantity, materialId) {
						if (projectStockId === null) {
							return $q.resolve({
								IsInStock2Material: false,
								IsLotManagement: false,
								PrjStockLocationFk: null,
								ProvisionPercent: 0,
								ProvisonTotal: 0
							});
						}

						let cacheKey = 'MATERIAL_STOCK_' + prcItemId + ':::' + projectStockId + ':::' + quantity +':::' + materialId;
						let cacheEntry = materialCacheAndRequests[cacheKey];
						if (cacheEntry && cacheEntry.data) {
							return $q.resolve(cacheEntry.data);
						}

						if (cacheEntry && cacheEntry.promise) {
							return cacheEntry.promise;
						}

						let httpRequest = $http.get(globals.webApiBaseUrl + 'procurement/pes/item/getmaterial2projectstock', {
							params: {
								prcItemId: prcItemId,
								projectStockId: projectStockId,
								quantity: quantity,
								materialId: materialId
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

					function getislocationmandatory(projectStockId) {
						var defer = $q.defer();
						if (projectStockId === _projectStockId1) {
							defer.resolve(_locationmandatory);
						} else {
							_projectStockId1 = projectStockId;
							$http.get(globals.webApiBaseUrl + 'project/stock/material/getislocationmandatory?projectStockId=' + projectStockId
							).then(function (response) {
								_locationmandatory = response;
								defer.resolve(_locationmandatory);
							}
							);
						}
						return defer.promise;
					}

					function getprovisionallowed(projectStockId) {
						var defer = $q.defer();
						if (projectStockId === _projectStockId2) {
							defer.resolve(_provisionallowed);
						} else {
							$http.get(globals.webApiBaseUrl + 'project/stock/material/getprovisionallowed?projectStockId=' + projectStockId
							).then(function (response) {
								_projectStockId2 = projectStockId;
								_provisionallowed = response;
								defer.resolve(_provisionallowed);
							}
							);
						}
						return defer.promise;
					}

					function updateItemByMaterial(entity, material, defer) {

						if (material) {
							updatePriceByCurrency(entity, material).then(function () {
								entity.Description1 = material.DescriptionInfo.Translated;
								entity.Description2 = material.DescriptionInfo2.Translated;
								entity.MdcTaxCodeFk = material.MdcTaxCodeFk;
								entity.UomFk = material.BasUomFk;
								entity.UserDefined1 = material.UserDefined1;
								entity.UserDefined2 = material.UserDefined2;
								entity.UserDefined3 = material.UserDefined3;
								entity.UserDefined4 = material.UserDefined4;
								entity.UserDefined5 = material.UserDefined5;

								entity.PrcPriceConditionFk = material.PrcPriceconditionFk;
								entity.PrcStructureFk = material.PrcStructureFk;
								entity.MdcMaterialFk = material.Id;
								entity.Material2Uoms = material.Material2Uoms;
								entity.Co2Source = material.Co2Source;
								entity.Co2SourceTotal = (entity.Co2Source * entity.Quantity).toFixed(3);
								entity.Co2Project = material.Co2Project;
								entity.Co2ProjectTotal = (entity.Co2Project * entity.Quantity).toFixed(3);

								entity.MaterialStockFk = material.MaterialStockFk;
								entity.AlternativeUomFk = material.MaterialStock2UomFk || material.BasUomFk;
								entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, entity.Quantity, null);// entity.AlternativeQuantity

								if (!entity.isCreate4Contract) {
									// if create pes from contract  wizard ,the MdcSalesTaxGroupFk  does not change.
									// defect:124735 start
									$http.get(globals.webApiBaseUrl + 'basics/procurementstructure/taxcode/list?mainItemId=' + entity.PrcStructureFk).then((response) => {
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
												if (response.data.Main[i].MdcLedgerContextFk === LedgerContextFk) {
													entity.MdcSalesTaxGroupFk = response.data.Main[i].MdcSalesTaxGroupFk;
													break;
												}
											}
										}
									});
								}

								// defect:124735 end
								// reload prcPriceCondition
								reloadPriceCondition(entity, entity.PrcPriceConditionFk, false, true,material.MaterialPriceListFk);
								service.validatePrcStructureFk(entity, entity.PrcStructureFk, 'PrcStructureFk');
								service.validateUomFk(entity, entity.UomFk, 'UomFk');
								service.validateAlternativeUomFk(entity, entity.AlternativeUomFk, 'AlternativeUomFk');

								dataService.loadMaterialSpecification(true);
								if (defer) {
									defer.resolve();
								}
							});
						} else {
							entity.Description1 = null;
							entity.Description2 = null;
							entity.MdcTaxCodeFk = null;
							entity.UomFk = null;
							entity.AlternativeUomFk = null;
							entity.Price = 0;
							entity.PriceOc = 0;
							entity.PrcPriceConditionFk = null;
							entity.PrcStructureFk = null;
							entity.MdcMaterialFk = null;
							entity.Material2Uoms = null;
							entity.MaterialStockFk = null;

							dataService.loadMaterialSpecification(true);
							// reload prcPriceCondition
							reloadPriceCondition(entity, entity.PrcPriceConditionFk, false, true);
							service.validatePrcStructureFk(entity, entity.PrcStructureFk, 'PrcStructureFk');
							service.validateUomFk(entity, entity.UomFk, 'UomFk');
							service.validateAlternativeUomFk(entity, entity.AlternativeUomFk, 'AlternativeUomFk');

							if (defer) {
								defer.resolve();
							}
						}
					}

					function updatePriceByCurrency(entity, material) {

						var defer = $q.defer();
						var headerItem = dataService.parentService().getSelected();
						if (material) {

							var docCurrencyFk = headerItem.CurrencyFk || headerItem.BasCurrencyFk,
								exchangeRate = headerItem.ExchangeRate;
							if (moduleContext.companyCurrencyId === material.BasCurrencyFk || !material.BasCurrencyFk) {
								entity.Price = round(roundingType.Price, math.bignumber(material.Cost).sub(material.PriceExtra));
								entity.PriceOc = itemCalculationHelper.getPriceOcByExchangeRate(entity, exchangeRate);
								defer.resolve();
							} else {
								getForeignToDocExchangeRate(docCurrencyFk, material.BasCurrencyFk, headerItem.ProjectFk).then(function (res) {
									var rate = res.data;
									entity.PriceOc = rate === 0 ? 0 : round(roundingType.PriceOc, math.bignumber(material.Cost).sub(material.PriceExtra).div(rate));
									entity.Price = exchangeRate === 0 ? 0 : itemCalculationHelper.getPriceByPriceOc(entity, exchangeRate);
									defer.resolve();
								});
							}
						} else {
							defer.resolve();
						}

						return defer.promise;
					}

					function getForeignToDocExchangeRate(documentCurrencyFk, currencyForeignFk, projectFk) {
						if (currencyForeignFk === documentCurrencyFk) {
							return $q.when({data: 1});
						}

						return $http({
							method: 'GET',
							url: globals.webApiBaseUrl + 'procurement/common/exchangerate/ocrate',
							params: {
								CurrencyForeignFk: currencyForeignFk,
								DocumentCurrencyFk: documentCurrencyFk,
								ProjectFk: projectFk
							}
						});
					}

					function reloadDeliverySchedule(value) {
						var DeliveryScheduleService = $injector.get('procurementCommonDeliveryScheduleDataService').getService(dataService);
						return DeliveryScheduleService.reload(value);
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

					function conversionQuantity(entity, uom, quantity, alterAtiveQuantity) {
						var uomItem = _.find(entity.Material2Uoms, {UomFk: uom}), value = 1;
						if (uomItem) {
							value = uomItem.Quantity;
						}
						if (!_.isNil(quantity)) {
							return round(roundingType.AlternativeQuantity, math.bignumber(quantity).mul(value), 3);// entity.AlternativeQuantity
						}
						if (!_.isNil(alterAtiveQuantity)) {
							return value === 0 ? 0 : round(roundingType.Quantity, math.bignumber(alterAtiveQuantity).div(value), 3);// entity.Quantity
						}
						return 0;
					}

					function resetExtraAndCalculateTotal(entity, dontReCalcuPricGrossOc) {
						getPriceConditionService();
						entity.calculateTotalLater = true;
						var originalExtra = entity.PriceExtra;
						var originalExtraOc = entity.PriceExtraOc;
						return priceConditionDataService.recalculate(entity, entity.PrcPriceConditionFk).then(function () {
							var isResetPriceExtra = (entity.PriceExtra !== originalExtra || entity.PriceExtraOc !== originalExtraOc);
							var notRecalTotalAndGross = false;
							dataService.calculateTotalAndVatAndGross(entity, notRecalTotalAndGross, isResetPriceExtra, dontReCalcuPricGrossOc);
							dataService.markItemAsModified(entity);
							entity.calculateTotalLater = false;
							return $q.when(true);
						});
					}

					function getPriceConditionService() {
						if (!priceConditionDataService) {
							priceConditionDataService = $injector.get('procurementPesItemPriceConditionDataService');
						}
					}

					function setPricePriceOcPriceGrossPriceGrossOc(entity, value, model) {
						var headerItem = dataService.parentService().getSelected();
						var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.MdcTaxCodeFk);
						var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
						let itemObj = {};
						itemObj[model] = value;
						switch (model) {
							case 'Price': {
								entity.PriceOc = itemCalculationHelper.getPriceOcByExchangeRate(itemObj, headerItem.ExchangeRate);
								entity.PriceGross = itemCalculationHelper.getPriceGross(itemObj, vatPercent);
								entity.PriceGrossOc = isOverGross ?
									itemCalculationHelper.getPriceGrossOcByPriceGross(entity, headerItem.ExchangeRate) :
									itemCalculationHelper.getPriceGrossOc(entity, vatPercent);
								break;
							}
							case 'PriceOc': {
								entity.Price = itemCalculationHelper.getPriceByPriceOc(itemObj, headerItem.ExchangeRate);
								entity.PriceGrossOc = itemCalculationHelper.getPriceGrossOc(itemObj, vatPercent);
								entity.PriceGross = isOverGross ?
									itemCalculationHelper.getPriceGrossByPriceGrossOc(entity, headerItem.ExchangeRate) :
									itemCalculationHelper.getPriceGross(entity, vatPercent);
								break;
							}
							case 'PriceGross': {
								entity.Price = itemCalculationHelper.getPrice(itemObj, vatPercent);
								entity.PriceGrossOc = itemCalculationHelper.getPriceGrossOcByPriceGross(itemObj, headerItem.ExchangeRate);
								entity.PriceOc = isOverGross ?
									itemCalculationHelper.getPriceOc(entity, vatPercent) :
									itemCalculationHelper.getPriceOcByExchangeRate(entity, headerItem.ExchangeRate);
								break;
							}
							case 'PriceGrossOc': {
								entity.PriceGross = itemCalculationHelper.getPriceGrossByPriceGrossOc(itemObj, headerItem.ExchangeRate);
								entity.PriceOc = itemCalculationHelper.getPriceOc(itemObj, vatPercent);
								entity.Price = isOverGross ?
									itemCalculationHelper.getPrice(entity, vatPercent) :
									itemCalculationHelper.getPriceByPriceOc(entity, headerItem.ExchangeRate);
								break;
							}
							default: {
								break;
							}
						}
					}

					function inputPriceAndThenCalculate(entity) {
						let defer = $q.defer();
						var isInputPriceGross = false;
						var isInputPriceGrossOc = true;
						dataService.setInputWhichField({PriceGrossOc: true});
						getPriceConditionService();
						priceConditionDataService.recalculate(entity, entity.PrcPriceConditionFk).then(function () {
							if (isInputPriceGross || isInputPriceGrossOc) {
								dataService.setInputWhichField({});
							}
							defer.resolve(null);
						});
						return defer.promise;
					}

					function round(roundingField, value) {
						return _.isNaN(value) ? 0 : itemCalculationHelper.round(roundingField, value);
					}

					service.reloadPriceCondition = reloadPriceCondition;

					// region For Bulk Edit Validation
					service.validatePrcPriceConditionFkForBulkConfig = function validatePrcPriceConditionFkForBulkConfig(entity, value, model) {
						if (Object.prototype.hasOwnProperty.call(entity, 'PrcPriceconditionFk')) {
							entity.PrcPriceconditionFk = value;
						}
						let res = {valid: true, apply: true, error: '', error$tr$: ''};
						if (value) {
							if (entity[model] === value) {
								res.valid = false;
								res.error = model + ' has already exist';
							}
						}
						entity[model] = value;
						dataService.markItemAsModified(entity);
						setBulkPriceConditionInformation(entity, value);
						return platformDataValidationService.finishValidation(res, entity, value, model, service, dataService);
					};
					service.asyncValidateMdcMaterialFkForBulkConfig = function asyncValidateMdcMaterialFkForBulkConfig(entity, value) {
						if (entity.PrcItemFk !== null && entity.PrcItemFk > 0) {
							return $.when(true);
						} else {
							return $injector.get('basicsLookupdataLookupDataService').getItemByKey('MaterialCommodity', value).then(function (material) {
								if(material) {
									updateItemByMaterial2(entity, material);
									dataService.markItemAsModified(entity);
									setBulkPriceConditionInformation(entity,material.PrcPriceconditionFk);
								}
								return $.when(true);
							});
						}
					};
					function updateItemByMaterial2(entity, material) {
						if (material) {
							var headerItem = dataService.parentService().getSelected();
							var exchangeRate = headerItem.ExchangeRate;

							if (moduleContext.companyCurrencyId === material.BasCurrencyFk || !material.BasCurrencyFk) {
								entity.Price = round(roundingType.Price, math.bignumber(material.Cost).sub(material.PriceExtra));
								setPricePriceOcPriceGrossPriceGrossOc(entity, entity.Price, 'Price');
							} else {
								entity.PriceOc = itemCalculationHelper.getPriceOcByExchangeRate(entity, exchangeRate);
								setPricePriceOcPriceGrossPriceGrossOc(entity, entity.PriceOc, 'PriceOc');
							}
							dataService.calculateTotalAndVatAndGross(entity);

							entity.Description1 = material.DescriptionInfo.Translated;
							entity.Description2 = material.DescriptionInfo2.Translated;
							entity.MdcTaxCodeFk = material.MdcTaxCodeFk;
							entity.UomFk = material.BasUomFk;

							entity.PrcPriceConditionFk = material.PrcPriceconditionFk;
							entity.PrcStructureFk = material.PrcStructureFk;
							entity.MdcMaterialFk = material.Id;
							entity.Material2Uoms = material.Material2Uoms;
							entity.Co2Source = material.Co2Source;
							entity.Co2SourceTotal = (entity.Co2Source * entity.Quantity).toFixed(3);
							entity.Co2Project = material.Co2Project;
							entity.Co2ProjectTotal = (entity.Co2Project * entity.Quantity).toFixed(3);

							entity.MaterialStockFk = material.MaterialStockFk;
							entity.AlternativeUomFk = material.MaterialStock2UomFk || material.BasUomFk;
							entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, entity.Quantity, null);
						} else {
							entity.Description1 = null;
							entity.Description2 = null;
							entity.MdcTaxCodeFk = null;
							entity.UomFk = null;
							entity.AlternativeUomFk = null;
							entity.Price = 0;
							entity.PriceOc = 0;
							entity.PrcPriceConditionFk = null;
							entity.PrcStructureFk = null;
							entity.MdcMaterialFk = null;
							entity.Material2Uoms = null;
							entity.MaterialStockFk = null;
						}
					}
					function setBulkPriceConditionInformation(entity, value) {
						getPriceConditionService();
						let headerService = dataService.parentService();
						let module = priceConditionDataService.moduleName;
						let projectFk = -1, headerId = -1, exchangeRate = 1;
						if (headerService) {
							if (module === 'procurement.pes') {
								headerId = $injector.get('procurementPesHeaderService').getSelected().Id;
								projectFk = $injector.get('procurementPesHeaderService').getSelected().ProjectFk;
							} else {
								headerId = headerService.getSelected().Id;
								projectFk = headerService.getSelected().ProjectFk;
							}
							if (headerService.getSelected()) {
								let headerEntity = headerService.getSelected();
								if (headerEntity.ExchangeRate) {
									exchangeRate = headerEntity.ExchangeRate;
								}
							}
						}
						let modState = $injector.get('platformModuleStateService').state(headerService ? headerService.getModule() : dataService.getModule());
						let parentElemState = headerService ? headerService.assertPath(modState.modifications, false, headerService.getSelected()) : dataService.assertPath(modState.modifications, false, entity);
						let parentItem2Save = parentElemState.ItemToSave;
						let itemInfo = null;
						if (parentItem2Save) {
							itemInfo = _.find(parentItem2Save, {Item: {Id: entity.Id}});
							if (itemInfo) {
								if (Object.prototype.hasOwnProperty.call(itemInfo, 'BulkEditPriceConditionToSave')) {
									if (!itemInfo.BulkEditPriceConditionToSave.MainItemIds.includes(entity.Id)) {
										itemInfo.BulkEditPriceConditionToSave.MainItemIds.push(entity.Id);
									}
								} else {
									itemInfo.BulkEditPriceConditionToSave = {
										MainItemIds: [entity.Id],
										PriceConditionFk: value,
										ExchangeRate: exchangeRate,
										HeaderName: module,
										HeaderId: headerId,
										ProjectFk: projectFk
									};
								}
								if (priceConditionDataService.data && priceConditionDataService.data.cache) {
									delete priceConditionDataService.data.cache[entity.Id];
								}
							}
						}
					}


					// endregion

					return service;
				};
			}
		]);
})(angular);