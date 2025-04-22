/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import {
	IProcurementCommonEventsEntity, ProcurementCommonEventsDataService,

} from '@libs/procurement/common';
import { IPesHeaderEntity } from '../model/entities';
import { ProcurementPesHeaderDataService } from './procurement-pes-header-data.service';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';


export const PROCUREMENT_PES_EVENTS_DATA_TOKEN = new InjectionToken<ProcurementPesEventsDataService>('procurementPesEventsDataService');


/**
 * events service in pes
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPesEventsDataService extends ProcurementCommonEventsDataService<IProcurementCommonEventsEntity,IPesHeaderEntity, PesCompleteNew> {
	/**
	 * The constructor
	 */
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

	public override isParentFn(parentKey: IPesHeaderEntity, entity: IProcurementCommonEventsEntity): boolean {
		return entity.PrcPackageFk === parentKey.PackageFk;
	}
}