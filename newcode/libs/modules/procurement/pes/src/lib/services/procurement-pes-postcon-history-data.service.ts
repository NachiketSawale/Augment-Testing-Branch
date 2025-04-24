/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPesHeaderEntity } from '../model/entities';
import { BasicsSharedPostConHistoryDataService, IBasicsSharedPostConHistoryEntity } from '@libs/basics/shared';
import { ProcurementPesHeaderDataService } from './procurement-pes-header-data.service';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';

/**
 * post con history service in pes
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPesPostConHistoryDataService extends BasicsSharedPostConHistoryDataService<IBasicsSharedPostConHistoryEntity, IPesHeaderEntity, PesCompleteNew> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementPesHeaderDataService);
		super(parentService);
	}

	public getParentId(parent: IPesHeaderEntity) {
		return {
			pesId: parent.Id,
		};
	}

	public override isParentFn(parentKey: IPesHeaderEntity, entity: IBasicsSharedPostConHistoryEntity): boolean {
		return entity.Id === parentKey.Id;
	}
}
