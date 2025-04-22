/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IPesHeaderEntity } from '../model/entities';
import { BasicsSharedPostConHistoryBehavior, IBasicsSharedPostConHistoryEntity } from '@libs/basics/shared';
import { ProcurementPesPostConHistoryDataService } from '../services/procurement-pes-postcon-history-data.service';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';

/**
 * Procurement PostCon History item behavior
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPesPostConHistoryBehavior extends BasicsSharedPostConHistoryBehavior<IBasicsSharedPostConHistoryEntity, IPesHeaderEntity, PesCompleteNew> {
	/**
	 * The constructor
	 */
	public constructor() {
		super(inject(ProcurementPesPostConHistoryDataService));
	}
}
