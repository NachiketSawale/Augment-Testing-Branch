/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import {
	IProcurementCommonEventsEntity, ProcurementCommonEventsDataService,

} from '@libs/procurement/common';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';


export const PROCUREMENT_CONTRACT_EVENTS_DATA_TOKEN = new InjectionToken<ProcurementContractEventsDataService>('procurementContractEventsDataService');


/**
 * events service in contract
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractEventsDataService extends ProcurementCommonEventsDataService<IProcurementCommonEventsEntity,IConHeaderEntity, ContractComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementContractHeaderDataService);
		super(parentService);
	}

	protected getPackageFk(parent: IConHeaderEntity): number {
		if(parent) {
			return parent.PackageFk!;
		}
		throw new Error('Should have selected parent entity');
	}

	protected isReadonly(): boolean {
		return true;
	}

	public override isParentFn(parentKey: IConHeaderEntity, entity: IProcurementCommonEventsEntity): boolean {
		return entity.PrcPackageFk === parentKey.Id;
	}
}