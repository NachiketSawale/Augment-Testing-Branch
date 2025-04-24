/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsSharedSatusHistoryDataService, IStatusHistoryEntity } from '@libs/basics/shared';
import { ProcurementPesHeaderDataService } from './procurement-pes-header-data.service';
import { IPesHeaderEntity } from '../model/entities';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';


/**
 * Represents the data service to handle Procurement Pes Status History Data Service.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPesStatusHistoryDataService extends BasicsSharedSatusHistoryDataService<IStatusHistoryEntity, IPesHeaderEntity, PesCompleteNew> {
	public constructor( public pesHeaderService:ProcurementPesHeaderDataService) {
		super(pesHeaderService);
	}

	protected getModuleName(): string {
        return 'pes';
    }
}
