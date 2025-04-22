/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { ProcurementRfqHeaderMainDataService } from './procurement-rfq-header-main-data.service';
import { ProcurementCommonSuggestBiddersDataService } from '@libs/procurement/common';
import { IPrcSuggestedBidderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../model/entities/rfq-header-entity-complete.class';
import { ProcurementInternalModule } from '@libs/procurement/shared';

/**
 * Represents the data service to handle rfq suggest bidder.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqSuggestBidderDataService extends ProcurementCommonSuggestBiddersDataService<IPrcSuggestedBidderEntity, IRfqHeaderEntity, RfqHeaderEntityComplete> {

	protected internalModuleName = ProcurementInternalModule.Rfq;
	public constructor(private readonly rfqHeaderDataService: ProcurementRfqHeaderMainDataService) {

		super(rfqHeaderDataService);

		rfqHeaderDataService.RootDataCreated$.subscribe((resp) => {

		});
	}

	protected override getMainItemId(parent: IRfqHeaderEntity): number {
		// TODO: Load prcHeaderFk from rfq_header
		const prcHeaderFk = this.rfqHeaderDataService.getSelection()[0].PrcHeaderFk;
		if (prcHeaderFk !== undefined && prcHeaderFk !== null) {
			return prcHeaderFk;
		} else {
			return 0;
		}
	}

	public override isParentFn(parentKey: IRfqHeaderEntity, entity: IPrcSuggestedBidderEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}