/*
 * Copyright(c) RIB Software GmbH
 */

import { IProcurementCommonExtBidderEntity, PrcCommonExtBidderComplete, ProcurementCommonExtBidderDataService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';
import { IQuoteHeaderEntity } from '../model';

/**
 * The Data service for the procurement quote futher extranal BPs container.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteExtBidderDataService extends ProcurementCommonExtBidderDataService<IProcurementCommonExtBidderEntity, IQuoteHeaderEntity, PrcCommonExtBidderComplete>{

	public constructor() {
		const parentService = inject(ProcurementQuoteHeaderDataService);
		super(parentService);
	}
	protected getPackageFk(parent: IQuoteHeaderEntity): number {
		if (parent) {
			return parent.PackageFk ?? 0;
		}
		throw new Error('Should have selected parent entity');
	}

	protected isReadonly(): boolean {
		return true;
	}

	public override isParentFn(parentKey: IQuoteHeaderEntity, entity: IProcurementCommonExtBidderEntity): boolean {
		return entity.PrcPackageFk === parentKey.PackageFk;
	}
}