(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_,math */
	var modelName = 'procurement.common';
	angular.module(modelName).factory('prcCommonItemCalculationHelperService', [
		'prcCommonCalculationHelper',
		'basicsLookupdataLookupDescriptorService',
		'procurementModuleName',
		'prcGetIsCalculateOverGrossService',
		'basicsCommonRoundingService',
		'procurementCommonConstantValues',
		function (
			prcCommonCalculationHelper,
			lookupDescriptorService,
			procurementModuleName,
			prcGetIsCalculateOverGrossService,
			roundingService,
			constantService
		) {
			let service = {};
			let basRoundingDataService = roundingService.getService('basics.material');
			let isOverGross = false;
			let roundingType = basRoundingDataService.getFieldsRoundType();
			let basRoundingType = basRoundingDataService.getBasRoundType();
			let contractRoundingMethod = constantService.contractRoundingMethod;
			const formula = generateFormula();

			prcGetIsCalculateOverGrossService.getIsCalculateOverGrossPromise().then(function (d) {
				isOverGross = d;
			});
			service.roundingType = roundingType;
			service.basRoundingType = basRoundingType;
			service.round = round;

			service.getItemCalculateHelper = function (prcItem) {
				var helper = {};
				var prcItemEntity = prcItem;
				helper.isOptionalItem = function () {
					return service.isOptionalItem(prcItemEntity);
				};
				helper.isNonAwardedAlternativeWithinAlternativeGroupItem = function () {
					return service.isNonAwardedAlternativeWithinAlternativeGroupItem(prcItemEntity);
				};

				helper.isOptionalItem = function () {
					return service.isOptionalItem(prcItemEntity);
				};

				helper.isNonAwardedAlternativeWithinAlternativeGroupItem = function (configuration) {
					return service.isNonAwardedAlternativeWithinAlternativeGroupItem(prcItemEntity, configuration);
				};

				helper.getTotalNoDiscount = function () {
					return service.getTotalNoDiscount(prcItemEntity);
				};

				helper.getTotalOcNoDiscount = function (exchangeRate) {
					return service.getTotalOcNoDiscount(prcItemEntity, exchangeRate);
				};

				helper.getTotal = function () {
					return service.getTotal(prcItemEntity);
				};

				helper.getTotalOc = function () {
					return service.getTotalOc(prcItemEntity);
				};

				helper.getTotalPrice = function () {
					return service.getTotalPrice(prcItemEntity);
				};

				// no using
				/* helper.getTotalPriceOcByExchangeRate = function (exchangeRate) {
					return service.getTotalPriceOcByExchangeRate(prcItemEntity, exchangeRate);
				}; */

				helper.getTotalPriceOc = function () {
					return service.getTotalPriceOc(prcItemEntity);
				};

				helper.getDiscountAbsolute = function () {
					return service.getDiscountAbsolute(prcItemEntity);
				};
				return helper;
			};
			service.isOptionalItem = function (prcItem, configuration) {
				var ItemTypeName = 'ItemTypeFk';
				if (configuration && configuration.ItemTypeFkFieldName) {
					ItemTypeName = configuration.ItemTypeFkFieldName;
				}
				return prcItem[ItemTypeName] === 2;
			};
			service.isNonAwardedAlternativeWithinAlternativeGroupItem = function (prcItem, configuration) {
				var itemType2Name = 'ItemType2Fk';
				if (configuration && configuration.ItemType2FkFieldName) {
					itemType2Name = configuration.ItemType2FkFieldName;
				}

				return prcItem[itemType2Name] === 3 || prcItem[itemType2Name] === 5;
			};
			service.isOptionalOrAlternativeItem = function (prcItem, configuration) {
				return service.isOptionalItem(prcItem, configuration) || service.isNonAwardedAlternativeWithinAlternativeGroupItem(prcItem, configuration);
			};

			service.getTotalNoDiscount = function (item, vatPercent) {
				if (item.PriceUnit === 0) {
					return 0;
				}
				if (item.Discount === 0 && item.DiscountSplit === 0) {
					return item.Total;
				}
				if (isOverGross) {
					return service.getTotalNoDiscountByTotalGross(item, vatPercent);
				}
				return round(roundingType.TotalNoDiscount, formula.totalNoDiscount(item));
			};

			service.getTotalNoDiscountByTotalGross = function (item, vatPercent) {
				let vp = getVatPercent(vatPercent);
				const charge = item.Charge ?? 0;
				if (item.Discount === 100) {
					return round(roundingType.TotalNoDiscount, mathBignumber(item.PriceGross).div(vp).add(item.PriceExtra).add(charge).mul(item.Quantity));
				}
				let discountTotalGross = getDiscountTotalByDiscountAbsoluteGross(item);
				return round(roundingType.TotalNoDiscount, mathBignumber(item.TotalGross).add(item.DiscountSplit).add(discountTotalGross).div(vp));
			};

			service.getTotalOcNoDiscount = function (item, vatPercent) {
				if (item.PriceUnit === 0) {
					return 0;
				}
				if (item.Discount === 0 && item.DiscountSplitOc === 0) {
					return item.TotalOc;
				}
				if (isOverGross) {
					return service.getTotalOcNoDiscountByTotalGrossOc(item, vatPercent);
				}
				return round(roundingType.TotalOcNoDiscount, formula.totalOcNoDiscount(item));
			};

			service.getTotalOcNoDiscountByTotalGrossOc = function (item, vatPercent) {
				var vp = getVatPercent(vatPercent);
				const chargeOc = item.ChargeOc ?? 0;
				if (item.Discount === 100) {
					return round(roundingType.TotalOcNoDiscount, mathBignumber(getPriceGrossOc(item)).div(vp).add(item.PriceExtraOc).add(chargeOc).mul(item.Quantity));
				}
				let discountTotalGrossOc = getDiscountTotalByDiscountAbsoluteGrossOc(item);
				return round(roundingType.TotalOcNoDiscount, mathBignumber(getTotalGrossOc(item)).add(item.DiscountSplitOc).add(discountTotalGrossOc).div(vp));
			};

			service.getTotal = function (item, vatPercent, priceUnit, factor) {
				if (item.PriceUnit === 0) {
					return 0;
				}
				if (isOverGross) {
					var vp = getVatPercent(vatPercent);
					if (vp === 1) {
						return item.TotalGross;
					}
					return round(roundingType.Total, mathBignumber(item.TotalGross).div(vp));
				}
				var pu = getPriceUnit(item, priceUnit);
				var factorPriceUnit = getFactorPriceUnit(item, factor);
				return round(roundingType.Total, mathBignumber(item.TotalPrice).mul(item.Quantity).div(pu).mul(factorPriceUnit).sub(item.DiscountSplit));
			};

			service.getTotalByTotalGross = function (item, vatPercent) {
				let vp = getVatPercent(vatPercent);
				if (vp === 1) {
					return item.TotalGross;
				}
				return round(roundingType.Total, mathBignumber(item.TotalGross).div(vp));
			};

			service.getTotalOc = function (item, vatPercent, priceUnit, factor) {
				if (item.PriceUnit === 0) {
					return 0;
				}
				if (isOverGross) {
					var vp = getVatPercent(vatPercent);
					if (vp === 1) {
						return getTotalGrossOc(item);
					}
					return round(roundingType.TotalOc, mathBignumber(getTotalGrossOc(item)).div(vp));
				}
				var pu = getPriceUnit(item, priceUnit);
				var factorPriceUnit = getFactorPriceUnit(item, factor);
				return round(roundingType.TotalOc, mathBignumber(item.TotalPriceOc).mul(item.Quantity).div(pu).mul(factorPriceUnit).sub(item.DiscountSplitOc));
			};

			service.getTotalOcByTotalGrossOc = function (item, vatPercent) {
				let vp = getVatPercent(vatPercent);
				if (vp === 1) {
					return getTotalGrossOc(item);
				}
				return round(roundingType.TotalOc, mathBignumber(getTotalGrossOc(item)).div(vp));
			};

			service.getTotalPrice = function (item, vatPercent) {
				if (isOverGross) {
					var vp = getVatPercent(vatPercent);
					if (vp === 1) {
						return item.TotalPriceGross;
					}
					return round(roundingType.TotalPrice, mathBignumber(item.TotalPriceGross).div(vp));
				}
				return round(roundingType.TotalPrice, formula.totalPrice(item));
			};

			service.getFactoredTotalPrice = function (item) {
				return round(roundingType.TotalPrice, formula.totalPrice(item).div(item.PriceUnit));
			};

			service.getTotalPriceByTotalPriceOc = function (item, exchangeRate) {
				if (item && item.TotalPriceOc) {
					let rate = (exchangeRate && exchangeRate !== 0) ? exchangeRate : 1;
					if (rate === 1) {
						return item.TotalPriceOc;
					}
					return round(roundingType.TotalPrice, mathBignumber(item.TotalPriceOc).div(rate));
				} else {
					return 0;
				}
			};

			service.getTotalPriceNoDiscount = function (prcItem) {
				return round(roundingType.TotalPrice, formula.totalPriceNoDiscount(prcItem));
			};

			service.getTotalPriceOcNoDiscount = function (prcItem) {
				return round(roundingType.TotalPriceOc, formula.totalPriceOcNoDiscount(prcItem));
			};

			service.getTotalPriceGrossNoDiscount = function (prcItem, vatPercent) {
				return doRound(roundingType.TotalPriceGross, formula.totalPriceGrossNoDiscount(prcItem, vatPercent));
			}

			service.getTotalPriceGrossOcNoDiscount = function (prcItem, vatPercent) {
				return doRound(roundingType.TotalPriceGrossOc, formula.totalPriceGrossOcNoDiscount(prcItem, vatPercent));
			}

			service.getTotalPriceOc = function (item, vatPercent) {
				if (isOverGross) {
					var vp = getVatPercent(vatPercent);
					if (vp === 1) {
						return getTotalPriceGrossOc(item);
					}
					return round(roundingType.TotalPriceOc, mathBignumber(getTotalPriceGrossOc(item)).div(vp));
				}
				return round(roundingType.TotalPriceOc, formula.totalPriceOc(item));
			};

			service.getDiscountAbsolute = function (prcItem) {
				return doRound(roundingType.NoType, mathBignumber(prcItem.Price).mul(prcItem.Discount).div(100), 7);
			};

			service.getDiscountAbsoluteOc = function (prcItem) {
				return doRound(roundingType.NoType, mathBignumber(prcItem.PriceOc).mul(prcItem.Discount).div(100), 7);
			};

			service.getDiscountAbsoluteByOc = function (prcItem, exchangeRate, dontRounding) {
				let rate = exchangeRate ? exchangeRate : 1;
				let valueObj = mathBignumber(prcItem.DiscountAbsoluteOc).div(rate);
				if (dontRounding) {
					return valueObj.toNumber();
				}
				return doRound(roundingType.NoType, mathBignumber(prcItem.DiscountAbsoluteOc).div(rate), 7);
			};

			service.getDiscountAbsoluteByGross = function (prcItem, vatPercent) {
				let vp = getVatPercent(vatPercent);
				return doRound(roundingType.NoType, mathBignumber(prcItem.DiscountAbsoluteGross).div(vp), 7);
			};

			service.getDiscountAbsoluteOcByDA = function (prcItem, exchangeRate) {
				let rate = exchangeRate ? exchangeRate : 1;
				return doRound(roundingType.NoType, mathBignumber(prcItem.DiscountAbsolute).mul(rate), 7);
			};

			service.getDiscountAbsoluteOcByGrossOc = function (prcItem, vatPercent, dontRounding) {
				let vp = getVatPercent(vatPercent);
				let valueObj = mathBignumber(prcItem.DiscountAbsoluteGrossOc).div(vp);
				if (dontRounding) {
					return valueObj.toNumber();
				}
				return doRound(roundingType.NoType, mathBignumber(prcItem.DiscountAbsoluteGrossOc).div(vp), 7);
			};

			service.getDiscountAbsoluteGrossByDA = function (prcItem, vatPercent) {
				let vp = getVatPercent(vatPercent);
				return doRound(roundingType.NoType, mathBignumber(prcItem.DiscountAbsolute).mul(vp), 7);
			};

			service.getDiscountAbsoluteGrossByPriceGross = function (prcItem) {
				return doRound(roundingType.NoType, mathBignumber(prcItem.PriceGross).mul(prcItem.Discount).div(100), 7);
			}

			service.getDiscountAbsoluteGrossByGrossOc = function (prcItem, exchangeRate, dontRounding) {
				let rate = exchangeRate ? exchangeRate : 1;
				var valueObj = mathBignumber(prcItem.DiscountAbsoluteGrossOc).div(rate);
				if (dontRounding) {
					return valueObj.toNumber();
				}
				return doRound(roundingType.NoType, mathBignumber(prcItem.DiscountAbsoluteGrossOc).div(rate), 7);
			};

			service.getDiscountAbsoluteGrossOcByGross = function (prcItem, exchangeRate) {
				let rate = exchangeRate ? exchangeRate : 1;
				return doRound(roundingType.NoType, mathBignumber(prcItem.DiscountAbsoluteGross).mul(rate), 7);
			};

			service.getDiscountAbsoluteGrossOcByOc = function (prcItem, vatPercent, dontRounding) {
				let vp = getVatPercent(vatPercent);
				let valueObj = mathBignumber(prcItem.DiscountAbsoluteOc).mul(vp);
				if (dontRounding) {
					return valueObj.toNumber();
				}
				return doRound(roundingType.NoType, mathBignumber(prcItem.DiscountAbsoluteOc).mul(vp), 7);
			};

			service.getDiscountAbsoluteGrossOcByPriceGrossOc = function (prcItem) {
				const priceGrossOc = getPriceGrossOc(prcItem);
				return doRound(roundingType.NoType, mathBignumber(priceGrossOc).mul(prcItem.Discount).div(100), 7);
			}

			service.getDiscount = function (prcItem) {
				if (prcItem.PriceOc !== 0) {
					return round(roundingType.NoType, mathBignumber(prcItem.DiscountAbsoluteOc).div(prcItem.PriceOc).mul(100));
				}
				return 0;
			};

			service.setTotalFieldsZeroIfOptionalOrAlternativeItem = function (prcItem) {
				if (service.isOptionalItem(prcItem) || service.isNonAwardedAlternativeWithinAlternativeGroupItem(prcItem)) {
					prcItem.Total = 0;
					prcItem.TotalOc = 0;
					prcItem.TotalNoDiscount = 0;
					prcItem.TotalCurrencyNoDiscount = 0;
					prcItem.TotalGross = 0;
					setTotalGrossOc(prcItem, 0);
					return true;
				} else {
					return false;
				}
			};

			service.getPriceExtraByExchangeRate = function (prcItem, exchangeRate) {
				if (prcItem && prcItem.PriceExtraOc) {
					let rate = (exchangeRate && exchangeRate !== 0) ? exchangeRate : 1;
					if (rate === 1) {
						return prcItem.PriceExtraOc;
					}
					prcItem.PriceExtra = round(roundingType.PriceExtra, mathBignumber(prcItem.PriceExtraOc).div(rate));
					return prcItem.PriceExtra;
				} else {
					prcItem.PriceExtra = 0;
					return 0;
				}
			};

			service.getPriceExtraOcByExchangeRate = function (prcItem, exchangeRate) {
				if (prcItem && prcItem.PriceExtra) {
					prcItem.PriceExtraOc = round(roundingType.PriceExtraOc, mathBignumber(prcItem.PriceExtra).mul(exchangeRate));
					return prcItem.PriceExtraOc;
				} else {
					prcItem.PriceExtraOc = 0;
					return 0;
				}
			};

			service.getTotalPriceGross = function (item, vatPercent, exchangeRate) {
				var vp = getVatPercent(vatPercent);
				if (isOverGross) {
					var rate = (exchangeRate && exchangeRate !== 0) ? exchangeRate : 1;
					if (rate === 1) {
						return getTotalPriceGrossOc(item);
					}
					let valueObj = formula.totalPriceGross(item, vatPercent);
					return round(roundingType.TotalPriceGross, valueObj);
				}
				return round(roundingType.TotalPriceGross, mathBignumber(item.TotalPrice).mul(vp));
			};

			service.getTotalPriceGrossByTotalPriceGrossOc = function (item, vatPercent, exchangeRate) {
				if (item && getTotalPriceGrossOc(item)) {
					let rate = (exchangeRate && exchangeRate !== 0) ? exchangeRate : 1;
					if (rate === 1) {
						return getTotalPriceGrossOc(item);
					}
					return round(roundingType.TotalPriceGross, mathBignumber(getTotalPriceGrossOc(item)).div(rate));
				} else {
					return 0;
				}
			};

			service.getTotalPriceGrossByTotalGross = function (item, priceUnit, factor) {
				var pu = getPriceUnit(item, priceUnit);
				var f = getFactorPriceUnit(item, factor);
				if (!item.Quantity) {
					return 0;
				}
				return round(roundingType.TotalPriceGross, mathBignumber(item.TotalGross).add(item.DiscountSplit).div(item.Quantity).mul(pu).div(f));
			};

			service.getTotalPriceOCGross = function (item, vatPercent) {
				var vp = getVatPercent(vatPercent);
				if (isOverGross) {
					let valueObj = formula.totalPriceGrossOc(item, vatPercent);
					return round(roundingType.TotalPriceGrossOc, valueObj);
				}
				return round(roundingType.TotalPriceGrossOc, mathBignumber(item.TotalPriceOc).mul(vp));
			};

			service.getTotalPriceOCGrossByTotalGrossOc = function (item, priceUnit, factor) {
				var pu = getPriceUnit(item, priceUnit);
				var factorPriceUnit = getFactorPriceUnit(item, factor);
				if (!item.Quantity) {
					return 0;
				}
				return round(roundingType.TotalPriceGrossOc, mathBignumber(getTotalGrossOc(item)).add(item.DiscountSplitOc).div(item.Quantity).mul(pu).div(factorPriceUnit));
			};

			service.getTotalGross = function (item, vatPercent, exchangeRate, priceUnit, factor) {
				if (item.PriceUnit === 0) {
					return 0;
				}
				if (isOverGross) {
					let rate = (exchangeRate && exchangeRate !== 0) ? exchangeRate : 1;
					if (rate === 1) {
						return getTotalGrossOc(item);
					}
					let pu = getPriceUnit(item, priceUnit);
					let factorPriceUnit = getFactorPriceUnit(item, factor);
					return round(roundingType.TotalGrossOc, mathBignumber(item.TotalPriceGross).mul(item.Quantity).div(pu).mul(factorPriceUnit).sub(item.DiscountSplit));
				}
				let vp = getVatPercent(vatPercent);
				if (vp === 1) {
					return item.Total;
				}
				return round(roundingType.TotalGross, mathBignumber(item.Total).mul(vp));
			};

			service.getTotalGrossByTotalGrossOc = function (item, exchangeRate) {
				var rate = (exchangeRate && exchangeRate !== 0) ? exchangeRate : 1;
				if (rate === 1) {
					return getTotalGrossOc(item);
				}
				return round(roundingType.TotalGross, mathBignumber(getTotalGrossOc(item)).div(rate));
			};

			service.getTotalGrossByTotalPriceGross = function (entity, vatPercent) {
				if (entity.PriceUnit !== 0) {
					let vp = getVatPercent(vatPercent);
					let discountSplitGross = mathBignumber(entity.DiscountSplit).mul(vp);
					return round(roundingType.TotalGross, mathBignumber(entity.TotalPriceGross).mul(entity.Quantity).div(entity.PriceUnit).mul(entity.FactorPriceUnit).sub(discountSplitGross));
				} else {
					return 0;
				}
			};

			service.getTotalGrossOc = function (item, vatPercent, priceUnit, factor) {
				if (item.PriceUnit === 0) {
					return 0;
				}
				if (isOverGross) {
					var pu = getPriceUnit(item, priceUnit);
					var factorPriceUnit = getFactorPriceUnit(item, factor);
					return round(roundingType.TotalGrossOc, mathBignumber(getTotalPriceGrossOc(item)).mul(item.Quantity).div(pu).mul(factorPriceUnit).sub(item.DiscountSplitOc));
				}
				var vp = getVatPercent(vatPercent);
				if (vp === 1) {
					return item.TotalOc;
				}
				return round(roundingType.TotalGrossOc, mathBignumber(item.TotalOc).mul(vp));
			};

			service.getTotalGrossOcByTotalPriceGrossOc = function (entity, vatPercent) {
				if (entity.PriceUnit !== 0) {
					let vp = getVatPercent(vatPercent);
					let discountSplitOcGross = mathBignumber(entity.DiscountSplitOc).mul(vp);
					return round(roundingType.TotalGrossOc, mathBignumber(getTotalPriceGrossOc(entity)).mul(entity.Quantity).div(entity.PriceUnit).mul(entity.FactorPriceUnit).sub(discountSplitOcGross));
				} else {
					return 0;
				}
			};

			service.getTotalGrossOcByTotalGross = function (entity, exchangeRate) {
				let rate = (exchangeRate && exchangeRate !== 0) ? exchangeRate : 1;
				if (rate === 1) {
					return entity.TotalGross;
				}
				return round(roundingType.TotalGrossOc, mathBignumber(entity.TotalGross).mul(rate));
			};

			service.getPriceFromTotalGross = function (totalGross, quantity, priceExtra, vatPercent, discount, priceUnit, factorPriceUnit, discountSplit) {
				var d = getDecimalDiscount(discount),
					vp = getVatPercent(vatPercent);
				if (vp !== 0 && d !== 0 && quantity !== 0 && factorPriceUnit !== 0) {
					return round(roundingType.Price, mathBignumber(totalGross).div(vp).add(discountSplit).div(factorPriceUnit).mul(priceUnit).div(quantity).div(d).sub(priceExtra));
				}
				return 0;
			};

			service.getPriceFromTotalOcGross = function (totalGross, quantity, priceOcExtra, vatPercent, discount, priceUnit, factorPriceUnit, discountSplitOc, exchangeRate) {
				var d = getDecimalDiscount(discount),
					vp = getVatPercent(vatPercent);
				var price = 0;
				if (vp !== 0 && d !== 0 && quantity !== 0 && factorPriceUnit !== 0) {
					price = round(roundingType.Price, mathBignumber(totalGross).div(vp).add(discountSplitOc).div(factorPriceUnit).mul(priceUnit).div(quantity).div(d).sub(priceOcExtra).div(exchangeRate));
				}
				return price;
			};

			service.getPriceFromTotal = function (prcItem, value, priceExtra) {
				var d = getDecimalDiscount(prcItem.Discount);
				if (d !== 0 && prcItem.FactorPriceUnit !== 0 && prcItem.Quantity !== 0) {
					return round(roundingType.Price, mathBignumber(value).add(prcItem.DiscountSplit).div(prcItem.FactorPriceUnit).mul(prcItem.PriceUnit).div(prcItem.Quantity).div(d).sub(priceExtra));
				}
				return 0;
			};

			service.getPriceFromTotalOc = function (prcItem, value, priceOcExtra, exchangeRate) {
				var d = getDecimalDiscount(prcItem.Discount);
				if (d !== 0 && prcItem.FactorPriceUnit !== 0 && prcItem.Quantity !== 0) {
					return round(roundingType.Price, mathBignumber(value).add(prcItem.DiscountSplitOc).div(prcItem.FactorPriceUnit).mul(prcItem.PriceUnit).div(prcItem.Quantity).div(d).sub(priceOcExtra).div(exchangeRate));
				}
				return 0;
			};

			service.getPriceFromTotalNoDiscount = function (prcItem, value, priceExtra) { // not need to consider discountSplit
				if (prcItem.FactorPriceUnit !== 0 && prcItem.Quantity !== 0) {
					return round(roundingType.Price, mathBignumber(value).div(prcItem.FactorPriceUnit).mul(prcItem.PriceUnit).div(prcItem.Quantity).sub(priceExtra));
				}
				return 0;
			};

			service.getPriceFromTotalOcNoDiscount = function (prcItem, value, priceOcExtra, exchangeRate) {  // not need to consider discountSplit
				if (prcItem.FactorPriceUnit !== 0 && prcItem.Quantity !== 0) {
					return round(roundingType.Price, mathBignumber(value).div(prcItem.FactorPriceUnit).mul(prcItem.PriceUnit).div(prcItem.Quantity).sub(priceOcExtra).div(exchangeRate));
				}
				return 0;
			};

			service.getPrice = function (item, vatPercent) {
				let vp = getVatPercent(vatPercent);
				if (vp === 1) {
					return item.PriceGross;
				}
				return round(roundingType.Price, mathBignumber(item.PriceGross).div(vp));
			};

			service.getPriceByMdcCost = function (cost, priceExtra) {
				return round(roundingType.Price, mathBignumber(cost).sub(priceExtra));
			};

			service.getPriceByPriceOc = function (item, exchangeRate) {
				var rate = (exchangeRate && exchangeRate !== 0) ? exchangeRate : 1;
				if (rate === 1) {
					return item.PriceOc;
				}
				return round(roundingType.Price, mathBignumber(item.PriceOc).div(rate));
			};

			service.getPriceOc = function (item, vatPercent) {
				let vp = getVatPercent(vatPercent);
				if (vp === 1) {
					return getPriceGrossOc(item);
				}
				return round(roundingType.PriceOc, mathBignumber(getPriceGrossOc(item)).div(vp));
			};

			service.getPriceOcByMdcCost = function (cost, priceExtra, rate) {
				return round(roundingType.PriceOc, mathBignumber(cost).sub(priceExtra).div(rate));
			};

			service.getOcByMaterial2ItemRate = function (mdcValue, material2ItemRate) {
				return round(basRoundingType.UnitRate, mathBignumber(mdcValue).div(material2ItemRate));
			};

			service.getPriceOcByPriceGross = function (item, vatPercent, exchangeRate) {
				let vp = getVatPercent(vatPercent);
				let rate = (exchangeRate && exchangeRate !== 0) ? exchangeRate : 1;
				if (vp === 1 && vp === 1) {
					return item.PriceGross;
				}
				return round(roundingType.PriceOc, mathBignumber(item.PriceGross).mul(rate).div(vp));
			};

			service.getPriceOcByTotalGross = function (item, vatPercent, exchangeRate) {
				let vp = getVatPercent(vatPercent);
				let rate = (exchangeRate && exchangeRate !== 0) ? exchangeRate : 1;
				if (!item.Quantity) {
					return 0;
				}
				return round(roundingType.PriceOc, mathBignumber(item.TotalGross).mul(rate).div(item.Quantity).div(vp));
			};

			service.getPriceOcByTotalGrossOc = function (item, vatPercent) {
				let vp = getVatPercent(vatPercent);
				if (!item.Quantity) {
					return 0;
				}
				return round(roundingType.PriceOc, mathBignumber(item.TotalGross).div(item.Quantity).div(vp));
			};

			service.getPriceOcByExchangeRate = function (prcItem, exchangeRate) {
				if (prcItem && prcItem.Price) {
					prcItem.PriceOc = round(roundingType.PriceOc, mathBignumber(prcItem.Price).mul(exchangeRate));
					return prcItem.PriceOc;
				} else {
					prcItem.PriceOc = 0;
					return 0;
				}
			};

			service.getPriceGross = function (item, vatPercent) {
				let vp = getVatPercent(vatPercent);
				if (vp === 1) {
					return item.Price;
				}
				return round(roundingType.PriceGross, mathBignumber(item.Price).mul(vp));
			};

			service.getPriceGrossByPriceGrossOc = function (item, exchangeRate) {
				var rate = (exchangeRate && exchangeRate !== 0) ? exchangeRate : 1;
				if (rate === 1) {
					return getPriceGrossOc(item);
				}
				return round(roundingType.PriceGross, mathBignumber(getPriceGrossOc(item)).div(rate));
			};

			service.getPriceGrossByTotalPriceGross = function (item, vatPercent) {
				if (item.Discount === 100) {
					return service.getPriceGross(item, vatPercent);
				}
				return round(roundingType.PriceGross, this.formula.priceGrossByTotalPriceGross(item, vatPercent));
			};

			service.getPriceGrossOc = function (item, vatPercent) {
				let vp = getVatPercent(vatPercent);
				if (vp === 1) {
					return item.PriceOc;
				}
				return round(roundingType.PriceGrossOc, mathBignumber(item.PriceOc).mul(vp));
			};

			service.getPriceGrossOcByPriceGross = function (item, exchangeRate) {
				let rate = (exchangeRate && exchangeRate !== 0) ? exchangeRate : 1;
				if (rate === 1) {
					return item.PriceGross;
				}
				return round(roundingType.PriceGrossOc, mathBignumber(item.PriceGross).mul(rate));
			};

			service.getPriceGrossOcByTotalPriceGrossOc = function (item, vatPercent) {
				if (item.Discount === 100) {
					return service.getPriceGrossOc(item, vatPercent);
				}
				return round(roundingType.PriceGrossOc, this.formula.priceGrossOcByTotalPriceGrossOc(item, vatPercent));
			};

			service.getTotalGrossForInv = function (price, quantity, priceExtra, discount, vatPercent, priceUnit, factorPriceUnit, discountSplit, totalGrossOc, exchangeRate, constant) {
				if (priceUnit !== 0) {
					if (isOverGross) {
						var rate = (exchangeRate && exchangeRate !== 0) ? exchangeRate : 1;
						if (rate === 1) {
							return totalGrossOc;
						}
						return round(roundingType.TotalGross, mathBignumber(totalGrossOc).div(rate), constant);
					} else {
						let d = getDecimalDiscount(discount);
						var netTotal = mathBignumber(price).add(priceExtra).mul(quantity).mul(d).div(priceUnit).mul(factorPriceUnit).sub(discountSplit);
						var vat = mathBignumber(netTotal).mul(vatPercent).div(100);
						var totalGross = mathBignumber(netTotal).add(vat);
						return round(roundingType.TotalGross, totalGross, constant);
					}
				} else {
					return 0;
				}
			};

			service.getTotalGrossOcForInv = function (priceOc, quantity, priceExtraOc, discount, vatPercent, priceUnit, factorPriceUnit, discountSplitOc, constant) {
				if (priceUnit !== 0) {
					let d = getDecimalDiscount(discount);
					var netTotalOc = mathBignumber(priceOc).add(priceExtraOc).mul(quantity).mul(d).div(priceUnit).mul(factorPriceUnit).sub(discountSplitOc);
					var vatOc = mathBignumber(netTotalOc).mul(vatPercent).div(100);
					return round(roundingType.TotalGrossOc, mathBignumber(netTotalOc).add(vatOc), constant);
				} else {
					return 0;

				}
			};

			service.getTotalValueForInv = function (item, vatPercent, constant) {
				if (item.PriceUnit === 0) {
					return 0;
				}
				if (isOverGross) {
					var vp = getVatPercent(vatPercent);
					if (vp === 1) {
						return item.TotalValueGross;
					}
					return round(roundingType.TotalValue, mathBignumber(item.TotalValueGross).div(vp), constant);
				}
				if (item.PrcItemFk) {
					return round(roundingType.TotalValue, mathBignumber(item.Quantity).mul(item.Price).sub(item.DiscountSplit), constant);
				} else {
					return round(roundingType.TotalValue, mathBignumber(item.Quantity).mul(item.Price), constant);
				}
			};

			service.getTotalValueOcForInv = function (item, vatPercent, constant) {
				if (item.PriceUnit === 0) {
					return 0;
				}
				if (isOverGross) {
					var vp = getVatPercent(vatPercent);
					if (vp === 1) {
						return item.TotalValueGrossOc;
					}
					return round(roundingType.TotalValueOc, mathBignumber(item.TotalValueGrossOc).div(vp), constant);
				}
				if (item.PrcItemFk) {
					return round(roundingType.TotalValueOc, mathBignumber(item.Quantity).mul(item.PriceOc).sub(item.DiscountSplitOc), constant);
				} else {
					return round(roundingType.TotalValueOc, mathBignumber(item.Quantity).mul(item.PriceOc), constant);
				}
			};

			service.getTotalValueGrossForInv = function (item, vatPercent, exchangeRate, constant) {
				if (item.PriceUnit === 0) {
					return 0;
				}
				if (isOverGross) {
					let rate = (exchangeRate && exchangeRate !== 0) ? exchangeRate : 1;
					if (rate === 1) {
						return item.TotalValueGrossOc;
					}
					return round(roundingType.TotalValueGross, mathBignumber(item.TotalValueGrossOc).div(rate), constant);
				}
				var vp = getVatPercent(vatPercent);
				if (vp === 1) {
					return item.TotalValue;
				}
				return round(roundingType.TotalValueGross, mathBignumber(item.TotalValue).mul(vp), constant);
			};

			service.getTotalValueOcGrossForInv = function (item, vatPercent, constant) {
				if (item.PriceUnit === 0) {
					return 0;
				}
				if (isOverGross) {
					if (item.PrcItemFk) {
						return round(roundingType.TotalValueGrossOc, mathBignumber(item.PriceOcGross).mul(item.Quantity).sub(item.DiscountSplitOc), constant);
					} else {
						return round(roundingType.TotalValueGrossOc, mathBignumber(item.PriceOcGross).mul(item.Quantity), constant);
					}
				}
				var vp = getVatPercent(vatPercent);
				if (vp === 1) {
					return item.TotalValueOc;
				}
				return round(roundingType.TotalValueGrossOc, mathBignumber(item.TotalValueOc).mul(vp), constant);
			};

			service.getPriceByTotalPriceForInv = function (totalPrice, priceUnit, factorPriceUnit, constant) {
				if (!priceUnit) {
					return 0;
				}
				return round(roundingType.Price, mathBignumber(totalPrice).div(priceUnit).mul(factorPriceUnit), constant);
			};

			service.getPercentageForInv = function (quantity, orderQuantity, constant) {
				if (!orderQuantity) {
					return 0;
				}
				return round(roundingType.NoType, mathBignumber(quantity).div(orderQuantity).mul(100), constant);
			};

			service.getPreTaxByAfterTax = function (afterTax, vatPercent) {
				var vp = getVatPercent(vatPercent);
				return round(roundingType.NoType, mathBignumber(afterTax).div(vp));
			};

			service.getAfterTaxByPreTax = function (preTax, vatPercent) {
				var vp = getVatPercent(vatPercent);
				return round(roundingType.NoType, mathBignumber(preTax).mul(vp));
			};

			service.getOcByNonOc = function (nonOc, exchangeRate) {
				return round(roundingType.NoType, mathBignumber(nonOc).mul(exchangeRate));
			};

			service.getNonOcByOc = function (oc, exchangeRate) {
				if (!exchangeRate) {
					return 0;
				}
				return round(roundingType.NoType, mathBignumber(oc).div(exchangeRate));
			};

			service.getUnitRatePreTaxByAfterTax = function (afterTax, vatPercent, constant) {
				var vp = getVatPercent(vatPercent);
				return round(roundingType.Price, mathBignumber(afterTax).div(vp), constant);
			};

			service.getUnitRateAfterTaxByPreTax = function (preTax, vatPercent, constant) {
				var vp = getVatPercent(vatPercent);
				return round(roundingType.Price, mathBignumber(preTax).mul(vp), constant);
			};

			service.getAmountAfterTaxByPreTax = function (preTax, vatPercent, constant, roundingField) {
				var vp = getVatPercent(vatPercent);
				return round(roundingField || roundingType.Total, mathBignumber(preTax).mul(vp), constant);
			};

			service.getUnitRateOcByNonOc = function (nonOc, exchangeRate) {
				return round(roundingType.Price, mathBignumber(nonOc).mul(exchangeRate));
			};

			service.getAmountOcByNonOc = function (nonOc, exchangeRate, constant) {
				return round(roundingType.Total, mathBignumber(nonOc).mul(exchangeRate), constant);
			};

			service.getUnitRateNonOcByOc = function (oc, exchangeRate, constant) {
				if (!exchangeRate) {
					return 0;
				}
				return round(roundingType.Price, mathBignumber(oc).div(exchangeRate), constant);
			};

			service.getAmountNonOcByOc = function (oc, exchangeRate, constant, roundingField) {
				if (!exchangeRate) {
					return 0;
				}
				return round(roundingField || roundingType.Total, mathBignumber(oc).div(exchangeRate), constant);
			};

			service.isCalculateOverGross = function () {
				return isOverGross;
			};

			service.setPricePriceOcPriceGrossPriceGrossOc = function (entity, value, field, vatPercent, exchangeRate) {
				var vp = getVatPercent(vatPercent);
				let rate = (exchangeRate && exchangeRate !== 0) ? exchangeRate : 1;
				let rateIsOne = (rate === 1);
				let vpIsOne = (vp === 1);
				switch (field) {
					case 'Price': {
						entity.PriceOc = rateIsOne ? value : round(roundingType.PriceOc, mathBignumber(value).mul(rate));
						entity.PriceGross = vpIsOne ? value : round(roundingType.PriceGross, mathBignumber(value).mul(vp));
						let priceGrossOc = isOverGross ?
							(rateIsOne ? entity.PriceGross : round(roundingType.PriceGrossOc, mathBignumber(entity.PriceGross).mul(rate))) :
							(vpIsOne ? entity.PriceOc : round(roundingType.PriceGrossOc, mathBignumber(entity.PriceOc).mul(vp)));
						setPriceGrossOc(entity, priceGrossOc);
						break;
					}
					case 'PriceOc': {
						entity.Price = rateIsOne ? value : round(roundingType.Price, mathBignumber(value).div(rate));
						let priceGrossOc = vpIsOne ? value : round(roundingType.PriceGrossOc, mathBignumber(value).mul(vp));
						setPriceGrossOc(entity, priceGrossOc);
						entity.PriceGross = isOverGross ?
							(rateIsOne ? getPriceGrossOc(entity) : round(roundingType.PriceGross, mathBignumber(getPriceGrossOc(entity)).div(rate))) :
							(vpIsOne ? entity.Price : round(roundingType.PriceGross, mathBignumber(entity.Price).mul(vp)));
						break;
					}
					case 'PriceGross': {
						entity.Price = vpIsOne ? value : round(roundingType.Price, mathBignumber(value).div(vp));
						let priceGrossOc = rateIsOne ? value : round(roundingType.PriceGrossOc, mathBignumber(value).mul(rate));
						setPriceGrossOc(entity, priceGrossOc);
						entity.PriceOc = isOverGross ?
							(vpIsOne ? getPriceGrossOc(entity) : round(roundingType.PriceOc, mathBignumber(getPriceGrossOc(entity)).div(vp))) :
							(rateIsOne ? entity.Price : round(roundingType.PriceOc, mathBignumber(entity.Price).mul(rate)));
						break;
					}
					case 'PriceGrossOc': {
						setPriceGrossOc(entity, value);
						entity.PriceGross = rateIsOne ? value : round(roundingType.PriceGross, mathBignumber(value).div(rate));
						entity.PriceOc = vpIsOne ? value : round(roundingType.PriceOc, mathBignumber(value).div(vp));
						entity.Price = isOverGross ?
							(vpIsOne ? entity.PriceGross : round(roundingType.Price, mathBignumber(entity.PriceGross).div(vp))) :
							(rateIsOne ? entity.PriceOc : round(roundingType.Price, mathBignumber(entity.PriceOc).div(rate)));
						break;
					}
					default: {
						break;
					}
				}
			};

			service.setChargeChargeOc = function(entity, value, field, exchangeRate){

				entity.ChargeOc = field === 'ChargeOc' ?
					value :
					service.getUnitRateOcByNonOc(value, exchangeRate);
				entity.Charge = field === 'Charge' ?
					value :
					exchangeRate === 0 ? 0 : service.getUnitRateNonOcByOc(value, exchangeRate);

			}

			function getPriceUnit(item, priceUnit) {
				var pu = item.PriceUnit;
				if (_.isNil(pu)) {
					pu = priceUnit ? priceUnit : 1;
				}
				return pu;
			}

			function getFactorPriceUnit(item, facotr) {
				var fpu = item.FactorPriceUnit;
				if (_.isNil(fpu)) {
					fpu = facotr ? facotr : 1;
				}
				return fpu;
			}

			function round(roundingField, beforeRoundingValue, contractRoundingMethodFk) {
				if (!contractRoundingMethodFk) {
					return doRound(roundingField, beforeRoundingValue);
				}
				let afterRoundingValue = beforeRoundingValue;
				switch (contractRoundingMethodFk) {
					case contractRoundingMethod.ForBoq:
						afterRoundingValue = prcCommonCalculationHelper.round(beforeRoundingValue, 2);
						break;
					case contractRoundingMethod.ForPrcItem:
						afterRoundingValue = doRound(roundingField, beforeRoundingValue);
						break;
					case contractRoundingMethod.ForNull:
						afterRoundingValue = prcCommonCalculationHelper.round(beforeRoundingValue, 3);
						break;
				}
				return afterRoundingValue;
			}


			function doRound(roundingField, beforeRoundingValue, digits) {
				if (!roundingField) {
					return prcCommonCalculationHelper.round(beforeRoundingValue, digits);
				}
				let value = beforeRoundingValue;
				if (typeof beforeRoundingValue === 'object' && beforeRoundingValue.isBigNumber) {
					value = beforeRoundingValue.toNumber();
				}
				return basRoundingDataService.doRounding(roundingField, value);
			}

			function getPriceGrossOc(item) {
				return item.PriceGrossOc || 0;
			}

			function getTotalPriceGrossOc(item) {
				return item.TotalPriceGrossOc || 0;
			}

			function getTotalGrossOc(item) {
				return item.TotalGrossOc || 0;
			}

			function setPriceGrossOc(item, value) {
				if (angular.isDefined(item.PriceGrossOc)) {
					item.PriceGrossOc = value;
				}
			}

			function setTotalGrossOc(item, value) {
				if (angular.isDefined(item.TotalGrossOc)) {
					item.TotalGrossOc = value;
				}
			}

			function mathBignumber(val) {
				return math.bignumber(val);
			}

			function getVatPercent(vatPercent) {
				return vatPercent ? (mathBignumber(100).add(vatPercent).div(100).toNumber()) : 1;
			}

			function getDecimalDiscount(discount) {
				return discount ? (mathBignumber(100).sub(discount).div(100).toNumber()) : 1;
			}

			function getDiscountTotalByDisAbsoluteCommon(discountAbsoluteFiled) {
				return function (item) {
					if (item.PriceUnit === 0) {
						return 0;
					}
					let field = discountAbsoluteFiled ? discountAbsoluteFiled : 'DiscountAbsolute';
					return mathBignumber(item[field]).mul(item.Quantity).div(item.PriceUnit).mul(item.FactorPriceUnit);
				};
			}

			// let getDiscountTotalByDiscountAbsolute = getDiscountTotalByDisAbsoluteCommon('DiscountAbsolute');
			// let getDiscountTotalByDiscountAbsoluteOc = getDiscountTotalByDisAbsoluteCommon('DiscountAbsoluteOc');
			let getDiscountTotalByDiscountAbsoluteGross = getDiscountTotalByDisAbsoluteCommon('DiscountAbsoluteGross');
			let getDiscountTotalByDiscountAbsoluteGrossOc = getDiscountTotalByDisAbsoluteCommon('DiscountAbsoluteGrossOc');

			function generateFormula() {
				return {
					base: {
						totalPrice(price, priceExtra, charge, discountAbsolute) {
							return mathBignumber(price).add(priceExtra).add(charge).sub(discountAbsolute);
						},
						totalPriceGross(priceGross, priceExtra, charge, discountAbsoluteGross, vatPercent) {
							const vp = getVatPercent(vatPercent);
							const priceExtraGross = mathBignumber(priceExtra).mul(vp);
							const chargeGross = mathBignumber(charge).mul(vp);
							return mathBignumber(priceGross).add(priceExtraGross).add(chargeGross).sub(discountAbsoluteGross);
						},
						totalPriceNoDiscount(price, priceExtra, charge) {
							return mathBignumber(price).add(priceExtra).add(charge);
						},
						totalPriceGrossNoDiscount(priceGross, priceExtra, charge, vatPercent) {
							const vp = getVatPercent(vatPercent);
							const priceExtraGross = mathBignumber(priceExtra).mul(vp);
							const chargeGross = mathBignumber(charge).mul(vp);
							return mathBignumber(priceGross).add(priceExtraGross).add(chargeGross);
						},
						totalNoDiscount(price, priceExtra, charge, quantity, priceUnit, factorPriceUnit) {
							return this.totalPriceNoDiscount(price, priceExtra, charge).mul(quantity).div(priceUnit).mul(factorPriceUnit)
						},
						priceByTotalPrice(totalPrice, discountAbsolute, charge, priceExtra) {
							return mathBignumber(totalPrice).add(discountAbsolute).sub(charge).sub(priceExtra);
						}
					},
					totalPrice(item) {
						const charge = item.Charge ?? 0;
						const discountAbsolute = item.DiscountAbsolute ?? 0;
						return this.base.totalPrice(item.Price, item.PriceExtra, charge, discountAbsolute);
					},
					totalPriceOc(item) {
						const chargeOc = item.ChargeOc ?? 0;
						const discountAbsoluteOc = item.DiscountAbsoluteOc ?? 0;
						return this.base.totalPrice(item.PriceOc, item.PriceExtraOc, chargeOc, discountAbsoluteOc);
					},
					totalPriceGross(item, vatPercent) {
						const charge = item.Charge ?? 0;
						const discountAbsoluteGross = item.DiscountAbsoluteGross ?? 0;
						return this.base.totalPriceGross(item.PriceGross, item.PriceExtra, charge, discountAbsoluteGross, vatPercent);
					},
					totalPriceGrossOc(item, vatPercent) {
						const chargeOc = item.ChargeOc ?? 0;
						const discountAbsoluteGrossOc = item.DiscountAbsoluteGrossOc ?? 0;
						return this.base.totalPriceGross(getPriceGrossOc(item), item.PriceExtraOc, chargeOc, discountAbsoluteGrossOc, vatPercent);
					},
					totalPriceNoDiscount(item) {
						const charge = item.Charge ?? 0;
						return this.base.totalPriceNoDiscount(item.Price, item.PriceExtra, charge);
					},
					totalPriceOcNoDiscount(item) {
						const chargeOc = item.ChargeOc ?? 0;
						return this.base.totalPriceNoDiscount(item.PriceOc, item.PriceExtraOc, chargeOc);
					},
					totalPriceGrossNoDiscount(item, vatPercent) {
						const charge = item.Charge ?? 0;
						return this.base.totalPriceGrossNoDiscount(item.PriceGross, item.PriceExtra, charge, vatPercent);
					},
					totalPriceGrossOcNoDiscount(item, vatPercent) {
						const chargeOc = item.ChargeOc ?? 0;
						const priceGrossOc = getPriceGrossOc(item);
						return this.base.totalPriceGrossNoDiscount(priceGrossOc, item.PriceExtraOc, chargeOc, vatPercent);
					},
					totalNoDiscount(item, priceUnit, factor) {
						const pu = getPriceUnit(item, priceUnit);
						const factorPriceUnit = getFactorPriceUnit(item, factor);
						return this.totalPriceNoDiscount(item).mul(item.Quantity).div(pu).mul(factorPriceUnit)
					},
					totalOcNoDiscount(item, priceUnit, factor) {
						const pu = getPriceUnit(item, priceUnit);
						const factorPriceUnit = getFactorPriceUnit(item, factor);
						return this.totalPriceOcNoDiscount(item).mul(item.Quantity).div(pu).mul(factorPriceUnit)
					},
					priceGrossOcByTotalPriceGrossOc(item, vatPercent) {
						const vp = getVatPercent(vatPercent);
						const priceExtraGrossOc = mathBignumber(item.PriceExtraOc).mul(vp);
						const chargeGrossOc = item.ChargeOc ? mathBignumber(item.ChargeOc).mul(vp) : 0;
						return this.base.priceByTotalPrice(getTotalPriceGrossOc(item), item.DiscountAbsoluteGrossOc, chargeGrossOc, priceExtraGrossOc)
					},
					priceGrossByTotalPriceGross(item, vatPercent) {
						const vp = getVatPercent(vatPercent);
						const priceExtraGross = mathBignumber(item.PriceExtra).mul(vp);
						const chargeGross = item.Charge ? mathBignumber(item.Charge).mul(vp) : 0;
						return this.base.priceByTotalPrice(item.TotalPriceGross, item.DiscountAbsoluteGross, chargeGross, priceExtraGross)
					}
				}
			}

			return service;
		}]);
})();