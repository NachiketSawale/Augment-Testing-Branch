/*
 * Copyright(c) RIB Software GmbH
 */

import { IProcurementCommonExtBidderEntity, PrcCommonExtBidderComplete, ProcurementCommonExtBidderDataService } from '@libs/procurement/common';
import { IPesHeaderEntity } from '../model/entities';
import { inject, Injectable } from '@angular/core';
import { ProcurementPesHeaderDataService } from './procurement-pes-header-data.service';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPesExtBidderDataService extends ProcurementCommonExtBidderDataService<IProcurementCommonExtBidderEntity, IPesHeaderEntity, PrcCommonExtBidderComplete>{

	public constructor() {
		const parentService = inject(ProcurementPesHeaderDataService);
		super(parentService);
	}
	protected getPackageFk(parent: IPesHeaderEntity): number {
		if(parent) {
			return parent.PackageFk!;
		}
		throw new Error('Should have selected parent entity');
	}

	protected isReadonly(): boolean {
		return true;
	}

	public override isParentFn(parentKey: IPesHeaderEntity, entity: IProcurementCommonExtBidderEntity): boolean {
		return entity.PrcPackageFk === parentKey.PackageFk;
	}
}