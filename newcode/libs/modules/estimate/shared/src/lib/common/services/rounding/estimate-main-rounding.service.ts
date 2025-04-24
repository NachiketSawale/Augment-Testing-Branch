/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EstimateMainRoundingDataService } from './estimate-main-rounding-data.service';
import { find, get, set } from 'lodash';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import {
	estimateMainRoundingConstants,
	initialCostsFields,
	initialQuantitiesFields
} from './estimate-main-rounding-constants';
import { IEstRoundingConfigDetailBaseEntity } from '../../model/est-rounding-config-detail-entity.base.interface';
import { DigitsAfterDecimalRounding } from './digits-after-decimal-rounding.service';

/**
 * use to rounding lineItem and resource properties
 */
@Injectable({ providedIn: 'root' })
export class EstimateMainRoundingService{

	private estimateMainRoundingDataService = inject(EstimateMainRoundingDataService);
	private digitsAfterDecimalRounding = inject(DigitsAfterDecimalRounding);

	private readonly defaultRoundingNumber: number = 6;

	/**
	 * get UI display rounding digits
	 * @param columnDef
	 * @param field
	 */
	public getUiRoundingDigits(columnDef:{$field:string},field:string): number{
		const estRoundingConfigData = this.estimateMainRoundingDataService.getEstRoundingConfig();
		if (estRoundingConfigData && estRoundingConfigData.length > 0) {
			const esRoundingColumnIds = this.estimateMainRoundingDataService.getRoundingColumnIds();
			let esRoundingLineItemColumnId = find(esRoundingColumnIds, {Field: field});
			if(esRoundingLineItemColumnId){
				const roundingConfigItem = find(estRoundingConfigData, {ColumnId: esRoundingLineItemColumnId.Id});
				return roundingConfigItem && roundingConfigItem.UiDisplayTo ? roundingConfigItem.UiDisplayTo : this.defaultRoundingNumber;
			} else{
				esRoundingLineItemColumnId = find(esRoundingColumnIds, {Field: columnDef.$field});
				if(esRoundingLineItemColumnId){
					const roundingConfigItem = find(estRoundingConfigData, {ColumnId: esRoundingLineItemColumnId.Id});
					return roundingConfigItem && roundingConfigItem.UiDisplayTo ? roundingConfigItem.UiDisplayTo : this.defaultRoundingNumber;
				}
			}
		}
		return this.defaultRoundingNumber;
	}

	/**
	 * get rounding digits
	 * @param field
	 */
	public getRoundingDigits(field: string): number {
		const estRoundingConfigData = this.estimateMainRoundingDataService.getEstRoundingConfig();
		if (estRoundingConfigData && estRoundingConfigData.length > 0) {
			const esRoundingColumnIds = this.estimateMainRoundingDataService.getRoundingColumnIds();
			const esRoundingLineItemColumnId = find(esRoundingColumnIds, {Field: field});
			if(esRoundingLineItemColumnId){
				const roundingConfigItem = find(estRoundingConfigData, {ColumnId: esRoundingLineItemColumnId.Id});
				return roundingConfigItem ? roundingConfigItem.RoundTo : this.defaultRoundingNumber;
			}else{
				// Todo: change to based on field type like quantity, cost totals..like domain type
				return this.defaultRoundingNumber;
			}
		}
		return this.defaultRoundingNumber;
	}

	/**
	 * rounding lineItem and resources
	 * @param lineItem
	 * @param resources
	 */
	public roundLineItemAndResources(lineItem: IEstLineItemEntity, resources: IEstResourceEntity[]|null){
		this.roundLineItemValues(lineItem);
		this.roundResourceValues(resources);
	}

	/**
	 * rounding lineItem
	 * @param lineItem
	 */
	public roundLineItemValues(lineItem: IEstLineItemEntity){
		const estRoundingConfigData = this.estimateMainRoundingDataService.getEstRoundingConfig();
		if (estRoundingConfigData && estRoundingConfigData.length > 0) {
			const roundingColumnIds = this.estimateMainRoundingDataService.getRoundingColumnIds();
			roundingColumnIds.forEach((estRoundingColumnId) => {
				const roundingColumnName = estRoundingColumnId.Field;
				if(roundingColumnName in lineItem){
					const beforeRoundingValue = get(lineItem, roundingColumnName);
					const roundingConfigItem = find(estRoundingConfigData, {ColumnId: estRoundingColumnId.Id});
					if (roundingConfigItem) {
						set(lineItem, roundingColumnName, this.doRounding(beforeRoundingValue, roundingColumnName,roundingConfigItem));
					}
				}
			});
		}
	}

	/**
	 * rounding resources
	 * @param resources
	 */
	public roundResourceValues(resources: IEstResourceEntity[]|null){
		if(!resources || !resources.length){
			return;
		}
		const estRoundingConfigData = this.estimateMainRoundingDataService.getEstRoundingConfig();
		const roundingColumnIds = this.estimateMainRoundingDataService.getRoundingColumnIds();
		if (estRoundingConfigData && estRoundingConfigData.length > 0) {
			resources.forEach((resource) => {
				if(resource){
					roundingColumnIds.forEach((estRoundingColumnId)=> {
						const roundingColumnName = estRoundingColumnId.Field;
						if(roundingColumnName in resource) {
							const beforeRoundingValue = get(resource, roundingColumnName);
							const roundingConfigItem = find(estRoundingConfigData, {ColumnId: estRoundingColumnId.Id});
							if (roundingConfigItem) {
								set(resource, roundingColumnName, this.doRounding(beforeRoundingValue,roundingColumnName, roundingConfigItem));
							}
						}
					});
				}
			});
		}
	}

	/**
	 * Rounds particular passed field only, call from outside services
	 * @param roundingField
	 * @param beforeRoundingValue
	 */
	public doRoundingValue(roundingField: string, beforeRoundingValue: number){
		if(beforeRoundingValue === 0){
			return beforeRoundingValue;
		}
		let afterRoundingValue = beforeRoundingValue;
		const estRoundingConfigData = this.estimateMainRoundingDataService.getEstRoundingConfig();
		if (estRoundingConfigData && estRoundingConfigData.length > 0) {
			const roundingColumnIds = this.estimateMainRoundingDataService.getRoundingColumnIds();
			const estRoundingColumnId = find(roundingColumnIds, {Field: roundingField});
			if(estRoundingColumnId) {
				const roundingFieldId = estRoundingColumnId.Id;

				if(!isNaN(beforeRoundingValue)) {
					const roundingConfigItem = find(estRoundingConfigData, {ColumnId: roundingFieldId});
					if (roundingConfigItem && roundingConfigItem.IsWithoutRounding) {
						afterRoundingValue = this.doWithOutRounding(beforeRoundingValue,roundingFieldId );
					}else if(roundingConfigItem){
						afterRoundingValue = this.doRounding(beforeRoundingValue, roundingField, roundingConfigItem);
					}
				}
			}
		}
		return afterRoundingValue;
	}

	/**
	 * Internal common rounding function which does actual rounding
	 * @param beforeRoundingValue
	 * @param roundingField
	 * @param roundingConfigItem
	 */
	public doRounding(beforeRoundingValue: number,roundingField:string,roundingConfigItem: IEstRoundingConfigDetailBaseEntity) {
		let afterRoundingValue= beforeRoundingValue;

		switch (roundingConfigItem.RoundToFk) {
			case estimateMainRoundingConstants.roundTo.digitsAfterDecimalPoint: {
				switch (roundingConfigItem.RoundingMethodFk) {
					case estimateMainRoundingConstants.roundingMethod.standard: {
						afterRoundingValue = this.digitsAfterDecimalRounding.round(beforeRoundingValue, roundingConfigItem.RoundTo);
					}
						break;
					case estimateMainRoundingConstants.roundingMethod.roundUp: {
						afterRoundingValue = this.digitsAfterDecimalRounding.ceil(beforeRoundingValue, roundingConfigItem.RoundTo);
					}
						break;
					case estimateMainRoundingConstants.roundingMethod.roundDown: {
						afterRoundingValue = this.digitsAfterDecimalRounding.floor(beforeRoundingValue, roundingConfigItem.RoundTo);
					}
						break;
				}
			}
		}

		return afterRoundingValue;
	}

	/**
	 * If Without Rounding is true. then cut the values to  6 or 7
	 * @param beforeRoundingValue
	 * @param roundingConfigColumnId
	 */
	public doWithOutRounding(beforeRoundingValue: number,roundingConfigColumnId: number) {
		let afterRoundingValue= beforeRoundingValue;

		if (roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.WqQuantityTarget ||
			roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.QuantityTarget ||
			roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.Quantity ||
			roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.QuantityFactors ||
			roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.CostFactors) {
			afterRoundingValue = this.digitsAfterDecimalRounding.round(beforeRoundingValue, 6);
		}else if (roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.CostUnit ||
			roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.CostTotal ||
			roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.PriceUnitItem ||
			roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.ItemPriceTotal) {
			afterRoundingValue = this.digitsAfterDecimalRounding.round(beforeRoundingValue, 7);
		}

		return afterRoundingValue;
	}

	public doRoundingValues<T extends object>(fields: string[], item:T){
		if(!item || !fields || !fields.length){
			return;
		}
		const estRoundingConfigData = this.estimateMainRoundingDataService.getEstRoundingConfig();
		if (estRoundingConfigData && estRoundingConfigData.length <= 0) {
			return;
		}

		fields.forEach((field) =>{
			set(item, field, this.doRoundingValue(field, get(item, field)));
		});
	}

	public roundInitialQuantities<T extends object>(item:T){
		if(!item){
			return;
		}
		const estRoundingConfigData = this.estimateMainRoundingDataService.getEstRoundingConfig();
		if (estRoundingConfigData && estRoundingConfigData.length <= 0) {
			return;
		}

		initialQuantitiesFields.forEach((field) => {
			set(item, field, this.doRoundingValue(field, get(item, field)));
		});
	}

	public roundInitialCosts<T extends object>(item:T){
		if(!item){
			return;
		}
		const estRoundingConfigData = this.estimateMainRoundingDataService.getEstRoundingConfig();
		if (estRoundingConfigData && estRoundingConfigData.length <= 0) {
			return;
		}

		initialCostsFields.forEach((field) => {
			set(item, field, this.doRoundingValue(field, get(item, field)));
		});
	}
}