/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IPesItemEntity } from '../model/entities';
import { ProcurementCommonItemCalculationService } from '@libs/procurement/common';

/**
 * Procurement Pes PesItem calculation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPesItemCalculationService extends ProcurementCommonItemCalculationService<IPesItemEntity> {
	public override readonly roundingType = this.getRoundingType<IPesItemEntity>();

	/**
	 * Computes Total
	 * method name is getTotalByPriceForPes in angularJs
	 * @param item
	 * @param priceUnit
	 * @param factorPriceUnit
	 */
	public getTotalByPrice(item: IPesItemEntity, priceUnit: number, factorPriceUnit: number) {
		return this.round(this.roundingType.Total, this.formula.totalByPrice(item.Price, item.PriceExtra, item.DiscountAbsolute, item.Quantity, priceUnit, factorPriceUnit, item.DiscountSplit));
	}
}