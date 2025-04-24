/*
 * Copyright(c) RIB Software GmbH
 */

import { IProcurementCommonExtBidderEntity, PrcCommonExtBidderComplete, ProcurementCommonExtBidderDataService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { ProcurementRfqHeaderMainDataService } from './procurement-rfq-header-main-data.service';

@Injectable({
	providedIn: 'root'
})

/*
 * Procurement Rfq Ext Bidder Data Service
 */
export class ProcurementRfqExtBidderDataService extends ProcurementCommonExtBidderDataService<IProcurementCommonExtBidderEntity, IRfqHeaderEntity, PrcCommonExtBidderComplete>{

	public constructor() {
		const parentService = inject(ProcurementRfqHeaderMainDataService);
		super(parentService);
	}
	protected getPackageFk(parent: IRfqHeaderEntity): number {
		if(parent) {
			return parent.PackageFk!;
		}
		throw new Error('Should have selected parent entity');
	}

	protected isReadonly(): boolean {
		return true;
	}

	public override isParentFn(parentKey: IRfqHeaderEntity, entity: IProcurementCommonExtBidderEntity): boolean {
		return entity.PrcPackageFk === parentKey.PackageFk;
	}
}