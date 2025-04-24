/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IPrcCommonExtBidder2contactEntity, IProcurementCommonExtBidderEntity, PrcCommonExtBidder2contactDataService, PrcCommonExtBidderComplete } from '@libs/procurement/common';
import { ProcurementPesExtBidderDataService } from './procurement-pes-extbidder-data.service';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPesExtBidder2ContactDataService extends PrcCommonExtBidder2contactDataService<IPrcCommonExtBidder2contactEntity,IProcurementCommonExtBidderEntity,PrcCommonExtBidderComplete>{

	public constructor() {
		const parentService = inject(ProcurementPesExtBidderDataService);
		super(parentService);
	}

	protected bpFkHasValue(parent: IProcurementCommonExtBidderEntity): boolean {
		return !!parent?.BusinessPartnerFk;
	}

	protected getExtBidderFk(parent: IProcurementCommonExtBidderEntity): number {
		return parent.Id;
	}

}