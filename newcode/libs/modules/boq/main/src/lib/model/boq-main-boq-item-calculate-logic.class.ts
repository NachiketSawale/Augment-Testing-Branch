/* eslint-disable prefer-const */
/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemEntity, IBoqStructureEntity, IBoqRoundingConfigDetailEntity } from '@libs/boq/interfaces';
import { PlatformHttpService } from '@libs/platform/common';
import { BoqItemHelper, BoqItemTreeHelper, BoqLineType, BoqMainRoundingConfigDetailType, IBoqVisitorObject } from './boq-main-boq-constants';
import { bignumber } from 'mathjs';
import { BoqItemRoundingLogic } from './boq-main-boq-item-rounding.logic';

type BoqRoundedColumns2DetailTypes = {
	[key: number]: string;
};

class BoqItemSumValues {

	public total: number = 0;
	public totalOc: number = 0;
	public totalgross: number = 0;
	public totalgrossOc: number = 0;
	public extraIncrement: number = 0;
	public preEscalation: number = 0;
	public extraIncrementOc: number = 0;
	public preEscalationOc: number = 0;
	public hours: number = 0;
	public preEscalationTotal: number = 0;
	public extraTotal: number = 0;
	public totalPrice: number = 0;
	public ordItemTotal: number = 0;
	public totalHours: number = 0;
	public totalBudget: number = 0;
	public preEscalationTotalForIQ: number = 0;
	public preEscalationTotalForBQ: number = 0;
	public iqPreEscalation: number = 0;
	public bqPreEscalation: number = 0;
	public performance: number = 0;

	public reset() {
		for (let key in this) {
			if (typeof this[key] == 'number') {
				this[key] = 0 as this[typeof key]; // or this one
			}
		}
	}
}

export type GetValueByBoqItemFunc = (boqItem: IBoqItemEntity) => number | null | undefined;

export interface IBoqItemCalculateOptions {
	getVatPercentFunc: GetValueByBoqItemFunc;
	fixedBudgetTotal: boolean
}


export class BoqItemCalculateLogic {
	//  region Calculation  ==ts==>  BoqItemCalculator in folder 'model' (no factoring in the first step, maybe when there is remaining time at the end of year 2024)
	// #region

	private static boqRoundedColumns2DetailTypes?: BoqRoundedColumns2DetailTypes;

	protected isCalculateOverGross = false;
	protected boqRoundingService?: BoqItemRoundingLogic;
	private roundingConfigDetails?: IBoqRoundingConfigDetailEntity[] | null;

	protected fixedBudgetTotal : boolean = false;

	public constructor(private boqStructure : IBoqStructureEntity, private flatBoqItemList: IBoqItemEntity[], private boqItemCalculateOptions : IBoqItemCalculateOptions) {
		this.boqStructure = boqStructure;

		const roundingConfig = (typeof this.boqStructure?.BoqRoundingConfigFk==='number' && this.boqStructure?.BoqRoundingConfigFk!==0) ? this.boqStructure?.BoqRoundingConfig : null;
		this.roundingConfigDetails = (Array.isArray(roundingConfig?.BoqRoundingconfigdetailEntities) ? roundingConfig?.BoqRoundingconfigdetailEntities : null) || null;
		this.boqRoundingService = new BoqItemRoundingLogic(roundingConfig || null, this.roundingConfigDetails);
	}

	/**
	 * @ngdoc function
	 * @name loadBoqRoundedColumns2DetailTypes
	 * @function
	 * @methodOf boqMainServiceFactory
	 * @description Load the mapping between the boq item colums to be rounded and the related boq rounding config detail type
	 * @returns  {Object} the promise and when being resolved the loaded mapping
	 */
	public static loadBoqRoundedColumns2DetailTypes(http : PlatformHttpService) : Promise<BoqRoundedColumns2DetailTypes> {

		if(this.boqRoundedColumns2DetailTypes) {
			return Promise.resolve(this.boqRoundedColumns2DetailTypes);
		}

		return (http.get<BoqRoundedColumns2DetailTypes>( 'boq/main/type/getboqroundedcolumns2detailtypes')).then(response =>  {
			this.boqRoundedColumns2DetailTypes = response;
			return response;
		});
	}

	// TODO: to be refactored by changing function name, creating calculate service, reducing redundancies, by separating 'isItemWithIT', ColVal1,2,3,4,5
	protected calcFinalPriceHoursNew(boqItem: IBoqItemEntity, calculatedProperties?: string[], boqItemList?: IBoqItemEntity[], changePropertyName?: string) {
		// type IBoqItemKey = keyof Pick<IBoqItemEntity, 'ColVal1ToCopy' | 'ColVal2ToCopy' | 'ColVal3ToCopy' | 'ColVal4ToCopy' | 'ColVal5ToCopy'>;

		const roundValue = (boqItem: IBoqItemEntity, fieldName: string, fieldValue: number) => {
			boqItem[fieldName] = this.roundValue(fieldValue, fieldName);
			// TODO: calculation of OC values here?
		};

		let udpColumns = ['ColVal1', 'ColVal2', 'ColVal3', 'ColVal4', 'ColVal5'];

		const calculateUDPValue = (boqItem: IBoqItemEntity, preEscalationForColVal: number, propertyName: string | undefined) => {

			if (!boqItem) {
				return;
			}

			let isItemWithIT = BoqItemTreeHelper.isItemWithIT(boqItem); // TODO-BOQ: reference to other service part
			udpColumns.forEach((udpColumn: string) => {
				if (boqItem && typeof boqItem[udpColumn] === 'number') {
					let oldValue = boqItem[udpColumn + 'Total'];
					boqItem[udpColumn + 'Total'] = isItemWithIT ? (boqItem[udpColumn] as number * preEscalationForColVal) : 0;

					if (!boqItem.isUDPChanged) {
						boqItem.isUDPChanged = (oldValue !== boqItem[udpColumn + 'Total']);
					}
				}
			});

			if (propertyName && propertyName.indexOf('ColVal') !== -1) {
				boqItem.isUDPChanged = true;
			}
		};

		if(!boqItem) {
			return;
		}

		let vatPercent = this.boqItemCalculateOptions?.getVatPercentFunc(boqItem) ?? 0;

		if (BoqItemHelper.isItem(boqItem)) {

			// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
			if (_.isArray(calculatedProperties) && (_.includes(calculatedProperties, 'TotalPrice') || _.includes(calculatedProperties, 'TotalHours'))) {
				service.initInstalledValues(boqItem);
			}
*/
			// Round atomic values
			this.roundInitialValues(boqItem);

			if (!calculatedProperties || calculatedProperties.indexOf('Finalprice') !== -1) {

				if (boqItem.IsLeadDescription && boqItem.IsUrFromSd) {
					boqItem.Price = this.roundValue(this.getSubdescriptionsTotal(boqItem, false), 'Price'); // Here we have a lead description that gets its price from the corresponding subdescriptions total
					boqItem.PriceOc = this.roundValue(this.getSubdescriptionsTotal(boqItem, true), 'PriceOc'); // Flag true indicates getting the total based on Oc values.
				}

				if (this.isCalculateOverGross && changePropertyName && changePropertyName === 'MdcTaxCodeFk') {
					// Calculate the net values out of the gross values
					this.calPriceOrPriceOcByGross(boqItem, true); // calculate Price out of PriceGross
					this.calPriceOrPriceOcByGross(boqItem, false);  // calculate PriceOc out of PriceGrossOc
				}

				boqItem.Correction = boqItem.Price - boqItem.Cost;
				boqItem.DiscountedUnitprice = this.roundValue(boqItem.Price - (boqItem.Price * boqItem.DiscountPercent / 100), 'DiscountedUnitprice'); // discount => abs (-)

				// TODO: beautify
				roundValue(boqItem, 'DiscountedPrice', bignumber(boqItem.DiscountedUnitprice).mul(boqItem.Quantity).mul(boqItem.Factor).toNumber()); // DiscountedPrice = DiscountedUnitprice * Quantity * Factor
				roundValue(boqItem, 'ItemTotal', bignumber(boqItem.Price).mul(boqItem.Quantity).mul(boqItem.Factor).toNumber()); // ItemTotal       = Price               * Quantity * Factor

				boqItem.PreEscalation = BoqItemTreeHelper.isItemWithIT(boqItem) ? boqItem.ItemTotal : 0;

				// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
				boqItem.IQPreEscalation = BoqItemTreeHelper.isItemWithIT(boqItem) ? (boqItem.DiscountedUnitprice * boqItem.InstalledQuantity * boqItem.Factor) : 0;
				boqItem.BQPreEscalation = BoqItemTreeHelper.isItemWithIT(boqItem) ? (boqItem.DiscountedUnitprice * boqItem.BilledQuantity * boqItem.Factor) : 0;
*/
				boqItem.Finalprice = BoqItemTreeHelper.isItemWithIT(boqItem) ? this.roundValue((boqItem.ItemTotal + boqItem.ExtraIncrement) * (1 - boqItem.DiscountPercent / 100), 'Finalprice') : 0;

				boqItem.CorrectionOc = boqItem.PriceOc - boqItem.CostOc;
				boqItem.ItemTotalOc = this.roundValue(boqItem.PriceOc * boqItem.Quantity * boqItem.Factor, 'ItemTotalOc');
				boqItem.DiscountedUnitpriceOc = this.roundValue(boqItem.PriceOc - (boqItem.PriceOc * boqItem.DiscountPercent / 100), 'DiscountedUnitpriceOc'); // discount => abs (-)
				boqItem.DiscountedPriceOc = this.roundValue(boqItem.DiscountedUnitpriceOc * boqItem.Quantity * boqItem.Factor, 'DiscountedPriceOc');
				boqItem.PreEscalationOc = BoqItemTreeHelper.isItemWithIT(boqItem) ? boqItem.ItemTotalOc : 0;
				boqItem.FinalpriceOc = BoqItemTreeHelper.isItemWithIT(boqItem) ? this.roundValue((boqItem.ItemTotalOc + boqItem.ExtraIncrementOc) * (1 - boqItem.DiscountPercent / 100), 'FinalpriceOc') : 0;

				calculateUDPValue(boqItem, boqItem.Quantity * boqItem.Factor, changePropertyName);


				/* calculate pricegross, pricocgross, finalgross and finalgrossoc */
				boqItem.Pricegross = this.roundValue(boqItem.DiscountedUnitprice * (100 + vatPercent) / 100, 'Pricegross');
				boqItem.Finalgross = BoqItemTreeHelper.isItemWithIT(boqItem) ? this.roundValue(boqItem.Finalprice * (100 + vatPercent) / 100, 'Finalgross') : 0;
				boqItem.PricegrossOc = this.roundValue(boqItem.DiscountedUnitpriceOc * (100 + vatPercent) / 100, 'PricegrossOc');
				boqItem.FinalgrossOc = BoqItemTreeHelper.isItemWithIT(boqItem) ? this.roundValue(boqItem.FinalpriceOc * (100 + vatPercent) / 100, 'FinalgrossOc') : 0;


				if (!BoqItemTreeHelper.isItemWithIT(boqItem)) {
					boqItem.BudgetTotal = 0;
					boqItem.BudgetDifference = 0;
				} else {
					let relevantQuantityForBudget = this.getCurrentlyRelevantQuantityForBudget(boqItem);
					let fixBudgetTotal = this.fixedBudgetTotal;
					if (boqItem.BudgetFixedTotal || boqItem.BudgetFixedUnit) {
						fixBudgetTotal = boqItem.BudgetFixedTotal;
					}

					if (!fixBudgetTotal) {
						boqItem.BudgetTotal = this.roundValue(relevantQuantityForBudget * boqItem.BudgetPerUnit, 'BudgetTotal');
					} else {
						boqItem.BudgetPerUnit = relevantQuantityForBudget !== 0 ? this.roundValue(boqItem.BudgetTotal / relevantQuantityForBudget, 'BudgetPerUnit') : 0;
					}
				}

				// Todo-Boq: At the moment we ignore handling the following properties for they are only needed in Sales Contract
/*
				if (service.getServiceName() === 'salesContractBoqStructureService') {
					let quantity = _calculationOfExpectedRevenueSysOpt ? (boqItem.ExWipIsFinalQuantity ? boqItem.ExWipQuantity : boqItem.QuantityAdj) : boqItem.Quantity;
					boqItem.ExWipExpectedRevenue = this.roundValueByDetailType(quantity * boqItem.DiscountedUnitprice, BoqMainRoundingConfigDetailType.Amounts);
				}
 */
			}

			if (!calculatedProperties || calculatedProperties.indexOf('Hours') !== -1) {
				boqItem.Hours = BoqItemTreeHelper.isItemWithIT(boqItem) ? this.roundValue(boqItem.HoursUnit * boqItem.Quantity * boqItem.Factor, 'Hours') : 0;
			}
		} else if (BoqItemHelper.isSurchargeItem(boqItem)) {
			if (!calculatedProperties || calculatedProperties.indexOf('Finalprice') !== -1) {
				boqItem.Quantity = this.getSurchargedItemsTotal(boqItem, boqItemList, false, false);
				// Info: The price property carries the surcharge percentage in case the boqItem is a surcharge boqItem
				boqItem.Correction = 0;
				boqItem.ItemTotal = this.roundValue(boqItem.Price * boqItem.Quantity * boqItem.Factor / 100, 'ItemTotal');
				boqItem.DiscountedUnitprice = this.roundValue(boqItem.ItemTotal, 'DiscountedUnitprice');
				boqItem.DiscountedPrice = this.roundValue(boqItem.DiscountedUnitprice - (boqItem.DiscountedUnitprice * boqItem.DiscountPercent / 100), 'DiscountedPrice');
				boqItem.PreEscalation = BoqItemTreeHelper.isItemWithIT(boqItem) ? this.roundValue(boqItem.DiscountedPrice, 'PreEscalation') : 0;

				// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*				var iqUnitPrice = boqItem.Price * boqItem.InstalledQuantity * boqItem.Factor / 100;
				var bqUnitPrice = boqItem.Price * boqItem.BilledQuantity * boqItem.Factor / 100;

				boqItem.IQPreEscalation = BoqItemTreeHelper.isItemWithIT(boqItem) ? (iqUnitPrice - (iqUnitPrice * boqItem.DiscountPercent / 100)) : 0;
				boqItem.BQPreEscalation = BoqItemTreeHelper.isItemWithIT(boqItem) ? (bqUnitPrice - (bqUnitPrice * boqItem.DiscountPercent / 100)) : 0;
*/
				boqItem.Finalprice = BoqItemTreeHelper.isItemWithIT(boqItem) ? this.roundValue(boqItem.PreEscalation + boqItem.ExtraIncrement, 'Finalprice') : 0;

				boqItem.CorrectionOc = 0;
				// For the Price property holds a percentage value the PriceOc value also holds the same percentage and not a derived OC value
				boqItem.PriceOc = boqItem.Price;
				boqItem.ItemTotalOc = this.roundValue(boqItem.PriceOc * this.getSurchargedItemsTotal(boqItem, boqItemList, true, false) / 100, 'ItemTotalOc');
				boqItem.DiscountedUnitpriceOc = this.roundValue(boqItem.ItemTotalOc, 'DiscountedUnitpriceOc');
				boqItem.DiscountedPriceOc = this.roundValue(boqItem.DiscountedUnitpriceOc - (boqItem.DiscountedUnitpriceOc * boqItem.DiscountPercent / 100), 'DiscountedPriceOc');
				boqItem.PreEscalationOc = BoqItemTreeHelper.isItemWithIT(boqItem) ? this.roundValue(boqItem.DiscountedPriceOc, 'PreEscalationOc') : 0;
				boqItem.FinalpriceOc = BoqItemTreeHelper.isItemWithIT(boqItem) ? this.roundValue(boqItem.PreEscalationOc + boqItem.ExtraIncrementOc, 'FinalpriceOc') : 0;


				// user defined column calculation like Finalprice ,but do not use DiscountPercent  and ExtraIncrement
				calculateUDPValue(boqItem, boqItem.Quantity * boqItem.Factor / 100, changePropertyName);

				boqItem.Pricegross = this.roundValue(boqItem.DiscountedUnitprice * (100 + vatPercent) / 100, 'Pricegross');
				boqItem.Finalgross = BoqItemTreeHelper.isItemWithIT(boqItem) ? this.roundValue(boqItem.Finalprice * (100 + vatPercent) / 100, 'Finalgross') : 0;
				boqItem.PricegrossOc = this.roundValue(boqItem.DiscountedUnitpriceOc * (100 + vatPercent) / 100, 'PricegrossOc');
				boqItem.FinalgrossOc = BoqItemTreeHelper.isItemWithIT(boqItem) ? this.roundValue(boqItem.FinalpriceOc * (100 + vatPercent) / 100, 'FinalgrossOc') : 0;
			}
		}

		// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
		if (option.serviceName === 'qtoBoqStructureService') {
			service.calcQtoBoqNewFinalPrice(boqItem);
		}
		if (service.calcTotalPrice) {
			if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalPrice') !== -1 && Object.prototype.hasOwnProperty.call(boqItem, 'TotalQuantity')) {
				service.calcTotalPrice(boqItem);
			}
		}

		if (service.calcTotalHours) {
			if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalHours') !== -1 && Object.prototype.hasOwnProperty.call(boqItem, 'TotalQuantity')) {
				service.calcTotalHours(boqItem);
			}
		}
*/
		return boqItem;
	}

	// calculate Price or PriceOc
	protected calPriceOrPriceOcByGross(boqItem: IBoqItemEntity, isPricegross: boolean) {

		let vatPercent = this.boqItemCalculateOptions?.getVatPercentFunc(boqItem) ?? 0;

		if (isPricegross) {
			boqItem.DiscountedUnitprice = boqItem.Pricegross / ((100 + vatPercent) / 100);
			boqItem.Price = boqItem.DiscountedUnitprice / ((100 - boqItem.DiscountPercent) / 100);
		} else {
			boqItem.DiscountedUnitpriceOc = boqItem.PricegrossOc / ((100 + vatPercent) / 100);
			boqItem.PriceOc = boqItem.DiscountedUnitpriceOc / ((100 - boqItem.DiscountPercent) / 100);
		}
	}

	/**
	 * @ngdoc function
	 * @name getSurchargedItemsTotal
	 * @function
	 * @methodOf
	 * @description Calculate the surcharge item total
	 * @param {Object} boqItem : boq item entity
	 * @param {Array} boqItemList boq item tree.
	 * @param {Boolean} basedOnOcValue: flag telling function to retrieve total based on home currency or original currency values.
	 *
	 */
	protected getSurchargedItemsTotal(boqItem: IBoqItemEntity, boqItemList: IBoqItemEntity[] | undefined, basedOnOcValue: boolean, isVatInclude: boolean) : number {
		let total = 0;
		let totalVatInclude = 0;

		if (BoqItemHelper.isSurchargeItem1(boqItem) || BoqItemHelper.isSurchargeItem2(boqItem)) {

			if (!basedOnOcValue) {
				boqItem.Quantity = 0;
			}

			let hasItem = false;
			let afterSi = false;

			if (boqItem.BoqItemFk === null) {
				return isVatInclude ? totalVatInclude : total; // No parent -> no siblings
			}

			let parentBoqItem;
			// Find the parent of the given boqItem
			if (!boqItemList) {
				parentBoqItem = boqItem.BoqItemParent;
			} else {
				parentBoqItem = boqItemList.find(aBoqItem => {
					return aBoqItem.Id === aBoqItem.BoqItemFk;
				});
			}

			if(!parentBoqItem) {
				return total;
			}

			// Todo-Boq: Specific sort functionality for boqItem must still be migrated
			// service.resortChildren(parentBoqItem, false);

			let surchargedItems = parentBoqItem.BoqItems;

			let si = null;

			if(!surchargedItems) {
				return total;
			}

			for (let i = surchargedItems.length - 1; i >= 0; i--) { // Traverse the siblings in reversse order
				si = surchargedItems[i];

				if (!afterSi) {
					if (si.Reference === boqItem.Reference) {
						afterSi = true;
					}
				} else {
					if (BoqItemHelper.isItem(si)) {

						hasItem = true;
						if (BoqItemHelper.isSurchargeItem2(boqItem) || (BoqItemHelper.isSurchargeItem1(boqItem) && si.IsSurcharged)) {
							this.calcFinalPriceHoursNew(si);
							total += basedOnOcValue ? si.FinalpriceOc : si.Finalprice;
							totalVatInclude += basedOnOcValue ? si.FinalgrossOc : si.Finalgross;
						}
					}

					if ((BoqItemHelper.isSurchargeItem(si)) && hasItem) {
						break;
					}
				}
			}
		} else { // SurchargeItemType3

			if (boqItem.BoqSurchardedItemEntities && Array.isArray(boqItem.BoqSurchardedItemEntities) && boqItem.BoqSurchardedItemEntities.length > 0) {
				let allBoqItems = this.flatBoqItemList;
				boqItem.BoqSurchardedItemEntities.forEach(siEntity => {
					// var si = siEntity.BoqSurchargedItem;
					let si = allBoqItems?.find(aBoqItem => {
						return aBoqItem.Id === siEntity.BoqSurcharedItemFk;
					});
					if (si && si.Quantity !== 0) {
						if(BoqItemHelper.isSurchargeItem3(boqItem)){
							this.calcFinalPriceHoursNew(si);
						}
						total += ((basedOnOcValue ? si.FinalpriceOc : si.Finalprice) * (siEntity.QuantitySplit ? siEntity.QuantitySplit : 0) / si.Quantity);
						totalVatInclude += ((basedOnOcValue ? si.FinalgrossOc : si.Finalgross) * (siEntity.QuantitySplit ? siEntity.QuantitySplit : 0) / si.Quantity);
					}
				});
			} else {// call from surcharge on
				total = boqItem.Quantity;
				totalVatInclude = boqItem.Quantity;
			}
		}

		return isVatInclude ? totalVatInclude : total;
	}


	/**
	 * @ngdoc function
	 * @name getSubdescriptionsTotal
	 * @function
	 * @methodOf
	 * @description Calculate the subdescription total
	 * @param {Object} boqItem : boq boqItem entity
	 * @param {Boolean} basedOnOcValue: flag telling function to retrieve total based on home currency or original currency values.
	 */
	protected getSubdescriptionsTotal(boqItem: IBoqItemEntity, basedOnOcValue: boolean) : number {
		let total = 0;

		if (boqItem.IsLeadDescription && boqItem.BoqItems) {
			// First get all subdescriptions of this lead description
			let subdescriptions = boqItem.BoqItems;
			let subdescription: IBoqItemEntity | null = null;

			for (let i = subdescriptions.length - 1; i >= 0; i--) { // Traverse the siblings in reversse order
				subdescription = subdescriptions[i];

				total += subdescription.Quantity * (basedOnOcValue ? subdescription.PriceOc : subdescription.Price);
			}
		}

		return total;
	}

	protected getCurrentlyRelevantQuantityForBudget(boqItem: IBoqItemEntity) : number {
		let relevantQuantity = 0;

		if(boqItem) {
			return boqItem.Quantity;
		}

		return relevantQuantity;
	}

	/**
	 * @ngdoc function
	 * @name recalculateMonetaryValuesBasedOnNewExchangeRate
	 * @function
	 * @methodOf
	 * @description Recalculate the basic monetary values of the visited boqItem (i.e. Price, LumpsumPrice or Discount)
	 * based on the new exchange rate handed over in visitorObject
	 * @param {Object} parentItem which is the parent of the boqItem
	 * @param {Object} boqItem whose monetary values are to be recalculated
	 * @param {Number} lineType of boqItem
	 * @param {Number} level of boqItem
	 * @param {Object} visitorObject parameter when used in recursion, at least holding the new exhcange rate
	 * @returns {Boolean}
	 */
	protected recalculateMonetaryValuesBasedOnNewExchangeRate = (parentItem: IBoqItemEntity | undefined, boqItem: IBoqItemEntity, lineType: BoqLineType, level: number, visitorObject: IBoqVisitorObject): boolean => {

		let newExchangeRate: number | null | undefined = visitorObject ? visitorObject['newExchangeRate'] as number : null; // Todo-Boq: the "as number" cast helps to silence to compiler, but not sure if this is a reasonable solution.
		let converted = false;

		if (newExchangeRate === undefined || newExchangeRate === null || newExchangeRate === 0) {
			return false;
		}

		if (BoqItemHelper.isItem(boqItem) && (boqItem.Price !== 0 || boqItem.PriceOc !== 0)) {
			boqItem.Price = this?.roundValue(boqItem.PriceOc / (newExchangeRate ?? 1), 'Price') ?? boqItem.Price;
			converted = true;
		} else if (BoqItemHelper.isDivisionOrRoot(boqItem)) {
			if (boqItem.IsLumpsum && (boqItem.LumpsumPrice !== 0 || boqItem.LumpsumPriceOc !== 0)) {
				boqItem.LumpsumPrice = this?.roundValue(boqItem.LumpsumPriceOc / (newExchangeRate ?? 1), 'LumpsumPrice') ?? boqItem.LumpsumPrice;
				converted = true;
			} else if (boqItem.Discount !== 0 || boqItem.DiscountOc !== 0) {
				boqItem.Discount = this?.roundValue(boqItem.DiscountOc / (newExchangeRate ?? 1), 'Discount') ?? boqItem.Discount;
				converted = true;
			}
		}

		return converted;
	};

	/**
	 * @ngdoc function
	 * @name updateSiblingSurchargeItems
	 * @function
	 * @methodOf boqMainServiceFactory.service
	 * @description trigger the calculation of the sibling surcharge items
	 * @param {Object} boqItem to whose sibling surcharge items have to be calculated
	 * @param {Boolean} notifyPriceChanged triggers firing of price changed event
	 */
	protected updateSiblingSurchargeItems(boqItem: IBoqItemEntity, notifyPriceChanged: boolean): boolean {

		let parentItem : IBoqItemEntity | null | undefined = null;
		let updated : boolean = false;

		// First check if there are sibling surcharge items.
		// Only if there are some the triggered calculation makes sense
		if (this.hasSiblingSurchargeItems(boqItem)) {
			parentItem = boqItem.BoqItemParent;
			// We hand over the parentItem, because we have to make sure the sibling items are recalculated.
			parentItem ? this.calcParentChain(parentItem, true) : null; // By giving the flag true, we assure that the children of boqItem are calculated first, before calculating up the parent chain.
			// As we can assume that boqItem is marked as modified we take care that it is not added to the affected item list when calculating the parent chain.

			// Todo-Boq: Needs to be discussed first, before we migrate the related functionality, i.e. maintaining a separate list of affected items
			// service.removeFromAffectedItems(boqItem);

			updated = true;
		}

		// Todo-Boq: Currently we don't trigger this event unless it's clear where exactly it is needed
/*
		if (notifyPriceChanged) {
			this.boqItemCalculateOptions?.boqItemPriceChanged.next(boqItem);
		}
*/
		return updated;
	}

	/**
	 * @ngdoc function
	 * @name hasSiblingSurchargeItems
	 * @function
	 * @methodOf boqMainServiceFactory
	 * @description Check if the given boqItem has siblings that are surcharge items
	 * @param {Object} boqItem whose siblings are to be checked
	 * @returns {Boolean} result of check
	 */
	protected hasSiblingSurchargeItems(boqItem: IBoqItemEntity) : boolean {

		if (!boqItem) {
			return false;
		}

		// First determine the parent boqItem
		let parentItem = boqItem.BoqItemParent;

		if (!parentItem) {
			return false;
		}

		let siblingSurchargeItem = parentItem.BoqItems?.find(siblingItem => {
			return BoqItemHelper.isSurchargeItem(siblingItem);
		});

		return (siblingSurchargeItem !== undefined && siblingSurchargeItem !== null);
	}

	/**
	 * @ngdoc function
	 * @name calcItemsPriceHoursNew
	 * @function
	 * @methodOf boqMainServiceFactory.service
	 * @description trigger the calculation of finalprice and hours
	 * @param {Object} boqItem to whose values are to be calculated
	 * @param {Boolean} doCalcParentChain triggers calculation of parent items
	 * @param {Boolean} calcChildrenFirst indicates that the children of the given boqItem have to be calculated first before calculating up the parent chain
	 * @param {String} changePropertyName tells if there was a special property changed that now causes the calculation.
	 */
	protected calcItemsPriceHoursNew(boqItem: IBoqItemEntity, doCalcParentChain: boolean, calcChildrenFirst: boolean = false, changePropertyName: string = '') {
		if (boqItem.IsOenBoq) { // OENORM currently does NOT calculate on the client
			return;
		}

		let oldFinalPrice = boqItem.Finalprice;
		/* let calcItem = */ this.calcFinalPriceHoursNew(boqItem, undefined, undefined, changePropertyName);
		let parentChainAlreadyCalculated = false;

		if ((boqItem.Finalprice !== oldFinalPrice)) {
			// The following call determines if there are sibling surcharge items.
			// If so it triggers the calculation of all sibling items to make sure all dependent values are up-to-date
			// and finally calls the calculation of the parentChain. The return value indicates that sibling surcharge items
			// were found and the described calculations were done.
			parentChainAlreadyCalculated = this.updateSiblingSurchargeItems(boqItem, false);
		}

		// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
		/*
				if(option.serviceName === 'qtoBoqStructureService') {
					service.initQtoBoqNewFinalPrices(boqItem);
				}
		*/
		if (doCalcParentChain && !parentChainAlreadyCalculated) {
			this.calcParentChain(boqItem, calcChildrenFirst, changePropertyName);
		}

		// mark user define price as modified
		// Todo-Boq: we skip this topic of dynamic columns for the moment and will return to it later on in the migration process.
/*
		let dynamicUserDefinedColumnsService = service.getDynamicUserDefinedColumnsService();
		if(boqItem.isUDPChanged && dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.markUdpAsModified)){
			dynamicUserDefinedColumnsService.markUdpAsModified(boqItem);
			boqItem.isUDPChanged = false;
		}
*/
		// Todo-Boq: Currently we don't trigger this event unless it's clear where exactly it is needed

//		this.boqItemCalculateOptions?.boqItemPriceChanged.next(calcItem);
	}

	/**
	 * @ngdoc function
	 * @name calcUrb
	 * @function
	 * @methodOf boqMainServiceFactory.service
	 * @description trigger the calculation of the unit rate depending on the changes in the urb's
	 * @param {Object} boqItem whose urb values have changed
	 * @param {Boolean} skipFinalpriceCalc: flag to trigger or skip calculation of finalprice
	 */
	protected calcUrb(boqItem: IBoqItemEntity, skipFinalpriceCalc: boolean) {

		if (!boqItem) {
			return;
		}

		// The calculation with unit rate breakdowns follows certain rules.
		// If the isUrb flag is set to true the sum of the urb is set to the unit rate.

		if (boqItem.IsUrb) {
			// Calculate the unit rate as sum of all urbs. Don't get confused for we use the price property.
			// Currently we use it as carrier of the unit rate information.
			this.roundInitialValues(boqItem); // round atomic values
			boqItem.Price = this.roundValue(boqItem.Urb1 + boqItem.Urb2 + boqItem.Urb3 + boqItem.Urb4 + boqItem.Urb5 + boqItem.Urb6, 'Price');
			boqItem.PriceOc = this.roundValue(boqItem.Urb1Oc + boqItem.Urb2Oc + boqItem.Urb3Oc + boqItem.Urb4Oc + boqItem.Urb5Oc + boqItem.Urb6Oc, 'PriceOc');

			if (!skipFinalpriceCalc) {
				this.calcItemsPriceHoursNew(boqItem, true);
			}
		}
	}

	/**
	 * @ngdoc function
	 * @name recalcUrbs
	 * @function
	 * @methodOf boqMainServiceFactory.service
	 * @description trigger the recalculation of the unit rate breakdowns in accordance of the current price value.
	 * This is only done when the flag CalcFromUrb in BoqStructure is set to true.
	 * @param {Object} boqItem whose urb values have to be recalculated
	 */
	protected recalcUrbs(boqItem: IBoqItemEntity) {

		if (!boqItem) {
			return;
		}

		// The calculation with unit rate breakdowns follows certain rules.
		// If the unit rate (price) itself changes this change is reflected in a change of the corresponding urbs, but only if the flag CalcFromUrb in BoqStructure is set to true.

		this.roundInitialValues(boqItem); // round atomic values
		let fractionSum = boqItem.Urb1 + boqItem.Urb2 + boqItem.Urb3 + boqItem.Urb4 + boqItem.Urb5 + boqItem.Urb6;
		let firstEditableUrbIndex = -1;

		if (this.boqStructure.CalcFromUrb) {
			if (boqItem.IsUrb) {
				// The urbs are adjusted in a way that the fractions remain the same but the sum equals the newly entered unit rate.

				// We don't have to adjust the boqItem urbs if the fractionSum is equal to the current unit rate (price)
				if (boqItem.Price === fractionSum || fractionSum === 0) {

					if (boqItem.Urb1 === 0 && boqItem.Urb2 === 0 && boqItem.Urb3 === 0 && boqItem.Urb4 === 0 && boqItem.Urb5 === 0 && boqItem.Urb6 === 0) {
						// In this case we set the current Price(Oc) to the first editable Urbx(Oc)
						for (let i = 1; i <= 6; i++) {
							if (this.boqStructure['NameUrb' + i] !== '') {
								firstEditableUrbIndex = i;
								break;
							}
						}

						if (firstEditableUrbIndex !== -1) {
							boqItem['Urb' + firstEditableUrbIndex] = boqItem.Price;
							boqItem['Urb' + firstEditableUrbIndex + 'Oc'] = boqItem.PriceOc;
						}
					}

					return; // No adjustments necessary
				}

				let fractions: number[] = [];
				fractions.push(boqItem.Urb1 / fractionSum); // Fraction 1
				fractions.push(boqItem.Urb2 / fractionSum); // Fraction 2
				fractions.push(boqItem.Urb3 / fractionSum); // Fraction 3
				fractions.push(boqItem.Urb4 / fractionSum); // Fraction 4
				fractions.push(boqItem.Urb5 / fractionSum); // Fraction 5
				fractions.push(boqItem.Urb6 / fractionSum); // Fraction 6

				// Now calculate the new urb values based on the newly entered unit rate (price)
				boqItem.Urb1 = this.roundValue(boqItem.Price * fractions[0], 'Urb1');
				boqItem.Urb2 = this.roundValue(boqItem.Price * fractions[1], 'Urb2');
				boqItem.Urb3 = this.roundValue(boqItem.Price * fractions[2], 'Urb3');
				boqItem.Urb4 = this.roundValue(boqItem.Price * fractions[3], 'Urb4');
				boqItem.Urb5 = this.roundValue(boqItem.Price * fractions[4], 'Urb5');
				boqItem.Urb6 = this.roundValue(boqItem.Price * fractions[5], 'Urb6');

				// When we round the resulting Urb1-6 values their sum might not be to given Price
				// -> add or remove a possible difference to the final urb6
				fractionSum = boqItem.Urb1 + boqItem.Urb2 + boqItem.Urb3 + boqItem.Urb4 + boqItem.Urb5 + boqItem.Urb6;
				let diff = boqItem.Price - fractionSum;
				if(diff !== 0) {
					boqItem.Urb6 += diff;
				}

				// For the Oc values we can use the same fractions for they should be identical between Hc and Oc values
				boqItem.Urb1Oc = this.roundValue(boqItem.PriceOc * fractions[0], 'Urb1OC');
				boqItem.Urb2Oc = this.roundValue(boqItem.PriceOc * fractions[1], 'Urb2OC');
				boqItem.Urb3Oc = this.roundValue(boqItem.PriceOc * fractions[2], 'Urb3OC');
				boqItem.Urb4Oc = this.roundValue(boqItem.PriceOc * fractions[3], 'Urb4OC');
				boqItem.Urb5Oc = this.roundValue(boqItem.PriceOc * fractions[4], 'Urb5OC');
				boqItem.Urb6Oc = this.roundValue(boqItem.PriceOc * fractions[5], 'Urb6OC');

				fractionSum = boqItem.Urb1Oc + boqItem.Urb2Oc + boqItem.Urb3Oc + boqItem.Urb4Oc + boqItem.Urb5Oc + boqItem.Urb6Oc;
				diff = boqItem.PriceOc - fractionSum;
				if(diff !== 0) {
					boqItem.Urb6Oc += diff;
				}
			} else {
				// Reset the Urb's

				// We don't have to adjust the boqItem urbs if they are already reset
				if (fractionSum === 0) {
					return; // No adjustments necessary
				}

				boqItem.Urb1 = 0;
				boqItem.Urb2 = 0;
				boqItem.Urb3 = 0;
				boqItem.Urb4 = 0;
				boqItem.Urb5 = 0;
				boqItem.Urb6 = 0;

				boqItem.Urb1Oc = 0;
				boqItem.Urb2Oc = 0;
				boqItem.Urb3Oc = 0;
				boqItem.Urb4Oc = 0;
				boqItem.Urb5Oc = 0;
				boqItem.Urb6Oc = 0;
			}
		}
	}

	/**
	 * @ngdoc function
	 * @name calcParentItem
	 * @function
	 * @methodOf boq.main.boqMainServiceFactory
	 * @description Calculate the parent boqItem by traversing its child items and summing up the according values.
	 * We don't iterate over the whole tree but only stay on the level of the parent boqItem and its children.
	 * @param {Object} parentItem to start the calculation with
	 */
	protected calcParentItem(parentItem: IBoqItemEntity) {

		if (!parentItem) {
			return;
		}

		// Now look for the children of this parent and sum up the corresponding values to the parent
		let childItem: IBoqItemEntity | null = null;
		let sumBudgetTotal = 0;
		let vatPercent = this.boqItemCalculateOptions?.getVatPercentFunc(parentItem) ?? 0;
		let childCount = Array.isArray(parentItem.BoqItems) ? parentItem.BoqItems.length : 0;

		this.roundInitialValues(parentItem);

		// Reset old values
		parentItem.ItemTotal = 0;
		parentItem.ExtraIncrement = 0;
		parentItem.ExtraIncrementOc = 0;
		parentItem.PreEscalation = 0;

		// Todo-Boq: The following properties are not in the current generated IBoqItemEntity interface and can only be accessed via index signature at the moment.
		// Todo-Boq: We have to clarify this first, before we use them, so we skip them at the moment
/*
		parentItem.IQPreEscalation = 0;
		parentItem.PreEscalationTotalForBQ =0;
		parentItem.PreEscalationTotalForIQ =0;
		parentItem.BQPreEscalation = 0;
*/
		parentItem.PreEscalationOc = 0;
		parentItem.Finalprice = 0;
		parentItem.DiscountedPrice = 0;
		parentItem.ItemTotalOc = 0;
		parentItem.FinalpriceOc = 0;
		parentItem.DiscountedPriceOc = 0;
		parentItem.Hours = 0;
		parentItem.Finalgross = 0;
		parentItem.FinalgrossOc = 0;

		// Todo-Boq: The following properties are not in the current generated IBoqItemEntity interface and can only be accessed via index signature at the moment.
		// Todo-Boq: We have to clarify this first, before we use them, so we skip them at the moment
/*
		parentItem.ColVal1Total = 0;
		parentItem.ColVal2Total = 0;
		parentItem.ColVal3Total = 0;
		parentItem.ColVal4Total = 0;
		parentItem.ColVal5Total = 0;
*/

		// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
		if(option.serviceName === 'qtoBoqStructureService') {
			service.reSetQtoBoqParentNewFinalPrice(parentItem);
		}
*/

		if (!BoqItemTreeHelper.isDivisionOrRootWithIT(parentItem)) {
			parentItem.BudgetTotal = 0;
			parentItem.BudgetDifference = 0;
		} else {
			if (!parentItem.BudgetFixedTotal) {
				parentItem.BudgetTotal = 0;
			}
		}

		// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
		if (Object.prototype.hasOwnProperty.call(parentItem, 'TotalQuantity')) {
			parentItem.TotalPrice = 0;
			parentItem.OrdItemTotal = 0;
			parentItem.TotalHours = 0;
			parentItem.PreEscalationTotal = 0;
			parentItem.ExtraTotal = 0;
			parentItem.PreEscalationTotalForIQ = 0;
			parentItem.PreEscalationTotalForBQ = 0;
			parentItem.IQPreEscalation = 0;
			parentItem.BQPreEscalation = 0;
			parentItem.Performance = 0;
		}
*/
		// Iterate over children and calculate Finalprice and Hours

		for (let i = 0; i < childCount; i++) {
			childItem = parentItem.BoqItems ? parentItem.BoqItems[i] : null;
			if (childItem) {
				if (((BoqItemHelper.isItem(childItem) || BoqItemHelper.isSurchargeItem(childItem)) && BoqItemTreeHelper.isItemWithIT(childItem)) || (BoqItemHelper.isDivisionOrRoot(childItem) && BoqItemTreeHelper.isDivisionOrRootWithIT(childItem))) {
					// The child item has an item total and therefore contributes to the parent totals
					parentItem.ItemTotal += childItem.Finalprice;
					parentItem.ItemTotalOc += childItem.FinalpriceOc;
					parentItem.ExtraIncrement += childItem.ExtraIncrement;
					parentItem.ExtraIncrementOc += childItem.ExtraIncrementOc;
					parentItem.PreEscalation += childItem.PreEscalation;

					// Todo-Boq: The following properties are not in the currently generated IBoqItemEntity interface and can only be accessed via index signature at the moment.
					// Todo-Boq: We have to clarify this first, before we use them, so we skip them at the moment
/*
					if (childItem.IQPreEscalation) {
						parentItem.IQPreEscalation += childItem.IQPreEscalation;
					} else {
						var _iqPreEscalation = BoqItemTreeHelper.isItemWithIT(childItem) ? (childItem.DiscountedUnitprice * childItem.InstalledQuantity * childItem.Factor) : 0;
						parentItem.IQPreEscalation += _iqPreEscalation;
					}
					if (childItem.BQPreEscalation) {
						parentItem.BQPreEscalation += childItem.BQPreEscalation;

					} else {
						var _bqPreEscalation = BoqItemTreeHelper.isItemWithIT(childItem) ? (childItem.DiscountedUnitprice * childItem.BilledQuantity * childItem.Factor) : 0;
						parentItem.BQPreEscalation += _bqPreEscalation;
					}
*/
					parentItem.PreEscalationOc += childItem.PreEscalationOc;
					parentItem.Finalprice += childItem.Finalprice;
					parentItem.FinalpriceOc += childItem.FinalpriceOc;
					parentItem.Finalgross += childItem.Finalgross;
					parentItem.FinalgrossOc += childItem.FinalgrossOc;
					parentItem.Hours += childItem.Hours;

					// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
					if(option.serviceName === 'qtoBoqStructureService') {
						service.sumQtoBoqParentNewFinalPrice(parentItem,childItem);
					}
*/
					// Todo-Boq: Currently we skip the handling of the userdefined columns
					// service.calcUserDefinedColumnOfParentItem(parentItem,childItem);

					if (!parentItem.BudgetFixedTotal) {
						parentItem.BudgetTotal += childItem.BudgetTotal;
					}

					sumBudgetTotal += childItem.BudgetTotal;

					// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
					if (Object.prototype.hasOwnProperty.call(parentItem, 'TotalQuantity')) {
						parentItem.TotalPrice += childItem.TotalPrice;
						parentItem.OrdItemTotal += childItem.OrdItemTotal ? childItem.OrdItemTotal : 0;
						parentItem.TotalHours += childItem.TotalHours;
						parentItem.PreEscalationTotal += childItem.PreEscalationTotal;
						parentItem.ExtraTotal += childItem.ExtraTotal;
						parentItem.Performance += childItem.Performance;

						if(childItem.PreEscalationTotalForBQ){
							parentItem.PreEscalationTotalForBQ += childItem.PreEscalationTotalForBQ;

						}else{
							let preEscatotalForBQ = childItem.BQTotalQuantity * childItem.DiscountedUnitprice * childItem.Factor;
							parentItem.PreEscalationTotalForBQ += preEscatotalForBQ;
						}

						if(childItem.PreEscalationTotalForIQ){
							parentItem.PreEscalationTotalForIQ += childItem.PreEscalationTotalForIQ;
						}else {
							let preEscatotalForIQ = childItem.IQTotalQuantity * childItem.DiscountedUnitprice * childItem.Factor;
							parentItem.PreEscalationTotalForIQ += preEscatotalForIQ;
						}
					}
 */
				} else if (((BoqItemHelper.isItem(childItem) || BoqItemHelper.isSurchargeItem(childItem)) && !BoqItemTreeHelper.isItemWithIT(childItem)) || (BoqItemHelper.isDivisionOrRoot(childItem) && !BoqItemTreeHelper.isDivisionOrRootWithIT(childItem))) {
					if (!BoqItemTreeHelper.isDisabledOrNA(childItem)) {
						if (!parentItem.BudgetFixedTotal) {
							parentItem.BudgetTotal += childItem.BudgetTotal;
						}

						sumBudgetTotal += childItem.BudgetTotal;
					}

					// That initialization seems to be not necessary in general and it would be a bug in context with the "Billing of special items" (see backend code 'BoqItemEnity.IsItemForBillingOfSpecialItems')
					// The child item doesn't have an item total so it's totals are set to zero (this is just for consistency reasons) and it doesn't contribute to the parent totals,
					childItem.ItemTotal = 0;
					childItem.PreEscalation = 0;

					childItem.Finalprice = 0;
					childItem.DiscountedPrice = 0;
					childItem.ItemTotalOc = 0;
					childItem.PreEscalationOc = 0;
					childItem.FinalpriceOc = 0;
					childItem.DiscountedPriceOc = 0;
					childItem.Hours = 0;

					// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
					/*
					childItem.IQPreEscalation = 0;
					childItem.BQPreEscalation = 0;

					if (Object.prototype.hasOwnProperty.call(childItem, 'TotalQuantity')) {
						childItem.TotalPrice = 0;
						childItem.OrdItemTotal = 0;
						childItem.TotalHours = 0;
						childItem.PreEscalationTotal = 0;
						childItem.ExtraTotal = 0;
						childItem.Performance = 0;
					}
					*/
				}
			}
		}

		parentItem.BudgetDifference = parentItem.BudgetTotal - sumBudgetTotal;

		if (BoqItemTreeHelper.isItemWithIT(parentItem) || BoqItemTreeHelper.isDivisionOrRootWithIT(parentItem)) {
			if (parentItem.IsLumpsum) {
				parentItem.Finalprice = parentItem.LumpsumPrice;
				parentItem.FinalpriceOc = parentItem.LumpsumPriceOc;
				parentItem.Finalgross = this.roundValue(parentItem.Finalprice * (100 + vatPercent) / 100, 'Finalgross');
				parentItem.FinalgrossOc = this.roundValue(parentItem.FinalpriceOc * (100 + vatPercent) / 100, 'FinalgrossOc');
			}

			let parentDiscount = parentItem.Discount, discountgross = parentDiscount;
			if (parentItem.DiscountPercentIt !== 0 && parentItem.Discount === 0) {
				parentDiscount = (parentItem.Finalprice * parentItem.DiscountPercentIt / 100);
				discountgross = (parentItem.Finalgross * parentItem.DiscountPercentIt / 100);
			} else {
				discountgross = parentDiscount * (100 + vatPercent) / 100;
			}

			let parentDiscountOc = parentItem.DiscountOc, discountOcgross = parentDiscountOc;
			if (parentItem.DiscountPercentIt !== 0 && parentItem.DiscountOc === 0) {
				parentDiscountOc = (parentItem.FinalpriceOc * parentItem.DiscountPercentIt / 100);
				discountOcgross = (parentItem.FinalgrossOc * parentItem.DiscountPercentIt / 100);
			} else {
				discountOcgross = parentDiscountOc * (100 + vatPercent) / 100;
			}

			parentItem.Finalprice -= this.roundValue(parentDiscount, 'Discount'); // discount => abs (-)
			parentItem.FinalpriceOc -= this.roundValue(parentDiscountOc, 'DiscountOc'); // discount => abs (-)
			parentItem.Finalgross -= this.roundValue(discountgross, 'Discount');
			parentItem.FinalgrossOc -= this.roundValue(discountOcgross, 'DiscountOc');

			// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
			if (Object.prototype.hasOwnProperty.call(parentItem, 'TotalQuantity')) {
				// Calculate the discount values
				if (parentItem.DiscountPercentIt !== 0 && parentItem.Discount === 0) {
					parentDiscount = (parentItem.TotalPrice * parentItem.DiscountPercentIt / 100);
				}

				parentItem.TotalPrice  -= parentDiscount;
				parentItem.TotalPriceOc = parentItem.TotalPrice * localData.currentExchangeRate;
			}
*/
		} else {
			parentItem.ItemTotal = 0;
			parentItem.Finalprice = 0;
			parentItem.ItemTotalOc = 0;
			parentItem.FinalpriceOc = 0;
			parentItem.Hours = 0;
		}

		// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
		if (Object.prototype.hasOwnProperty.call(parentItem, 'TotalQuantity')) {
			service.calcDependantValues(parentItem, 'TotalPrice');
		}
		if(option.serviceName === 'qtoBoqStructureService') {
			service.initQtoBoqNewFinalPrices(parentItem);		}
 */
	}

	/**
	 * @ngdoc function
	 * @name calcParentChain
	 * @function
	 * @methodOf boq.main.boqMainServiceFactory
	 * @description Climb up the parent chain and calculate the visited items
	 * @param {Object} boqItem to start the calculation with
	 * @param {Boolean} calcChildrenFirst indicates that the children of the given boqItem have to be calculated first before calculating up the parent chain
	 * @param {String} changePropertyName tells if there was a special property changed that now causes the calculation of the parent chain.
	 */
	protected calcParentChain(boqItem: IBoqItemEntity, calcChildrenFirst: boolean, changePropertyName?: string) {
		if (boqItem.IsOenBoq) { // OENORM currently does NOT calculate on the client
			return;
		}

		let sumValues = new BoqItemSumValues();

		let vatPercent = 0;

		if (!boqItem) {
			return;
		}

		// Todo BH: I'm not really sure if 'boqItem' has to be marked as an 'affected' boqItem. I assume that it's already marked as a 'modified' boqItem so also marking it as an 'affected' would do the job twice.
		if (BoqItemHelper.isItem(boqItem) || BoqItemHelper.isSurchargeItem(boqItem)) {
			// To be sure the boqItem is calculated we simply perform the calculation now
			// even though the calculation may have already been done before.
			this.calcFinalPriceHoursNew(boqItem, undefined, undefined, changePropertyName);
		} else if (BoqItemHelper.isDivisionOrRoot(boqItem)) {
			this.roundInitialValues(boqItem);
			if (calcChildrenFirst) {
				sumValues.reset();

				// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
				let calculatedProperties : string[] | undefined;
/*
				if(option.serviceName === 'qtoBoqStructureService'){
					service.initQtoSumValues(sumValues);
				}

				if (!_.isEmpty(changePropertyName) && (changePropertyName === 'PercentageQuantity' || changePropertyName === 'CumulativePercentage')) {
					calculatedProperties.push(changePropertyName);
					calculatedProperties = calculatedProperties.concat(['TotalPrice', 'TotalHours']);
				} else {
					calculatedProperties = undefined;
				}
*/
				this.calcChildTree(boqItem, sumValues, calculatedProperties, undefined, changePropertyName);

				// Set new boqItem totals according to sum values in child calculation
				boqItem.DiscountedPrice = 0; // On this level there is no accumulated discounted price
				boqItem.DiscountedPriceOc = 0;
				boqItem.ItemTotal = sumValues.total;
				boqItem.ItemTotalOc = sumValues.totalOc;

				boqItem.ExtraIncrement = sumValues.extraIncrement;
				boqItem.ExtraIncrementOc = sumValues.extraIncrementOc;
				boqItem.PreEscalation = sumValues.preEscalation;

				// Todo-Boq: The following properties are not in the currently generated IBoqItemEntity interface and can only be accessed via index signature at the moment.
				// Todo-Boq: We have to clarify this first, before we use them, so we skip them at the moment
/*
				boqItem.IQPreEscalation =  sumValues.iqPreEscalation;
				boqItem.BQPreEscalation =  sumValues.bqPreEscalation;
*/
				boqItem.PreEscalationOc = sumValues.preEscalationOc;

				if (boqItem.IsLumpsum) {
					vatPercent = this.boqItemCalculateOptions?.getVatPercentFunc(boqItem) ?? 0;
					boqItem.Finalprice = boqItem.LumpsumPrice;
					boqItem.FinalpriceOc = boqItem.LumpsumPriceOc;
					boqItem.Finalgross = this.roundValue(boqItem.Finalprice * (100 + vatPercent) / 100, 'Finalgross');
					boqItem.FinalgrossOc = this.roundValue(boqItem.FinalpriceOc * (100 + vatPercent) / 100, 'FinalgrossOc');
				} else {
					boqItem.Finalprice = sumValues.total;
					boqItem.FinalpriceOc = sumValues.totalOc;
					boqItem.Finalgross = sumValues.totalgross;
					boqItem.FinalgrossOc = sumValues.totalgrossOc;

					if (!BoqItemTreeHelper.isDivisionOrRootWithIT(boqItem)) {
						boqItem.BudgetTotal = 0;
						boqItem.BudgetDifference = 0;
					} else {
						if (!boqItem.BudgetFixedTotal) {
							boqItem.BudgetTotal = sumValues.totalBudget;
						}

						boqItem.BudgetDifference = boqItem.BudgetTotal - sumValues.totalBudget;
					}
				}

				// Calculate the discount values
				let discount = boqItem.Discount, discountgross = discount;
				let discountOc = boqItem.DiscountOc, discountgrossOc = discountOc;
				if (boqItem.DiscountPercentIt !== 0 && boqItem.Discount === 0) {
					discount = (boqItem.Finalprice * boqItem.DiscountPercentIt / 100);
					discountgross = (boqItem.Finalgross * boqItem.DiscountPercentIt / 100);
				} else {
					discountgross = discount * (100 + vatPercent) / 100;
				}

				if (boqItem.DiscountPercentIt !== 0 && boqItem.DiscountOc === 0) {
					discountOc = (boqItem.FinalpriceOc * boqItem.DiscountPercentIt / 100);
					discountgrossOc = (boqItem.FinalgrossOc * boqItem.DiscountPercentIt / 100);
				} else {
					discountgrossOc = discountOc * (100 + vatPercent) / 100;
				}

				boqItem.Finalprice -= this.roundValue(discount, 'Discount'); // discount => abs (-)
				boqItem.FinalpriceOc -= this.roundValue(discountOc, 'DiscountOc');
				boqItem.Finalgross -= this.roundValue(discountgross, 'Discount');
				boqItem.FinalgrossOc -= this.roundValue(discountgrossOc, 'DiscountOc');

				boqItem.Hours = sumValues.hours;

				// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
				if (Object.prototype.hasOwnProperty.call(boqItem, 'TotalQuantity')) {
					boqItem.TotalPrice   = sumValues.totalPrice;
					boqItem.OrdItemTotal = sumValues.ordItemTotal;

					// Calculate the discount values
					if (boqItem.DiscountPercentIt !== 0 && boqItem.Discount === 0) {
						discount = (boqItem.TotalPrice * boqItem.DiscountPercentIt / 100);
					}

					boqItem.TotalPrice  -= discount;
					boqItem.TotalPriceOc = boqItem.TotalPrice * localData.currentExchangeRate;

					boqItem.PreEscalationTotal = sumValues.preEscalationTotal;
					boqItem.ExtraTotal = sumValues.extraTotal;

					boqItem.TotalHours = sumValues.totalHours;

					boqItem.PreEscalationTotalForIQ = sumValues.PreEscalationTotalForIQ;
					boqItem.PreEscalationTotalForBQ = sumValues.PreEscalationTotalForBQ;

					boqItem.Performance = sumValues.performance;

					service.calcDependantValues(boqItem, 'TotalPrice');
				}
*/
			} else {
				// For boqItem is a parent boqItem itself we simply sum up the values of its children without recursively calculating the whole tree.
				this.calcParentItem(boqItem);
			}
		}

		// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
		if(option.serviceName === 'qtoBoqStructureService') {
			service.initQtoBoqNewFinalPrices(boqItem);
		}
*/
		// Determine the parent boqItem
		let parentItem = boqItem.BoqItemParent;

		// Todo-Boq: Currently there seems to be no replacement for the following call in the new client implementation,
		// Todo-Boq: and question remains, if it is still needed
		//service.fireItemModified(boqItem); // Fire that the boqItem is changed to update it in the UI.

		// Todo-Boq: Currently we skip the handling of the userdefined columns
/*
		// mark user define price as modified
		let dynamicUserDefinedColumnsService = service.getDynamicUserDefinedColumnsService();
		if(boqItem.isUDPChanged && dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.markUdpAsModified)){
			dynamicUserDefinedColumnsService.markUdpAsModified(boqItem);
			boqItem.isUDPChanged = false;
		}
*/
		if (!parentItem) {
			return;
		}

		// Recursively climb up the parent chain
		this.calcParentChain(parentItem, false, changePropertyName);
	}

	/**
	 * @ngdoc function
	 * @name calcChildTree
	 * @function
	 * @methodOf boq.main.boqMainServiceFactory
	 * @description Traverse the children tree and calculate the visited items
	 * @param {Object} parentItem to start the calculation with
	 * @param {Object} sumValues to gather sums of currently visited hierarchical level and report them to the upper level
	 * @param {Array} calculatedProperties string held in an array indicating which boqItem properties are to be summed up.
	 * @param {Array} boqItemList boq item tree.
	 * @param {String} changePropertyName tells if there was a special property changed that now causes the calculation
	 * If this value is undefined we sum up all handled summable values.
	 */
	protected calcChildTree(parentItem: IBoqItemEntity, sumValues: BoqItemSumValues, calculatedProperties?: string[], boqItemList?: IBoqItemEntity[], changePropertyName?: string) {

		if (!parentItem) {
			return;
		}

		// Now look for the children of this parent and recursively visit the children and sum up the corresponding values to the parent
		let childItem = null;
		let mySumValues = new BoqItemSumValues();

		let discount = 0;
		let discountgross = 0;
		let oldItemTotal = 0;
		let oldFinalprice = 0;
		let oldFinalgross = 0;
		let oldHours = 0;
		let oldBudgetTotal = 0;
		let minDiff = 0.000001;
		let vatPercent = 0;
		let initialCalculatedProperties = calculatedProperties;

		if (Array.isArray(parentItem.BoqItems) && parentItem.BoqItems.length > 0) {

			// Reset old values
			parentItem.DiscountedPrice = 0; // On this level there is no accumulated discounted price

			this.roundInitialValues(parentItem);

			if (!calculatedProperties || calculatedProperties.indexOf('Finalprice') !== -1) {
				parentItem.ItemTotal = 0;
				parentItem.ItemTotalOc = 0;
				parentItem.ExtraIncrement = 0;
				parentItem.ExtraIncrementOc = 0;
				parentItem.PreEscalation = 0;

				// Todo-Boq: The following properties are not in the currently generated IBoqItemEntity interface and can only be accessed via index signature at the moment.
				// Todo-Boq: We have to clarify this first, before we use them, so we skip them at the moment
/*				parentItem.IQPreEscalation = 0;
				parentItem.BQPreEscalation = 0;
*/

				parentItem.PreEscalationOc = 0;
				parentItem.Finalprice = 0;
				parentItem.FinalpriceOc = 0;
				parentItem.Finalgross = 0;
				parentItem.FinalgrossOc = 0;

				if (!BoqItemTreeHelper.isDivisionOrRootWithIT(parentItem)) {
					parentItem.BudgetTotal = 0;
					parentItem.BudgetDifference = 0;
				} else {
					if (!parentItem.BudgetFixedTotal) {
						parentItem.BudgetTotal = 0;
					}
				}
			}

			if (!calculatedProperties || calculatedProperties.indexOf('Hours') !== -1) {
				parentItem.Hours = 0;
			}

			// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
			if (_.isArray(calculatedProperties) && (_.includes(calculatedProperties, 'TotalPrice') || _.includes(calculatedProperties, 'TotalHours'))) {
				service.initInstalledValues(parentItem);
			}

			if (_.isArray(calculatedProperties) && (_.includes(calculatedProperties, 'PercentageQuantity') || _.includes(calculatedProperties, 'CumulativePercentage'))) {
				let propertyName = _.includes(calculatedProperties, 'PercentageQuantity') ? 'PercentageQuantity' : 'CumulativePercentage';
				service.dispatchOnInstalledChildValues(parentItem, propertyName);
				// Reset calculatedProperties to force complete recalculation of all values
				calculatedProperties = undefined;
			}

			if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalPrice') !== -1 && Object.prototype.hasOwnProperty.call(parentItem, 'TotalQuantity')) {
				parentItem.TotalPrice = 0;
				parentItem.OrdItemTotal = 0;
				parentItem.PreEscalationTotal = 0;
				parentItem.ExtraTotal = 0;
				parentItem.Performance = 0;
			}

			if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalHours') !== -1 && Object.prototype.hasOwnProperty.call(parentItem, 'TotalQuantity')) {
				parentItem.TotalHours = 0;
			}
*/

			// Recursively iterate over children and calculate Finalprice and Hours
			for (let i = 0; i < parentItem.BoqItems.length; i++) {
				childItem = parentItem.BoqItems[i];

				if (childItem != undefined && childItem !== null) {

					oldItemTotal = childItem.ItemTotal;
					oldFinalprice = childItem.Finalprice;
					oldFinalgross = childItem.Finalgross;
					oldHours = childItem.Hours;
					oldBudgetTotal = childItem.BudgetTotal;
					vatPercent = this.boqItemCalculateOptions?.getVatPercentFunc(childItem) ?? 0;

					if (BoqItemHelper.isItem(childItem) || BoqItemHelper.isSurchargeItem(childItem)) {
						// Hint: Check if item has a total or not is done in calcFinalPriceHoursNew itself !!

						this.calcFinalPriceHoursNew(childItem, calculatedProperties, boqItemList, changePropertyName);

						// Add the changed item to the affected item list
						if ((!calculatedProperties || calculatedProperties.indexOf('Finalprice') !== -1 || calculatedProperties.indexOf('Hours') !== -1) &&
							Math.abs(childItem.ItemTotal - oldItemTotal) > minDiff ||
							Math.abs(childItem.Finalprice - oldFinalprice) > minDiff ||
							Math.abs(childItem.Finalgross - oldFinalgross) > minDiff ||
							Math.abs(childItem.Hours - oldHours) > minDiff ||
							Math.abs(childItem.BudgetTotal - oldBudgetTotal) > minDiff) {

							// Todo-Boq: Currently we haven't implemented the affectedItem list yet
							// this.boqItemDataService?.addAffectedItem(childItem);
						}
					} else if (BoqItemHelper.isDivisionOrRoot(childItem)) {

						// Reset children sum container
						mySumValues.reset();

						// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
						if(option.serviceName === 'qtoBoqStructureService'){
							service.initQtoSumValues(mySumValues);
						}
*/
						// Recursively dig deeper
						this.calcChildTree(childItem, mySumValues, initialCalculatedProperties, boqItemList, changePropertyName);

						if (BoqItemTreeHelper.isDivisionOrRootWithIT(childItem)) {

							if (!calculatedProperties || calculatedProperties.indexOf('Finalprice') !== -1) {

								this.roundInitialValues(childItem);

								childItem.DiscountedPrice = 0; // On this level there is no accumulated discounted price
								childItem.DiscountedPriceOc = 0;
								childItem.ItemTotal = mySumValues.total;
								childItem.ItemTotalOc = mySumValues.totalOc;

								childItem.ExtraIncrement = mySumValues.extraIncrement;
								childItem.ExtraIncrementOc = mySumValues.extraIncrementOc;
								childItem.PreEscalation = mySumValues.preEscalation;

								childItem.PreEscalationOc = mySumValues.preEscalationOc;

								// Todo-Boq: The following properties are not in the currently generated IBoqItemEntity interface and can only be accessed via index signature at the moment.
								// Todo-Boq: We have to clarify this first, before we use them, so we skip them at the moment
/*
								childItem.IQPreEscalation = mySumValues.IQPreEscalation;
								childItem.BQPreEscalation = mySumValues.BQPreEscalation;
*/

								if (childItem.IsLumpsum) {
									childItem.Finalprice = childItem.LumpsumPrice;
									childItem.FinalpriceOc = childItem.LumpsumPriceOc;
									childItem.Finalgross = this.roundValue(childItem.Finalprice * (100 + vatPercent) / 100, 'Finalgross');
									childItem.FinalgrossOc = this.roundValue(childItem.FinalpriceOc * (100 + vatPercent) / 100, 'FinalgrossOc');
								} else {
									childItem.Finalprice = mySumValues.total;
									childItem.FinalpriceOc = mySumValues.totalOc;
									childItem.Finalgross = mySumValues.totalgross;
									childItem.FinalgrossOc = mySumValues.totalgrossOc;

									if (!childItem.BudgetFixedTotal) {
										childItem.BudgetTotal = mySumValues.totalBudget;
									}

									childItem.BudgetDifference = childItem.BudgetTotal - mySumValues.totalBudget;
								}

								// Calculate the discount values
								discount = childItem.Discount;
								discountgross = childItem.Discount;
								if (childItem.DiscountPercentIt !== 0 && childItem.Discount === 0) {
									discount = (childItem.Finalprice * childItem.DiscountPercentIt / 100);
									discountgross = (childItem.Finalgross * childItem.DiscountPercentIt / 100);
								} else {
									discountgross = discount * (100 + vatPercent) / 100;
								}

								let discountOc = childItem.DiscountOc;
								let discountgrossOc = childItem.DiscountOc;
								if (childItem.DiscountPercentIt !== 0 && childItem.DiscountOc === 0) {
									discountOc = (childItem.FinalpriceOc * childItem.DiscountPercentIt / 100);
									discountgrossOc = (childItem.FinalgrossOc * childItem.DiscountPercentIt / 100);
								} else {
									discountgrossOc = discountOc * (100 + vatPercent) / 100;
								}

								childItem.Finalprice -= this.roundValue(discount, 'Discount'); // discount => abs (-)
								childItem.FinalpriceOc -= this.roundValue(discountOc, 'DiscountOc');
								childItem.Finalgross -= this.roundValue(discountgross, 'Discount');
								childItem.FinalgrossOc -= this.roundValue(discountgrossOc, 'DiscountOc');
							}

							if (!calculatedProperties || calculatedProperties.indexOf('Hours') !== -1) {
								childItem.Hours = mySumValues.hours;
							}

							// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
							if (!calculatedProperties || calculatedProperties.indexOf('TotalPrice') !== -1 && Object.prototype.hasOwnProperty.call(childItem, 'TotalQuantity')) {
								childItem.TotalPrice   = mySumValues.totalPrice;
								childItem.OrdItemTotal = mySumValues.ordItemTotal;

								childItem.PreEscalationTotalForBQ = mySumValues.PreEscalationTotalForBQ;
								childItem.PreEscalationTotalForIQ = mySumValues.PreEscalationTotalForIQ;
								childItem.BQPreEscalation = mySumValues.BQPreEscalation;
								childItem.IQPreEscalation = mySumValues.IQPreEscalation;

								// Calculate the discount values
								discount = childItem.Discount;
								if (childItem.DiscountPercentIt !== 0 && childItem.Discount === 0) {
									discount = (childItem.TotalPrice * childItem.DiscountPercentIt / 100);
								}

								childItem.TotalPrice  -= discount;
								childItem.TotalPriceOc = childItem.TotalPrice * localData.currentExchangeRate;

								childItem.PreEscalationTotal = mySumValues.preEscalationTotal;
								childItem.ExtraTotal = mySumValues.extraTotal;

								childItem.Performance = mySumValues.performance;

								if(option.serviceName === 'qtoBoqStructureService') {
									service.calcQtoBoqRootItemNewFinalPrice(mySumValues,childItem);
								}
								service.calcDependantValues(childItem, 'TotalPrice');
							}

							if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalHours') !== -1 && Object.prototype.hasOwnProperty.call(childItem, 'TotalQuantity')) {
								childItem.TotalHours = mySumValues.totalHours;
							}
*/
						} else {
							if (!calculatedProperties || calculatedProperties.indexOf('Finalprice') !== -1) {
								childItem.ItemTotal = 0;
								childItem.ItemTotalOc = 0;
								childItem.PreEscalation = 0;

								// Todo-Boq: The following properties are not in the currently generated IBoqItemEntity interface and can only be accessed via index signature at the moment.
								// Todo-Boq: We have to clarify this first, before we use them, so we skip them at the moment
/*
								childItem.IQPreEscalation = 0;
								childItem.BQPreEscalation = 0;
 */
								childItem.PreEscalationOc = 0;
								childItem.Finalprice = 0;
								childItem.FinalpriceOc = 0;
								childItem.Finalgross = 0;
								childItem.FinalgrossOc = 0;

								if (!BoqItemTreeHelper.isDivisionOrRootWithIT(childItem)) {
									childItem.BudgetTotal = 0;
									childItem.BudgetDifference = 0;
								} else {
									if (!childItem.BudgetFixedTotal) {
										childItem.BudgetTotal = mySumValues.totalBudget;
									}

									childItem.BudgetDifference = childItem.BudgetTotal - mySumValues.totalBudget;
								}
							}
							if (!calculatedProperties || calculatedProperties.indexOf('Hours') !== -1) {
								childItem.Hours = 0;
							}

							// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
							if (!calculatedProperties || calculatedProperties.indexOf('TotalPrice') !== -1 && Object.prototype.hasOwnProperty.call(childItem, 'TotalQuantity')) {
								childItem.TotalPrice = 0;
								childItem.OrdItemTotal = 0;
								childItem.PreEscalationTotal = 0;
								childItem.Performance = 0;
							}
							if (!calculatedProperties || calculatedProperties.indexOf('TotalHours') !== -1 && Object.prototype.hasOwnProperty.call(childItem, 'TotalQuantity')) {
								childItem.TotalHours = 0;
							}
 */
						}

						// Add the changed item to the affected item list
						if ((!calculatedProperties || calculatedProperties.indexOf('Finalprice') !== -1 || calculatedProperties.indexOf('Hours') !== -1) &&
							Math.abs(childItem.Finalprice - oldFinalprice) > minDiff ||
							Math.abs(childItem.Finalgross - oldFinalgross) > minDiff ||
							Math.abs(childItem.Hours - oldHours) > minDiff ||
							Math.abs(childItem.BudgetTotal - oldBudgetTotal) > minDiff) {

							// Todo-Boq: Currently we haven't implemented the affectedItem list yet
							// this.boqItemDataService?.addAffectedItem(childItem);
						}
					}

					// Report child sum values to parent
					if (!calculatedProperties || calculatedProperties.indexOf('Finalprice') !== -1) {
						sumValues.extraIncrement += childItem.ExtraIncrement;
						sumValues.extraIncrementOc += childItem.ExtraIncrementOc;
						sumValues.preEscalation += childItem.PreEscalation;
						sumValues.preEscalationOc += childItem.PreEscalationOc;
						sumValues.total += childItem.Finalprice;
						sumValues.totalOc += childItem.FinalpriceOc;
						sumValues.totalgross += childItem.Finalgross;
						sumValues.totalgrossOc += childItem.FinalgrossOc;
						sumValues.totalBudget += childItem.BudgetTotal;
					}
					if (!calculatedProperties || calculatedProperties.indexOf('Hours') !== -1) {
						sumValues.hours += childItem.Hours;
					}

					// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
					if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalPrice') !== -1 && Object.prototype.hasOwnProperty.call(childItem, 'TotalQuantity')) {
						sumValues.totalPrice   += childItem.TotalPrice;
						sumValues.ordItemTotal += childItem.OrdItemTotal ? childItem.OrdItemTotal : 0;
						sumValues.preEscalationTotal += childItem.PreEscalationTotal;
						sumValues.extraTotal += childItem.ExtraTotal;

						if(option.serviceName === 'qtoBoqStructureService'){
							service.calcQtoBoqSumValues(sumValues,childItem);
						}

						if(service.isDivisionOrRootWithIT(childItem)){
							sumValues.PreEscalationTotalForIQ +=childItem.PreEscalationTotalForIQ;
							sumValues.PreEscalationTotalForBQ +=childItem.PreEscalationTotalForBQ;

							sumValues.IQPreEscalation += childItem.IQPreEscalation;
							sumValues.BQPreEscalation +=childItem.BQPreEscalation;

						}
						else {
							if (Object.prototype.hasOwnProperty.call(childItem, 'IQTotalQuantity')){
								sumValues.PreEscalationTotalForIQ += childItem.IQTotalQuantity * childItem.DiscountedUnitprice * childItem.Factor;
							}

							if (Object.prototype.hasOwnProperty.call(childItem, 'BQTotalQuantity')){
								sumValues.PreEscalationTotalForBQ += childItem.BQTotalQuantity * childItem.DiscountedUnitprice * childItem.Factor;
							}

							if (Object.prototype.hasOwnProperty.call(childItem, 'InstalledQuantity')){
								sumValues.IQPreEscalation +=  service.isItemWithIT(childItem) ? (childItem.DiscountedUnitprice * childItem.InstalledQuantity * childItem.Factor): 0;
							}
							if (Object.prototype.hasOwnProperty.call(childItem, 'BilledQuantity')){
								sumValues.BQPreEscalation +=  service.isItemWithIT(childItem) ? (childItem.DiscountedUnitprice * childItem.BilledQuantity * childItem.Factor): 0;
							}

							if(option.serviceName === 'qtoBoqStructureService'){
								service.calcQtoBoqOrdPreEscalation(sumValues,childItem);
							}
						}

						sumValues.performance += childItem.Performance;

						service.calcDependantValues(childItem, 'TotalPrice');

						// Hint: For 'TotalPrice' is only a transient property we don't need to propagate it's change to the server via adding the item to the affected list.
					}
					if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalHours') !== -1 && Object.prototype.hasOwnProperty.call(childItem, 'TotalQuantity')) {
						sumValues.totalHours += childItem.TotalHours;

						// Hint: For 'TotalHours' is only a transient property we don't need to propagate it's change to the server via adding the item to the affected list.
					}
					if(option.serviceName === 'qtoBoqStructureService') {
						service.initQtoBoqNewFinalPrices(childItem,sumValues);
					}
 */
				}
			}
		}
	}

	/**
	 * @ngdoc function
	 * @name calcBoq
	 * @function
	 * @methodOf boq.main.boqMainServiceFactory
	 * @description Calculate the whole boq
	 * @param {number} newExchangeRate based on which the current monetary values are calculated from its related oc values.
	 * @param {Array} calculatedProperties string held in an array indicating which item properties are to be summed up.
	 * If this value is undefined we sum up all handled summable values.
	 */
	public calcBoq(rootBoqItem: IBoqItemEntity, newExchangeRate?: number, calculatedProperties?: string[]) {
		if (!rootBoqItem) {
			return;
		}

		let mySumValues = new BoqItemSumValues();
		let discount = rootBoqItem.Discount;
		let discountOc = rootBoqItem.DiscountOc;
		let vatPercent = this.boqItemCalculateOptions?.getVatPercentFunc(rootBoqItem) ?? 0;
		let discountgross = this.roundValue(rootBoqItem.Discount * (100 + vatPercent) / 100, 'Discount');
		let discountgrossOc = this.roundValue(rootBoqItem.DiscountOc * (100 + vatPercent) / 100, 'DiscountOc');

		if (newExchangeRate != null) {
			interface IConvertAllMonetaryValuesVisitor extends IBoqVisitorObject {
				newExchangeRate?: number
			}

			// First convert all basic home currency values (i.e. Price, Lumpsum and Discount) based on the newExchangeRate and the related oc.
			let convertAllMonetaryValuesVisitor : IConvertAllMonetaryValuesVisitor = {
				visitBoqItemFn: this.recalculateMonetaryValuesBasedOnNewExchangeRate,
				newExchangeRate: newExchangeRate
			};

			BoqItemTreeHelper.visitBoqItemsRecursively(undefined, rootBoqItem, 0, convertAllMonetaryValuesVisitor);
		}

		// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
		if(option.serviceName === 'qtoBoqStructureService'){
			service.initQtoSumValues(mySumValues);
		}
 */
		// Recursively dig deeper
		this.calcChildTree(rootBoqItem, mySumValues, calculatedProperties);

		// Set new item totals according to sum values in child calculation

		if (!calculatedProperties || calculatedProperties.indexOf('Finalprice') !== -1) {

			this.roundInitialValues(rootBoqItem);

			rootBoqItem.DiscountedPrice = 0; // On this level there is no accumulated discounted price
			rootBoqItem.DiscountedPriceOc = 0;
			rootBoqItem.ItemTotal = mySumValues.total;
			rootBoqItem.ItemTotalOc = mySumValues.totalOc;

			rootBoqItem.ExtraIncrement = mySumValues.extraIncrement;
			rootBoqItem.ExtraIncrementOc = mySumValues.extraIncrementOc;
			rootBoqItem.PreEscalation = mySumValues.preEscalation;

			// Todo-Boq: The following properties are not in the currently generated IBoqItemEntity interface and can only be accessed via index signature at the moment.
			// Todo-Boq: We have to clarify this first, before we use them, so we skip them at the moment
/*
			rootItem.IQPreEscalation = mySumValues.IQPreEscalation;
			rootItem.BQPreEscalation = mySumValues.BQPreEscalation;
*/
			rootBoqItem.PreEscalationOc = mySumValues.preEscalationOc;

			if (rootBoqItem.IsLumpsum) {
				rootBoqItem.Finalprice = rootBoqItem.LumpsumPrice;
				rootBoqItem.FinalpriceOc = rootBoqItem.LumpsumPriceOc;
				rootBoqItem.Finalgross = this.roundValue(rootBoqItem.Finalprice * (100 + vatPercent) / 100, 'Finalgross');
				rootBoqItem.FinalgrossOc = this.roundValue(rootBoqItem.FinalpriceOc * (100 + vatPercent) / 100, 'FinalgrossOc');
			} else {
				rootBoqItem.Finalprice = mySumValues.total;
				rootBoqItem.FinalpriceOc = mySumValues.totalOc;
				rootBoqItem.Finalgross = mySumValues.totalgross;
				rootBoqItem.FinalgrossOc = mySumValues.totalgrossOc;

				if (!BoqItemTreeHelper.isDivisionOrRootWithIT(rootBoqItem)) {
					rootBoqItem.BudgetTotal = 0;
					rootBoqItem.BudgetDifference = 0;
				} else {
					if (!rootBoqItem.BudgetFixedTotal) {
						rootBoqItem.BudgetTotal = mySumValues.totalBudget;
					}

					rootBoqItem.BudgetDifference = rootBoqItem.BudgetTotal - mySumValues.totalBudget;
				}
			}

			// Calculate the discount values
			if (rootBoqItem.DiscountPercentIt !== 0 && rootBoqItem.Discount === 0) {
				discount = (rootBoqItem.Finalprice * rootBoqItem.DiscountPercentIt / 100);
				discountgross = (rootBoqItem.Finalgross * rootBoqItem.DiscountPercentIt / 100);
			}
			if (rootBoqItem.DiscountPercentIt !== 0 && rootBoqItem.DiscountOc === 0) {
				discountOc = (rootBoqItem.FinalpriceOc * rootBoqItem.DiscountPercentIt / 100);
				discountgrossOc = (rootBoqItem.FinalgrossOc * rootBoqItem.DiscountPercentIt / 100);
			}

			rootBoqItem.Finalprice -= this.roundValue(discount, 'Discount'); // discount => abs (-)
			rootBoqItem.FinalpriceOc -= this.roundValue(discountOc, 'DiscountOc');
			rootBoqItem.Finalgross -= this.roundValue(discountgross, 'Discount');
			rootBoqItem.FinalgrossOc -= this.roundValue(discountgrossOc, 'DiscountOc');
		}
		if (!calculatedProperties || calculatedProperties.indexOf('Hours') !== -1) {
			rootBoqItem.Hours = mySumValues.hours;
		}

		// Todo-Boq: At the moment we ignore handling the following transient properties for they are only needed in QTO, PES and WIP
/*
		if (!calculatedProperties || calculatedProperties.indexOf('TotalPrice') !== -1 && Object.prototype.hasOwnProperty.call(rootItem, 'TotalQuantity')) {
			rootItem.TotalPrice   = mySumValues.totalPrice;
			rootItem.OrdItemTotal = mySumValues.ordItemTotal;

			// Calculate the discount values
			if (rootItem.DiscountPercentIt !== 0 && rootItem.Discount === 0) {
				discount = (rootItem.TotalPrice * rootItem.DiscountPercentIt / 100);
			}

			rootItem.TotalPrice  -= discount;
			rootItem.TotalPriceOc = rootItem.TotalPrice * localData.currentExchangeRate;

			rootItem.PreEscalationTotal = mySumValues.preEscalationTotal;
			rootItem.ExtraTotal = mySumValues.extraTotal;
			rootItem.PreEscalationTotalForIQ = mySumValues.PreEscalationTotalForIQ;
			rootItem.PreEscalationTotalForBQ = mySumValues.PreEscalationTotalForBQ;
			rootItem.BQPreEscalation = mySumValues.BQPreEscalation;
			rootItem.IQPreEscalation = mySumValues.IQPreEscalation;

			rootItem.Performance = mySumValues.performance;

			if(option.serviceName === 'qtoBoqStructureService') {
				service.calcQtoBoqRootItemNewFinalPrice(mySumValues,rootItem);
			}

			if (_.isArray(calculatedProperties) && (_.includes(calculatedProperties, 'TotalPrice'))) {
				service.calcDependantValues(rootItem, 'TotalPrice');
			}
		}
		if (!calculatedProperties || calculatedProperties.indexOf('TotalHours') !== -1 && Object.prototype.hasOwnProperty.call(rootItem, 'TotalQuantity')) {
			rootItem.TotalHours = mySumValues.totalHours;
		}
 */
	}

	/**
	 * @ngdoc function
	 * @name doCalculateOverGross
	 * @function
	 * @methodOf boqMainServiceFactory
	 * @description return setting indicating that calculation is driven by the gross values
	 * @returns {Boolean} flag indicating that calculation is driven by the gross values
	 */
	protected doCalculateOverGross(): boolean {
		return this.isCalculateOverGross;
	}

	/**
	 * @ngdoc function
	 * @name roundValue
	 * @function
	 * @methodOf boqMainServiceFactory
	 * @description Return the currently loaded rounding config details
	 * @param {Number} value to be rounded
	 * @param {Object} field of boq item telling which type of rounding config detail to use
	 * @returns  {number} rounded value
	 */
	protected roundValue(value: number, field: string): number;
	protected roundValue(value: number, detailType: BoqMainRoundingConfigDetailType): number;
	protected roundValue(value: number, fieldOrDetailType: string | BoqMainRoundingConfigDetailType): number {
		let roundedValue = value;

		if (!value && typeof value !== 'number') {
			return value;
		}

		if(fieldOrDetailType && typeof fieldOrDetailType === 'string') {
			roundedValue = this.boqRoundingService?.doRoundingValue(fieldOrDetailType, value) ?? value;
		} else {
			let boqRoundingConfigDetail = this.roundingConfigDetails?.find((item: IBoqRoundingConfigDetailEntity) => {
				return item.ColumnId === fieldOrDetailType;
			});
			roundedValue = this.boqRoundingService?.doRounding(value, '', boqRoundingConfigDetail) ?? value;
		}

		return roundedValue;
	}

	// Local helper to do rounding of initial, atomic values of boqItem
	private roundInitialValues(boqItem: IBoqItemEntity) {
		this.boqRoundingService?.roundInitialValues(boqItem);
	}

}