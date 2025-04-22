/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import {IConHeaderEntity} from '../model/entities';
import {ContractComplete} from '../model/contract-complete.class';
import {ProcurementContractHeaderDataService} from './procurement-contract-header-data.service';
import { BasicsSharedPostConHistoryDataService, IBasicsSharedPostConHistoryEntity } from '@libs/basics/shared';


export const PROCUREMENT_CONTRACT_POST_CON_HISTORY_DATA_TOKEN = new InjectionToken<ProcurementContractPostConHistoryDataService>('procurementContractPostConHistoryDataService');


/**
 * post con history service in contract
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractPostConHistoryDataService extends BasicsSharedPostConHistoryDataService<IBasicsSharedPostConHistoryEntity,IConHeaderEntity, ContractComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementContractHeaderDataService);
		super(parentService);
	}

	public getParentId(parent:IConHeaderEntity){
		return{
			contractId: parent.Id
		};
}

public override isParentFn(parentKey: IConHeaderEntity, entity: IBasicsSharedPostConHistoryEntity): boolean {
	return entity.Id === parentKey.Id;
}
}