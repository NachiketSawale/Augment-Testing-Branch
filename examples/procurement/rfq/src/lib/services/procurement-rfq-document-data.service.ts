/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IPrcDocumentEntity, ProcurementCommonDocumentDataService } from '@libs/procurement/common';

import { ProcurementRfqHeaderMainDataService } from './procurement-rfq-header-main-data.service';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../model/entities/rfq-header-entity-complete.class';

/**
 * Procurement Rfq Document Data Service
 */

@Injectable({
	providedIn: 'root',
})
export class ProcurementRfqDocumentDataService extends ProcurementCommonDocumentDataService<IPrcDocumentEntity, IRfqHeaderEntity, RfqHeaderEntityComplete> {
	public constructor() {
		const rfqDataService = inject(ProcurementRfqHeaderMainDataService);
		super(rfqDataService, {});
	}

	public override isParentFn(parentKey: IRfqHeaderEntity, entity: IPrcDocumentEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}
