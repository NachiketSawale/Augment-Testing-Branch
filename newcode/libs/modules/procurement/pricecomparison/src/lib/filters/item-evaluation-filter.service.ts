/*
	 * $Id$
	 * Copyright(c) RIB Software GmbH
	 */

import { Injectable } from '@angular/core';
import {
	ILookupClientSideFilter,
	ILookupContext,
} from '@libs/ui/common';
import { IBasicsCustomizeProcurementItemEvaluationEntity } from '@libs/basics/interfaces';
import { ICompareRowEntity } from '../model/entities/compare-row-entity.interface';
import { CompareFields } from '../model/constants/compare-fields';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonItemEvaluationFilterService implements ILookupClientSideFilter<IBasicsCustomizeProcurementItemEvaluationEntity, ICompareRowEntity> {
	public execute(item: IBasicsCustomizeProcurementItemEvaluationEntity, context: ILookupContext<IBasicsCustomizeProcurementItemEvaluationEntity, ICompareRowEntity>): boolean {
		let items = [4, 5, 6, 7];
		switch (context.entity?.Field) {
			case CompareFields.percentage:
			case CompareFields.absoluteDifference : {
				items = items.concat([10, 11]);
				break;
			}
			case CompareFields.price:
			case CompareFields.unitRate: {
				items = items.concat(10);
				break;
			}
			case CompareFields.total:
			case CompareFields.finalPrice: {
				items = items.concat(11);
				break;
			}
			case CompareFields.quantity:
			default: {
				break;
			}
		}
		return items.indexOf(item.Id) > -1;
	}
}
