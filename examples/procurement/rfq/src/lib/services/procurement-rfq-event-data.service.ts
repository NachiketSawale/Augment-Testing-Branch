/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IProcurementCommonEventsEntity, ProcurementCommonEventsDataService } from '@libs/procurement/common';
import { ProcurementRfqHeaderMainDataService } from './procurement-rfq-header-main-data.service';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../model/entities/rfq-header-entity-complete.class';

/**
 * events service in rfq
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRfqEventDataService extends ProcurementCommonEventsDataService<IProcurementCommonEventsEntity, IRfqHeaderEntity, RfqHeaderEntityComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementRfqHeaderMainDataService);
		super(parentService);
	}

	protected getPackageFk(parent: IRfqHeaderEntity): number {
		if (parent?.PackageFk) {
			return parent.PackageFk;
		}
		throw new Error('Should have selected parent entity');
	}

	protected isReadonly(): boolean {
		return true;
	}

	public override isParentFn(parentKey: IRfqHeaderEntity, entity: IProcurementCommonEventsEntity): boolean {
		return entity.PrcPackageFk === parentKey.PackageFk;
	}
}
