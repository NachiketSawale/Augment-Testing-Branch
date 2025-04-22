/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BoqItemDataServiceBase } from '@libs/boq/main';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { IBidBoqCompositeEntity } from '@libs/sales/interfaces';
import { SalesBidBoqDataService } from './sales-bid-boq-data.service';

@Injectable({providedIn: 'root'})
/**
 * Service to handle the data operations for the Sales Bid BOQ Item.
 * It extends the base class BoqItemDataServiceBase and provides specific implementations for Sales Bid.
 */
export class SalesBidBoqItemDataService extends BoqItemDataServiceBase {
	public constructor(private parentService: SalesBidBoqDataService) {
		const options = BoqItemDataServiceBase.createDataServiceOptions(parentService);
		super(options);
	}

	public override getSelectedBoqHeaderId() : number | undefined {
		return this.parentService.getSelectedEntity()?.BoqRootItem?.BoqHeaderFk ?? undefined;
	}

	public override isParentFn(parentKey: IBidBoqCompositeEntity, entity: IBoqItemEntity): boolean {
		return entity.BoqHeaderFk === parentKey.Id;
	}
}