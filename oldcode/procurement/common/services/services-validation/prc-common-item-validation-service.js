(function (angular) {
	'use strict';
	/* global globals, _, math */
	/**
	 * @ngdoc service
	 * @name procurementCommonPrcItemValidationService
	 * @description provides validation methods for prcItem
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').factory('procurementCommonPrcItemValidationService', [
		'platformDataValidationService',
		'$translate',
		'basicsLookupdataLookupDataService',
		'$http',
		'$q',
		'$injector',
		'platformContextService',
		'procurementContextService',
		'procurementCommonCertificateNewDataService',
		'procurementCommonGeneralsDataService',
		'procurementCommonPriceConditionService',
		'basicsLookupdataLookupDescriptorService',
		'platformModalService',
		'procurementCommonItemQuantityValidationFlagService',
		'platformRuntimeDataService',
		'basicsMaterialPriceListLookupDataService',
		'contractHeaderPurchaseOrdersDataService',
		'prcCommonItemCalculationHelperService',
		'prcGetIsCalculateOverGrossService',
		'procurementModuleName',
		'procurementItemProjectChangeService',
		function (
			platformDataValidationService,
			$translate,
			lookupService,
			$http,
			$q,
			$injector,
			platformContextService,
			moduleContext,
			procurementCommonCertificateDataService,
			procurementCommonGeneralsDataService,
			priceConditionDataService,
			lookupDescriptorService,
			platformModalService,
			procurementCommonItemQuantityValidationFlagService,
			platformRuntimeDataService,
			basicsMaterialPriceListLookupDataService,
			contractHeaderPurchaseOrdersDataService,
			itemCalculationHelper,
			prcGetIsCalculateOverGrossService,
			procurementModuleName,
			procurementItemProjectChangeService
		) {

			let serviceCache = {};

			return function (dataService) {

				let serviceName = null;
				let moduleName = '';
				let roundingType = itemCalculationHelper.roundingType;
				if (dataService && dataService.getServiceName) {
					serviceName = dataService.getServiceName();
					if (serviceName && Object.prototype.hasOwnProperty.call(serviceCache, serviceName)) {
						return serviceCache[serviceName];
					}
				}
				var module = dataService.getModule();
				if (module) {
					moduleName = module.name;
				}

				var service = {},
					certificateDataService = procurementCommonCertificateDataService.getService(moduleContext.getMainService()),
					generalsDataService = procurementCommonGeneralsDataService.getService(moduleContext.getMainService());
				var bulkModifyPlants = [];

				// create price condition service
				var priceConditionService = priceConditionDataService.getService();
				const validateDiscountAfterSetPrice = getValidateDiscount(false);

				function resetExtraAndCalculateTotal(entity, isResetGross, dontReCalPriceGrossOc) {
					return dataService.resetExtraCalculateTotal(entity, dontReCalPriceGrossOc);
				}

				// TODO yew 2020.12.01 int or decimal property maybe set null in js validation
				service.checkEntityPropertyNull = function checkEntityIsNull(entity) {
					var checkProperty = ['Price', 'PriceOc', 'PriceExtra', 'PriceExtraOc', 'PriceUnit', 'FactorPriceUnit',
						'TargetPrice', 'TargetTotal', 'QuantityAskedfor', 'QuantityDelivered', 'SafetyLeadTime', 'BufferLeadTime',
						'LeadTimeExtra', 'QuantityConfirm', 'Discount', 'SellUnit', 'LeadTime', 'MinQuantity'];
					_.forEach(checkProperty, function (item) {
						if (entity[item] === null) {
							entity[item] = 0;
						}
					});
				};

				function reloadPriceCondition(entity, value, isFromMaterial, materialPriceListId, basicPrcItemId) {
					dataService.priceConditionSelectionChanged.fire({Id: value});
					entity.PrcPriceConditionFk = value;
					entity.PrcPriceconditionFk = value;
					if (!isFromMaterial && basicPrcItemId !== undefined && basicPrcItemId !== null) {
						return priceConditionService.reload(entity, entity.PrcPriceConditionFk, isFromMaterial, true, null, false, basicPrcItemId);
					} else {
						if (_.isFunction(priceConditionService.unwatchEntityAction)) {
							priceConditionService.unwatchEntityAction();
						}
						return priceConditionService.reload(entity, entity.PrcPriceConditionFk, isFromMaterial, false, materialPriceListId).finally(resetWatchDataAction);
					}
				}

				function resetWatchDataAction() {
					if (_.isFunction(priceConditionService.watchEntityAction)) {
						priceConditionService.watchEntityAction();
					}
				}

				service.reloadPriceCondition = reloadPriceCondition;

				function totalRecalculateValidator(entity, isResetGross, dontReCalcuPricGrossOc) {
					resetExtraAndCalculateTotal(entity, isResetGross, dontReCalcuPricGrossOc);
					return true;
				}

				function calcQuantityConverted(entity, value, model) {
					if (model === 'FactorPriceUnit') {
						entity.QuantityConverted = itemCalculationHelper.round(roundingType.QuantityConverted, math.bignumber(entity.Quantity).mul(value));
					} else if (model === 'Quantity') {
						entity.QuantityConverted = itemCalculationHelper.round(roundingType.QuantityConverted, math.bignumber(entity.FactorPriceUnit).mul(value));
					}
				}

				service.validateFactorPriceUnit = function validateFactorPriceUnit(entity, value, model) {
					var validateResult = {
						apply: true,
						valid: true
					};
					if (!value || value === 0) {
						var itemNo = entity.Itemno;
						var errMsg = $translate.instant('basics.common.procurementDialog.FactorZeroDescription', {'Itemno': '#' + itemNo});

						validateResult.apply = false;
						validateResult.valid = false;
						validateResult.error = errMsg;
					}

					totalRecalculateValidator(entity, true, true);

					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);

					calcQuantityConverted(entity, value, model);

					return validateResult;
				};

				service.validatePriceUnit = function validatePriceUnit(entity, value, model) {
					var validateResult = {
						apply: true,
						valid: true
					};
					if (!value || value === 0) {
						var itemNo = entity.Itemno;
						var errMsg = $translate.instant('basics.common.procurementDialog.PriceUnitZeroDescription', {'Itemno': '#' + itemNo});

						validateResult.apply = false;
						validateResult.valid = false;
						validateResult.error = errMsg;
					}

					entity.IsInputTotal = false;
					totalRecalculateValidator(entity, true, true);

					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);

					return validateResult;
				};

				service.validateTargetPrice = function validateTargetPrice(entity, value, model, quantity) {
					if (_.isNil(value)) {
						value = 0;
					}
					if (quantity === undefined) {
						entity.TargetTotal = itemCalculationHelper.round(roundingType.TargetTotal, math.bignumber(entity.Quantity).mul(value));
					} else {
						entity.TargetTotal = itemCalculationHelper.round(roundingType.TargetTotal, math.bignumber(quantity).mul(value));
					}
					dataService.markItemAsModified(entity);
				};

				service.validateTargetTotal = function validateTargetTotal(entity, value) {
					entity.TargetPrice = entity.Quantity === 0 ? 0 : itemCalculationHelper.round(roundingType.TargetPrice, math.bignumber(value).div(entity.Quantity));
					dataService.markItemAsModified(entity);
				};

				service.validateDiscount = getValidateDiscount(true);

				function discountAbsoluteCommonValidation(entity, value, model) {
					let validateResult = { apply: true, valid: true };
					if (_.isNil(value)) {
						value = 0;
					}

					const DiscountAbsolute2PriceMapping = {
						'DiscountAbsolute': 'Price',
						'DiscountAbsoluteOc': 'PriceOc',
						'DiscountAbsoluteGross': 'PriceGross',
						'DiscountAbsoluteGrossOc': 'PriceGrossOc',
					};
					const relatedPriceValue = entity[DiscountAbsolute2PriceMapping[model]];
					if (value > relatedPriceValue) {
						validateResult.apply = false;
						validateResult.valid = false;
						validateResult.error = `${model} range should less than ${relatedPriceValue}`;
						return validateResult;
					}
					entity[model] = value;
					const discount = itemCalculationHelper.round(roundingType.NoType, math.bignumber(value).div(relatedPriceValue).mul(100));
					if (discount === 0 || discount === 100) {
						entity.Discount = discount;
						updateDiscountAndAbsoluteAfterOneChanged(entity, entity.Discount, 'Discount');
					}
					else {
						updateDiscountAndAbsoluteAfterOneChanged(entity, value, model);
						entity.Discount = discount;
					}
					totalRecalculateValidator(entity, true, true);
					if (validateResult.valid) {
						_.forEach(['Discount','DiscountAbsolute','DiscountAbsoluteOc','DiscountAbsoluteGross','DiscountAbsoluteGrossOc'],function(discountField) {
							platformRuntimeDataService.applyValidationResult(true, entity, discountField);
							platformDataValidationService.finishValidation(true, entity, entity[discountField], discountField, service, dataService);
						});
					}
					return validateResult;
				}

				service.validateDiscountAbsolute = discountAbsoluteCommonValidation;
				service.validateDiscountAbsoluteOc = discountAbsoluteCommonValidation;
				service.validateDiscountAbsoluteGross = discountAbsoluteCommonValidation;
				service.validateDiscountAbsoluteGrossOc = discountAbsoluteCommonValidation;
				service.validateItemTypeFn = validateItemTypeFn;

				service.validateItemno = function validateItemno(entity, value, model) {
					// implement the itemno validator separately is because the itemno in entity is an integer value but
					// the pass-in value from editor is a string, so we need to set the compare method use '==' but not '===' in _.find() method
					var validateResult = {
						apply: true,
						valid: true
					};
					if (!value) {
						validateResult.apply = false;
						validateResult.valid = false;
						validateResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model.toLowerCase()});
						return validateResult;
					}
					var items = _.filter(dataService.getList(), function (item) {
						return parseInt(value) === parseInt(item.Itemno) && item.Id !== entity.Id;
					});

					if (items.length) {
						if (items.length > 0) {
							validateResult.apply = false;
							validateResult.valid = false;
							validateResult.error = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: 'itemno'});
						}
					}
					var parentService = dataService.parentDataService;
					if (parentService && parentService.name === 'procurement.contract') {
						// if user overwrites line no to a line no alredy used in the basis contract or a previous change order,
						// then MDC_MATERIAL_FK, PRC_STRUCTURE_FK, DESCRIPTION1, DESCRIPTION2,
						// BAS_UOM_FK must be taken from the previous line and set to read only
						var parentSelect = parentService.getSelected();
						if (parentSelect) {
							var conHeaderFk = parentSelect.ContractHeaderFk;
							if (conHeaderFk && value) {
								overwriteItemNo(entity, conHeaderFk, value);
							}
						}
					}
					service.checkContractItemReadOnly(parentService, [entity]);
					if (validateResult.valid) {
						if (parentService && parentService.name === 'procurement.quote.requisition') {
							var result = dataService.validateQuoteItemNoFromReq(_.parseInt(value));
							if (!result) {
								validateResult.apply = true;
								validateResult.valid = false;
								validateResult.error = $translate.instant('procurement.common.prcItemNotMatchError');
							} else {
								var reqPrcItem = dataService.findrelevantReqItemByNo(_.parseInt(value));
								if (reqPrcItem) {
									dataService.setCopyPrcItemValue(reqPrcItem, {isRefresh: true, isValidateUom: true});
								}
							}
							platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
							platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
						}
					}
					return validateResult;
				};

				service.validateBasItemTypeFk = function validateBasItemTypeFk(entity, value) {
					validateItemTypeFn(value,entity,true);
				};

				service.validateAAN = function (entity, value, model) {
					var validateResult = {
						apply: true,
						valid: true
					};
					var dataList = dataService.getList();
					if (value && entity.AGN) {
						var hasBaseItem = _.find(dataList, function (item) {
							return entity.Id !== item.Id && item.AGN === entity.AGN && (item.BasItemType2Fk === 2 || item.BasItemType2Fk === 3);
						});
						var sameAGNANNItems = _.filter(dataList, function (item) {
							return entity.Id !== item.Id && item.AGN === entity.AGN && item.AAN === value;
						});
						if (sameAGNANNItems.length > 0 && hasBaseItem) {
							entity.BasItemType2Fk = sameAGNANNItems[0].BasItemType2Fk;
						} else {
							if (hasBaseItem) {
								entity.BasItemType2Fk = 5;
							} else {
								validateResult.apply = false;
								validateResult.valid = false;
								validateResult.error = $translate.instant('procurement.common.prcNoBaseError1');
								return validateResult;
							}
						}
					}
					if (value === 0 && (entity.BasItemType2Fk === 3 || entity.BasItemType2Fk === 5)) {
						entity.BasItemType2Fk = 2;
						service.validateBasItemType2Fk(entity, entity.BasItemType2Fk, 'BasItemType2Fk');
					}
					platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					return validateResult;
				};

				service.validateAGN = function validateAGN(entity, value) {
					var validateResult = {
						apply: true,
						valid: true
					};
					if (_.isNumber(value) && value < 100) {
						validateResult.apply = false;
						validateResult.valid = false;
						validateResult.error = $translate.instant('procurement.common.AgnRangeError');
						return validateResult;
					}
					if (!_.isNull(value) && value >= 100) {
						var dataList = dataService.getList();
						var sameAgns = _.filter(dataList, function (item) {
							return item.AGN === value && item.Id !== entity.Id;
						});
						var sameOldAgns = _.filter(dataList, function (item) {
							return item.AGN === entity.AGN && item.Id !== entity.Id && (item.BasItemType2Fk === 5 || item.BasItemType2Fk === 7);
						});
						if (entity.BasItemType2Fk === 1) {
							if (sameAgns.length === 0) {
								entity.AAN = 0;
								entity.AGN = value;
								entity.BasItemType2Fk = 2;
								service.validateBasItemType2Fk(entity, 2, 'BasItemType2Fk', true);
							} else {
								var basOrbasePostponed = _.find(sameAgns, function (item) {
									return item.BasItemType2Fk === 2 || item.BasItemType2Fk === 3;
								});
								if (basOrbasePostponed) {
									entity.PrcItemAltFk = basOrbasePostponed.PrcItemAltFk;
									entity.AGN = value;
									entity.BasItemType2Fk = 5;
									service.validateBasItemType2Fk(entity, 5, 'BasItemType2Fk', true);
								}
							}
						} else if (entity.BasItemType2Fk === 2 || entity.BasItemType2Fk === 3) {
							if (sameOldAgns.length > 0) {
								validateResult.apply = false;
								validateResult.valid = false;
								validateResult.error = $translate.instant('procurement.common.cantSetAGN');
								return validateResult;
							}
						} else if (entity.BasItemType2Fk === 5 || entity.BasItemType2Fk === 7) {
							if (sameAgns.length === 0) {
								entity.AAN = 0;
								entity.BasItemType2Fk = 2;
								entity.PrcItemAltFk = entity.Id;
							} else {
								var sameAgnAnnItems = _.filter(dataList, function (item) {
									return item.AGN === value && item.AAN === entity.AAN && item.Id !== entity.Id;
								});
								if (sameAgnAnnItems.length > 0) {
									entity.BasItemType2Fk = sameAgnAnnItems[0].BasItemType2Fk;
									entity.PrcItemAltFk = sameAgnAnnItems[0].PrcItemAltFk;
								} else {
									entity.BasItemType2Fk = 5;
									entity.PrcItemAltFk = sameAgns[0].PrcItemAltFk;
								}
							}
						}
					} else if ((_.isNull(value) || value === '') && entity.BasItemType2Fk !== 1) {
						var dataList = dataService.getList();
						if (entity.BasItemType2Fk === 2 || entity.BasItemType2Fk === 3) {
							var filterDataList = _.filter(dataList, function (item) {
								return item.Id !== entity.Id && (item.BasItemType2Fk === 5 || item.BasItemType2Fk === 7) && item.AGN === entity.AGN;
							});
							if (filterDataList.length === 0) {
								service.validateBasItemType2Fk(entity, 1, 'BasItemType2Fk');
							} else {
								validateResult = {
									apply: false,
									valid: false,
									error: $translate.instant('procurement.common.prcBaseToNormalErrorMessage')
								};
							}
						} else {
							service.validateBasItemType2Fk(entity, 1, 'BasItemType2Fk');
						}
					}
					return validateResult;
				};

				service.validateBasItemType2Fk = function validateBasItemType2Fk(entity, value, model) {
					var validateResult = {
						apply: true,
						valid: true
					};
					var dataList = dataService.getList();
					if (value === 1) {
						let sameAGNAlternativeWizardDataList = _.filter(dataList, function (item) {
							return item.AGN === entity.AGN && (item.Id !== entity.Id) && (item.BasItemType2Fk === 7 || item.BasItemType2Fk === 5);
						});
						if (sameAGNAlternativeWizardDataList.length > 0 && (entity.BasItemType2Fk === 3 || entity.BasItemType2Fk === 2)) {
							validateResult = {
								apply: false,
								valid: false,
								error: $translate.instant('procurement.common.prcBaseToNormalErrorMessage')
							};
						} else {
							var oldEntity = angular.copy(entity);
							var sameAgnAnnItems = _.filter(dataList, function (item) {
								return item.AGN === entity.AGN && item.AAN === entity.AAN;
							});
							_.forEach(sameAgnAnnItems, function (item) {
								item.PrcItemAltFk = null;
								item.AAN = null;
								item.AGN = null;
								item.BasItemType2Fk = value;
								dataService.markItemAsModified(item);
							});
							if (oldEntity.BasItemType2Fk === 7) {
								let sameAGNBaseponstponedDataList = _.filter(dataList, function (item) {
									return item.AGN === oldEntity.AGN && (item.Id !== entity.Id) && (item.BasItemType2Fk === 3);
								});
								if (sameAGNBaseponstponedDataList.length > 0) {
									_.forEach(sameAGNBaseponstponedDataList, function (item) {
										item.BasItemType2Fk = 2;
										dataService.markItemAsModified(item);
									});
								}
							}
						}
					} else if (value === 2) {
						if ((_.isNull(entity.AAN) || '' === entity.AAN)) {
							entity.AAN = 0;
						}
						if ((_.isNull(entity.AGN) || '' === entity.AGN)) {
							let hasAGN = _.filter(dataList, function (item) {
								return !_.isNull(item.AGN) && (entity.Id !== item.Id);
							});
							if (hasAGN.length === 0) {
								entity.AGN = 100;
							} else {
								entity.AGN = _.maxBy(dataList, function (o) {
									return o.AGN;
								}).AGN + 1;
							}
							entity.PrcItemAltFk = angular.copy(entity.Id);
						} else {
							if (entity.BasItemType2Fk === 5 || entity.BasItemType2Fk === 7) {
								var oldEntity = angular.copy(entity);
								var sameAgnAnnItems = _.filter(dataList, function (item) {
									return item.AGN === entity.AGN && item.AAN === entity.AAN;
								});
								var sameAgnAnnItemIds = _.map(sameAgnAnnItems, 'Id');
								let sameAGNDataList = _.filter(dataList, function (item) {
									return item.AGN === entity.AGN && (item.Id !== entity.Id) && !_.includes(sameAgnAnnItemIds, item.Id);
								});
								_.forEach(sameAgnAnnItems, function (item) {
									item.BasItemType2Fk = value;
									item.AAN = 0;
									dataService.markItemAsModified(item);
								});
								if (sameAGNDataList.length > 0 && (oldEntity.BasItemType2Fk === 7 || oldEntity.BasItemType2Fk === 5)) {
									_.forEach(sameAGNDataList, function (item) {
										if (item.BasItemType2Fk === 2 || item.BasItemType2Fk === 3) {
											item.AAN = oldEntity.AAN;
										}
										item.BasItemType2Fk = 5;
										dataService.markItemAsModified(item);
									});
								}
							} else if (entity.BasItemType2Fk === 3) {
								let sameAGNAlternativeWizardDataList = _.filter(dataList, function (item) {
									return item.AGN === entity.AGN && (item.Id !== entity.Id) && (item.BasItemType2Fk === 7);
								});
								if (sameAGNAlternativeWizardDataList.length > 0) {
									validateResult = {
										apply: false,
										valid: false,
										error: $translate.instant('procurement.common.prcBaseToNormalErrorMessage')
									};
								}
							} else {
								entity.PrcItemAltFk = angular.copy(entity.Id);
							}
						}
					} else if (value === 3) {
						validateResult = {
							apply: false,
							valid: false,
							error: $translate.instant('procurement.common.prcCantSelectBasePostponedMessage')
						};
					} else if (value === 5 || value === 7) {
						var filterBaseDataList = _.filter(dataList, function (item) {
							return (item.Id !== entity.Id) && (item.BasItemType2Fk === 2 || item.BasItemType2Fk === 3);
						});
						if (filterBaseDataList.length > 0) {
							if (entity.BasItemType2Fk === 2 || entity.BasItemType2Fk === 3) {
								var sameAgnAnnItems = _.filter(dataList, function (item) {
									return item.AGN === entity.AGN && item.AAN === entity.AAN && (item.BasItemType2Fk === 2 || item.BasItemType2Fk === 3);
								});
								var sameAgnAnnItemIds = _.map(sameAgnAnnItems, 'Id');
								if (sameAgnAnnItemIds.length > 1) {
									filterBaseDataList = _.filter(filterBaseDataList, function (item) {
										return !_.includes(sameAgnAnnItemIds, item.Id);
									});
								}
							}
						}
						if (filterBaseDataList.length > 0) {
							if (_.isNull(entity.AGN) || '' === entity.AGN) {
								let maxBasObj = _.maxBy(filterBaseDataList, function (item) {
									return item.Id;
								});
								if (maxBasObj) {
									entity.AGN = maxBasObj.AGN;
									var showAltByBase = _.find(filterBaseDataList, function (item) {
										return item.AGN === maxBasObj.AGN && maxBasObj.AAN === maxBasObj.AAN;
									});
									if (showAltByBase) {
										entity.PrcItemAltFk = showAltByBase.PrcItemAltFk;
									} else {
										entity.PrcItemAltFk = maxBasObj.PrcItemAltFk;
									}
								}
							}
							if (!_.isNull(entity.AGN)) {
								let sameAGNBaseDataList = _.filter(filterBaseDataList, function (item) {
									return item.AGN === entity.AGN;
								});
								if (sameAGNBaseDataList.length > 0) {
									let sameAGNs = _.filter(dataList, function (item) {
										return (entity.AGN === item.AGN) && (entity.Id !== item.Id);
									});
									if (sameAGNs.length > 0) {
										if (_.isNull(entity.AAN) || '' === entity.AAN) {
											entity.AAN = _.maxBy(sameAGNs, function (o) {
												return o.AAN;
											}).AAN + 1;
										}
										if (value === 5) {
											const samegroups = _.filter(sameAGNs, function (item) {
												return item.AAN === entity.AAN;
											});
											_.forEach(samegroups, function (item) {
												item.BasItemType2Fk = value;
												dataService.markItemAsModified(item);
											});
											const hasAlternativeWardItem = _.find(dataList, function (item) {
												return item.AGN === entity.AGN && (item.BasItemType2Fk === 7) && (entity.Id !== item.Id);
											});
											_.forEach(sameAGNBaseDataList, function (item) {
												if (item.BasItemType2Fk === 3 && !hasAlternativeWardItem) {
													item.BasItemType2Fk = 2;
													dataService.markItemAsModified(item);
												}
											});
										} else if (value === 7) {
											const groups = _.groupBy(sameAGNs, function (item) {
												return [item.AGN, item.AAN].join(',');
											});
											_.each(groups, function (groupItems/* , index */) {
												_.forEach(groupItems, function (item) {
													if (item.BasItemType2Fk === 2) {
														item.BasItemType2Fk = 3;
														dataService.markItemAsModified(item);
													} else if (item.BasItemType2Fk === 5 && item.AAN === entity.AAN && item.Id !== entity.Id) {
														item.BasItemType2Fk = 7;
														dataService.markItemAsModified(item);
													} else if (item.BasItemType2Fk === 7) {
														item.BasItemType2Fk = 5;
														dataService.markItemAsModified(item);
													}
												});
											});
										}
									}
								} else {
									validateResult = {
										apply: false,
										valid: false,
										error: $translate.instant('procurement.common.prcNoBaseError')
									};
								}
							}
						} else {
							validateResult = {
								apply: false,
								valid: false,
								error: $translate.instant('procurement.common.prcNoBaseError')
							};
						}
					}
					if (value === 3 || value === 5) {
						entity.TotalNoDiscount = 0;
						entity.TotalCurrencyNoDiscount = 0;
						entity.Total = 0;
						entity.TotalOc = 0;
						entity.TotalGross = 0;
						entity.TotalGrossOc = 0;
					} else {
						resetExtraAndCalculateTotal(entity);
					}
					platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					return validateResult;
				};

				service.validateOnhire = function validateOnhire(entity, value) {
					var validateResult = {valid: true};
					if (entity.Offhire && value) {
						var onhire = new Date(value);
						if (onhire > new Date(entity.Offhire)) {
							validateResult.apply = true;
							validateResult.valid = false;
							validateResult.error = $translate.instant('cloud.common.ValidationRule_CompareLessThan', {
								'p_0': 'on hire date',
								'p_1': 'off hire date'
							});
						}
					}
					return validateResult;
				};

				service.validateOffhire = function validateOffhire(entity, value) {
					var validateResult = {valid: true};
					if (entity.Onhire && value) {
						var offhire = new Date(value);
						if (offhire < new Date(entity.Onhire)) {
							validateResult.apply = true;
							validateResult.valid = false;
							validateResult.error = $translate.instant('cloud.common.ValidationRule_CompareLessThan', {
								'p_0': 'on hire date',
								'p_1': 'off hire date'
							});

						}
					}
					return validateResult;
				};
				// defect:124735 start
				service.validatePrcStructureFk = function validatePrcStructureFk(entity, value) {
					if (!value && entity.PrcStructureFk && moduleName === 'procurement.contract') {
						entity.ModifiedStructureNull = true;
					}
					entity.PrcStructureFk = value;
					return service.onPrcStructureFkChange(entity, value, null, true);
				};
				// defect:124735 end

				service.onPrcStructureFkChange = function changePrcStructureFk(entity, value, taxCodeFK, isCalculateTotal) {
					// onEntityCreated(value, entity);  TODO: dead loop

					var headerItem = dataService.getSelectedPrcHeader();
					var result = true;
					if (!value) {
						if (entity.PrcStructureFk && moduleName === 'procurement.contract') {
							entity.ModifiedStructureNull = true;
						}
						if (taxCodeFK) {
							entity.MdcTaxCodeFk = taxCodeFK;
						}
						if (_.isNil(entity.MdcTaxCodeFk)) {
							entity.MdcTaxCodeFk = headerItem.TaxCodeFk;
						}
						if (isCalculateTotal) {
							resetExtraAndCalculateTotal(entity);
						}
						return result;
					}

					// #93553 - Contract item no getting the tax code from material master
					if (taxCodeFK) {
						entity.MdcTaxCodeFk = taxCodeFK;
						if (isCalculateTotal) {
							resetExtraAndCalculateTotal(entity);
						}
					} else {
						$http.get(globals.webApiBaseUrl + 'basics/procurementstructure/taxcode/getTaxCodeByStructure?structureId=' + value).then(function (response) {
							if (response.data) {
								let taxCodeFk = response.data;
								resetTaxCode(taxCodeFk, entity);
							} else {
								if (_.isNil(entity.MdcTaxCodeFk)) {
									let taxCodeFk = headerItem.TaxCodeFk;
									resetTaxCode(taxCodeFk, entity);
								}
							}
						});
					}

					// update StructureFk to parent when it has value
					if (angular.isDefined(value) && value !== null) {
						var parentItem = dataService.parentDataService.getSelected();
						if (parentItem && parentItem.PrcHeaderEntity && !parentItem.PrcHeaderEntity.StructureFk) {
							dataService.onItemStructureChanged.fire({entity: parentItem, newValue: value});
						}
					}

					if (angular.isFunction(dataService.updateReadOnly)) {
						dataService.updateReadOnly(entity, 'PrcStructureFk');
					}
					var postData = $http.get(globals.webApiBaseUrl + 'basics/procurementstructure/taxcode/list?mainItemId=' + entity.PrcStructureFk);
					$q.all([postData]).then(function (response) {
						if (response[0].data.Main.length >= 1) {
							var loginCompanyFk = platformContextService.clientId;
							var LedgerContextFk;
							if (loginCompanyFk) {
								var companies = lookupDescriptorService.getData('Company');
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

					return result;
				};

				service.validatePrice = function validatePrice(entity, value, model) {
					if (value === null) {
						return true;
					}
					entity[model] = value;
					entity.IsInputTotal = false;
					setPricePriceOcPriceGrossPriceGrossOc(entity, value, model);
					var dontReCalcuPricGrossOc = true;
					var isResetGross = true;
					resetExtraAndCalculateTotal(entity, isResetGross, dontReCalcuPricGrossOc);
					updateDiscountAbsoluteReadOnly(entity);
					entity.OrginalPrcItem = null;
					return true;
				};

				service.validatePriceOc = function validatePriceOc(entity, value, model) {
					if (value === null) {
						return true;
					}
					entity[model] = value;
					entity.IsInputTotal = false;
					setPricePriceOcPriceGrossPriceGrossOc(entity, value, model);
					var dontReCalcuPricGrossOc = true;
					var isResetGross = true;
					resetExtraAndCalculateTotal(entity, isResetGross, dontReCalcuPricGrossOc);
					updateDiscountAbsoluteReadOnly(entity);
					entity.OrginalPrcItem = null;
					return true;
				};

				service.validateTotalPriceOc = totalRecalculateValidator;
				service.validateTotalPrice = totalRecalculateValidator;

				service.validateBasUomFk = generateValidationOfBasUomFk(true);
				function generateValidationOfBasUomFk(isCalculateTotal) {
					return function(entity, value, model) {
						var validateResult = {
							apply: true,
							valid: true
						};
						if (!value || value === 0) {
							if (entity.BasItemTypeFk === 7) {
								platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
								platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
								return validateResult;
							}
							var uom = $translate.instant('cloud.common.entityUoM');
							var errMsg = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: uom});
							validateResult.apply = false;
							validateResult.valid = false;
							validateResult.error = errMsg;
						} else {
							// Whenever BAS_UOM_FK is changed then FactorPriceUnit is reinitialized to 1
							// When BAS_UOM_FK is changed, BasUomPriceUnitFk is updated to the same value


							if (!entity.MdcMaterialFk) {// When BAS_UOM_FK is changed and MdcMaterialFk is null, AlternativeUomFk is updated to the same value
								entity.AlternativeUomFk = value;
							}
							entity.BasUomPriceUnitFk = value;
							entity.FactorPriceUnit = 1;
							if (isCalculateTotal) {
								resetExtraAndCalculateTotal(entity);
							}
							calcQuantityConverted(entity, entity.FactorPriceUnit, 'FactorPriceUnit');
							dataService.fireItemModified(entity);
						}

						platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
						platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
						return validateResult;
					};
				};
				service.validateAlternativeUomFk = function validateAlternativeUomFk(entity, value) {
					entity.AlternativeQuantity = conversionQuantity(entity, value, entity.Quantity, null);
					return true;
				};

				service.validateBasUomPriceUnitFk = function validateBasUomPriceUnitFk(entity, value) {
					entity.FactorPriceUnit = 1;
					var uoms = lookupDescriptorService.getData('Uom');
					if (uoms) {
						var uomObj = uoms[entity.BasUomFk];
						var uomPriceObj = uoms[value];
						if (uomObj && uomPriceObj) {
							if ((uomPriceObj.LengthDimension !== 0 && uomObj.LengthDimension === uomPriceObj.LengthDimension) ||
								(uomPriceObj.MassDimension !== 0 && uomObj.MassDimension === uomPriceObj.MassDimension) ||
								(uomPriceObj.TimeDimension !== 0 && uomObj.TimeDimension === uomPriceObj.TimeDimension)) {
								if (uomPriceObj.Factor !== 0 && uomPriceObj.Factor) {
									entity.FactorPriceUnit = itemCalculationHelper.round(roundingType.FactorPriceUnit, math.bignumber(uomObj.Factor).div(uomPriceObj.Factor));
								}
							}
						}
					}
					resetExtraAndCalculateTotal(entity);
					calcQuantityConverted(entity, entity.FactorPriceUnit, 'FactorPriceUnit');
					dataService.fireItemModified(entity);
					return true;
				};

				service.validateSafetyLeadTime = function validateSafetyLeadTime(entity, value) {
					entity.TotalLeadTime = entity.LeadTime + entity.BufferLeadTime + entity.LeadTimeExtra + value;
					leadTimeDeal(entity);
					return true;
				};

				service.validateBufferLeadTime = function validateBufferLeadTime(entity, value) {
					entity.TotalLeadTime = entity.LeadTime + entity.SafetyLeadTime + entity.LeadTimeExtra + value;
					leadTimeDeal(entity);
					return true;
				};
				// supplier lead time
				service.validateLeadTime = function validateLeadTime(entity, value) {
					if (angular.isFunction(dataService.parentDataService.calculateTLeadTime)) {
						entity.TotalLeadTime = dataService.parentDataService.calculateTLeadTime(entity, value);
					} else {
						entity.TotalLeadTime = entity.SafetyLeadTime + entity.BufferLeadTime + entity.LeadTimeExtra + value;
					}
					leadTimeDeal(entity);
					return true;
				};

				// Express lead time
				service.validateLeadTimeExtra = function validateLeadTimeExtra(entity, value) {
					if (!angular.isFunction(dataService.parentDataService.calculateTLeadTime)) {
						entity.TotalLeadTime = entity.LeadTime + entity.BufferLeadTime + entity.SafetyLeadTime + value;
						leadTimeDeal(entity);
					}
					return true;
				};

				function leadTimeDeal(entity) {
					dataService.fireItemModified(entity);
					var maxTotalLeadTime = _.max(_.map(dataService.getList(), 'TotalLeadTime'));
					if (maxTotalLeadTime) {
						var parentItem = dataService.parentDataService.getSelected();
						parentItem.TotalLeadTime = maxTotalLeadTime;
						dataService.parentDataService.markItemAsModified(parentItem);

					}
					/* $http.post(globals.webApiBaseUrl + 'procurement/common/prcitem/getTotalLeadTime', entity).then(function(response){
					 var parentItem = dataService.parentDataService.getSelected();
					 if(parentItem){
					 parentItem.TotalLeadTime = response.data;
					 }

					 dataService.parentDataService.markItemAsModified(parentItem);
					 }); */
				}

				service.validateMdcMaterialFk = function validateMdcMaterialFk(entity, value) {
					if(_.isNil(value)){
						entity.Co2Project = 0;
						entity.Co2ProjectTotal = (entity.Co2Project * entity.Quantity).toFixed(3);
					}
					var mainService = moduleContext.getMainService();
					var moduleName = mainService.name;
					if (value) {
						if ('procurement.qto' !== moduleName) {
							platformRuntimeDataService.readonly(entity, [{field: 'SellUnit', readonly: true}]);
							platformRuntimeDataService.readonly(entity, [{field: 'LeadTime', readonly: true}]);
							platformRuntimeDataService.readonly(entity, [{field: 'MinQuantity', readonly: true}]);
						}
					} else {
						if ('procurement.qto' !== moduleName) {
							platformRuntimeDataService.readonly(entity, [{field: 'SellUnit', readonly: false}]);
							platformRuntimeDataService.readonly(entity, [{field: 'LeadTime', readonly: false}]);
							platformRuntimeDataService.readonly(entity, [{field: 'MinQuantity', readonly: false}]);
							dataService.fireItemModified(entity);
						}
					}
					dataService.fireItemModified(entity);
				};

				service.validateCo2Project = (entity, value)=>{
					entity.Co2ProjectTotal = (entity.Quantity * value).toFixed(3);
				};
				// #92164, use async validator to wait async logic done before update data on bulk edit feature.
				service.asyncValidateMdcMaterialFk = function asyncValidateMdcMaterialFk(entity, value) {

					var defer = $q.defer();
					var headerItem = dataService.getSelectedPrcHeader();
					var parentItem = dataService.parentDataService.getSelected();
					var mainService = moduleContext.getMainService();
					var moduleName = mainService.name;
					var docCurrencyFk = headerItem.CurrencyFk || headerItem.BasCurrencyFk,
						exchangeRate = headerItem.ExchangeRate;
					entity.IsInputTotal = false;
					// if user click clear button, no need to clear other data
					if (!value) {
						if (parentItem.MaterialCatalogFk) {
							dataService.setColumnsReadOnly(entity, false);
						}

						entity.MdcMaterialFk = null;
						entity.MaterialExternalCode = null;
						entity.MaterialCatalogCode = null;
						entity.MaterialCatalogDescription = null;
						entity.MaterialCatalogSupplier = null;
						entity.MaterialCatalogTypeFk = null;
						entity.Material2Uoms = null;
						if (angular.isFunction(dataService.updateReadOnly)) {
							dataService.updateReadOnly(entity, 'PrcStructureFk');
						}
						platformRuntimeDataService.readonly(entity, [{field: 'BasUomFk', readonly: false}]);
						platformRuntimeDataService.readonly(entity, [{field: 'AlternativeUomFk', readonly: false}]);
						dataService.updatePrjStockReadOnly(entity);
						dataService.fireItemModified(entity);
						dataService.loadMaterialSpecification(true);
						return $q.when(true);
					}

					platformRuntimeDataService.readonly(entity, [{field: 'BasUomFk', readonly: true}]);
					priceConditionService.lockParentSelection();

					var promises = [];
					var promise1 = lookupService.getItemByKey('MaterialCommodity', value);
					promises.push(promise1);

					if ('procurement.contract' === moduleName) {
						var _parentItem = dataService.parentDataService.getSelected();
						if (_parentItem && _parentItem.ConHeaderFk !== null && _parentItem.ConHeaderFk !== undefined) {
							var promise2 = $http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/listbyconheaderid?conHeaderId=' + _parentItem.ConHeaderFk);
							promises.push(promise2);
						}
					}
					$q.all(promises).then(function (response) {
						if (!angular.isObject(response[0])) {
							defer.resolve(true);
							return;
						}
						lookupDescriptorService.updateData('MaterialCommodity', [response[0]]);
						var materialSearchVItem = angular.copy(lookupDescriptorService.getLookupItem('MaterialCommodity', value));
						var materialItem = response[0];
						var priceList = basicsMaterialPriceListLookupDataService.getPriceList(materialSearchVItem);

						var sameBasicPrcItem = null;
						if (response[1] && response[1].data) {
							sameBasicPrcItem = _.find(response[1].data, {MdcMaterialFk: value});
						}
						entity.MdcMaterialFk = value;
						entity.MaterialExternalCode = materialItem.ExternalCode;
						entity.MaterialCatalogCode = materialItem.CatalogCode;
						entity.MaterialCatalogDescription = materialItem.CatalogDescriptionInfo ? materialItem.CatalogDescriptionInfo.Translated : null;
						entity.MaterialCatalogTypeFk = materialItem.MaterialCatalogTypeFk;
						entity.MaterialCatalogSupplier = materialItem.MaterialCatalogSupplier;
						entity.Description1 = materialItem.DescriptionInfo.Translated || materialItem.DescriptionInfo.Description;
						entity.Description2 = materialItem.DescriptionInfo2.Translated || materialItem.DescriptionInfo2.Description;
						entity.PriceUnit = itemCalculationHelper.round(roundingType.PriceUnit, materialItem.PriceUnit);
						entity.BasUomFk = materialItem.BasUomFk;
						generateValidationOfBasUomFk(false)(entity, entity.BasUomFk, 'BasUomFk');
						entity.BasUomPriceUnitFk = materialItem.BasUomPriceUnitFk;
						const factorPriceUnit = materialItem.FactorPriceUnit ? materialItem.FactorPriceUnit : 1;
						entity.FactorPriceUnit = itemCalculationHelper.round(roundingType.FactorPriceUnit, factorPriceUnit);
						entity.PrcStructureFk = materialItem.PrcStructureFk;
						entity.Material2Uoms = materialItem.Material2Uoms;
						entity.Userdefined1 = materialItem.UserDefined1;
						entity.Userdefined2 = materialItem.UserDefined2;
						entity.Userdefined3 = materialItem.UserDefined3;
						entity.Userdefined4 = materialItem.UserDefined4;
						entity.Userdefined5 = materialItem.UserDefined5;

						entity.MaterialStockFk = materialItem.MaterialStockFk;
						entity.AlternativeUomFk = materialItem.MaterialStock2UomFk || materialItem.BasUomFk;
						entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, entity.Quantity, null);// entity.AlternativeQuantity

						// defect:124735 start
						$http.get(globals.webApiBaseUrl + 'basics/procurementstructure/taxcode/list?mainItemId=' + entity.PrcStructureFk).then((response) => {
							if (response.data.Main.length >= 1) {
								var loginCompanyFk = platformContextService.clientId;
								var LedgerContextFk;
								if (loginCompanyFk) {
									var companies = lookupDescriptorService.getData('Company');
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
						// defect:124735 end
						platformRuntimeDataService.readonly(entity, [{
							field: 'AlternativeUomFk',
							readonly: !entity.Material2Uoms
						}]);
						if(!_.isNil(priceList.Co2Project)){
							entity.Co2Project = priceList.Co2Project;
							entity.Co2Source = priceList.Co2Source;
							entity.Co2ProjectTotal = (entity.Co2Project * entity.Quantity).toFixed(3);
							entity.Co2SourceTotal = (entity.Co2Source * entity.Quantity).toFixed(3);
						}else{
							$http.get(globals.webApiBaseUrl + 'basics/material/getbyid?id=' + entity.MdcMaterialFk).then((response) => {
								if (!_.isNil(response.data)) {
									entity.Co2Source = response.data.Co2Source;
									entity.Co2Project = response.data.Co2Project;
									entity.Co2ProjectTotal = (entity.Co2Project * entity.Quantity).toFixed(3);
									entity.Co2SourceTotal = (entity.Co2Source * entity.Quantity).toFixed(3);
								}
							});
						}
						if (sameBasicPrcItem !== null && sameBasicPrcItem !== undefined) {
							entity.SellUnit = sameBasicPrcItem.SellUnit;
							entity.MinQuantity = sameBasicPrcItem.MinQuantity;
							entity.LeadTime = sameBasicPrcItem.LeadTime;
							entity.Charge = sameBasicPrcItem.Charge;
							entity.ChargeOc = sameBasicPrcItem.ChargeOc;
							entity.DiscountAbsolute = sameBasicPrcItem.DiscountAbsolute;
							entity.DiscountAbsoluteOc = sameBasicPrcItem.DiscountAbsoluteOc;
							entity.DiscountAbsoluteGross = sameBasicPrcItem.DiscountAbsoluteGross;
							entity.DiscountAbsoluteGrossOc = sameBasicPrcItem.DiscountAbsoluteGrossOc;
							entity.Discount = sameBasicPrcItem.Discount;
						} else {
							entity.SellUnit = priceList.SellUnit;
							entity.MinQuantity = priceList.MinQuantity;
							entity.LeadTime = priceList.LeadTime;
						}

						// #105079 - Do Not Set Express Lead Time via Material Look Up Dialog in Procurement
						entity.LeadTimeExtra = 0;
						entity.TotalLeadTime = angular.isFunction(dataService.parentDataService.calculateTLeadTime) ?
							dataService.parentDataService.calculateTLeadTime(entity, entity.LeadTime) :
							(entity.LeadTime + entity.SafetyLeadTime + entity.LeadTimeExtra);
						var Specification = materialItem.SpecificationInfo.Translated || materialItem.SpecificationInfo.Description;
						if (typeof Specification === 'string') {
							entity.Specification = Specification.replace(/<[^>]+>/g, '').replace(/(&nbsp;)/g, '');
						}
						dataService.onSpecificationChanged.fire(Specification);

						if (sameBasicPrcItem !== undefined && sameBasicPrcItem !== null) {
							if (sameBasicPrcItem.BasUomFk) {
								entity.BasUomFk = sameBasicPrcItem.BasUomFk;
							}
							entity.MaterialStockFk = sameBasicPrcItem.MaterialStockFk;
							entity.AlternativeUomFk = sameBasicPrcItem.MaterialStock2UomFk || sameBasicPrcItem.BasUomFk;
							// fixed issue:106771
							const factorPriceUnit = sameBasicPrcItem.FactorPriceUnit ? sameBasicPrcItem.FactorPriceUnit : 1;
							entity.FactorPriceUnit = itemCalculationHelper.round(roundingType.FactorPriceUnit, factorPriceUnit);
							entity.PriceUnit = itemCalculationHelper.round(roundingType.PriceUnit, sameBasicPrcItem.PriceUnit);
							entity.BasUomPriceUnitFk = sameBasicPrcItem.BasUomPriceUnitFk;
							entity.PrcPriceConditionFk = sameBasicPrcItem.PrcPriceConditionFk;

						}
						if (parentItem !== null) {
							if (parentItem.PaymentTermFiFk) {
								entity.BasPaymentTermFiFk = parentItem.PaymentTermFiFk;
							}

							if (parentItem.BasPaymentTermFiFk) {
								entity.BasPaymentTermFiFk = parentItem.BasPaymentTermFiFk;
							}

							if (parentItem.PaymentTermPaFk) {
								entity.BasPaymentTermPaFk = parentItem.PaymentTermPaFk;
							}

							if (parentItem.BasPaymentTermPaFk) {
								entity.BasPaymentTermPaFk = parentItem.BasPaymentTermPaFk;
							}

							if (parentItem.IncotermFk) {
								entity.PrcIncotermFk = parentItem.IncotermFk;
							}

							if (parentItem.MaterialCatalogFk) {
								dataService.setColumnsReadOnly(entity, true);
							}
						}
						dataService.fireItemModified(entity);
						dataService.loadMaterialSpecification(true);

						if (sameBasicPrcItem === undefined || sameBasicPrcItem === null) {
							// defect : 143658
							if(_.isNil(priceList.Id)||(priceList&&priceList.Id<0)){
								priceList.Id = materialItem.MaterialPriceListFk;
							}

							reloadPriceCondition(entity, priceList.PrcPriceConditionFk, true, priceList.Id).then(function () {
								service.onPrcStructureFkChange(entity, entity.PrcStructureFk, priceList.MdcTaxCodeFk, false);
								updatePriceFieldsAfterUpdateMaterial(entity, priceList, exchangeRate, docCurrencyFk, headerItem.ProjectFk).then(function () {
									calcQuantityConverted(entity, entity.FactorPriceUnit, 'FactorPriceUnit');
									dataService.fireItemModified(entity);
									if (angular.isFunction(dataService.updateReadOnly)) {
										dataService.updateReadOnly(entity, 'PrcStructureFk');
									}
								}).finally(function () {
									defer.resolve();
								});
							});
						} else {
							reloadPriceCondition(entity, sameBasicPrcItem.PrcPriceConditionFk, false, null, sameBasicPrcItem.Id).then(function () {
								entity.Price = sameBasicPrcItem.Price;
								setPricePriceOcPriceGrossPriceGrossOc(entity, entity.Price, 'Price', exchangeRate);
								entity.PriceOc = sameBasicPrcItem.PriceOc;
								service.onPrcStructureFkChange(entity, entity.PrcStructureFk, sameBasicPrcItem.MdcTaxCodeFk, true);
								dataService.fireItemModified(entity);
								if (angular.isFunction(dataService.updateReadOnly)) {
									dataService.updateReadOnly(entity, 'PrcStructureFk');
								}
							}).finally(function () {
								defer.resolve();
							});
						}

						dataService.updatePrjStockReadOnly(entity);
					}, function () {
						defer.resolve();
					});

					if (value > 0) {
						var _mainService = moduleContext.getMainService();
						var leadingService = moduleContext.getLeadingService();
						var subModule = null;
						if (_mainService.getItemName() !== leadingService.getItemName()) {
							subModule = _mainService.getItemName();
						}
						var options = {
							url: 'procurement/common/prccertificate/copycertificatesfrommaterial',
							parameter: {PrcHeaderId: parentItem.PrcHeaderFk, MdcMaterialId: value},
							dataService: certificateDataService,
							subModule: subModule
						};
						certificateDataService.copyCertificatesFromOtherModule(options);
						// certificateDataService.copyCertificatesFromMaterial(value);
					}

					return defer.promise;
				};

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

				function overwriteItemNo(entity, conHeaderFk, itemNo) {
					$http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'procurement/common/prcitem/getpreviewprcItembyitemno',
						params: {
							conHeaderFk: conHeaderFk,
							itemNo: itemNo,
							inContractMoudle: (moduleName === 'procurement.contract')
						}
					}).then(function (response) {
						if (response && response.data) {
							var data = response.data.Main;
							var priceConditions = response.data.PriceConditions;
							entity.MdcMaterialFk = data.MdcMaterialFk;
							entity.PrcStructureFk = data.PrcStructureFk;
							if (entity.PrcStructureFk !== null) {
								removeError(entity, 'PrcStructureFk');
								var result = {apply: true, valid: true};
								platformDataValidationService.finishValidation(result, entity, entity.PrcStructureFk, 'PrcStructureFk', service, dataService);
							}
							entity.Description1 = data.Description1;
							entity.Description2 = data.Description2;
							// UOM,price,price factor,unit,price unit uom, price(OC),price condition container from basis contract(ALM 92196)
							entity.BasUomFk = entity.AlternativeUomFk = data.BasUomFk;
							entity.MaterialStockFk = data.MaterialStockFk;
							entity.FactorPriceUnit = data.FactorPriceUnit;
							entity.PriceUnit = data.PriceUnit;
							entity.BasUomPriceUnitFk = data.BasUomPriceUnitFk;
							entity.PrcPriceConditionFk = data.PrcPriceConditionFk;
							entity.PriceExtra = data.PriceExtra;
							entity.PriceExtraOc = data.PriceExtraOc;
							entity.MdcMaterialFk = data.MdcMaterialFk;
							entity.MdcTaxCodeFk = data.MdcTaxCodeFk;
							entity.Discount = data.Discount;
							entity.DiscountAbsolute = data.DiscountAbsolute;
							entity.DiscountAbsoluteOc = data.DiscountAbsoluteOc;
							entity.DiscountAbsoluteGross = data.DiscountAbsoluteGross;
							entity.DiscountAbsoluteGrossOc = data.DiscountAbsoluteGrossOc;
							entity.PrcItemFk = data.PrcItemFk;
							entity.DiscountSplit = 0;
							entity.DiscountSplitOc = 0;
							entity.Co2Project = data.Co2Project;
							entity.Co2ProjectTotal =(data.Co2Project * data.Quantity).toFixed(3);
							entity.Co2Source = data.Co2Source;
							entity.Co2SourceTotal = (data.Co2Source * data.Quantity).toFixed(3);
							if (moduleName === 'procurement.contract') {
								entity.ContractGrandQuantity = data.ContractGrandQuantity;
								entity.TotalCallOffQuantity = data.TotalCallOffQuantity;
								entity.RemainingQuantityForCallOff = entity.ContractGrandQuantity - entity.TotalCallOffQuantity;
								setContractGrandQuantityAndTotalCallOffQuantity(entity, 0, entity.Quantity);

								const isConsolidateChange = _.isFunction(dataService.parentDataService.isConsolidateChange) ? dataService.parentDataService.isConsolidateChange() : false;
								if (isConsolidateChange) {
									entity.QuantityDelivered = data.QuantityDelivered;
									entity.QuantityRemaining = dataService.calculateQuantityRemaining(entity.ContractGrandQuantity, entity.QuantityDelivered);
								}
							}
		                    if(data.PrjChangeFk !== null){
			                     entity.PrjChangeFk = data.PrjChangeFk;
		                     }
							if(data.PrjChangeStatusFk !== null){
								entity.PrjChangeStatusFk = data.PrjChangeStatusFk;
							}
							var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
							var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.MdcTaxCodeFk);
							var parentItem = dataService.parentDataService.getSelected();
							var sameRate = parentItem.ExchangeRate === data.MainExchangeRate;
							var sameVatPercent = vatPercent === data.MainVatPercent;
							if (isCalculateOverGross) {
								entity.PriceGrossOc = data.PriceGrossOc;
								entity.PriceGross = sameRate ? data.PriceGross : itemCalculationHelper.getPriceGrossByPriceGrossOc(entity, parentItem.ExchangeRate);
								entity.PriceOc = (sameRate && sameVatPercent) ? data.PriceOc : itemCalculationHelper.getPriceOc(entity, vatPercent);
								entity.Price = (sameRate && sameVatPercent) ? data.Price : itemCalculationHelper.getPrice(entity, vatPercent);
							} else {
								entity.PriceOc = data.PriceOc;
								entity.Price = sameRate ? data.Price : itemCalculationHelper.getPriceByPriceOc(entity, parentItem.ExchangeRate);
								entity.PriceGrossOc = (sameRate && sameVatPercent) ? data.PriceGrossOc : itemCalculationHelper.getPriceGrossOc(entity, vatPercent);
								entity.PriceGross = (sameRate && sameVatPercent) ? data.PriceGross : itemCalculationHelper.getPriceGross(entity, vatPercent);
							}
							setPriceIsChangeField(data, entity);
							var isResetGross = true;
							var isResetPriceExtra = true;
							var dontReCalcuPricGrossOc = true;
							dataService.calculateTotal(entity, isResetGross, isResetPriceExtra, dontReCalcuPricGrossOc);

							if (priceConditions && priceConditions.length) {
								_.forEach(priceConditions, function (pc) {
									pc.PrcItemFk = entity.Id;
								});
								priceConditionService.handleReloadSucceeded(entity, priceConditions, {});
							}

							var basUomFkValidateResult = {
								apply: true,
								valid: true
							};
							if (!entity.BasUomFk || entity.BasUomFk === 0) {
								var uom = $translate.instant('cloud.common.entityUoM');
								var errMsg = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: uom});
								basUomFkValidateResult.apply = false;
								basUomFkValidateResult.valid = false;
								basUomFkValidateResult.error = errMsg;
							}
							platformDataValidationService.finishValidation(basUomFkValidateResult, entity, entity.BasUomFk, 'BasUomFk', service, dataService);
							platformRuntimeDataService.applyValidationResult(basUomFkValidateResult, entity, 'BasUomFk');

							dataService.fireItemModified(entity);
							setItemReadonly(entity, true);
						} else {
							setItemReadonly(entity, false);
						}
					});

				}

				function removeError(entity, model) {
					if (entity.__rt$data && entity.__rt$data.errors) {
						entity.__rt$data.errors[model] = null;
					}
				}

				function setItemReadonly(entity, isReadonly) {
					var fields = ['MdcMaterialFk', 'PrcStructureFk', 'Description1', 'Description2'];
					var readonlyArr = [];
					angular.forEach(fields, function (field) {
						readonlyArr.push({field: field, readonly: isReadonly});
					});
					platformRuntimeDataService.readonly(entity, readonlyArr);
				}

				service.getMaterialById = function getMaterialById(materialFk) {
					return $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'basics/material/material',
						params: {
							id: materialFk
						}
					});
				};

				service.totalValidator = function totalValidator(/* entity, value */) {
					dataService.parentDataService.isTotalDirty = true;
					return true;
				};

				service.asyncValidateQuantity = function asyncValidateQuantity(entity, value, field, formatterOptions, forBulkConfig, noConversion) {
					let defer = $q.defer();
					var result = true;
					entity.Co2ProjectTotal = (entity.Co2Project * value).toFixed(3);
					entity.Co2SourceTotal = (entity.Co2Source * value).toFixed(3);
					entity.IsInputTotal = false;
					if (_.isNil(value)) {
						value = 0;
					}
					setContractGrandQuantityAndTotalCallOffQuantity(entity, entity.Quantity, value);
					service.validateTargetPrice(entity, entity.TargetPrice, 'TargetPrice', value);
					if (dataService.treePresOpt) {
						var parent = _.find(dataService.getList(), {Id: entity[dataService.treePresOpt.parentProp]}) || {};
						if (parent && parent[dataService.treePresOpt.childProp]) {
							result = platformDataValidationService.isTotal(parent[dataService.treePresOpt.childProp], entity, value, field, parent[field]);
							angular.forEach(parent[dataService.treePresOpt.childProp], dataService.markItemAsModified);
						}
						// else {
						//    var replacementItems = entity[dataService.treePresOpt.childProp];
						//    if (replacementItems.length > 0) {
						//        var totalQuantity = 0;
						//        for (var i = 0; i < replacementItems.length; i++) {
						//            totalQuantity += replacementItems[i].Quantity;
						//        }
						//        if (totalQuantity != value) {
						//            result = platformDataValidationService.isTotal(entity[dataService.treePresOpt.childProp], entity, value, field, entity[field]);
						//            angular.forEach(entity[dataService.treePresOpt.childProp], dataService.markItemAsModified);
						//        }
						//    }
						// }
					}

					calcQuantityConverted(entity, value, field);

					dataService.onQuantityChanged.fire({prcItem: entity, newValue: value});

					if (!noConversion) {
						entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, value, null);
					}
					updateBudgetFixedUnitAndTotalByQuantity(entity, value);
					if (dataService.getModule().name === 'procurement.package') {
						entity.QuantityRemainingUi = value - entity.QuantityDeliveredUi;
					}

					let originalValue = entity[field];
					entity[field] = value;

					resetExtraAndCalculateTotal(entity, true, true)
						.then(function () {
							entity[field] = originalValue;
							defer.resolve(result);
						});
					return defer.promise;
				};

				service.asyncValidateAlternativeQuantity = function asyncValidateAlternativeQuantity(entity, value) {
					let defer = $q.defer();
					var quantity = conversionQuantity(entity, entity.AlternativeUomFk, null, value);
					service.asyncValidateQuantity(entity, quantity, 'Quantity', undefined, false, true)
						.then(function () {
							entity.Quantity = quantity;
							defer.resolve(true);
						});
					return defer.promise;
				};

				service.validateNewQuantity = function validateNewQuantity(entity, value/* , field */) {
					var validateResult = {
						apply: true,
						valid: true
					};
					if (entity.Quantity < value || value < entity.MinQuantity) {
						validateResult.apply = true;
						validateResult.valid = false;
						validateResult.error = $translate.instant('cloud.common.newQuantityValidateErrorMessage', {
							currentQty: entity.Quantity,
							minQty: entity.MinQuantity
						});
					}
					return validateResult;
				};

				service.validateMdcTaxCodeFk = function (entity, value) {
					entity.IsInputTotal = false;
					var TaxCodes = lookupDescriptorService.getData('TaxCode');
					var taxCode = _.find(TaxCodes, {Id: value});
					var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					if (taxCode) {
						entity.MdcTaxCodeFk = value;
					} else {
						entity.MdcTaxCodeFk = null;
					}
					if (isCalculateOverGross) {
						dataService.setNetValuesAfterChangeVatPrecent([entity]);
					} else {
						dataService.setGross(isCalculateOverGross, [entity], false, false, true);
					}
					dataService.fireItemModified(entity);
					return true;
				};

				service.validatePriceGross = function (entity, value, model) {
					if (value === null) {
						return true;
					}
					entity.IsInputTotal = false;
					entity.PriceGross = value;
					setPricePriceOcPriceGrossPriceGrossOc(entity, value, model);
					var dontReCalcuPricGrossOc = true;
					var isResetGross = true;
					resetExtraAndCalculateTotal(entity, isResetGross, dontReCalcuPricGrossOc);
					updateDiscountAbsoluteReadOnly(entity);
					return true;
				};

				service.validatePriceGrossOc = function (entity, value, model) {
					if (value === null) {
						return true;
					}
					entity.IsInputTotal = false;
					entity.PriceGrossOc = value;
					setPricePriceOcPriceGrossPriceGrossOc(entity, value, model);
					var dontReCalcuPricGrossOc = true;
					var isResetGross = true;
					resetExtraAndCalculateTotal(entity, isResetGross, dontReCalcuPricGrossOc);
					updateDiscountAbsoluteReadOnly(entity);
					return true;
				};

				service.asyncValidateMdcControllingunitFk = function (entity, value, model) {

					var defer = $q.defer();
					var result = {
						apply: true,
						valid: true
					};
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					if (null === value || undefined === value) {
						defer.resolve(true);
					} else {
						if (dataService.getModule().name === 'procurement.pes' || dataService.getModule().name === 'procurement.invoice') {
							var ProjectFk = entity.ProjectFk;
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
						} else {
							{
								defer.resolve(true);
							}
						}
						asyncMarker.myPromise = defer.promise;
					}
					asyncMarker.myPromise = defer.promise.then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});
					return asyncMarker.myPromise;
				};

				service.validateMdcControllingunitFk = function (entity, value/* , model */) {
					entity.MdcControllingunitFk = value;
					dataService.updatePrjStockReadOnly(entity);
				};

				service.validateBasItemType85Fk = function (entity, value, model) {
					if (angular.isFunction(dataService.updateReadOnly)) {
						entity[model] = value;
						var quoteRequistion = 'procurement.quote.requisition',
							priceComparisonQuoteRequisition = 'procurement.pricecomparison.quote.requisition',
							quote = 'procurement.quote',
							priceComparisonQuote = 'procurement.pricecomparison.quote',
							moduleName = moduleContext.getMainService().name;
						var isModuleNameQuoteRequisition = (moduleName === quoteRequistion || moduleName === priceComparisonQuoteRequisition),
							isModuleNameQuote = moduleName === quote || moduleName === priceComparisonQuote;
						if (isModuleNameQuote || isModuleNameQuoteRequisition) {
							dataService.doProcessItem(entity);
						}
					}
					return true;
				};

				service.asyncValidatePlantFk = function (entity, value) {
					var defer = $q.defer();
					var moduleName = moduleContext.getMainService().name;
					var title = $translate.instant('procurement.common.takeOverFromPlantDialogTitle');
					if (moduleName === 'procurement.contract' && value && entity.PlantFk !== value) {
						bulkModifyPlants.push({
							entity: entity,
							value: value
						});
						if (bulkModifyPlants.length === 1) {
							return platformModalService.showYesNoDialog(title, title)
								.then(function (result) {
									if (result.yes) {
										var plants = lookupDescriptorService.getData('equipmentPlant');
										if (plants) {
											bulkModifyPlants.forEach(function (e) {
												var plant = _.find(plants, {Id: e.value});
												if (plant) {
													e.entity.Description1 = plant.DescriptionInfo.Translated ? plant.DescriptionInfo.Translated : e.entity.Description1;
													if (plant.ProcurementStructureFk && plant.ProcurementStructureFk !== e.entity.PrcStructureFk) {
														e.entity.PrcStructureFk = plant.ProcurementStructureFk;
														platformRuntimeDataService.applyValidationResult({
															apply: true,
															valid: true
														}, e.entity, 'PrcStructureFk');
														platformDataValidationService.finishValidation({
															apply: true,
															valid: true
														}, e.entity, plant.ProcurementStructureFk, 'PrcStructureFk', service, dataService);
													}

													if (plant.UoMFk && plant.UoMFk !== e.entity.BasUomFk) {
														e.entity.BasUomFk = plant.UoMFk;
														platformRuntimeDataService.applyValidationResult({
															apply: true,
															valid: true
														}, e.entity, 'BasUomFk');
														platformDataValidationService.finishValidation({
															apply: true,
															valid: true
														}, e.entity, plant.UoMFk, 'BasUomFk', service, dataService);
													}
													$http.post(globals.webApiBaseUrl + 'resource/equipment/controllingUnit/listByParent', {PKey1: plant.Id}).then(
														function (response) {
															if (response.data && response.data.length) {
																e.entity.MdcControllingunitFk = response.data[0].ControllingUnitFk;
																platformDataValidationService.finishValidation({
																	apply: true,
																	valid: true
																}, e.entity, e.entity.MdcControllingunitFk, 'MdcControllingunitFk', service, dataService);
															}
															dataService.markItemAsModified(e.entity);
															defer.resolve(true);
														});
												} else {
													defer.resolve(true);
												}
											});
										}
									} else {
										defer.resolve(true);
									}
								})
								.finally(function () {
									bulkModifyPlants = [];
								});
						} else {
							defer.resolve(true);
							return defer.promise;
						}
					} else {
						defer.resolve(true);
						return defer.promise;
					}
				};

				service.validateQuoteItemno = function validateQuoteItemno(entity, value, model) {
					var validateResult = {
						apply: true,
						valid: true
					};
					var parentService = dataService.parentDataService;
					if (parentService && parentService.name === 'procurement.quote.requisition') {
						var result = dataService.validateQuoteItemNoFromReq(entity.Itemno);
						if (!result) {
							validateResult.apply = false;
							validateResult.valid = false;
							validateResult.error = $translate.instant('procurement.common.prcItemNotMatchError');

						}
					}
					platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);

					return validateResult;
				};

				service.validateBudgetFixedUnit = function validateBudgetFixedUnit(entity, value) {
					let moduleName = moduleContext.getMainService().name;
					if (!_.includes([procurementModuleName.packageModule, procurementModuleName.requisitionModule], moduleName)) {
						return true;
					}
					if (value) {
						entity.BudgetFixedTotal = false;
						service.validateBudgetFixedTotal(entity, entity.BudgetFixedTotal);
						platformRuntimeDataService.readonly(entity, [{field: 'BudgetPerUnit', readonly: false}]);
					} else {
						platformRuntimeDataService.readonly(entity, [{field: 'BudgetPerUnit', readonly: true}]);
					}
				};

				service.validateBudgetFixedTotal = function validateBudgetFixedTotal(entity, value) {
					let moduleName = moduleContext.getMainService().name;
					if (!_.includes([procurementModuleName.packageModule, procurementModuleName.requisitionModule], moduleName)) {
						return true;
					}
					if (value) {
						entity.BudgetFixedUnit = false;
						service.validateBudgetFixedUnit(entity, entity.BudgetFixedUnit);
						platformRuntimeDataService.readonly(entity, [{field: 'BudgetTotal', readonly: false}]);
					} else {
						platformRuntimeDataService.readonly(entity, [{field: 'BudgetTotal', readonly: true}]);
					}
				};

				service.validateBudgetPerUnit = function validateBudgetPerUnit(entity, value) {
					if (value || value === 0) {
						entity.BudgetTotal = itemCalculationHelper.round(roundingType.BudgetTotal, math.bignumber(value).mul(entity.Quantity));
					}
				};

				service.validateBudgetTotal = function validateBudgetTotal(entity, value) {
					if ((value || value === 0) && entity.Quantity !== 0) {
						entity.BudgetPerUnit = itemCalculationHelper.round(roundingType.BudgetPerUnit, math.bignumber(value).div(entity.Quantity));
					}
				};

				service.validateTotalGross = function validateTotalGross(entity, value) {
					var mainService = moduleContext.getMainService();
					var moduleName = mainService.name;
					var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					if (moduleName !== 'procurement.contract' || !isOverGross) {
						return true;
					}
					entity.IsInputTotal = true;
					var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.MdcTaxCodeFk);
					var headerItem = dataService.getSelectedPrcHeader();
					var rate = headerItem.ExchangeRate;
					if (value === null) {
						value = 0;
					}
					entity.TotalGross = value;
					entity.Total = itemCalculationHelper.getTotalByTotalGross(entity, vatPercent);
					entity.TotalGrossOc = itemCalculationHelper.getTotalGrossOcByTotalGross(entity, rate);
					entity.TotalOc = itemCalculationHelper.getTotalOcByTotalGrossOc(entity, vatPercent);

					entity.TotalPriceGross = itemCalculationHelper.getTotalPriceGrossByTotalGross(entity, null, null);
					entity.PrcPriceConditionFk = null;
					entity.PriceExtra = 0;
					entity.PriceExtraOc = 0;
					entity.PriceGross = itemCalculationHelper.getPriceGrossByTotalPriceGross(entity, vatPercent);
					entity.TotalPrice = itemCalculationHelper.getTotalPrice(entity, vatPercent);
					entity.FactoredTotalPrice = itemCalculationHelper.getFactoredTotalPrice(entity);
					entity.Price = itemCalculationHelper.getPrice(entity, vatPercent);
					entity.TotalPriceGrossOc = itemCalculationHelper.getTotalPriceOCGrossByTotalGrossOc(entity, null, null);
					entity.PriceGrossOc = itemCalculationHelper.getPriceGrossOcByTotalPriceGrossOc(entity, vatPercent);
					entity.TotalPriceOc = itemCalculationHelper.getTotalPriceOc(entity, vatPercent);
					entity.PriceOc = itemCalculationHelper.getPriceOc(entity, vatPercent);
					entity.TotalNoDiscount = itemCalculationHelper.getTotalNoDiscountByTotalGross(entity, vatPercent);
					entity.TotalCurrencyNoDiscount = itemCalculationHelper.getTotalOcNoDiscountByTotalGrossOc(entity, vatPercent);
				};

				service.validateTotalGrossOc = function validateTotalGrossOc(entity, value) {
					var mainService = moduleContext.getMainService();
					var moduleName = mainService.name;
					var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					if (moduleName !== 'procurement.contract' || !isOverGross) {
						return true;
					}
					entity.IsInputTotal = true;
					var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.MdcTaxCodeFk);
					var headerItem = dataService.getSelectedPrcHeader();
					var rate = headerItem.ExchangeRate;
					if (value === null) {
						value = 0;
					}
					entity.TotalGrossOc = value;
					entity.TotalOc = itemCalculationHelper.getTotalOcByTotalGrossOc(entity, vatPercent);
					entity.TotalGross = itemCalculationHelper.getTotalGrossByTotalGrossOc(entity, rate);
					entity.Total = itemCalculationHelper.getTotalByTotalGross(entity, vatPercent);

					entity.TotalPriceGrossOc = itemCalculationHelper.getTotalPriceOCGrossByTotalGrossOc(entity, null, null);
					entity.PrcPriceConditionFk = null;
					entity.PriceExtra = 0;
					entity.PriceExtraOc = 0;
					entity.PriceGrossOc = itemCalculationHelper.getPriceGrossOcByTotalPriceGrossOc(entity, vatPercent);
					entity.TotalPriceOc = itemCalculationHelper.getTotalPriceOc(entity, vatPercent);
					entity.PriceOc = itemCalculationHelper.getPriceOc(entity, vatPercent);
					entity.TotalPriceGross = itemCalculationHelper.getTotalPriceGrossByTotalGross(entity, null, null);
					entity.PriceGross = itemCalculationHelper.getPriceGrossByTotalPriceGross(entity, vatPercent);
					entity.TotalPrice = itemCalculationHelper.getTotalPrice(entity, vatPercent);
					entity.FactoredTotalPrice = itemCalculationHelper.getFactoredTotalPrice(entity);
					entity.Price = itemCalculationHelper.getPrice(entity, vatPercent);
					entity.TotalNoDiscount = itemCalculationHelper.getTotalNoDiscountByTotalGross(entity, vatPercent);
					entity.TotalCurrencyNoDiscount = itemCalculationHelper.getTotalOcNoDiscountByTotalGrossOc(entity, vatPercent);
				};

				if (serviceName) {
					serviceCache[serviceName] = service;
				}

				service.checkContractItemReadOnly = function checkContractItemReadOnly(parentService, items) {
					var mainService = moduleContext.getMainService();
					var moduleName = mainService.name;
					if (moduleName !== 'procurement.contract') {
						return;
					}
					var parentSelect = parentService.getSelected();
					if (parentSelect) {
						var conHeaderFk = parentSelect.ContractHeaderFk;
						if (conHeaderFk) {
							$http({
								method: 'GET',
								url: globals.webApiBaseUrl + 'procurement/common/prcitem/getprcitemsbyheader',
								params: {
									conHeaderFk: conHeaderFk
								}
							}).then(function (response) {
								if (response && response.data) {
									var parentPreviousItems = response.data;
									angular.forEach(items, function (item) {
										var existingItem = parentPreviousItems.findIndex(function (o) {
											return o.Id !== item.Id && o.Itemno.toString().toLowerCase() === item.Itemno.toString().toLowerCase();
										});
										var isRead = true;
										var fields = ['Price', 'PriceOc', 'PriceGross', 'PriceGrossOc', 'PriceUnit', 'BasUomPriceUnitFk', 'PrcPriceConditionFk', 'MdcTaxCodeFk'];
										var readonlyArr = [];
										if (existingItem !== -1) {
											fields = fields.concat(['MdcMaterialFk', 'PrcStructureFk', 'BasUomFk', 'AlternativeUomFk', 'Description1', 'Description2']);
											if (!parentSelect.ProjectChangeFk || angular.isUndefined(parentSelect.ProjectChangeFk)) {
												var parentItem = _.find(parentPreviousItems, function (o) {
													return o.Id !== item.Id && o.Itemno.toString().toLowerCase() === item.Itemno.toString().toLowerCase();
												});
												setPriceIsChangeField(parentItem, item);
												dataService.gridRefresh();
											}
										} else if (!moduleContext.isReadOnly) {
											isRead = false;
										}
										angular.forEach(fields, function (field) {
											readonlyArr.push({field: field, readonly: isRead});
										});
										platformRuntimeDataService.readonly(item, readonlyArr);
									});
								}
							});
						}
					}
				};

				service.asyncValidateNotSubmitted = function asyncValidateNotSubmitted(entity, value, model) {
					return asyncValidateAskBeforeValidating(entity, value, model, 'procurement.common.askDeletePrice', 'procurement.common.askDeletePrice', true);
				};

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

				service.validateMdcMaterialFkForBulkConfig = function validateMdcMaterialFkForBulkConfig(){
					return true;
				};

				service.asyncValidateMdcMaterialFkForBulkConfig = function asyncValidateMdcMaterialFkForBulkConfig(entity, value) {
					var mainService = moduleContext.getMainService();
					var moduleName = mainService.name;
					entity.IsInputTotal = false;
					var promises = [];
					var promise1 = lookupService.getItemByKey('MaterialCommodity', value);
					promises.push(promise1);
					if ('procurement.contract' === moduleName) {
						var _parentItem = dataService.parentDataService.getSelected();
						if (_parentItem && _parentItem.ConHeaderFk !== null && _parentItem.ConHeaderFk !== undefined) {
							var promise2 = $http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/listbyconheaderid?conHeaderId=' + _parentItem.ConHeaderFk);
							promises.push(promise2);
						}
					}

					return $q.all(promises).then(function (response) {
						updateItemByMaterial2(entity,value,response[0],response[1]);
						dataService.markItemAsModified(entity);
						setBulkPriceConditionInformation(entity, entity.PrcPriceConditionFk);
						return $q.when(true);
					});
				};

				function updateItemByMaterial2(entity, value, materialItem, sameBasicPrcItem) {
					if (materialItem) {
						var headerItem = dataService.getSelectedPrcHeader();
						var parentItem = dataService.parentDataService.getSelected();
						var exchangeRate = headerItem.ExchangeRate;
						lookupDescriptorService.updateData('MaterialCommodity', [materialItem]);
						var materialSearchVItem = angular.copy(lookupDescriptorService.getLookupItem('MaterialCommodity', value));
						var priceList = basicsMaterialPriceListLookupDataService.getPriceList(materialSearchVItem);
						const docCurrencyFk = headerItem.CurrencyFk || headerItem.BasCurrencyFk;

						if (sameBasicPrcItem && sameBasicPrcItem.data) {
							sameBasicPrcItem = _.find(sameBasicPrcItem.data, {MdcMaterialFk: value});
						}
						entity.MdcMaterialFk = value;
						entity.MaterialExternalCode = materialItem.ExternalCode;
						entity.MaterialCatalogCode = materialItem.CatalogCode;
						entity.MaterialCatalogDescription = materialItem.CatalogDescriptionInfo ? materialItem.CatalogDescriptionInfo.Translated : null;
						entity.MaterialCatalogTypeFk = materialItem.MaterialCatalogTypeFk;
						entity.MaterialCatalogSupplier = materialItem.MaterialCatalogSupplier;
						entity.Description1 = materialItem.DescriptionInfo.Translated || materialItem.DescriptionInfo.Description;
						entity.Description2 = materialItem.DescriptionInfo2.Translated || materialItem.DescriptionInfo2.Description;
						entity.PriceUnit = itemCalculationHelper.round(roundingType.PriceUnit, materialItem.PriceUnit);
						entity.BasUomFk = materialItem.BasUomFk;
						entity.BasUomPriceUnitFk = materialItem.BasUomPriceUnitFk;
						const factorPriceUnit = materialItem.FactorPriceUnit ? materialItem.FactorPriceUnit : 1;
						entity.FactorPriceUnit = itemCalculationHelper.round(roundingType.FactorPriceUnit, factorPriceUnit);
						entity.PrcStructureFk = materialItem.PrcStructureFk;
						entity.Material2Uoms = materialItem.Material2Uoms;

						entity.MaterialStockFk = materialItem.MaterialStockFk;
						entity.AlternativeUomFk = materialItem.MaterialStock2UomFk || materialItem.BasUomFk;
						entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, entity.Quantity, null);// entity.AlternativeQuantity

						if (!_.isNil(priceList.Co2Project)) {
							entity.Co2Project = priceList.Co2Project;
							entity.Co2Source = priceList.Co2Source;
							entity.Co2ProjectTotal = (entity.Co2Project * entity.Quantity).toFixed(3);
							entity.Co2SourceTotal = (entity.Co2Source * entity.Quantity).toFixed(3);
						}
						if (sameBasicPrcItem !== null && sameBasicPrcItem !== undefined) {
							entity.SellUnit = sameBasicPrcItem.SellUnit;
							entity.MinQuantity = sameBasicPrcItem.MinQuantity;
							entity.LeadTime = sameBasicPrcItem.LeadTime;
						} else {
							entity.SellUnit = priceList.SellUnit;
							entity.MinQuantity = priceList.MinQuantity;
							entity.LeadTime = priceList.LeadTime;
						}

						entity.LeadTimeExtra = 0;
						entity.TotalLeadTime = angular.isFunction(dataService.parentDataService.calculateTLeadTime) ?
							dataService.parentDataService.calculateTLeadTime(entity, entity.LeadTime) :
							(entity.LeadTime + entity.SafetyLeadTime + entity.LeadTimeExtra);
						var Specification = materialItem.SpecificationInfo.Translated || materialItem.SpecificationInfo.Description;
						if (typeof Specification === 'string') {
							entity.Specification = Specification.replace(/<[^>]+>/g, '').replace(/(&nbsp;)/g, '');
						}
						updatePriceFieldsAfterUpdateMaterial(priceList, exchangeRate, docCurrencyFk, headerItem.ProjectFk);
						if (sameBasicPrcItem !== undefined && sameBasicPrcItem !== null) {
							if (sameBasicPrcItem.BasUomFk) {
								entity.BasUomFk = sameBasicPrcItem.BasUomFk;
							}
							entity.MaterialStockFk = sameBasicPrcItem.MaterialStockFk;
							entity.AlternativeUomFk = sameBasicPrcItem.MaterialStock2UomFk || sameBasicPrcItem.BasUomFk;
							// fixed issue:106771
							const factorPriceUnit = sameBasicPrcItem.FactorPriceUnit ? sameBasicPrcItem.FactorPriceUnit : 1;
							entity.FactorPriceUnit = itemCalculationHelper.round(roundingType.FactorPriceUnit, factorPriceUnit);
							entity.PriceUnit = itemCalculationHelper.round(roundingType.PriceUnit, sameBasicPrcItem.PriceUnit);
							entity.BasUomPriceUnitFk = sameBasicPrcItem.BasUomPriceUnitFk;
							entity.PrcPriceConditionFk = sameBasicPrcItem.PrcPriceConditionFk;
						}else {
							entity.PrcPriceConditionFk = priceList.PrcPriceConditionFk;
						}
						if (parentItem !== null) {
							if (parentItem.PaymentTermFiFk) {
								entity.BasPaymentTermFiFk = parentItem.PaymentTermFiFk;
							}

							if (parentItem.BasPaymentTermFiFk) {
								entity.BasPaymentTermFiFk = parentItem.BasPaymentTermFiFk;
							}

							if (parentItem.PaymentTermPaFk) {
								entity.BasPaymentTermPaFk = parentItem.PaymentTermPaFk;
							}

							if (parentItem.BasPaymentTermPaFk) {
								entity.BasPaymentTermPaFk = parentItem.BasPaymentTermPaFk;
							}

							if (parentItem.IncotermFk) {
								entity.PrcIncotermFk = parentItem.IncotermFk;
							}

							if (parentItem.MaterialCatalogFk) {
								dataService.setColumnsReadOnly(entity, true);
							}
						}
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
				function setBulkPriceConditionInformation(entity, value){
					let headerService = dataService.parentService();
					let module = priceConditionService.moduleName;
					let projectFk = -1, headerId = -1, exchangeRate = 1;
					if (headerService) {
						if (module === 'procurement.package') {
							headerId = headerService.getSelected().PackageFk;
							projectFk = headerService.getSelected().ProjectFk;
						} else if (module === 'procurement.quote.requisition') {
							headerId = headerService.getSelected().QtnHeaderFk;
							projectFk = headerService.getSelected().ProjectFk;
						} else if (module === 'procurement.pes') {
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
					let parentItemName = dataService.getItemName();
					let parentItem2Save = null;
					let itemInfo = null;
					if (module === 'procurement.requisition' || module === 'procurement.contract') {
						parentItem2Save = parentElemState[parentItemName + 'ToSave'];
					} else if (module === 'procurement.package' && parentElemState.PrcPackage2HeaderToSave) {
						let prcPackage2HeaderToSave = _.find(parentElemState.PrcPackage2HeaderToSave, {MainItemId: headerService.getSelected().Id});
						parentItem2Save = prcPackage2HeaderToSave && prcPackage2HeaderToSave.PrcItemToSave ? prcPackage2HeaderToSave.PrcItemToSave : null;
					} else if ((module === 'procurement.quote' || module === 'procurement.quote.requisition')  && parentElemState.QtnRequisitionToSave) {
						let qtnRequisitionToSave = _.find(parentElemState.QtnRequisitionToSave, {MainItemId: headerService.getSelected().Id});
						parentItem2Save = qtnRequisitionToSave && qtnRequisitionToSave.PrcItemToSave ? qtnRequisitionToSave.PrcItemToSave : null;
					}
					if (parentItem2Save) {
						itemInfo = _.find(parentItem2Save, {PrcItem: {Id: entity.Id}});
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
							if (priceConditionService.data && priceConditionService.data.cache) {
								delete priceConditionService.data.cache[entity.Id];
							}
						}
					}
				}

				// endregion

				service.validatePrjChangeFk = function validatePrjChangeFk(entity, value) {
					entity.PrjChangeFk = value;
					var prcItemPrjChangeService = procurementItemProjectChangeService.getService(moduleContext.getMainService(),dataService);
					prcItemPrjChangeService.UpdateChangedInfo(entity);
					return true;
				};

				service.validateSpecification=function validateSpecification(entity,value){
					dataService.onSpecificationChanged.fire(value);
				};

				service.validateCharge = generateChargeValidation('Charge');
				service.validateChargeOc = generateChargeValidation('ChargeOc');

				service.updateDiscountAndAbsoluteAfterOneChanged = updateDiscountAndAbsoluteAfterOneChanged;

				return service;

				function conversionQuantity(entity, uom, quantity, alterAtiveQuantity) {
					const material2Uoms = entity.Material2Uoms || (typeof dataService?.getMaterialUomCache === 'function' ? dataService.getMaterialUomCache()[entity.Id] : []);
					var uomItem = _.find(material2Uoms, {UomFk: uom}), value = 1;
					if (uomItem) {
						value = uomItem.Quantity;
					}
					if (!_.isNil(quantity)) {
						return itemCalculationHelper.round(roundingType.Quantity, math.bignumber(quantity).mul(value));// entity.AlternativeQuantity
					}
					if (!_.isNil(alterAtiveQuantity)) {
						return value === 0 ? 0 : itemCalculationHelper.round(roundingType.Quantity, math.bignumber(alterAtiveQuantity).div(value));// entity.Quantity
					}
					return 0;
				}

				function updateDiscountAbsoluteReadOnly(entity) {
					if (angular.isFunction(dataService.updateReadOnly)) {
						_.forEach(dataService.DiscountAbsoluteFields, function(field) {
							dataService.updateReadOnly(entity, field);
						});
					}
				}

				function updateBudgetFixedUnitAndTotalByQuantity(entity, quantity) {
					if (moduleName !== procurementModuleName.packageModule && entity.BudgetFixedTotal) {
						return true;
					}
					if (entity.BudgetFixedUnit) {
						entity.BudgetTotal = itemCalculationHelper.round(roundingType.BudgetTotal, math.bignumber(quantity).mul(entity.BudgetPerUnit));
					} else if (entity.BudgetFixedTotal && quantity !== 0) {
						entity.BudgetPerUnit = itemCalculationHelper.round(roundingType.BudgetPerUnit, math.bignumber(entity.BudgetTotal).div(quantity));
					} else {
						entity.BudgetTotal = itemCalculationHelper.round(roundingType.BudgetTotal, math.bignumber(quantity).mul(entity.BudgetPerUnit));
					}
				}

				function setPricePriceOcPriceGrossPriceGrossOc(entity, value, model, exchangeRate) {
					var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					var headerItem = dataService.getSelectedPrcHeader();
					var rate = exchangeRate ? exchangeRate : headerItem.ExchangeRate;
					var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.MdcTaxCodeFk);
					let itemObj = {};
					itemObj[model] = value;
					switch (model) {
						case 'Price': {
							entity.PriceOc = itemCalculationHelper.getPriceOcByExchangeRate(itemObj, rate);
							entity.PriceGross = itemCalculationHelper.getPriceGross(itemObj, vatPercent);
							entity.PriceGrossOc = isOverGross ?
								itemCalculationHelper.getPriceGrossOcByPriceGross(entity, rate) :
								itemCalculationHelper.getPriceGrossOc(entity, vatPercent);
							break;
						}
						case 'PriceOc': {
							entity.Price = itemCalculationHelper.getPriceByPriceOc(itemObj, rate);
							entity.PriceGrossOc = itemCalculationHelper.getPriceGrossOc(itemObj, vatPercent);
							entity.PriceGross = isOverGross ?
								itemCalculationHelper.getPriceGrossByPriceGrossOc(entity, rate) :
								itemCalculationHelper.getPriceGross(entity, vatPercent);
							break;
						}
						case 'PriceGross': {
							entity.Price = itemCalculationHelper.getPrice(itemObj, vatPercent);
							entity.PriceGrossOc = itemCalculationHelper.getPriceGrossOcByPriceGross(itemObj, rate);
							entity.PriceOc = isOverGross ?
								itemCalculationHelper.getPriceOc(entity, vatPercent) :
								itemCalculationHelper.getPriceOcByExchangeRate(entity, rate);
							break;
						}
						case 'PriceGrossOc': {
							entity.PriceGross = itemCalculationHelper.getPriceGrossByPriceGrossOc(itemObj, rate);
							entity.PriceOc = itemCalculationHelper.getPriceOc(itemObj, vatPercent);
							entity.Price = isOverGross ?
								itemCalculationHelper.getPrice(entity, vatPercent) :
								itemCalculationHelper.getPriceByPriceOc(entity, rate);
							break;
						}
						default: {
							break;
						}
					}
					updateDiscountAfterPriceChanged(entity, isOverGross);
					if (value > 0){
						entity.NotSubmitted = false;
					}
				}

				function updateDiscountAfterPriceChanged(entity) {
					let model = 'Discount';
					if (entity.PriceOc === 0 && entity.DiscountAbsoluteOc !== 0) {
						let validateResult = {apply: false, valid: false};
						validateResult.error = 'price has no value, discount should no value';
						platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
						platformDataValidationService.finishValidation(validateResult, entity, entity[model], model, service, dataService);
						return true;
					}
					entity.Discount = itemCalculationHelper.getDiscount(entity);
					validateDiscountAfterSetPrice(entity, entity.Discount, model);
				}

				function updateDiscountAndAbsoluteAfterOneChanged(entity, value, model, exchangeRate) {
					if (value === 0) {
						entity.Discount = 0;
						entity.DiscountAbsolute = 0;
						entity.DiscountAbsoluteOc = 0;
						entity.DiscountAbsoluteGross = 0;
						entity.DiscountAbsoluteGrossOc = 0;
						return true;
					}
					let vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.MdcTaxCodeFk);
					entity[model] = value;
					if (model === 'Discount') {
						entity.DiscountAbsolute = itemCalculationHelper.getDiscountAbsolute(entity);
						entity.DiscountAbsoluteOc = itemCalculationHelper.getDiscountAbsoluteOc(entity);
						entity.DiscountAbsoluteGross = itemCalculationHelper.getDiscountAbsoluteGrossByPriceGross(entity);
						entity.DiscountAbsoluteGrossOc = itemCalculationHelper.getDiscountAbsoluteGrossOcByPriceGrossOc(entity);
						return true;
					}

					let isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					let headerItem = dataService.getSelectedPrcHeader();
					let rate = exchangeRate ? exchangeRate : (headerItem.ExchangeRate ? headerItem.ExchangeRate : 1);
					switch (model) {
						case 'DiscountAbsolute': {
							entity.DiscountAbsoluteOc = itemCalculationHelper.getDiscountAbsoluteOcByDA(entity, rate);
							entity.DiscountAbsoluteGross = itemCalculationHelper.getDiscountAbsoluteGrossByDA(entity, vatPercent);
							entity.DiscountAbsoluteGrossOc = isOverGross ?
								itemCalculationHelper.getDiscountAbsoluteGrossOcByGross(entity, rate) :
								itemCalculationHelper.getDiscountAbsoluteGrossOcByOc(entity, vatPercent);
							break;
						}
						case 'DiscountAbsoluteOc': {
							entity.DiscountAbsolute = itemCalculationHelper.getDiscountAbsoluteByOc(entity, rate);
							entity.DiscountAbsoluteGrossOc = itemCalculationHelper.getDiscountAbsoluteGrossOcByOc(entity, vatPercent);
							entity.DiscountAbsoluteGross = isOverGross ?
								itemCalculationHelper.getDiscountAbsoluteGrossByGrossOc(entity, rate) :
								itemCalculationHelper.getDiscountAbsoluteGrossByDA(entity, vatPercent);
							break;
						}
						case 'DiscountAbsoluteGross': {
							entity.DiscountAbsolute = itemCalculationHelper.getDiscountAbsoluteByGross(entity, vatPercent);
							entity.DiscountAbsoluteGrossOc = itemCalculationHelper.getDiscountAbsoluteGrossOcByGross(entity, rate);
							entity.DiscountAbsoluteOc = isOverGross ?
								itemCalculationHelper.getDiscountAbsoluteOcByGrossOc(entity, vatPercent) :
								itemCalculationHelper.getDiscountAbsoluteOcByDA(entity, rate);
							break;
						}
						case 'DiscountAbsoluteGrossOc': {
							entity.DiscountAbsoluteGross = itemCalculationHelper.getDiscountAbsoluteGrossByGrossOc(entity, rate);
							entity.DiscountAbsoluteOc = itemCalculationHelper.getDiscountAbsoluteOcByGrossOc(entity, vatPercent);
							entity.DiscountAbsolute = isOverGross ?
								itemCalculationHelper.getDiscountAbsoluteByGross(entity, vatPercent) :
								itemCalculationHelper.getDiscountAbsoluteByOc(entity, rate);
							break;
						}
						default: {
							break;
						}
					}
					entity.Discount = entity.DiscountAbsoluteOc === 0 ? 0 : itemCalculationHelper.getDiscount(entity);
				}

				function setPriceIsChangeField(parentItem, item) {
					item.IsChangePrice = false;
					item.IsChangePriceOc = false;
					item.IsChangePriceGross = false;
					item.IsChangePriceGrossOc = false;
					if (parentItem.Price !== item.Price) {
						item.IsChangePrice = true;
					}
					if (parentItem.PriceOc !== item.PriceOc) {
						item.IsChangePriceOc = true;
					}
					if (parentItem.PriceGross !== item.PriceGross) {
						item.IsChangePriceGross = true;
					}
					if (parentItem.PriceGrossOc !== item.PriceGrossOc) {
						item.IsChangePriceGrossOc = true;
					}
				}

				function setContractGrandQuantityAndTotalCallOffQuantity(entity, oldQuantity, newQuantity) {
					if (moduleName === 'procurement.contract' &&
						Object.prototype.hasOwnProperty.call(entity, 'ContractGrandQuantity') &&
						Object.prototype.hasOwnProperty.call(entity, 'TotalCallOffQuantity')) {
						var parentItem = dataService.parentDataService.getSelected();
						var prcItemStatuss = lookupDescriptorService.getData('prcitemstatus');
						var conStatuss = lookupDescriptorService.getData('ConStatus');
						var currentParentStatus = _.find(conStatuss, {Id: parentItem.ConStatusFk});
						var currentItemStatus = _.find(prcItemStatuss, {Id: entity.PrcItemstatusFk});
						if (currentParentStatus && !currentParentStatus.Iscanceled && !currentParentStatus.IsVirtual && !currentItemStatus.IsCanceled) {
							if (!parentItem.ConHeaderFk || contractHeaderPurchaseOrdersDataService.isChangeOrder(parentItem)) {
								entity.ContractGrandQuantity = entity.ContractGrandQuantity - oldQuantity + newQuantity;
								entity.RemainingQuantityForCallOff = entity.ContractGrandQuantity - entity.TotalCallOffQuantity;
							} else if (contractHeaderPurchaseOrdersDataService.isCallOff(parentItem)) {
								entity.TotalCallOffQuantity = entity.TotalCallOffQuantity - oldQuantity + newQuantity;
								entity.RemainingQuantityForCallOff = entity.ContractGrandQuantity - entity.TotalCallOffQuantity;
							}
						}
					}
				}

				function asyncValidateAskBeforeValidating(entity, value, model, dialogMessage, dialogTitle, useTemporaryProperty) {
					let returnPromise = $q.when(true);
					let platformModalService = $injector.get('platformModalService');
					let doValidate = _.isBoolean(value) ? value : true;
					entity['Reset_' + model] = undefined;

					if (doValidate) {
						let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
						asyncMarker.myPromise = platformModalService.showYesNoDialog(dialogMessage, dialogTitle).then(function (response) {
							if (response.yes) {
								entity.Price = 0;
								entity.IsInputTotal = false;
								setPricePriceOcPriceGrossPriceGrossOc(entity, 0, 'Price');
								let dontReCalcuPricGrossOc = true;
								let isResetGross = true;
								resetExtraAndCalculateTotal(entity, isResetGross, dontReCalcuPricGrossOc);
								updateDiscountAbsoluteReadOnly(entity);
								entity.OrginalPrcItem = null;
								dataService.fireItemModified(entity);
								return platformDataValidationService.finishAsyncValidation({
									valid: true,
									apply: true,
									error: '...',
									error$tr$: '',
									error$tr$param: {}
								}, entity, value, model, asyncMarker, service, dataService);
							} else {
								// Add temporary property to entity to trigger resetting to false
								entity['Reset_' + model] = true;
								dataService.fireItemModified(entity);
								return platformDataValidationService.finishAsyncValidation({
									valid: true,
									apply: false,
									error: '...',
									error$tr$: '',
									error$tr$param: {}
								}, entity, value, model, asyncMarker, service, dataService);
							}
						},
						function () {
							dataService.fireItemModified(entity);
							return platformDataValidationService.finishAsyncValidation({
								valid: true,
								apply: true,
								error: '...',
								error$tr$: '',
								error$tr$param: {}
							}, entity, value, model, asyncMarker, service, dataService);
						});

						returnPromise = asyncMarker.myPromise;
					}

					if (!useTemporaryProperty) {
						delete entity['Reset_' + model];
					}

					return returnPromise;
				}

				function validateItemTypeFn(value,entity,isFromValidate) {
					if(!isFromValidate) {
						if (entity.BasItemTypeFk === value && value === 7) {
							let columns = Object.keys(entity);
							_.forEach(columns, (item) => {
								if (item === 'Itemno' || item === 'Description1' || item === 'Description2' || item === 'Specification' || item === 'Userdefined1'
									|| item === 'Userdefined2' || item === 'Userdefined3' || item === 'Userdefined4' || item === 'Userdefined5') {
									platformRuntimeDataService.readonly(entity, [{field: item, readonly: false}]);
								} else {
									platformRuntimeDataService.readonly(entity, [{field: item, readonly: true}]);
								}
							});
							let dynamicColumns = dataService.dynamicColumns;
							if (!_.isNil(dynamicColumns)) {
								_.forEach(dynamicColumns, (column) => {
									platformRuntimeDataService.readonly(entity, [{field: column.model, readonly: true}]);
								});
							}
							$injector.get('procurementCommonPriceConditionService').getService().updateToolsEvent.fire();
							$injector.get('procurementCommonDeliveryScheduleDataService').getService(moduleContext.getItemDataService()).updateToolsEvent.fire();
							$injector.get('prcItemScopeDetailPriceConditionDataService').getService().updateToolsEvent.fire();
							var prcItemService = moduleContext.getItemDataService();
							var scopeService = $injector.get('prcItemScopeDataService').getService(prcItemService);
							$injector.get('prcItemScopeDataService').getService(prcItemService).updateToolsEvent.fire();
							var scopeDetailService = $injector.get('prcItemScopeDetailDataService').getService(scopeService);
							scopeDetailService.updateToolsEvent.fire();
							$injector.get('prcItemScopeItemTextDataService').getService(scopeDetailService).updateToolsEvent.fire();
							$injector.get('procurementCommonItemTextNewDataService').getService().updateToolsEvent.fire();
						}
					}else{
						entity.BasItemTypeFk = value;
						if (value === 7) {
							let columns = Object.keys(entity);
							_.forEach(columns, (item) => {
								if (item === 'Itemno' || item === 'Description1' || item === 'Description2' || item === 'Specification' || item === 'Userdefined1'
									|| item === 'Userdefined2'|| item === 'Userdefined3'|| item === 'Userdefined4'|| item === 'Userdefined5') {
									platformRuntimeDataService.readonly(entity, [{field: item, readonly: false}]);
								} else {
									platformRuntimeDataService.readonly(entity, [{field: item, readonly: true}]);
								}
							});
							let dynamicColumns = dataService.dynamicColumns;
							if (!_.isNil(dynamicColumns)) {
								_.forEach(dynamicColumns, (column) => {
									platformRuntimeDataService.readonly(entity, [{field: column.model, readonly: true}]);
								});
							}
							entity.BasItemType2Fk = 1;
							entity.BasUomFk = 0;
							entity.BasUomPriceUnitFk = 0;
							entity.AlternativeUomFk = 0;
							entity.AlternativeQuantity = 0;
							entity.SellUnit = 0;
							entity.Quantity = 0;
							entity.Price = 0;
							entity.PriceOc = 0;
							entity.PriceGross = 0;
							entity.PriceGrossOc = 0;
							entity.Total = 0;
							entity.TotalOc = 0;
							entity.TotalGross = 0;
							entity.TotalGrossOc = 0;
							entity.TotalPrice = 0;
							entity.TotalPriceOc = 0;
							entity.TotalPriceGross = 0;
							entity.TotalPriceGrossOc = 0;
							entity.FactorPriceUnit = 0;
							entity.QuantityRemaining = 0;
							entity.QuantityRemainingUi = 0;
							entity.QuantityConverted = 0;
							entity.PriceExtra = 0;
							entity.PriceExtraOc = 0;
							entity.Discount = 0;
							entity.DiscountAbsolute = 0;
							entity.DiscountAbsoluteGross = 0;
							entity.DiscountAbsoluteGrossOc = 0;
							entity.DiscountAbsoluteOc = 0;
							entity.DiscountSplit = 0;
							entity.DiscountSplitOc = 0;
							entity.TotalNoDiscount = 0;
							entity.TotalCurrencyNoDiscount = 0;
							entity.QuantityConfirm = 0;
							dataService.fireItemModified(entity);
							service.validateBasUomFk(entity, entity.BasUomFk, 'BasUomFk');
							$injector.get('procurementCommonPriceConditionService').getService().updateToolsEvent.fire();
							$injector.get('procurementCommonDeliveryScheduleDataService').getService(moduleContext.getItemDataService()).updateToolsEvent.fire();
							$injector.get('prcItemScopeDetailPriceConditionDataService').getService().updateToolsEvent.fire();
							var prcItemService = moduleContext.getItemDataService();
							var scopeService = $injector.get('prcItemScopeDataService').getService(prcItemService);
							$injector.get('prcItemScopeDetailDataService').getService(scopeService).updateToolsEvent.fire();
							$injector.get('prcItemScopeDataService').getService(prcItemService).updateToolsEvent.fire();
							var scopeDetailService = $injector.get('prcItemScopeDetailDataService').getService(scopeService);
							scopeDetailService.updateToolsEvent.fire();
							$injector.get('prcItemScopeItemTextDataService').getService(scopeDetailService).updateToolsEvent.fire();
							$injector.get('procurementCommonItemTextNewDataService').getService().updateToolsEvent.fire();
						} else {
							if (value === 2) {
								entity.TotalNoDiscount = 0;
								entity.TotalCurrencyNoDiscount = 0;
								entity.Total = 0;
								entity.TotalOc = 0;
								entity.TotalGross = 0;
								entity.TotalGrossOc = 0;
								dataService.fireItemModified(entity);
							} else {
								resetExtraAndCalculateTotal(entity);
							}
						}
					}
				}

				function resetTaxCode(taxCodeFk, entity) {
					service.validateMdcTaxCodeFk(entity, taxCodeFk);
					resetExtraAndCalculateTotal(entity);
					dataService.fireItemModified(entity);
				}

				function getValidateDiscount(updateDiscountAbsolute) {
					return function(entity, value, model) {
						if (value === null) {
							return true;
						}
						var validateResult = {
							apply: true,
							valid: true
						};

						if (value < 0 || value > 100) {
							validateResult.apply = false;
							validateResult.valid = false;
							validateResult.error = $translate.instant('procurement.common.discountRangeError');
							platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
							platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
							return validateResult;
						}

						entity.Discount = value;
						// TODO yew 2020-11-26 it is error to dto when entity.Discount is null
						if (!entity.Discount) {
							entity.Discount = 0;
						}
						if (updateDiscountAbsolute) {
							updateDiscountAndAbsoluteAfterOneChanged(entity, value, model);
							totalRecalculateValidator(entity, true, true);
						}
						platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
						platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					}
				}

				function generateChargeValidation(model) {
					return function(entity, value) {
						const headerItem = dataService.getSelectedPrcHeader();
						value = value ?? 0;
						if (headerItem) {
							entity.ChargeOc = model === 'ChargeOc' ?
								value :
								itemCalculationHelper.getUnitRateOcByNonOc(value, headerItem.ExchangeRate);
							entity.Charge = model === 'Charge' ?
								value :
								headerItem.ExchangeRate === 0 ? 0 : itemCalculationHelper.getUnitRateNonOcByOc(value, headerItem.ExchangeRate);
							dataService.calculateTotal(entity, true, false, true);
							entity.Discount = itemCalculationHelper.getDiscount(entity);
						}
						return true;
					}
				}

				/**
				 * update fields after update material
				 */
				function updatePriceFieldsAfterUpdateMaterial(entity, priceList, exchangeRate, docCurrencyFk, headerProjectFk) {
					const defer = $q.defer();
					const setPriceChargeDefer = $q.defer();

					// if home currency(A) equal as material currency(C)
					// price list currency may be null, if null operate just like equal
					if (moduleContext.companyCurrencyId === priceList.BasCurrencyFk || !priceList.BasCurrencyFk) {
						entity.Price = itemCalculationHelper.round(roundingType.Price, priceList.ListPrice);
						setPricePriceOcPriceGrossPriceGrossOc(entity, entity.Price, 'Price', exchangeRate);
						entity.Charge = itemCalculationHelper.round(roundingType.Charge, priceList.Charges);
						entity.ChargeOc = itemCalculationHelper.getUnitRateOcByNonOc(entity.Charge, exchangeRate);
						setPriceChargeDefer.resolve(true);
					} else {
						getForeignToDocExchangeRate(docCurrencyFk, priceList.BasCurrencyFk, headerProjectFk).then(function (res) {
							const rate = res.data;
							entity.PriceOc = rate === 0 ? 0 : itemCalculationHelper.getOcByMaterial2ItemRate(priceList.ListPrice, rate);
							setPricePriceOcPriceGrossPriceGrossOc(entity, entity.PriceOc, 'PriceOc', exchangeRate);
							entity.ChargeOc = rate === 0 ? 0 : itemCalculationHelper.getOcByMaterial2ItemRate(priceList.Charges, rate);
							entity.Charge = exchangeRate === 0 ? 0 : itemCalculationHelper.getUnitRateNonOcByOc(entity.ChargeOc, exchangeRate);
							setPriceChargeDefer.resolve(true);
						});
					}

					setPriceChargeDefer.promise.then(function() {
						entity.Discount = priceList.Discount;
						updateDiscountAbsoluteReadOnly(entity);
						updateDiscountAndAbsoluteAfterOneChanged(entity, priceList.Discount, 'Discount');
						resetExtraAndCalculateTotal(entity, true, false).then(function () {
							defer.resolve(true);
						});
					});

					return defer.promise;
				}
			};
		}
	]);
})(angular);
