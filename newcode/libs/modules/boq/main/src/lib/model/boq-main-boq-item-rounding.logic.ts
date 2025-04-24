/* eslint-disable prefer-const */

import { IBoqItemEntity, IBoqRoundingConfigEntity, IBoqRoundingConfigDetailEntity } from '@libs/boq/interfaces';
import { BoqItemHelper, BoqMainRoundingMethod, BoqMainRoundTo } from './boq-main-boq-constants';

const initialPriceFields = [
	'Price',
	'PriceOc',
	'Pricegross',
	'PricegrossOc',
	'Cost',
	'CostOc',
	'Urb1',
	'Urb1Oc',
	'Urb2',
	'Urb2Oc',
	'Urb3',
	'Urb3Oc',
	'Urb4',
	'Urb4Oc',
	'Urb5',
	'Urb5Oc',
	'Urb6',
	'Urb6Oc',
	'UnitRateFrom',
	'UnitRateFromOc',
	'UnitRateTo',
	'UnitRateToOc',
	'DiscountPercent',
	'SurchargeFactor',
	'SurchargePercent',
	'BudgetPerUnit',
	'VobDirectCostPerUnit',
	'VobDirectCostPerUnitOc'
];

const initialAmountFields = [
	'LumpsumPrice',
	'LumpsumPriceOc',
	'Discount',
	'DiscountOc',
	'DiscountPercentIt'
];

const initialQuantitiesFields = [
	'Quantity',
	'QuantityAdj',
	'QuantityTarget',
	'ExSalesRejectedQuantity',
	'HoursUnit',
	'Hours',
	'QuantityMax'
];

export class BoqItemRoundingLogic {
	private roundingConfig?: IBoqRoundingConfigEntity | null;
	private roundingConfigDetails?: IBoqRoundingConfigDetailEntity[] | null;

	public constructor(boqRoundingConfig: IBoqRoundingConfigEntity | null, roundingConfigDetails: IBoqRoundingConfigDetailEntity[] | null) {
		this.roundingConfig = boqRoundingConfig;
		this.roundingConfigDetails = roundingConfigDetails;
	}

		// Rounding logic for Digits after decimal point
		private digitsAfterDecimalRounding = (function() {
			let decimalAdjust = function myself(type: string, num: number, decimalPlaces: number): number {
				if (type === 'round' && num < 0){
					return -myself(type, -num, decimalPlaces);
				}
				let shift = function(value: number, exponent: number) : number {
					let valueArray = (value + 'e').split('e');
					return +(valueArray[0] + 'e' + (+valueArray[1] + (exponent || 0))); // Use of unary + operator. Short from of converting string to number, i.e. +"22e-1" leads to 2.2 or +"22e1" leads to 220
				};
				let callMathOperation = function(mathOperation: string, num: number) : number {
					let result: number = num;
					switch(mathOperation) {
						case 'round':
							result = Math.round(num);
							break;
						case 'ceil':
							result = Math.ceil(num);
							break;
						case 'floor':
							result = Math.floor(num);
							break;
					}
					return result;
				};

				let n = shift(num, +decimalPlaces);
				return shift(callMathOperation(type, n), -decimalPlaces);   // In the JavaScript implementation one could access the Math properties via dynamic string. This doesn't seem to work in TypeScript,
																								// so I implemented "callMathOperation" as a simple mapper helping function
			};
			return {
				// Standard Decimal round (half away from zero)
				round: function(num: number, decimalPlaces: number) {
					return decimalAdjust('round', num, decimalPlaces);
				},
				// Decimal ceil
				ceil: function(num: number, decimalPlaces: number) {
					return decimalAdjust('ceil', num, decimalPlaces);
				},
				// Decimal floor
				floor: function(num: number, decimalPlaces: number) {
					return decimalAdjust('floor', num, decimalPlaces);
				},
			};
		})();

		// TODO-BOQ: ISlickColumn is not public
		/*
		public getUiRoundingDigits(columnDef: ISlickColumn, field: string): number | null | undefined {
			let uiDisplayTo = null;
			if (this.roundingConfigDetails && this.roundingConfigDetails.length > 0) {
				if(this.roundingConfig && Array.isArray(this.roundingConfig.RoundedColumns2DetailTypes)) {
					let roundedColumns2DetailTypes = this.roundingConfig.RoundedColumns2DetailTypes;
					let boqRoundingColumnId = roundedColumns2DetailTypes.find(type => {
						return type.Field === field;
					});
					if(boqRoundingColumnId){
						let roundingConfigItem = this.roundingConfigDetails.find(roundingConfigDetail => {
							return roundingConfigDetail.ColumnId === boqRoundingColumnId.Id;
						});
						uiDisplayTo = roundingConfigItem?.UiDisplayTo;
					} else{
						boqRoundingColumnId = roundedColumns2DetailTypes.find(type => {
							return type.Field === columnDef.field;
						});
						if(boqRoundingColumnId){
							let roundingConfigItem = this.roundingConfigDetails.find(roundingConfigDetail => {
								return roundingConfigDetail.ColumnId === boqRoundingColumnId.Id;
							});
							uiDisplayTo = roundingConfigItem?.UiDisplayTo;
						}
					}
				}
			}

			return uiDisplayTo;
		}
		*/

		// Round boqItem all columns
		public roundBoqItemValues(boqItem: IBoqItemEntity){
			if (this.roundingConfigDetails && this.roundingConfigDetails.length > 0) {
				if (this.roundingConfig && Array.isArray(this.roundingConfig.RoundedColumns2DetailTypes)) {
					let roundedColumns2DetailTypes = this.roundingConfig.RoundedColumns2DetailTypes;
					roundedColumns2DetailTypes.forEach(boqRoundingColumnId => {
						let roundingColumnName = boqRoundingColumnId.Field;
						if (boqItem[roundingColumnName]) {
							let beforeRoundingValue = boqItem[roundingColumnName];
							let roundingConfigItem = this.roundingConfigDetails?.find(roundingConfigDetail => {
								return roundingConfigDetail.ColumnId === boqRoundingColumnId.Id;
							});
							if (roundingConfigItem) {
								boqItem[roundingColumnName] = this.doRounding(beforeRoundingValue as number, roundingColumnName, roundingConfigItem);
							}
						}
					});
				}
			}
		}

		// Rounds particular passed field only, call from outside services
		public doRoundingValue(roundingField: string, beforeRoundingValue: number){
			if(beforeRoundingValue === 0){
				return beforeRoundingValue;
			}

			let afterRoundingValue = beforeRoundingValue;
			if (this.roundingConfigDetails && this.roundingConfigDetails.length > 0) {
				if(this.roundingConfig && Array.isArray(this.roundingConfig.RoundedColumns2DetailTypes)) {
					let roundedColumns2DetailTypes = this.roundingConfig.RoundedColumns2DetailTypes;
					let boqRoundingColumnId = roundedColumns2DetailTypes.find(type => {
						return type.Field === roundingField;
					});

					if (boqRoundingColumnId) {
						let roundingFieldId = boqRoundingColumnId.Id;

						if (!isNaN(beforeRoundingValue)) {
							let roundingConfigItem = this.roundingConfigDetails.find(roundingConfigDetail => {
								return roundingConfigDetail.ColumnId === roundingFieldId;
							});
							if (roundingConfigItem) {
								afterRoundingValue = this.doRounding(beforeRoundingValue, roundingField, roundingConfigItem);
							}
						}
					} else {
						console.error('boqMainRoundingService.doRoundingValues: the following property name is not mapped <' + roundingField + '>');
					}
				}
			}
			return afterRoundingValue;
		}

		// Internal common rounding function which does actual rounding
		public doRounding(beforeRoundingValue: number, roundingField: string, roundingConfigItem: IBoqRoundingConfigDetailEntity | null | undefined) {
			let afterRoundingValue = beforeRoundingValue;

			if (!roundingConfigItem || roundingConfigItem.IsWithoutRounding) { /*
				if (costTotalFields.indexOf(roundingField) >=1 ) {
					afterRoundingValue= beforeRoundingValue.toFixed(7) - 0;
				}
				else if(hoursTotalFields.indexOf(roundingField) >=1){
					afterRoundingValue = beforeRoundingValue.toFixed(6) - 0;
				} */
			} else if(roundingConfigItem && roundingConfigItem.RoundTo) {
				switch (roundingConfigItem.BasRoundToFk) {
					case BoqMainRoundTo.DigitsAfterDecimalPoint: {
						switch (roundingConfigItem.BasRoundingMethodFk) {
							case BoqMainRoundingMethod.Standard: {
								afterRoundingValue = this.digitsAfterDecimalRounding.round(beforeRoundingValue, roundingConfigItem.RoundTo);
							}
							break;
							case BoqMainRoundingMethod.RoundUp: {
								afterRoundingValue = this.digitsAfterDecimalRounding.ceil(beforeRoundingValue, roundingConfigItem.RoundTo);
							}
							break;
							case BoqMainRoundingMethod.RoundDown: {
								afterRoundingValue = this.digitsAfterDecimalRounding.floor(beforeRoundingValue, roundingConfigItem.RoundTo);
							}
							break;
						}
					}
				}
			}

			return afterRoundingValue;
		}

		public doRoundingValues(fields: string[], boqItem: IBoqItemEntity){
			if(!boqItem || !fields || !fields.length){
				return;
			}
			if (this.roundingConfigDetails && this.roundingConfigDetails.length <= 0) {
				return;
			}

			fields.forEach(field => {
				boqItem[field] = this.doRoundingValue(field, boqItem[field] as number);
			});
		}

		protected roundInitialFields(boqItem: IBoqItemEntity, intitialFields: string[]){
			if(!boqItem){
				return;
			}
			if (this.roundingConfigDetails && this.roundingConfigDetails.length <= 0) {
				return;
			}

			intitialFields.forEach(field => {
				boqItem[field] = this.doRoundingValue(field, boqItem[field] as number);
			});
		}

		public roundInitialQuantities(boqItem: IBoqItemEntity){
			this.roundInitialFields(boqItem, initialQuantitiesFields);
		}

		public roundInitialPrices(boqItem: IBoqItemEntity){
			this.roundInitialFields(boqItem, initialPriceFields);
		}

		public roundInitialAmounts(boqItem: IBoqItemEntity){
			this.roundInitialFields(boqItem, initialAmountFields);
		}

		public roundInitialValues(boqItem: IBoqItemEntity) {

			if(BoqItemHelper.isItem(boqItem)) {
				this.roundInitialQuantities(boqItem);
				this.roundInitialPrices(boqItem);
			}

			if(BoqItemHelper.isDivisionOrRoot(boqItem)) {
				this.roundInitialAmounts(boqItem);
			}
		}
}
