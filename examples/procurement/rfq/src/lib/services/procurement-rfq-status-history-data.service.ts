/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BasicsSharedSatusHistoryDataService, IStatusHistoryEntity } from '@libs/basics/shared';
import { ProcurementRfqHeaderMainDataService } from './procurement-rfq-header-main-data.service';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../model/entities/rfq-header-entity-complete.class';

/**
 * Represents the data service to handle Procurement Rfq Status History Data Service.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRfqStatusHistoryDataService extends BasicsSharedSatusHistoryDataService<IStatusHistoryEntity, IRfqHeaderEntity, RfqHeaderEntityComplete> {
	public constructor( public rfqHeaderService:ProcurementRfqHeaderMainDataService) {
		super(rfqHeaderService);
	}
	protected getModuleName(): string {
        return 'rfq';
    }
}
